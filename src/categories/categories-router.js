const express = require("express");
const categoriesRouter = express.Router();
const CategoriesService = require("./categories-service");

categoriesRouter.route("/").get((req, res, next) => {
  CategoriesService.getAllCategories(req.app.get("db"))
    .then(categories => {
      res.json(categories);
    })
    .catch(next);
});

module.exports = categoriesRouter;
