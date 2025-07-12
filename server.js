process.on("uncaughtException", (err) => {
  console.log("UNHANDLED REJECTION! Shutting Down");
  console.log(err);
  process.exit(1);
});
require("dotenv").config(); // <-- This line must be near the top

const app = require("./app");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "./config.env" });

const DB = process.env.MONGO_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ DB connection successful");
  })
  .catch((err) => {
    console.error("❌ DB connection failed");
    console.error(err);
  });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
  });
}

const PORT = process.env.PORT || 8800;
const server = app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting Down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
