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
app.use(express.json());
app.use(morgan("dev"));

// ----------------- Helper to track any async operation as child span -----------------
function trackAsync(name, fn) {
  return async function (...args) {
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
        data: "",
        duration,
        success,
        dependencyTypeName: "InProc",
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
      if (err) res.status(500).send(err);
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

