const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const path = require("path");
require("colors");
const morgan = require("morgan");
const appInsights = require("applicationinsights");

// ----------------- Config -----------------
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

// ----------------- Telemetry Helpers -----------------
function trackEvent(name, props = {}) {
  client.trackEvent({ name, properties: props });
}

function trackException(error, props = {}) {
  client.trackException({ exception: error, properties: props });
}

function trackTrace(message, severity = appInsights.Contracts.SeverityLevel.Information, props = {}) {
  client.trackTrace({ message, severity, properties: props });
}

// ----------------- Track Async with Child Spans -----------------
function trackAsync(fn, name) {
  return async function (req, res, next) {
    const operation = appInsights.defaultClient.context.telemetryContext.startOperation(
      { request: req },
      name || fn.name || "anonymous_operation"
    );

    return appInsights.defaultClient.context.withinContext(operation, async () => {
      const start = Date.now();
      let success = true;

      try {
        return await fn(req, res, next);
      } catch (err) {
        success = false;
        appInsights.defaultClient.trackException({ exception: err });
        throw err;
      } finally {
        const duration = Date.now() - start;
        appInsights.defaultClient.trackDependency({
          target: "CustomOperation",
          name: name || fn.name || "anonymous_operation",
          data: req.originalUrl,
          duration,
          success,
          dependencyTypeName: "InProc",
        });
      }
    });
  };
}


// ----------------- Auto-wrap All Route Handlers -----------------
function autoWrapRoutes(router) {
  if (!router || !router.stack) return router;

  router.stack.forEach((layer) => {
    if (layer.route) {
      const routeMethods = Object.keys(layer.route.methods);
      routeMethods.forEach((method) => {
        layer.route.stack.forEach((routeLayer) => {
          if (typeof routeLayer.handle === "function") {
            routeLayer.handle = trackAsync(
              routeLayer.handle,
              `${method.toUpperCase()} ${layer.route.path}`
            );
          }
        });
      });
    }
  });

  return router;
}

// ----------------- Express App -----------------
const app = express();
app.use(express.json());
app.use(morgan("dev"));

// ----------------- Routes -----------------
const pizzaRouter = autoWrapRoutes(require("./routes/pizzaRoute"));
const userRouter = autoWrapRoutes(require("./routes/userRoutes"));
const orderRouter = autoWrapRoutes(require("./routes/orderRoute"));
const testRouter = autoWrapRoutes(require("./routes/testRoutes"));
const dbRouter = autoWrapRoutes(require("./routes/dbRoute"));

app.use("/api/pizzas", pizzaRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/test", testRouter);
app.use("/api/db", dbRouter);

// Example route with custom telemetry
app.get("/api/test/insights", async (req, res) => {
  trackEvent("TestEndpointHit", { route: "/api/test/insights" });
  trackTrace("Processing request...", appInsights.Contracts.SeverityLevel.Information);

  try {
    await new Promise((resolve) => setTimeout(resolve, 200)); // simulate DB/API
    res.json({ msg: "App Insights custom telemetry working!" });
  } catch (err) {
    trackException(err);
    res.status(500).send("Error occurred");
  }
});

// ----------------- Serve Frontend -----------------
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) => {
    if (err) res.status(500).send(err);
  });
});

// ----------------- Start Server -----------------
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  try {
    await connectDB(); // Mongo connection
    console.log(`Server running on port ${port}`.bgMagenta.white);
  } catch (e) {
    console.log(e.message);
  }
});

// ----------------- Flush Telemetry on Exit -----------------
process.on("SIGTERM", () => {
  client.flush();
  process.exit(0);
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

// // ----------------- App Insights Setup -----------------
// appInsights
//   .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
//   .setAutoDependencyCorrelation(true)   // link requests to dependencies
//   .setAutoCollectRequests(true)         // HTTP requests
//   .setAutoCollectPerformance(true)      // CPU, memory
//   .setAutoCollectExceptions(true)       // Errors
//   .setAutoCollectDependencies(true)     // External calls, MongoDB if supported
//   .setSendLiveMetrics(true)
//   .start();

// const client = appInsights.defaultClient;

// // ----------------- Telemetry Helpers -----------------
// function trackEvent(name, props = {}) {
//   client.trackEvent({ name, properties: props });
// }

// function trackException(error, props = {}) {
//   client.trackException({ exception: error, properties: props });
// }

// function trackTrace(message, severity = appInsights.Contracts.SeverityLevel.Information, props = {}) {
//   client.trackTrace({ message, severity, properties: props });
// }

// // ----------------- Express App -----------------
// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// // ----------------- Helper to track async operations -----------------
// function trackAsync(fn, name) {
//   return async function (...args) {
//     const start = Date.now();
//     let success = true;

//     try {
//       return await fn(...args);
//     } catch (err) {
//       success = false;
//       throw err;
//     } finally {
//       const duration = Date.now() - start;
//       client.trackDependency({
//         target: "CustomOperation",
//         name: name || fn.name || "anonymous_operation",
//         data: "",
//         duration,
//         success,
//         dependencyTypeName: "InProc",
//       });
//       client.flush();
//     }
//   };
// }

// // ----------------- Auto-wrap all route handlers -----------------
// function autoWrapRoutes(router) {
//   const methods = ["get", "post", "put", "delete", "patch"];
//   if (!router.stack) return router;

//   router.stack.forEach((layer) => {
//     if (layer.route) {
//       const routeMethods = Object.keys(layer.route.methods);
//       routeMethods.forEach((method) => {
//         layer.route.stack.forEach((routeLayer, index) => {
//           routeLayer.handle = trackAsync(routeLayer.handle, `${method.toUpperCase()} ${layer.route.path}`);
//         });
//       });
//     }
//   });

//   return router;
// }

// // ----------------- Routes -----------------
// const pizzaRouter = autoWrapRoutes(require("./routes/pizzaRoute"));
// const userRouter = autoWrapRoutes(require("./routes/userRoutes"));
// const orderRouter = autoWrapRoutes(require("./routes/orderRoute"));
// const testRouter = autoWrapRoutes(require("./routes/testRoutes"));
// const dbRouter = autoWrapRoutes(require("./routes/dbRoute"));

// app.use("/api/pizzas", pizzaRouter);
// app.use("/api/users", userRouter);
// app.use("/api/orders", orderRouter);
// app.use("/api/test", testRouter);
// app.use("/api/db", dbRouter);

// // Serve frontend
// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "./client/build/index.html"),
//     function (err) {
//       if (err) res.status(500).send(err);
//     }
//   );
// });

// // ----------------- Start Server -----------------
// const port = process.env.PORT || 8080;
// app.listen(port, async () => {
//   try {
//     await connectDB();
//     console.log(`Server running on port ${port}`.bgMagenta.white);
//   } catch (e) {
//     console.log(e.message);
//   }
// });




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

