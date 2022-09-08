const express = require("express");
const app = express();
const helmet = require("helmet");
require("dotenv").config({ path: "./config/.env" });
require("./config/mgdb");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
module.exports = app;