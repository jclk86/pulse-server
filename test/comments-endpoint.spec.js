const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe(`Comments Endpoint`, () => {
  let db;
  const {
    testArticles,
    testUsers,
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

  describe(`GET /api/comments`, () => {
    context(`Given no articles`, () => {
      it(`responds 200 and returns empty`, () => {
        return supertest(app)
          .get(`/api/comments`)
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
      // const expectedComments = testArticles.map(article => {
      //   return helpers.makeExpectedArticleComments(
      //     testUsers,
      //     article.id,
      //     testComments
      //   );
      // });

      it(`responds 200 and returns all comments`, () => {
        return supertest(app)
          .get(`/api/comments`)
          .expect(200);
      });
    });
  });

  describe(`POST /api/comments`, () => {
    beforeEach("insert categories", () => {
      return db.into("travelist_categories").insert(testCategories);
    });
    beforeEach("insert users", () => {
      return db.into("travelist_users").insert(testUsers);
    });
    beforeEach("insert articles", () => {
      return db.into("travelist_articles").insert(testArticles);
    });
    it(`responds 201 and inserts comment into db`, () => {
      const newComment = {
        article_id: testArticles[0].id,
        content: "posted test content"
      };
      return supertest(app)
        .post(`/api/comments`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.content).to.eql(newComment.content);
          expect(res.body.article_id).to.eql(newComment.article_id);
          expect(res.body)
            .to.have.property("user")
            .to.have.property("id");
        });
    });
  });

  describe(`PATCH /api/comments/:comment_id`, () => {
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
    it(`responds 204 and updates comment`, () => {
      const testComment = testComments[0];
      const updatedComment = {
        content: "Upated comment"
      };
      const expectedComment = {
        ...testComment[testComment.id],
        ...updatedComment
      };
      return supertest(app)
        .patch(`/api/comments/${testComment.id}`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(updatedComment)
        .expect(204)
        .then(res => {
          supertest(app)
            .get(`/api/comments/${testComment.id}`)
            .expect(expectedComment);
        });
    });
  });

  describe(`DELETE /api/comments:comment_id`, () => {
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
    it(`responds 204 and item is deleted`, () => {
      return supertest(app)
        .delete(`/api/comments/${testComments[0].id}`)
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .expect(204);
    });
  });
});
