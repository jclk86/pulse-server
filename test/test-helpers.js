const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      fullname: "Tom Brady",
      username: "TBrady",
      email: "TBrady@gmail.com",
      profile: "I am test user 1",
      image_url:
        "https://images.pexels.com/photos/2501968/pexels-photo-2501968.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      password: "Password123!"
    },
    {
      id: 2,
      fullname: "Daniel Jones",
      username: "DJones",
      email: "DJones@gmail.com",
      profile: "I am test user 2",
      image_url:
        "https://images.pexels.com/photos/2501968/pexels-photo-2501968.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      password: "Password123!"
    }
  ];
}

function makeCategoriesArray() {
  return [
    { name: "Diary" },
    { name: "Advice" },
    { name: "Guide" },
    { name: "Random" },
    { name: "News" },
    { name: "Interviews" }
  ];
}

function makeArticlesArray(users, categories) {
  return [
    {
      id: 1,
      title: "Test post 1",
      author_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      image_url:
        "https://images.pexels.com/photos/2501968/pexels-photo-2501968.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      content: "Test content 1",
      article_category: categories[1].name
    },
    {
      id: 2,
      title: "Test post 2",
      author_id: users[1].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      image_url:
        "https://images.pexels.com/photos/2501968/pexels-photo-2501968.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      content: "Test content 2",
      article_category: categories[2].name
    }
  ];
}

function makeCommentsArray(articles, users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      article_id: articles[0].id,
      content: "test comment 1",
      date_created: new Date("2029-01-22T16:28:32.615Z")
    },
    {
      id: 2,
      user_id: users[1].id,
      article_id: articles[1].id,
      content: "test comment 2",
      date_created: new Date("2029-01-22T16:28:32.615Z")
    }
  ];
}

function makeVotesArray(articles, users) {
  return [
    {
      vote_id: 1,
      user_id: users[0].id,
      article_id: articles[1].id,
      voted: true
    },
    {
      vote_id: 2,
      user_id: users[1].id,
      article_id: articles[0].id,
      voted: true
    }
  ];
}

function makeExpectedArticle(article, users, categories, votes) {
  const category = categories.find(
    category => category.name === article.article_category
  );
  const author = users.find(user => user.id === article.author_id);
  const articleVotes = votes.filter(vote => article.id === vote.article_id);

  return {
    id: article.id,
    article_category: category.name,
    title: article.title,
    content: article.content,
    image_url: article.image_url,
    date_created: "2029-01-22T16:28:32.615Z",
    num_of_votes: articleVotes.length,
    author: {
      id: author.id,
      username: author.username,
      fullname: author.fullname
    }
  };
}

function makeExpectedArticleComments(users, articleId, comments) {
  const expectedComments = comments.filter(
    comment => comment.article_id === articleId
  );

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id);
    return {
      id: comment.id,
      article_id: comment.article_id,
      content: comment.content,
      date_created: "2029-01-22T16:28:32.615Z",
      user: {
        id: commentUser.id,
        username: commentUser.username,
        fullname: commentUser.fullname,
        date_created: "2029-01-22T16:28:32.615Z",
        date_modified: expectedComments.date_modified || null
      }
    };
  });
}

function makeExpectedVotesForArticle(votes, articleId) {
  const expectedVotes = votes.filter(vote => articleId === vote.article_id);

  return [
    {
      id: expectedVotes[0].vote_id,
      article_id: expectedVotes[0].article_id,
      voted: expectedVotes[0].voted,
      user_id: expectedVotes[0].user_id
    }
  ];
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        travelist_votes,
        travelist_comments,
        travelist_articles,
        travelist_categories,
        travelist_users`
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE travelist_users_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE travelist_articles_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE travelist_comments_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE travelist_votes_vote_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('travelist_users_id_seq', 0)`),
          trx.raw(`SELECT setval('travelist_articles_id_seq', 0)`),
          trx.raw(`SELECT setval('travelist_comments_id_seq', 0)`),
          trx.raw(`SELECT setval('travelist_votes_vote_id_seq', 0)`)
        ])
      )
  );
}

function makeArticleFixtures() {
  const testUsers = makeUsersArray();
  const testCategories = makeCategoriesArray();
  const testArticles = makeArticlesArray(testUsers, testCategories);
  const testComments = makeCommentsArray(testArticles, testUsers);
  const testVotes = makeVotesArray(testArticles, testUsers);
  return { testUsers, testArticles, testCategories, testComments, testVotes };
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256"
  });
  return `Bearer ${token}`;
}

function seedUsersTable(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into("travelist_users").insert(preppedUsers);
}

function seedCategoriesTable(db, categories) {
  const preppedCategories = categories.map(category => ({
    ...category
  }));
  return db.into("travelist_categories").insert(preppedCategories);
}

function seedCommentsTable(db, comments) {
  const preppedComments = comments.map(comment => ({
    ...comment
  }));
  return db.into("travelist_comments").insert(preppedComments);
}

function seedArticlesTable(
  db,
  articles,
  users,
  comments = [],
  categories,
  votes
) {
  return db.transaction(async trx => {
    await seedUsersTable(trx, users);
    await seedCategoriesTable(trx, categories);
    await trx.into("travelist_articles").insert(articles);
    await seedVotesTable(trx, votes);
    if (comments.length) {
      await trx.into("travelist_comments").insert(comments);
    }
  });
}

function seedVotesTable(db, votes) {
  const preppedVotes = votes.map(vote => ({
    ...vote
  }));
  return db.into("travelist_votes").insert(preppedVotes);
}

module.exports = {
  cleanTables,

  seedCategoriesTable,
  seedUsersTable,
  seedArticlesTable,
  seedVotesTable,
  seedCommentsTable,

  makeArticlesArray,
  makeUsersArray,
  makeCategoriesArray,
  makeVotesArray,
  makeCommentsArray,

  makeArticleFixtures,

  makeExpectedArticle,
  makeExpectedArticleComments,
  makeExpectedVotesForArticle,

  makeAuthHeader
};
