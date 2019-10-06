const express = require("express");
const ArticlesService = require("./articles-service");

const articlesRouter = express.Router();

articlesRouter.route("/").get((req, res, next) => {
  ArticlesService.getAllArticles(req.app.get("db"))
    .then(articles => {
      res.json(articles.map(ArticlesService.serializeArticle));
    })
    .catch(next);
});
