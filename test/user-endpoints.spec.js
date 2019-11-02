const knex = require("knex");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("User Endpoints", function() {
  let db;

  const { testUsers } = helpers.makeArticleFixtures();
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

  describe(`POST /api/user`, () => {
    context(`User Validation`, () => {
      beforeEach("insert users", () => helpers.seedUsersTable(db, testUsers));
      const requiredFields = [
        "username",
        "password",
        "fullname",
        "email",
        "profile"
      ];
      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: "test username",
          password: "test password",
          fullname: "test fullname",
          email: "test@gmail.com",
          profile: "test profile"
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/user")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });

        it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
          const userShortPassword = {
            username: "test user_name",
            password: "1234567",
            fullname: "test full_name",
            profile: "test profile",
            email: "test@gmail.com"
          };
          return supertest(app)
            .post("/api/user")
            .send(userShortPassword)
            .expect(400, {
              error: `Password must be longer than 8 characters`
            });
        });

        it(`responds 400 'Password be less than 72 characters' when long password`, () => {
          const userLongPassword = {
            username: "test user_name",
            password: "*".repeat(73),
            fullname: "test full_name",
            profile: "test profile",
            email: "test@gmail.com"
          };
          return supertest(app)
            .post("/api/user")
            .send(userLongPassword)
            .expect(400, { error: `Password must be less than 72 characters` });
        });

        it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
            username: "test user_name",
            password: " 1Aa!2Bb@",
            fullname: "test full_name",
            profile: "test profile",
            email: "test@gmail.com"
          };
          return supertest(app)
            .post("/api/user")
            .send(userPasswordStartsSpaces)
            .expect(400, {
              error: `Password must not start or end with empty space`
            });
        });

        it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            username: "test user_name",
            password: "1Aa!2Bb@ ",
            fullname: "test full_name",
            profile: "test profile",
            email: "test@gmail.com"
          };
          return supertest(app)
            .post("/api/user")
            .send(userPasswordEndsSpaces)
            .expect(400, {
              error: `Password must not start or end with empty space`
            });
        });

        it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
            username: "test username",
            password: "11AAaabb",
            fullname: "test fullname",
            profile: "test profile",
            email: "test@gmail.com"
          };
          return supertest(app)
            .post("/api/user")
            .send(userPasswordNotComplex)
            .expect(400, {
              error: `Password must contain one uppercase, lowercase, number and special character`
            });
        });

        it(`responds 400 'User name already taken' when username isn't unique`, () => {
          const duplicateUser = {
            username: testUser.username,
            password: "11AAaa!!",
            fullname: "test fullname",
            profile: "test profile",
            email: "test@gmail.com"
          };
          return supertest(app)
            .post("/api/user")
            .send(duplicateUser)
            .expect(400, { error: `Username already taken` });
        });
      });
    });
    context(`Happy path`, () => {
      it(`responds 201, serialize user, storing bcrypted password`, () => {
        const newUser = {
          username: "test user",
          password: "Password123!",
          fullname: "test fullname",
          profile: "test profile",
          email: "test@gmail.com",
          image_url: "test image"
        };
        return supertest(app)
          .post("/api/user")
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("id");
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.fullname).to.eql(newUser.fullname);
            expect(res.body.profile).to.eql(newUser.profile);
            expect(res.body.email).to.eql(newUser.email);
            expect(res.body.image_url).to.eql(newUser.image_url);
            expect(res.body).to.not.have.property("password");
            expect(res.headers.location).to.eql(
              `/api/user/profile/${newUser.username.replace(/ /g, "")}`
            );
          })
          .expect(res =>
            db
              .from("travelist_users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username);
                expect(row.fullname).to.eql(newUser.fullname);
                expect(row.email).to.eql(newUser.email);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });

  describe(`PATCH /api/users/account`, () => {
    beforeEach("insert users", () => helpers.seedUsersTable(db, testUsers));

    it(`updates user account, responding with 201 and updated user`, () => {
      const updatedUser = {
        password: "Password321!",
        profile: "updated profile",
        image_url: "test image"
      };

      const expectedUser = {
        ...testUser,
        ...updatedUser
      };

      return supertest(app)
        .patch(`/api/user/account`)
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(updatedUser)
        .expect(201)
        .then(res => {
          return supertest(app)
            .get(`/api/user/account`)
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .expect(res => {
              expect(res.body).to.not.have.property("password");
              expect(res.body.username).to.eql(expectedUser.username);
              expect(res.body.fullname).to.eql(expectedUser.fullname);
              expect(res.body.profile).to.eql(expectedUser.profile);
              expect(res.body.email).to.eql(expectedUser.email);
              expect(res.body.image_url).to.eql(expectedUser.image_url);
            });
        });
    });
  });

  describe(`GET /api/user/profile/:username`, () => {
    beforeEach("insert users", () => helpers.seedUsersTable(db, testUsers));

    context(`User not found`, () => {
      it(`responds 404 profile doesn't exist`, () => {
        return supertest(app)
          .get(`/api/user/profile/notexists`)
          .expect(404)
          .expect({
            error: `Profile doesn't exist`
          });
      });
    });

    context(`Happy path`, () => {
      it(`responds 200 okay`, () => {
        return supertest(app)
          .get(`/api/user/profile/${testUser.username}`)
          .expect(200);
      });
    });
  });
});
