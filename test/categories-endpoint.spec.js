const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe(`Categories Endpoint`, () => {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after(`disconnect from db`, () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`Categories Endpoint`, () => {
    context(`Given no categories`, () => {
      it(`responds 404 and no categories rendered`, () => {
        return supertest(app)
          .get("/api/categories")
          .expect(404);
      });
    });
    context(`Happy path`, () => {
      const expectedCategories = helpers.makeCategoriesArray();
      beforeEach(() => helpers.seedCategoriesTable(db, expectedCategories));
      it(`responds with 200 and with categories`, () => {
        return supertest(app)
          .get("/api/categories")
          .expect(200);
      });
    });
  });
});
