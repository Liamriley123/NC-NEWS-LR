process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => {
    return connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run());
  });
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET status:200 responds with an array of topic objects", () => {
      return request
        .get("/api/topic")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.have.length(2);
          expect(body.topics).to.be.an("array");
          expect(body.topics).to.haveOwnProperty("slug");
          expect(body.topics).to.haveOwnProperty("description");
          expect(body.topics[1].slug).to.equal("cats");
          expect(body.topics[0].description).to.equal(
            "The man, the Mitch, the legend"
          );
        });
    });
    it("POST status:201 will post the request and add it to our database", () => {
      const testObj = { slug: "test", description: "this is a test" };
      return request
        .post("/api/topic")
        .send(testObj)
        .expect(201)
        .then(({ body }) => {
          expect(body.topics).to.eql([testObj]);
        });
    });
  });
});
