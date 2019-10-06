const xss = require("xss");

const ArticlesService = {
  getAllArticles(db) {
    return db
      .from("travelist_articles AS art")
      .select(
        "art.id",
        "art.title",
        "art.author_id",
        "art.content",
        "art.date_created",
        "art.style",
        db.raw(`count(DISTINCT comm) AS number_of_comments`),
        db.raw(
          `json_strip_nulls(
          json_build_object(
            'id', user.id,
            'username, user.username,
            'fullname', user.fullname,
            'date_created', user.date_created,
            'date_modified', user.date_modified
          )
        ) AS "author"`
        ),
      )
      .leftJoin("travelist_comments AS comm", "art.id", "comm.article_id")
      .leftJoin("travelist_users AS user", "art.author_id", "user.id")
      .groupBy("art.id", "user.id");
  },
  getById(db, id) { // username? I think payload allows for id though
    return ArticlesService.getAllArticles(db)
      .where("art.id", id)
      .first(); // might need to get stuff via user_id if you want a list of it
  },
  updateItem(db, id, newItemFields) {
    return db
    .from("travelist_articles")
    .where({ id })
    .update(newItemFields)
  },
  addItem(db, newItem) {
    return db
      .insert(newItem)
      .into("travelist_articles")
      .returning("*")
      .then(rows => {
        return rows[0]
      })
  },
  getCommentForArticle(db, article_id) {
    return db
      .from("travelist_comments AS comm")
      .select(
        "comm.id",
        "comm.content",
        "comm.date_created",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (
                SELECT tmp FROM(
                  SELECT 
                    user.id
                    user.username,
                    user.fullname,
                    user.nickname,
                    user.date_created,
                    user.date_modified
                )
              ) tmp
            )
          ) AS "user"`
        )
      )
      .where("comm.article_id", article_id)
      .leftJoin("travelist_users AS user", "comm.user_id", "user.id")
      .groupBy("comm.id", "user.id");
  },
  serializeArticle(article) {
    const { author } = article;
    return {
      id: article.id,
      style: article.style,
      title: xss(article.title),
      date_created: new Date(article.date_create),
      number_of_comments: Number(article.number_of_comments) || 0,
      author: {
        id: author.id,
        username: author.username,
        fullname: author.fullname,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      }
    };
  },

  serializeArticleComment(comment) {
    const { user } = comment;
    return {
      id: comment.id,
      article_id: comment.article_id,
      content: xss(comment.content),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      }
    };
  }
};

module.exports = ArticlesService;
