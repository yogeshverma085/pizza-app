const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/config");
const path = require("path");
require("colors");
const morgan = require("morgan");

// config dotenv
dotenv.config();

// connection mongodb
// connectDB();

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

// route
app.use("/api/pizzas", require("./routes/pizzaRoute"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/db", require("./routes/dbRoute"));


app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`server running on mode on port ${process.env.PORT}`.bgMagenta.white);
  } catch (e) {
    console.log(e.message);
  }
});

