const express = require("express");
const tagsRouter = express.Router();
const TagsService = require("./tags-service");

tagsRouter.route("/").get((req, res, next) => {
  TagsService.getAllTags(req.app.get("db"))
    .then(tags => {
      res.json(tags);
    })
    .catch(next);
});

module.exports = tagsRouter;
