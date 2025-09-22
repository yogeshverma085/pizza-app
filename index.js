// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const path = require("path");
require("colors");
const morgan = require("morgan");
const cors = require("cors");
const axios = require("axios");
const appInsights = require("applicationinsights");

dotenv.config();

// ----------------- Express App -----------------
const app = express();
// ----------------- Trust proxy for correct HTTPS detection -----------------
app.set("trust proxy", true);

// ----------------- Redirect HTTP to HTTPS -----------------
// app.use((req, res, next) => {
//   if (!req.secure) {
//     // Redirect HTTP → HTTPS
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*", credentials: true }));

// ----------------- App Insights Setup -----------------
appInsights
  .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)       // track incoming requests
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)   // track outgoing HTTP/HTTPS
  .setSendLiveMetrics(true)
  .start();

const client = appInsights.defaultClient;


// ----------------- Middleware: Track all incoming requests -----------------
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    client.trackDependency({
      target: req.hostname,
      name: `${req.method} ${req.originalUrl}`,
      data: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      duration,
      resultCode: res.statusCode,
      success: res.statusCode < 400,
      dependencyTypeName: "HTTP (Manual)",
    });
  });

  next();
});

// ----------------- Axios wrapper: Track outgoing HTTP & HTTPS -----------------
const api = axios.create();

api.interceptors.request.use((config) => {
  const dep = client.startDependencyTelemetry({
    target: config.baseURL || config.url,
    name: `${config.method?.toUpperCase()} ${config.url}`,
    data: config.url,
    dependencyTypeName: "HTTP",
  });
  config.__dependency = dep;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config?.__dependency) {
      response.config.__dependency.success = response.status < 400;
      client.endDependencyTelemetry(response.config.__dependency);
    }
    return response;
  },
  (error) => {
    if (error.config?.__dependency) {
      error.config.__dependency.success = false; // ✅ fixed
      client.endDependencyTelemetry(error.config.__dependency);
    }
    return Promise.reject(error);
  }
);

module.exports.api = api;

// ----------------- API Routes -----------------
app.use("/api/pizzas", require("./routes/pizzaRoute"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/db", require("./routes/dbRoute"));

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
// const cors = require("cors");
// const axios = require("axios");

// // ----------------- Config dotenv -----------------
// dotenv.config();

// // ----------------- App Insights Setup -----------------
// appInsights
//   .setup(process.env.APPINSIGHTS_CONNECTIONSTRING)
//   .setAutoDependencyCorrelation(true)
//   .setAutoCollectRequests(true)
//   .setAutoCollectPerformance(true)
//   .setAutoCollectExceptions(true)
//   .setAutoCollectDependencies(true)
//   .setSendLiveMetrics(true)
//   .start();

// const client = appInsights.defaultClient;

// // ----------------- Axios wrapper for AI child spans -----------------
// const api = axios.create();

// api.interceptors.request.use((config) => {
//   const dependency = client.startDependencyTelemetry({
//     target: config.baseURL || config.url,
//     name: `${config.method?.toUpperCase()} ${config.url}`,
//     data: config.url,
//     dependencyTypeName: "HTTP",
//   });
//   config.__dependency = dependency;
//   return config;
// });

// api.interceptors.response.use(
//   (response) => {
//     if (response.config.__dependency) {
//       response.config.__dependency.success = response.status < 400;
//       client.endDependencyTelemetry(response.config.__dependency);
//     }
//     return response;
//   },
//   (error) => {
//     if (error.config?.__dependency) {
//       error.config.__dependency.success = false;
//       client.endDependencyTelemetry(error.config.__dependency);
//     }
//     return Promise.reject(error);
//   }
// );

// module.exports.api = api;

// // ----------------- Express App -----------------
// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// // ----------------- CORS Setup -----------------
// const allowedOrigins = [
//   "http://localhost:3000", // frontend local dev
//   "https://pizzaapptest-ejc6fdbjgya4cvhg.eastus-01.azurewebsites.net", // production frontend
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));

// // ----------------- API Routes -----------------
// app.use("/api/pizzas", require("./routes/pizzaRoute"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/orders", require("./routes/orderRoute"));
// app.use("/api/test", require("./routes/testRoutes"));
// app.use("/api/db", require("./routes/dbRoute"));

// // ----------------- Serve Frontend -----------------
// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) => {
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
