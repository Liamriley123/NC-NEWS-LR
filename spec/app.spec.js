process.env.NODE_ENV = "test";
const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../app");

const request = supertest(app);
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() =>
    connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run())
  );
  after(() => connection.destroy());

  describe("/topics", () => {
    it("GET status:200 responds with an array of topic objects", () =>
      request
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.have.length(2);
          expect(body.topics).to.be.an("array");
          expect(body.topics[1]).to.haveOwnProperty("slug");
          expect(body.topics[1]).to.haveOwnProperty("description");
          expect(body.topics[1].slug).to.equal("cats");
          expect(body.topics[0].description).to.equal(
            "The man, the Mitch, the legend"
          );
        }));
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
    it("will return 405 if any methods are used that are not aloud", () =>
      request.patch("/api/topics").expect(405));
    it("will return 405 if any methods are used that are not aloud", () =>
      request.delete("/api/topics").expect(405));
  });

  describe("/topics/cats/articles", () => {
    it("GET status:200 responds with an array of topic objects", () =>
      request
        .get("/api/topics/cats/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(2);
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.haveOwnProperty("topic");
          expect(body.articles[0]).to.haveOwnProperty("title");
          expect(body.articles[1].topic).to.equal("cats");
          expect(body.articles[0].title).to.equal(
            "UNCOVERED: catspiracy to bring down democracy"
          );
        }));
    it("GET should exept querys such as limit to limit number of a page and ?p to choose pagination number", () =>
      request
        .get("/api/topics/mitch/articles?limit=3&&p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(3);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[0].author).to.equal("rogersop");
          expect(body.articles[1].title).to.equal("A");
        }));
    it("GET should exept querys such as ?sort_by and ?order to show us what we want in a specific order", () =>
      request
        .get("/api/topics/mitch/articles?sort_by=author&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[9].author).to.equal("rogersop");
          expect(body.articles[1].author).to.equal("butter_bridge");
        }));
    it("GET should exept querys such as ?limit ?p ?sort_by and ?order", () =>
      request
        .get(
          "/api/topics/mitch/articles?limit=2&&p=2&&sort_by=article_id&&order=asc"
        )
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(2);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[0].author).to.equal("icellusedkars");
          expect(body.articles[1].title).to.equal("Student SUES Mitch!");
        }));
    it("GET 404 due to topic in params doesnt exist", () =>
      request.get("/api/topics/liam/articles").expect(404));
    it("POST status:201 will post the request and add it to our database", () => {
      const testObj = {
        title: "is mitch a cat?",
        body:
          "after reading a variety of cat and mitch articles, im starting to belive they may be the same thing",
        username: "butter_bridge"
      };
      return request
        .post("/api/topics/cats/articles")
        .send(testObj)
        .expect(201)
        .then(({ body }) => {
          expect(body.article.article_id).to.equal(13);
          expect(body.article.body).to.equal(testObj.body);
          expect(body.article.title).to.equal(testObj.title);
          expect(body.article.topic).to.equal("cats");
          expect(body.article.username).to.equal(testObj.username);
          expect(body.article.votes).to.equal(0);
        });
    });
    it("POST status:400 client uses malformed body", () => {
      const testObj = { title: "snail" };
      return request
        .post("/api/topics/cats/articles")
        .send(testObj)
        .expect(400);
    });
    it("POST 404 due to topic in params doesnt exist", () =>
      request
        .post("/api/topics/liam/articles")
        .send({
          title: "is mitch a cat?",
          body:
            "after reading a variety of cat and mitch articles, im starting to belive they may be the same thing",
          username: "butter_bridge"
        })
        .expect(404));
  });
  it("will return 405 if any methods are used that are not aloud", () =>
    request.patch("/api/topics/cats/articles").expect(405));
  it("will return 405 if any methods are used that are not aloud", () =>
    request.delete("/api/topics/cats/articles").expect(405));

  describe("/articles", () => {
    it("GET status:200 responds with an array of article objects", () =>
      request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body.articles).to.have.length(10);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("author");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[1]).to.haveOwnProperty("article_id");
          expect(body.articles[1]).to.haveOwnProperty("votes");
          expect(body.articles[1]).to.haveOwnProperty("created_at");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("comment_count");
          expect(body.articles[0].author).to.equal("butter_bridge");
          expect(body.articles[0].votes).to.equal(100);
          expect(body.articles[0].comment_count).to.equal("13");
        }));
    it("GET should exept querys such as limit to limit number of a page and ?p to choose pagination number", () =>
      request
        .get("/api/articles?limit=4&&p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(4);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[0].author).to.equal("rogersop");
          expect(body.articles[1].title).to.equal("A");
        }));
    it("GET should exept querys such as ?sort_by and ?order to show us what we want in a specific order", () =>
      request
        .get("/api/articles?sort_by=author&&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[9].author).to.equal("butter_bridge");
          expect(body.articles[1].author).to.equal("rogersop");
        }));
    it("GET should exept querys such as ?limit ?p ?sort_by and ?order", () =>
      request
        .get("/api/articles?limit=2&&p=2&&sort_by=article_id&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(2);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[0].author).to.equal("icellusedkars");
          expect(body.articles[1].title).to.equal("Student SUES Mitch!");
        }));
    it("GET status:200 when nonsense params used it will ignore it and send 200", () =>
      request.get("/api/articles?limit=asdfghjkl").expect(200));
    it("will return 405 if any methods are used that are not aloud", () =>
      request.post("/api/articles").expect(405));
    it("will return 405 if any methods are used that are not aloud", () =>
      request.patch("/api/articles").expect(405));
    it("will return 405 if any methods are used that are not aloud", () =>
      request.delete("/api/articles").expect(405));
  });

  describe("/articles/:article_id", () => {
    it("GET status:200 responds with an article object", () =>
      request
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(1);
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.haveOwnProperty("author");
          expect(body.articles[0]).to.haveOwnProperty("title");
          expect(body.articles[0]).to.haveOwnProperty("article_id");
          expect(body.articles[0]).to.haveOwnProperty("votes");
          expect(body.articles[0]).to.haveOwnProperty("created_at");
          expect(body.articles[0]).to.haveOwnProperty("topic");
          expect(body.articles[0]).to.haveOwnProperty("comment_count");
          expect(body.articles[0].author).to.equal("icellusedkars");
          expect(body.articles[0].title).to.equal(
            "Eight pug gifs that remind me of mitch"
          );
        }));
    it("get status:400 if article id supplied isnt an a number", () =>
      request.get("/api/articles/liam").expect(400));
    it("get status:404 if article id supplied is a number but doesnt match an article id", () =>
      request.get("/api/articles/4789").expect(404));
    it("PATCH status:200 responds with an article object with updated votes", () =>
      request
        .patch("/api/articles/3")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body.articles).to.have.length(1);
          expect(body.articles[0]).to.haveOwnProperty("title");
          expect(body.articles[0]).to.haveOwnProperty("article_id");
          expect(body.articles[0]).to.haveOwnProperty("votes");
          expect(body.articles[0]).to.haveOwnProperty("created_at");
          expect(body.articles[0]).to.haveOwnProperty("topic");
          expect(body.articles[0].votes).to.equal(5);
        }));
    it("PATCH status:400 client uses malformed body", () =>
      request
        .patch("/api/articles/5")
        .send({ votes: 10 })
        .expect(400));
    it("PATCH status:400 doesnt insert a number for votes", () =>
      request
        .patch("/api/articles/5")
        .send({ inc_votes: "five" })
        .expect(400));
    it("delete status:204 removes the article specified in the params", () =>
      request
        .delete("/api/articles/1")
        .expect(204)
        .then(() => request.get("/api/articles/1").expect(404)));
    it("will return 405 if any methods are used that are not aloud", () =>
      request.post("/api/articles/1").expect(405));
  });

  describe("/articles/:article_id/comments", () => {
    it("GET status:200 responds with an array of comment objects", () =>
      request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.length(10);
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.haveOwnProperty("author");
          expect(body.comments[0]).to.haveOwnProperty("comment_id");
          expect(body.comments[0]).to.haveOwnProperty("votes");
          expect(body.comments[0]).to.haveOwnProperty("created_at");
          expect(body.comments[0]).to.haveOwnProperty("body");
          expect(body.comments[0].author).to.equal("butter_bridge");
          expect(body.comments[0].votes).to.equal(14);
        }));
    it("GET should exept querys such as limit to limit number of a page and ?p to choose pagination number", () =>
      request
        .get("/api/topics/mitch/articles?limit=3&&p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(3);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[0].author).to.equal("rogersop");
          expect(body.articles[1].title).to.equal("A");
        }));
    it("GET should exept querys such as ?sort_by and ?order to show us what we want in a specific order", () =>
      request
        .get("/api/topics/mitch/articles?sort_by=author&&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles).to.be.an("array");
          expect(body.articles[1]).to.haveOwnProperty("topic");
          expect(body.articles[1]).to.haveOwnProperty("title");
          expect(body.articles[9].author).to.equal("rogersop");
          expect(body.articles[1].author).to.equal("butter_bridge");
        }));
  });
});
