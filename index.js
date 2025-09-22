const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const path = require("path");
require("colors");
const morgan = require("morgan");
const appInsights = require("applicationinsights");
const axios = require("axios");

// ----------------- Config dotenv -----------------
dotenv.config();

// ----------------- App Insights Setup -----------------
appInsights
  .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
  .setAutoDependencyCorrelation(true)   // link requests to dependencies
  .setAutoCollectRequests(true)         // incoming requests
  .setAutoCollectPerformance(true)      // CPU, memory
  .setAutoCollectExceptions(true)       // errors
  .setAutoCollectDependencies(true)     // outgoing http/https/db
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

function trackTrace(
  message,
  severity = appInsights.Contracts.SeverityLevel.Information,
  props = {}
) {
  client.trackTrace({ message, severity, properties: props });
}

// ----------------- Axios wrapper for AI child spans -----------------
const api = axios.create();

api.interceptors.request.use((config) => {
  const dependency = client.startDependencyTelemetry({
    target: config.baseURL || config.url,
    name: `${config.method?.toUpperCase()} ${config.url}`,
    data: config.url,
    dependencyTypeName: "HTTP",
  });
  config.__dependency = dependency;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.__dependency) {
      response.config.__dependency.success = response.status < 400;
      client.endDependencyTelemetry(response.config.__dependency);
    }
    return response;
  },
  (error) => {
    if (error.config?.__dependency) {
      error.config.__dependency.success = false;
      client.endDependencyTelemetry(error.config.__dependency);
    }
    return Promise.reject(error);
  }
);

// Export if you want to reuse in routes
module.exports.api = api;

// ----------------- Express App -----------------
const app = express();
app.use(express.json());
app.use(morgan("dev"));

// ----------------- Routes -----------------
app.use("/api/pizzas", require("./routes/pizzaRoute"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/db", require("./routes/dbRoute"));

// Serve frontend
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) {
    if (err) res.status(500).send(err);
  });
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

// // ----------------- App Insights Setup -----------------
// appInsights
//   .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
//   .setAutoDependencyCorrelation(true)   // link requests to dependencies
//   .setAutoCollectRequests(true)         // incoming requests
//   .setAutoCollectPerformance(true)      // CPU, memory
//   .setAutoCollectExceptions(true)       // errors
//   .setAutoCollectDependencies(true)     // outgoing http/https/db
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

// function trackTrace(
//   message,
//   severity = appInsights.Contracts.SeverityLevel.Information,
//   props = {}
// ) {
//   client.trackTrace({ message, severity, properties: props });
// }

// // ----------------- Express App -----------------
// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// // ----------------- Force child span per request -----------------
// app.use((req, res, next) => {
//   const start = Date.now();

//   res.on("finish", () => {
//     const duration = Date.now() - start;

//     // Only add a manual child span if auto-collection didn’t create one
//     client.trackDependency({
//       target: req.hostname,
//       name: `${req.method} ${req.originalUrl}`,
//       data: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
//       duration,
//       resultCode: res.statusCode,
//       success: res.statusCode < 400,
//       dependencyTypeName: "HTTP (Manual)",
//     });
//   });

//   next();
// });

// // ----------------- Routes -----------------
// app.use("/api/pizzas", require("./routes/pizzaRoute"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/orders", require("./routes/orderRoute"));
// app.use("/api/test", require("./routes/testRoutes"));
// app.use("/api/db", require("./routes/dbRoute"));

// // Serve frontend
// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) {
//     if (err) res.status(500).send(err);
//   });
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
