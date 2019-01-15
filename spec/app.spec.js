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
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.have.length(2);
          expect(body.topics).to.be.an("array");
          expect(body.topics).to.hasOwnProperty("slug");
          expect(body.topics).to.hasOwnProperty("description");
          expect(body.topics[1].slug).to.equal("cats");
          expect(body.topics[0].description).to.equal(
            "The man, the Mitch, the legend"
          );
        });
    });
    it("POST status:201 will post the request and add it to our database", () => {
      const testObj = { slug: "test", description: "this is a test" };
      return request
        .post("/api/topics")
        .send(testObj)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.eql(testObj);
        });
    });
    it("POST status:400 client uses malformed body", () => {
      const testObj = { slug: "snail" };
      return request
        .post("/api/topics")
        .send(testObj)
        .expect(400);
    });
  });
  describe("/topics/cats/articles", () => {
    it("GET status:200 responds with an array of topic objects", () => {
      return request
        .get("/api/topics/cats/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(2);
          expect(body.articles).to.be.an("array");
          expect(body.articles).to.hasOwnProperty("topic");
          expect(body.articles).to.hasOwnProperty("title");
          expect(body.articles[1].topic).to.equal("cats");
          expect(body.articles[0].title).to.equal(
            "UNCOVERED: catspiracy to bring down democracy"
          );
        });
    });
    it("GET should exept querys such as ?limit ?p ?sort_by and ?order", () => {
      return request
        .get(
          "/api/topics/mitch/articles?limit=2&&p=2&&sort_by=article_id&&order=asc"
        )
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(2);
          expect(body.articles).to.be.an("array");
          expect(body.articles).to.hasOwnProperty("topic");
          expect(body.articles).to.hasOwnProperty("title");
          expect(body.articles[0].author).to.equal("icellusedkars");
          expect(body.articles[1].title).to.equal("Student SUES Mitch!");
        });
    });
  });
});
