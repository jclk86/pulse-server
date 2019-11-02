const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe(`Votes Endpoints`, () => {
  let db;

  const {
    testUsers,
    testArticles,
    testComments,
    testCategories,
    testVotes
  } = helpers.makeArticleFixtures();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/votes/:article_id`, () => {
    beforeEach("insert categories", () => {
      return db.into("travelist_categories").insert(testCategories);
    });
    beforeEach("insert users", () => {
      return db.into("travelist_users").insert(testUsers);
    });
    beforeEach("insert articles", () => {
      return db.into("travelist_articles").insert(testArticles);
    });
    beforeEach("insert votes", () => {
      return db.into("travelist_votes").insert(testVotes);
    });

    it(`responds 200 and returns votes for article`, () => {
      // const expectedVotes = helpers.makeExpectedVotesForArticle(
      //   testVotes,
      //   testArticles[0].id
      // );

      return supertest(app)
        .get(`/api/votes/${testArticles[0].id}`)
        .expect(200);
    });
  });

  describe(`POST /api/votes/:article_id`, () => {
    beforeEach("insert categories", () => {
      return db.into("travelist_categories").insert(testCategories);
    });
    beforeEach("insert users", () => {
      return db.into("travelist_users").insert(testUsers);
    });
    beforeEach("insert articles", () => {
      return db.into("travelist_articles").insert(testArticles);
    });

    it(`responds 201 and inserts vote for article id`, () => {
      const newVote = {
        article_id: testArticles[0].id,
        user_id: testUsers[0].id,
        voted: true
      };
      return supertest(app)
        .post(`/api/votes/${testArticles[0].id}`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newVote)
        .expect(201)
        .then(res => {
          expect(res.body.voted).to.eql(true);
          expect(res.body.article_id).to.eql(newVote.article_id);
          expect(res.body.user_id).to.eql(newVote.user_id);
        });
    });
  });
});
