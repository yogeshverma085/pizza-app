const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const path = require("path");
require("colors");
const morgan = require("morgan");
const appInsights = require("applicationinsights");

// config dotenv
dotenv.config();

// ----------------- App Insights Setup -----------------
appInsights
  .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
  .setAutoDependencyCorrelation(true)   // link requests to dependencies
  .setAutoCollectRequests(true)         // HTTP requests
  .setAutoCollectPerformance(true)      // CPU, memory
  .setAutoCollectExceptions(true)       // Errors
  .setAutoCollectDependencies(true)     // External calls, MongoDB if supported
  .setSendLiveMetrics(true)
  .start();

const client = appInsights.defaultClient;

// ----------------- Express App -----------------
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// ----------------- App Insights Middleware for Request Operation -----------------
app.use((req, res, next) => {
  // Start a request operation for this incoming request
  const operation = client.startOperation(req.method, req.url);
  req.appInsightsOperation = operation;

  res.on("finish", () => {
    client.stopOperation(operation);
    client.flush();
  });

  next();
});

// ----------------- Helper to track any async operation -----------------
function trackAsync(name, fn) {
  return async function (...args) {
    // Find Express req to link parent
    const req = args.find(a => a && a.appInsightsOperation);
    const start = Date.now();
    let success = true;

    try {
      const result = await fn(...args);
      return result;
    } catch (err) {
      success = false;
      throw err;
    } finally {
      const duration = Date.now() - start;

      client.trackDependency({
        target: "CustomOperation",
        name,
        data: "", // optional info
        duration,
        success,
        dependencyTypeName: "InProc",
        id: req?.appInsightsOperation?.id, // link to parent request
      });

      client.flush();
    }
  };
}

// ----------------- Routes -----------------
app.use("/api/pizzas", require("./routes/pizzaRoute"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/db", require("./routes/dbRoute"));

// Serve frontend
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

// ----------------- Start Server -----------------
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${port}`.bgMagenta.white);
  } catch (e) {
    console.log(e.message);
  }
});

// ----------------- Example usage of trackAsync -----------------
// Any async DB or custom operation
// const trackedFunc = trackAsync("MyCustomOperation", async () => {
//   // your async code here
// });
// trackedFunc(req, ...);





// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/config");
// const path = require("path");
// require("colors");
// const morgan = require("morgan");
// const appInsights = require("applicationinsights");

// // config dotenv
// dotenv.config();

// appInsights.setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
//   .setAutoDependencyCorrelation(true)   // link requests to dependencies
//   .setAutoCollectRequests(true)         // HTTP requests
//   .setAutoCollectPerformance(true)      // CPU, memory
//   .setAutoCollectExceptions(true)       // Errors
//   .setAutoCollectDependencies(true)     // External calls, MongoDB if supported
//   .setSendLiveMetrics(true)
//   .start();

// const client = appInsights.defaultClient;

// // connection mongodb
// // connectDB();

// const app = express();

// //middlewares
// app.use(express.json());
// app.use(morgan("dev"));

// // route
// app.use("/api/pizzas", require("./routes/pizzaRoute"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/orders", require("./routes/orderRoute"));
// app.use("/api/test", require("./routes/testRoutes"));
// app.use("/api/db", require("./routes/dbRoute"));

// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "./client/build/index.html"),
//     function (err) {
//       res.status(500).send(err);
//     }
//   );
// });

// const port = process.env.PORT || 8080;
// app.listen(port, async () => {
//   try {
//     await connectDB();
//     console.log(`server running on mode on port ${process.env.PORT}`.bgMagenta.white);
//   } catch (e) {
//     console.log(e.message);
//   }
// });

