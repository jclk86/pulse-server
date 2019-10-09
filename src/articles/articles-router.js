const express = require("express");
const ArticlesService = require("./articles-service");
const articlesRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

articlesRouter
  .route("/")
  .get((req, res, next) => {
    ArticlesService.getAllArticles(req.app.get("db"))
      .then(articles => {
        res.json(articles.map(ArticlesService.serializeArticle));
      })
      .catch(next);
  })

  .post(requireAuth, bodyParser, (req, res, next) => {
    // add require auth before bodyParser
    const { id, username } = req.user;
    // title, style, author_id, content;
    const {
      // add image
      title,
      content,
      style
    } = req.body;
    const newArticle = {
      author_id: id,
      username: username,
      title,
      content,
      style
    };

    console.log(newArticle);
    for (const [key, value] of Object.entries(newArticle))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    ArticlesService.addArticle(req.app.get("db"), newArticle).then(article => {
      res
        .status(201)
        .location(req.originalUrl, `/${article.id}`)
        .json(article);
    });
  });

articlesRouter
  .route("/:article_id")
  // .all(requireAuth)
  .all(checkArticleExists)
  .get((req, res, next) => {
    res.json(ArticlesService.serializeArticle(res.article));
  });
articlesRouter
  .route("/:article_id/comments/")
  // add requireAuth
  .all(checkArticleExists)
  .get((req, res, next) => {
    ArticlesService.getCommentsForArticle(
      req.app.get("db"),
      req.params.article_id
    )
      .then(comments => {
        res.json(
          comments.map(comment =>
            ArticlesService.serializeArticleComment(comment)
          )
        );
      })
      .catch(next);
  });

async function checkArticleExists(req, res, next) {
  try {
    const article = await ArticlesService.getById(
      req.app.get("db"),
      req.params.article_id
    );
    if (!article)
      return res.status(404).json({
        error: `Article doesn't exist`
      });
    res.article = article;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = articlesRouter;
