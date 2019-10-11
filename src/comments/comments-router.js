const express = require("express");
const path = require("path");
const CommentsService = require("./comments-service");
const commentsRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

commentsRouter.route("/").post(requireAuth, bodyParser, (req, res, next) => {
  const { article_id, content } = req.body; // it'll be passed down from the articlePage Component as a prop
  const newComment = { article_id, content };

  for (const [key, value] of Object.entries(newComment))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });
  newComment.user_id = req.user.id;
  CommentsService.addComment(req.app.get("db"), newComment)
    .then(comment => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${comment.id}`))
        .json(CommentsService.serializeComment(comment));
    })
    .catch(next);
});

commentsRouter
  .route("/:comment_id")
  .all(requireAuth)
  .all(checkCommentExists) // check comment exists 
  .get((req,res, next) => {
    
    // res.json(CommentsService.serializeComment(res.comment)); checkComme
  })
  .delete(bodyParser, (req, res, next) => {
    // ensure not any user can delete any comment
    const { comment_id } = req.params;
    CommentsService.deleteComment(req.app.get("db"), comment_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { comment_id } = req.params;
    const { content } = req.body;
    const {user_id} = req.user
    const updatedComment = {
      id: comment_id,
      content: content,
      date_created: new Date()
    };
    CommentsService.updateComment(req.app.get("db"), comment_id, updatedComment)
      .then(numOfRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

  async function checkCommentExists(req, res, next) {
    try {
      const comment = await CommentsService.getById(
        req.app.get("db"),
        req.params.id
      );
      if (!comment)
        return res.status(404).json({
          error: `Comment doesn't exist`
        });
      res.comment = comment;
      next();
    } catch (error) {
      next(error);
    }
  }

module.exports = commentsRouter;
