const VotesService = {
  getTotalVotes(db) {
    return db
      .from("travelist_votes as votes")
      .select("article_id", "vote_id", "user_id", "voted");
  },
  getVoteByIds(db, article_id, user_id) {
    return db
      .from("travelist_votes")
      .select("*")
      .where({ article_id })
      .andWhere({ user_id })
      .first();
  },
  addVote(db, newVote) {
    return db
      .insert(newVote)
      .into("travelist_votes")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteVote(db, article_id, user_id) {
    return db
      .from("travelist_votes")
      .where({ article_id })
      .andWhere({ user_id })
      .del();
  },
  updateNumOfVotes(db, article_id, user_id, newVoteCount) {
    return db
      .from("travelist_votes")
      .where({ article_id })
      .andWhere({ user_id })
      .update(newVoteCount);
  },

  serializeVotes(votes) {
    return {
      id: votes.vote_id,
      article_id: votes.article_id,
      voted: votes.voted,
      num_of_votes: votes.num_of_votes,
      user_id: votes.user_id
    };
  }
};

module.exports = VotesService;
