const VotesService = {
  getTotalVotes(db, article_id) {
    return db
      .from("travelist_votes as votes")
      .select("article_id", db.raw(`count(voted) as num_of_votes`))
      .where("votes.article_id", article_id)
      .andWhere("votes.voted", true)
      .groupBy("article_id", "voted");
  },
  updateNumOfVotes(db, article_id, user_id, newVoteCount) {
    return db
      .from("travelist_votes")
      .where({ article_id })
      .andWhere({ user_id })
      .update(newVoteCount);
  }
};

module.exports = VotesService;
