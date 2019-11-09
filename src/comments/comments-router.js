const express = require("express");
const path = require("path");
const CommentsService = require("./comments-service");
const commentsRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

commentsRouter
  .route("/")
  .get((req, res, next) => {
    CommentsService.getAllComments(req.app.get("db"))
      .then(comments => {
        if (!comments) {
          res.status(404).json({
            message: "No comments found in database",
            type: "NoCommentsFoundinDB",
            comments: comments
          });
        } else {
          res.json(
            comments.map(comment => CommentsService.serializeComment(comment))
          );
        }
      })
      .catch(next);
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { article_id, content } = req.body;
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
          .location(path.posix.join(req.originalUrl))
          .json(CommentsService.serializeComment(comment));
      })
      .catch(next);
  });

commentsRouter
  .route("/:comment_id")
  .all(requireAuth)
  .all(checkCommentExists)
  .get((req, res, next) => {
    res.json(CommentsService.serializeComment(res.comment).catch(next));
  })
  .delete(bodyParser, (req, res, next) => {
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
    const user_id = req.user.id;
    const updatedComment = {
      content: content
    };

    const numOfValues = Object.values(updatedComment).filter(Boolean).length;

    if (numOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'content`
        }
      });
    }
    CommentsService.updateComment(
      req.app.get("db"),
      comment_id,
      user_id,
      updatedComment
    )
      .then(numOfRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkCommentExists(req, res, next) {
  try {
    const comment = await CommentsService.getById(
      req.app.get("db"),
      req.params.comment_id
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
