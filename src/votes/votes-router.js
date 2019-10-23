const express = require("express");
const path = require("path");
const VotesService = require("./votes-service");
const votesRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

votesRouter
  .route("/:article_id")
  .get((req, res, next) => {
    VotesService.getTotalVotes(req.app.get("db")).then(
      votes => res.json(votes.map(vote => VotesService.serializeVotes(vote))) //filter it here?
    );
  })
  // 2 ways this can work: no vote is nonexistent or a deleted true vote.
  // or no vote is false, which requires a req.body.voted value
  .post(requireAuth, bodyParser, (req, res, next) => {
    const { article_id } = req.params;
    const user_id = req.user.id;
    const newVote = {
      article_id,
      user_id,
      voted: true
    };
    for (const [key, value] of Object.entries(newVote))
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    const voterExists = VotesService.getVoteByIds(
      req.app.get("db"),
      newVote.article_id,
      newVote.user_id
    );
    if (voterExists) {
      VotesService.deleteVote(
        req.app.get("db"),
        newVote.article_id,
        newVote.user_id
      ).then(numRowsAffected => {
        res.status(204).end();
      });
    } else {
      VotesService.addVote(req.app.get("db"), newVote)
        .then(vote => {
          res.status(201).json(vote);
        })
        .catch(next);
    }
  })
  .delete(requireAuth, (req, res, next) => {
    const { article_id } = req.params;
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

// does voter exist for article
module.exports = votesRouter;
