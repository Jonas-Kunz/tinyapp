const express = require("express");
// const { findUser, generateRandomString, genUser} = require("./helpers")
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port
//mock URL database
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

// mock user database"
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
// generates user id
const generateRandomString = function () {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += chars[Math.floor(Math.random() * (62 - 0) + 0)];
  }
  return randString;
};
//finds user in database when given an email
const findUser = function (email) {
  for (let user in users) {
    if (users[user].email === email) {
      const userObj = users[user];
      return userObj;
    }
  }
  return null;
};

// crappy key generator: just loops six time and selects arandom character.

// sets app to use ejs as its view engine
app.set("view engine", "ejs");
// translates forms to readable stuff
app.use(express.urlencoded({ extended: true }));
// set cookie parser
app.use(cookieParser());

//gets for various paths
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/urls");
});
// takes us to the main page
app.get("/urls", (req, res) => {
  let id = req.cookies["user_id"];
  const user = users[id];
  //console.log(user);
  const shortURL = req.params.id;
  const templateVars = { urls: urlDatabase, shortURL, user };

  res.render("urls_index", templateVars);
});
// if we want to creat a new url
app.get("/urls/new", (req, res) => {
  let id = req.cookies["user_id"];
  const user = users[id];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});
// shows us the specified url
// seriously dont forget about [] notation it helps to break down stuff in understandable variables
app.get("/urls/:id", (req, res) => {
  let id = req.cookies["user_id"];
  const user = users[id];
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user };
  res.render("urls_show", templateVars);
});
// redirect to the original long url
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});
// handles people wanting to go to register page
app.get("/register", (req, res) => {
  let id = req.cookies["user_id"];
  const user = users[id];
  const templateVars = { user };
  res.render("register", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//////posts
// app.post("/login", (req, res) => {
//   const email = req.cookies.email;
//   if (email.length <= 0) {
//     res.redirect("/urls");
//     return;
//   }
//   res.cookie("username", `${username}`);
//   res.redirect("/urls");
// });
// logout botton
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
// basic make an URL and add to database
app.post("/urls", (req, res) => {
  const id = req.cookies["user_id"];
  const longURLnew = req.body.longURL;
  const newID = generateRandomString();
  // adds new object to database
  urlDatabase[`${newID}`] = {
    longURL: longURLnew,
    userID: id
  };
  res.redirect(`/urls/${newID}`);
});
// deletes a URL
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// catches the urls/:id/EDIT action from urls_index.ejs and redirects to the show page for that id at line 37
app.post("/urls/:id/EDIT", (req, res) => {
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});

// yeets a post at the url and replaces the urlDatabse entry at that id with what you filled in on  the edit form in url_show.ejs at line 25
app.post("/urls/EDIT/:shortURL", (req, res) => {
  let newURL = req.body.newURL;
  let id = req.params.shortURL;
  urlDatabase[id] = newURL;
  res.redirect("/urls");
});

// registration post
app.post("/register", (req, res) => {
  const id = req.cookies["user_id"];
  // console.log("id: ", id);
  const userInfo = {
    email: req.body.email,
    psw: req.body.password,
    psw_re: req.body.password_repeat,
  };

  if (!userInfo.email || !userInfo.psw) {
    res.status(400).send("Email or password cannot be empty");
  }

  // generates a user object if it doesnt already exist and redirects us to the registration page if it does
  const genUser = function (email, psw) {
    if (findUser(email)) {
      res.status(400).send("Email already in use");
      return res.redirect("/register");
    }
    return {
      id: generateRandomString(),
      email: userInfo.email,
      psw: userInfo.psw,
    };
  };
  // checks if passwords match
  if (userInfo.psw !== userInfo.psw_re) {
    res.redirect("/register");
  }

  const user = genUser(userInfo.email, userInfo.psw);

  users[user.id] = user;

  // console.log("users:", users);
  // console.log("USER email: ", users[user.id].email);
  res.cookie("user_id", user.id);

  res.redirect("/urls");
});

///listen
app.listen(PORT, () => {
  console.log(`Express_server listening on Port: ${PORT}!`);
});
