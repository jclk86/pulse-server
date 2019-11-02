const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe(`Articles Endpoint`, () => {
  let db;
  const {
    testUsers,
    testArticles,
    testComments,
    testCategories,
    testVotes
  } = helpers.makeArticleFixtures();

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

  describe(`GET /api/articles`, () => {
    context(`Given no articles`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/articles")
          .expect(200, []);
      });
    });
    context(`Happy path`, () => {
      beforeEach("insert articles", () =>
        helpers.seedArticlesTable(
          db,
          testArticles,
          testUsers,
          testComments,
          testCategories,
          testVotes
        )
      );

      it(`respond with 200 and gets all articles from api`, () => {
        const expectedArticles = testArticles.map(article =>
          helpers.makeExpectedArticle(
            article,
            testUsers,
            testCategories,
            testVotes
          )
        );
        return supertest(app)
          .get("/api/articles")
          .expect(200, expectedArticles);
      });
    });
  });

  describe(`POST /api/articles`, () => {
    beforeEach("insert categories", () => {
      return db.into("travelist_categories").insert(testCategories);
    });
    beforeEach("insert users", () => {
      return db.into("travelist_users").insert(testUsers);
    });
    it(`posts article, responding 201 and article in database`, () => {
      const newArticle = {
        title: "Test Article Title",
        content: "Test article content",
        article_category: "News",
        image_url: "test image"
      };
      return supertest(app)
        .post(`/api/articles`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newArticle)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.title).to.eql(newArticle.title);
          expect(res.body.content).to.eql(newArticle.content);
          expect(res.body.article_category).to.eql(newArticle.article_category);
          expect(res.body.image_url).to.eql(newArticle.image_url);
        });
    });
  });

  describe(`PATCH /api/articles/:article_id`, () => {
    beforeEach("insert articles", () =>
      helpers.seedArticlesTable(
        db,
        testArticles,
        testUsers,
        testComments,
        testCategories,
        testVotes
      )
    );

    it(`updates article, responding with 201 and updated user`, () => {
      const testArticle = testArticles[0];
      const updatedArticle = {
        title: "Updated test title",
        content: "updated test content",
        article_category: "Diary",
        image_url: "updated test image"
      };
      const expectedArticle = {
        ...testArticle[testArticle.id],
        ...updatedArticle
      };

      return supertest(app)
        .patch(`/api/articles/${testArticle.id}`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(updatedArticle)
        .expect(201)
        .then(res => {
          supertest(app)
            .get(`/api/articles/${testArticle.id}`)
            .expect(expectedArticle);
        });
    });
  });

  describe(`DELETE /api/articles/:article_id`, () => {
    beforeEach("insert articles", () =>
      helpers.seedArticlesTable(
        db,
        testArticles,
        testUsers,
        testComments,
        testCategories,
        testVotes
      )
    );
    it(`responds 204 with no content`, () => {
      const article_id = testArticles[0].id;
      return supertest(app)
        .delete(`/api/articles/${article_id}`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(204);
    });
  });
});
