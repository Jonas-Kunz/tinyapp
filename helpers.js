const { users, urlDatabase } = require("./database")
// I know this is not optimal, i just didnt want to copy the stackoverflow solution
const generateRandomString = function () {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += chars[Math.floor(Math.random() * (62 - 0) + 0)];
  }
  return randString;
};

const findUser = function (email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      const userObj = users[user]
      return userObj
    }
  }
  return null;
};

const urlsForUser = function (id,urlDatabase) {
  const userUrls = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

const checkURL = function(URLID) {
  return URLID in urlDatabase;
}



module.exports = { generateRandomString, findUser, urlsForUser, checkURL };
