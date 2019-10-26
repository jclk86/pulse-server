const xss = require("xss");

const ArticlesService = {
  //
  getAllArticles(db) {
    return db
      .select(
        "art.id",
        "art.image_url",
        "art.title",
        "art.author_id",
        "art.content",
        "art.date_created",
        "art.article_category",
        "usr.username",
        "usr.fullname",
        "usr.id as user_id",
        db.raw(`COUNT(votes.user_id) as num_of_votes`)
      )
      .from("travelist_articles as art")
      .leftJoin("travelist_votes as votes", "votes.article_id", "art.id")
      .leftJoin("travelist_users as usr", "usr.id", "art.author_id")
      .groupBy("art.id", "usr.username", "usr.fullname", "usr.id");
  },
  getById(db, article_id) {
    return db
      .select(
        "art.id",
        "art.image_url",
        "art.title",
        "art.author_id",
        "art.content",
        "art.article_category",
        "art.date_created",
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

  // countDistinctArticles() {
  //   return db
  //     .from("travelist_articles")
  //     .select("id", COUNT("id"))
  //     .groupBy("id");
  // },
  serializeArticle(article) {
    return {
      id: article.id,
      image_url: xss(article.image_url),
      article_category: article.article_category,
      title: xss(article.title),
      content: xss(article.content),
      date_created: new Date(article.date_created),
      num_of_votes: article.num_of_votes,
      author: {
        id: article.author_id,
        username: article.username,
        fullname: article.fullname
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
