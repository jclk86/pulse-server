const xss = require("xss");

const CommentsService = {
  getById(db, id) {
    return db
      .from("travelist_comments as comm")
      .select(
        "comm.id",
        "comm.content",
        "comm.date_created",
        "comm.article_id",
        "comm.user_id",
        "usr.username",
        "usr.id"
      )
      .leftJoin("travelist_users as usr", "comm.user_id", "usr.id")
      .where("comm.id", id)
      .first();
  },
  addComment(db, newComment) {
    return db
      .insert(newComment)
      .into("travelist_comments")
      .returning("*")
      .then(([comment]) => comment)
      .then(comment => CommentsService.getById(db, comment.id));
  },
  updateComment(db, id, newCommentFields) {
    return db
      .from("travelist_comments")
      .where({ id })
      .update(newCommentFields);
  },
  deleteComment(db, id) {
    return db
      .from("travelist_comments")
      .where({ id })
      .del();
  },
  serializeComment(comment) {
    return {
      id: comment.id,
      content: xss(comment.content),
      article_id: comment.article_id,
      date_created: new Date(comment.date_created),
      user: {
        username: comment.username,
        date_modified: new Date() || null
      }
    };
  }
};

module.exports = CommentsService;
