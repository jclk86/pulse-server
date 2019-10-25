const express = require("express");
const path = require("path");
const VotesService = require("./votes-service");
const votesRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

votesRouter
  .route("/:article_id")
  .get((req, res, next) => {
    VotesService.getTotalVotes(req.app.get("db")).then(votes =>
      res.json(votes.map(vote => VotesService.serializeVotes(vote)))
    );
  })
  // 2 ways this can work: no vote is nonexistent or a deleted true vote.
  // or no vote is false, which requires a req.body.voted value
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { article_id } = req.params;
    const user_id = req.user.id;
    const newVote = {
      article_id: parseInt(article_id),
      user_id,
      voted: true
    };
    for (const [key, value] of Object.entries(newVote))
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }

    // If a row with a corresponding article_id and user_id exists in the database, send 405 message to client. This prevents
    // users from upvoting more than once.
    VotesService.getVoteByIds(
      req.app.get("db"),
      newVote.article_id,
      newVote.user_id
    ).then(row => {
      if (row) {
        return res.status(405).json({
          message: "Already voted",
          type: "AlreadyVotedError",
          article_id: newVote.article_id
        });
      } else {
        VotesService.addVote(req.app.get("db"), newVote)
          .then(vote => {
            res.status(201).json(vote);
          })
          .catch(next);
      }
    });
  })
  .delete(requireAuth, (req, res, next) => {
    const { article_id } = req.params;
    const user_id = req.user.id;
    const voteToRemove = {
      article_id: parseInt(article_id),
      user_id,
      voted: true
    };

    VotesService.getVoteByIds(
      req.app.get("db"),
      voteToRemove.article_id,
      voteToRemove.user_id
    ).then(row => {
      if (!row) {
        return res.status(405).json({
          message: "No vote to delete",
          type: "NoExistingVoteError",
          article_id: voteToRemove.article_id
        });
      } else {
        VotesService.deleteVote(
          req.app.get("db"),
          voteToRemove.article_id,
          voteToRemove.user_id
        )
          .then(numOfRowsAffected => {
            res.status(204).end();
          })
          .catch(next);
      }
    });
  });

module.exports = votesRouter;
