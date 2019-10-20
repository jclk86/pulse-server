const VotesService = {
  getTotalVotes(db, article_id) {
    return db
      .from("travelist_votes as votes")
      .select(
        "article_id",
        "id",
        "user_id",
        "voted",
        db.raw(`count(voted) as num_of_votes`)
      )
      .where("votes.article_id", article_id)
      .andWhere("votes.voted", true)
      .groupBy("article_id", "voted", "id", "user_id");
  },
  getByIds(db, article_id, user_id) {
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
      .then(([votes]) => votes)
      .then(votes =>
        VotesService.getByIds(db, votes.article_id, votes.user_id)
      );
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
      id: votes.id,
      article_id: votes.article_id,
      voted: votes.voted,
      num_of_votes: votes.num_of_votes,
      user_id: votes.user_id
    };
  }
};

module.exports = VotesService;
