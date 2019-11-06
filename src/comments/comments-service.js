const xss = require("xss");

const CommentsService = {
  getAllComments(db) {
    return db
      .select(
        "comm.id",
        "comm.article_id",
        "comm.content",
        "comm.date_created",
        "comm.user_id",
        "usr.username",
        "usr.image_url"
      )
      .from("travelist_comments as comm")
      .leftJoin("travelist_users as usr", "comm.user_id", "usr.id");
  },
  getById(db, id) {
    return db
      .from("travelist_comments as comm")
      .select(
        "comm.id",
        "comm.content",
        "comm.date_created",
        "comm.article_id",
        "comm.user_id",
        "usr.username"
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
  updateComment(db, id, user_id, newCommentFields) {
    return db
      .from("travelist_comments")
      .where({ id })
      .andWhere({ user_id })
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
      article_id: comment.article_id,
      content: xss(comment.content),
      date_created: new Date(comment.date_created),
      user: {
        id: comment.user_id,
        image_url: comment.image_url,
        username: comment.username,
        fullname: comment.fullname,
        date_created: new Date(comment.date_created),
        date_modified: new Date(comment.date_modified) || null
      }
    };
  }
};

module.exports = CommentsService;
