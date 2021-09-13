require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const authRouter = require("./auth/auth-router");
const userRouter = require("./user/user-router");
const articlesRouter = require("./articles/articles-router");
const commentsRouter = require("./comments/comments-router");
const categoriesRouter = require("./categories/categories-router");
const votesRouter = require("./votes/votes-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());

app.use(
  cors({
    origin: "https://afternoon-wildwood-59829.herokuapp.com",
  })
);

app.use("/public", express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/votes", votesRouter);

app.get("/", (req, res) => {
  res.status(404).send({ error: { message: "Page Not Found" } });
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error 500" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
