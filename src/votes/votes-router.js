const express = require("express");
const path = require("path");
const VotesService = require("./votes-service");
const votesRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

votesRouter
  .route("/:article_id")
  .get((req, res, next) => {
    VotesService.getTotalVotes(req.app.get("db"), req.params.article_id).then(
      votes => res.json(votes.map(vote => VotesService.serializeVotes(vote))) //filter it here?
    );
  })
  .delete(requireAuth, (req, res, next) => {
    const { article_id } = req.params.article_id;
    const user_id = req.user.id;
    VotesService.deleteVote(req.app.get("db"), article_id, user_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(requireAuth, bodyParser, (req, res, next) => {
    const { voted } = req.body;
    const { article_id } = req.params;
    const user_id = req.user.id;
    const newVoteCount = {
      voted: voted
    };
    VotesService.updateNumOfVotes(
      req.app.get("db"),
      article_id,
      user_id,
      newVoteCount
    )
      .then(numOfRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = votesRouter;
