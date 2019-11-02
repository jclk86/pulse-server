const express = require("express");
const categoriesRouter = express.Router();
const CategoriesService = require("./categories-service");

categoriesRouter.route("/").get((req, res, next) => {
  CategoriesService.getAllCategories(req.app.get("db"))
    .then(categories => {
      if (!categories.length) {
        res.status(404).json({
          message: "No categories found in database",
          type: "MissingCategoriesInDB",
          categories: categories
        });
      } else {
        res.json(categories);
      }
    })
    .catch(next);
});

module.exports = categoriesRouter;
