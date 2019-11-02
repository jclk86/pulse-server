const app = require("../src/app");

describe("App", () => {
  it("GET / responds with 404 error", () => {
    return supertest(app)
      .get("/")
      .expect(404, { error: { message: "Page Not Found" } });
  });
});
