
const bcrypt = require("bcryptjs");

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

const checkURL = function(URLID, urlDatabase) {
  return URLID in urlDatabase;
}

const authenticateUser = function (password, userObj) {
  
  if (userObj) {
    if(bcrypt.compareSync(password, userObj.password)) {
      return true;
    }
    return false
  }
  return false
};


module.exports = { generateRandomString, findUser, urlsForUser, checkURL, authenticateUser };
