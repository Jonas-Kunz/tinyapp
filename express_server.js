const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port
//mock URL database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

// crappy key generator: just loops six time and selects arandom character.
const generateRandomString = function () {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += chars[Math.floor(Math.random() * (62 - 0) + 0)]
  }
  return randString
};  

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

app.get("/urls", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  const shortURL = req.params.id;
  const templateVars = { urls: urlDatabase, shortURL, user};
 
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  const templateVars = { user }
  res.render("urls_new", templateVars);
});

// seriously dont forget about [] notation it helps to break down stuff in understandable variables
app.get("/urls/:id", (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id] 
  res.redirect(longURL);
});

app.get("/register", (req,res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  const templateVars = { user }
  res.render("register", templateVars)
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase)
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

//////posts
app.post("/login", (req,res) => {
  let username = req.body.username;
  if (username.length <= 0) {
    res.redirect("/urls");
    return;
  };
  res.cookie("username",`${username}`);
  res.redirect("/urls")
});

app.post("/logout", (req,res) => {
  res.clearCookie("username");
  res.redirect("/urls")
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL
  let newID = generateRandomString();
  urlDatabase[newID] = longURL;
  res.redirect(`/urls/${newID}`);
});

app.post("/urls/:id/delete", (req,res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

// catches the urls/:id/EDIT action from urls_index.ejs and redirects to the show page for that id at line 37
app.post("/urls/:id/EDIT", (req,res) => {
  const shortURL = req.params.id
  res.redirect(`/urls/${shortURL}`);
});

// yeets a post at the url and replaces the urlDatabse entry at that id with what you filled in on  the edit form in url_show.ejs at line 25
app.post("/urls/EDIT/:shortURL", (req,res) => {
  let newURL = req.body.newURL;
  let id = req.params.shortURL;
  urlDatabase[id] = newURL
  res.redirect("/urls");
});

// registration post
app.post("/register", (req,res) => {
  const formVars = {
    email: req.body.email,
    psw: req.body.password,
    psw_re: req.body.password_repeat
  };

  if (formVars.psw !== formVars.psw_re) {
    res.redirect("/register")
  };

  const randID = generateRandomString();
  res.cookie("user_id", `${randID}`);
  users[randID] = {
    id: randID,
    email: formVars.email,
    psw: formVars.psw
  };
  console.log(users[randID]);
  res.redirect("/urls")
})

///listen
app.listen(PORT, () => {
  console.log(`Express_server listening on Port: ${PORT}!`);
});