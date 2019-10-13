const xss = require("xss");

const ArticlesService = {
  getAllArticles(db) {
    return db
      .select(
        "art.id",
        "art.title",
        "art.author_id",
        "art.content",
        "art.article_tag",
        "usr.username",
        "usr.fullname"
      )
      .from("travelist_articles as art")
      .leftJoin("travelist_users as usr", "art.author_id", "usr.id");
  },
  //getNumberOfComments or in getComments
  getById(db, article_id) {
    // username? I think payload allows for id though and might need to get stuff via user_id if you want a list of it
    return db
      .select(
        "art.id",
        "art.title",
        "art.author_id",
        "art.content",
        "art.article_tag",
        "usr.username"
      )
      .from("travelist_articles as art")
      .leftJoin("travelist_users as usr", "art.author_id", "usr.id")
      .where("art.id", article_id)
      .first();
  },

  updateArticle(db, id, newArticleFields) {
    return db
      .from("travelist_articles")
      .where({ id })
      .update(newArticleFields);
  },
  addArticle(db, newArticle) {
    return db
      .insert(newArticle)
      .into("travelist_articles")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteArticle(db, id) {
    return db
      .from("travelist_articles")
      .where({ id })
      .del();
  },
  getCommentsForArticle(db, article_id) {
    return db
      .from("travelist_comments AS comm")
      .select(
        "comm.id",
        "comm.article_id",
        "comm.content",
        "comm.date_created",
        "comm.user_id",
        "usr.username"
      )
      .where("comm.article_id", article_id)
      .leftJoin("travelist_users AS usr", "comm.user_id", "usr.id")
      .groupBy("comm.id", "usr.id");
  },
  serializeArticle(article) {
    return {
      id: article.id,
      article_tag: article.article_tag,
      title: xss(article.title),
      content: xss(article.content),
      date_created: new Date(article.date_create),
      number_of_comments: Number(article.number_of_comments) || 0,
      author: {
        id: article.author_id,
        username: article.username,
        fullname: article.fullname
        // date_created: new Date(article.date_created),
        // date_modified: new Date(article.date_modified) || null
      }
    };
  },

  serializeArticleComment(comment) {
    return {
      id: comment.id,
      article_id: comment.article_id,
      content: xss(comment.content),
      date_created: new Date(comment.date_created),
      user: {
        id: comment.user_id,
        username: comment.username,
        fullname: comment.fullname,
        date_created: new Date(comment.date_created),
        date_modified: new Date(comment.date_modified) || null
      }
    };
  }
};

module.exports = ArticlesService;
