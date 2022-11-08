const express = require("express");
const app = express();
const helmet = require("helmet");
require("dotenv").config({ path: "./config/.env" });
require("./config/mgdb");
const userRoutes = require("./routes/userRoutes");
const sauceRoutes = require("./routes/sauceRoutes");
const path = require("path");

const cors = require('cors');
app.use(cors());

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
app.use("/api/sauces", sauceRoutes);
app.use(helmet());
module.exports = app;