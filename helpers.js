
const generateRandomString = function () {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += chars[Math.floor(Math.random() * (62 - 0) + 0)];
  }
  return randString;
};

const findUser = function (email) {
  for (let user in users) {
    if (users[user].email === email) {
      return true
    }
    return false;
  }
};

const genUser = function (email, password,) {
  if (findUser(email)) {
    return res.redirect("/register")
  }
  return {
    id: generateRandomString(),
    email: userInfo.email,
    psw: userInfo.psw,
  };
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

urlDatabase.asdad = {
  longURL: "ass",
  userID: "123"
}
console.log(urlDatabase);

