const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);
const appURL = "http://localhost:8080";

const agent = chai.request.agent(appURL);

describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b6UTxQ"', () => {
    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent
          .get("/urls/b6UTxQ")
          .redirects(0)
          .then((accessRes) => {
          // Step 3: Expect the status code to be 403
            expect(accessRes).to.have.status(403);
          });
      });
  });

  it("should redirect to /login if user not logged in", () => {
    const agent = chai.request.agent("http://localhost:8080");

    return agent.get("/").then((response) => {
      // expect(response).to.have.status(302)
      expect(response).to.redirectTo("http://localhost:8080/login");
    });
  });

  it("should redirect to /login if user not logged in", () => {
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get("/urls/new")
      .redirects(0)
      .then((response) => {
        expect(response).to.redirect;
        expect(response).to.have.status(302);
        expect(response).to.redirectTo("/login");
      });
  });

  it("should redirect to /login if user not logged in", () => {
    const agent = chai.request.agent("http://localhost:8080");
    return agent.get("/urls/b6UTxQ").then((response) => {
      expect(response).to.have.status(403);
    });
  });

  it("should return 404 status code for trying to acces a non existant resource", () => {
    const agent = chai.request.agent("http://localhost:8080");
    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "user@example.com", password: "purple-monkey-dinosaur" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return (
          agent
            .get("/urls/ardvark")
            // .redirects(0)
            .then((accessRes) => {
              // Step 3: Expect the status code to be 403
              expect(accessRes).to.have.status(404);
            })
        );
      });
  });
});
