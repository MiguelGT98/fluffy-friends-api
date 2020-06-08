const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 8080;

// Configuration
// ================================================================================================

// Set up env variables with dotenv
require("dotenv").config();

// Set up Mongoose
mongoose.connect(isDev ? process.env.DB_DEV : process.env.DB_PROD);
mongoose.Promise = global.Promise;

const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRoutes = require("./routes/users");
const friendRoutes = require("./routes/friends");

// API routes
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }

  console.info(">>> 🌎 Open http://localhost:%s/ in your browser.", port);
});

module.exports = app;
