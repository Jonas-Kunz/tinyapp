const { assert } = require("chai");
const { generateRandomString, findUser, urlsForUser } = require("../helpers");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
// finduser test
describe("findUser", function() {
  it("should return user object with id", function() {
    const user = findUser("user@example.com", testUsers).id
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID, "user is ecpected user")
  });
  it("should return user object with valid email", function() {
    const user = findUser("user@example.com", testUsers).email
    const expectedUserID = "user@example.com";
    assert.equal(user, expectedUserID, "user is ecpected user")
  });
  it("should return user object with password", function() {
    const user = findUser("user@example.com", testUsers).password
    const expectedUserID = "purple-monkey-dinosaur";
    assert.equal(user, expectedUserID, "user is ecpected user")
  });
  it("should return null when given a wron email", function() {
    const user = findUser("user@ex.com", testUsers)
    const expectedUserID = null;
    assert.equal(user, expectedUserID, "user === null")
  });
});
///number gen test
describe("generateRandomString", function () {
  it("should return a random string 6 chars long", function (){
    const string = generateRandomString();
    assert.equal(string.length, 6, "String is 6 characters long")
  });
});
// urls for user test
describe("urlsForUser", function () {
  it("should return only urls that have a user id equal to users id", function () {
    const actualObject = urlsForUser("aJ48lW", testUrlDatabase);
    console.log(actualObject);
    const expectedObject = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW",
      },
      i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW",
      },
    }
    assert.deepEqual(actualObject, expectedObject, "the Objects are Equal");
  })
  it("should return an empty object if there are no URLs for that user", () => {
    const actualObject = urlsForUser("gobldygook", testUrlDatabase);
    const expectedObject = {};
    assert.deepEqual(actualObject, expectedObject, "when id is non existant returns empty object")
  })
});

