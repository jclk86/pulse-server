require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const authRouter = require("./auth/auth-router");
// afc5d75ddfff4597be88b995978ccdab; newsapi
// https://newsapi.org/v2/everything?q=travel&sortBy=popularity&apiKey=afc5d75ddfff4597be88b995978ccdab
// AIzaSyAq8UepD__oQcsgQN5hgj1vTC2bH8qMgwY; google api
// https://api.nytimes.com/svc/topstories/v2/travel.json?api-key=oYrTlANh5Oy1wX48yGarRkizcYSJlLI8
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Hello, boilerplate!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
