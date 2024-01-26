const express = require("express");
const {
  generateRandomString,
  findUser,
  urlsForUser,
  checkURL,
  authenticateUser,
} = require("./helpers");
const { users, urlDatabase } = require("./database");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port

// sets app to use ejs as its view engine
app.set("view engine", "ejs");
// translates forms to readable stuff
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// set session parser
app.use(
  cookieSession({
    name: "user_id",
    keys: ["ARGHAHAQADAS!@#$%!#$!@#!$!@#", "GORSHDOGNABBIT"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

//gets for various paths
app.get("/", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (user) {
    res.status(302);
    console.log(res.statusCode);
    return res.redirect("/urls");
  }
  res.status(302);
  console.log(res.statusCode);
  return res.redirect("/login");
});

// takes us to the main page
app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  const shortURL = req.params.id;
  urls = urlsForUser(id, urlDatabase);
  const templateVars = { urls, shortURL, user };
  return res.render("urls_index", templateVars);
});

// if we want to creat a new url
app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (!user) {
    res.status(302);
    return res.redirect("/login");
  }
  const templateVars = { user };
  return res.render("urls_new", templateVars);
});

// shows us the specified url
// seriously dont forget about [] notation it helps to break down stuff in understandable variables

app.get("/urls/:id", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  const shortURL = req.params.id;
  console.log(shortURL);
  console.log({ user, id, users });

  if (!user) {
    return res.status(403).send("<p> Cannot view unowned Urls <p>");
  };

  const URLID = req.params.id;
  const check = checkURL(URLID, urlDatabase);

  if (!check) {
    return res.status(404).send("<p>404 That URL Des Not exist");
  };

  if (id !== urlDatabase[shortURL].userID) {
    return res.status(403).send("<p> Cannot Acces Unowned Urls <p>");
  };

  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user, URLID, check };

  res.render("urls_show", templateVars);
  
});

// redirect to the original long url
app.get("/u/:id", (req, res) => {
  const id = req.session.user_id;
  const longURL = urlDatabase[req.params.id].longURL;
  res.status(302);
  return res.redirect(longURL);
});

// handles people wanting to go to register page
app.get("/register", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (user) {
    res.status(302);
    return res.redirect("/urls");
  }
  const templateVars = { user };
  return res.render("register", templateVars);
});

app.get("/urls.json", (req, res) => {
  return res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.status(200);
  return res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// login
app.get("/login", (req, res) => {
  const id = req.session.user_id;
  const user = users[id];
  if (user) {
    res.status(302);
    return res.redirect("/urls");
  }
  templateVars = { user };
  res.render("login", templateVars);
});

//////posts

// login post
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userObj = findUser(email, users);
  console.log(userObj, "user Objs");
  console.log({ email, password });
  if (!authenticateUser(password, userObj)) {
    res.status(403);
    return res.send("<p> 403 Please Enter A Valid Email or Adress <p>");
  } else {
    req.session.user_id = userObj.id;
    res.status(302);
    return res.redirect("/urls");
  }
});

// logout botton
app.post("/logout", (req, res) => {
  req.session = null;
  res.status(302);
  return res.redirect("/login");
});

// basic make an URL and add to database
app.post("/urls", (req, res) => {
  const id = req.session.user_id;
  if (!id) {
    res.status(400);
    return res.send("<p>Please Login or Register<p>");
  }
  const longURLnew = req.body.longURL;
  const newID = generateRandomString();
  // adds new object to database
  urlDatabase[`${newID}`] = {
    longURL: longURLnew,
    userID: id,
  };
  res.status(302);
  return res.redirect(`/urls/${newID}`);
});

// deletes a URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.session.user_id;
  const shortURL = req.params.id;
  if (!id) {
    res.status(403);
    return res.send(
      "<p>Cannot delete Id if not logged in or if pilfering others ids<p>"
    );
  }
  if (!shortURL) {
    res.status(400);
    return res.send("<p>id Does Not Exist<p>");
  }

  delete urlDatabase[shortURL];
  res.status(302);
  return res.redirect("/urls");
});

// catches the urls/:id/EDIT action from urls_index.ejs and redirects to the show page for that id at line 37
app.post("/urls/:id/EDIT", (req, res) => {
  const id = req.session.user_id;
  const shortURL = req.params.id;
  if (!id) {
    console.log("Cannot edit unowned IDs");
    res.status(403);
    return res.send("<p>Cannot edit unowned ids<p>");
  }
  res.status(302);
  return res.redirect(`/urls/${shortURL}`);
});

// yeets a post at the url and replaces the urlDatabse entry at that id with what you filled in on  the edit form in url_show.ejs at line 25
app.post("/urls/EDIT/:shortURL", (req, res) => {
  const id = req.session.user_id;
  const newURL = req.body.newURL;
  const urlid = req.params.shortURL;
  urlDatabase[urlid] = {
    longURL: newURL,
    userID: id,
  };
  res.status(302);
  return res.redirect("/urls");
});

// registration post
app.post("/register", (req, res) => {
  //forgot what i had this here for
  // const id = req.cookies["user_id"];

  const userInfo = {
    email: req.body.email,
    psw: req.body.password,
    psw_re: req.body.password_repeat,
  };

  if (!userInfo.email || !userInfo.psw) {
    res.status(400);
    return res.send("<p>Email or password cannot be empty<p>");
  }
  console.log(userInfo.email, " user Email");
  if (findUser(userInfo.email, users)) {
    res.status(400);
    return res.send("<p>Email already in use</p>");
  }

  // generates a user object if it doesnt already exist and redirects us to the registration page if it does
  // checks if passwords match
  if (userInfo.psw !== userInfo.psw_re) {
    res.status(302);
    return res.redirect("/register");
  }

  const newID = generateRandomString();
  users[newID] = {
    id: newID,
    email: userInfo.email,
    password: bcrypt.hashSync(userInfo.psw, 10),
  };

  req.session.user_id = newID;
  res.status(302);
  return res.redirect("/urls");
});

///listen
app.listen(PORT, () => {
  console.log(`Express_server listening on Port: ${PORT}!`);
});
