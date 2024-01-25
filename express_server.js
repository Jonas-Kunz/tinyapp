const express = require("express");
const { generateRandomString, findUser, urlsForUser, checkURL} = require("./helpers");
const { users, urlDatabase } = require("./database")
const cookieParser = require("cookie-parser");
// const functionCaller = require("./helpers")
const app = express();
const PORT = 8080; // default port


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
  const id = req.cookies["user_id"];
  const user = users[id];
  const shortURL = req.params.id;
  urls = urlsForUser(id);
  const templateVars = { urls, shortURL, user };
  res.render("urls_index", templateVars);
});

// if we want to creat a new url
app.get("/urls/new", (req, res) => {
  const id = req.cookies["user_id"];
  const user = users[id];
  if (!user) {
    res.redirect("/urls");
  };
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// shows us the specified url
// seriously dont forget about [] notation it helps to break down stuff in understandable variables

app.get("/urls/:id",  (req, res) => {
  const id = req.cookies["user_id"];
  const user = users[id];
  const URLID = req.params.id;
  const shortURL = req.params.id;
  const check = checkURL(URLID)
  const shortVars = { shortURL, URLID, user, check }
  if(!check) {
    return res.render("urls_show", shortVars) 
  }
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {shortURL, longURL, user, URLID, check };
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
  const id = req.cookies["user_id"];
  const user = users[id];
  if(user) {
    res.redirect("/urls");
  };
  const templateVars = { user };
  res.render("register", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// login
app.get("/login", (req, res) => {
  const id = req.cookies["user_id"];
  const user = users[id];
  if(user) {
    res.redirect("/urls");
  };
  templateVars = { user };
  res.render("login", templateVars);
});

//////posts

// login post
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userObj = findUser(email);

  const authenticateUser = function (password, userObj) {
    // console.log(userObj);
    if (userObj !== null) {
      // console.log(userObj.password);
      if(userObj.password === password) {
        // return console.log("Pass");
        res.cookie("user_id", userObj.id);
        return res.redirect("/urls")
      }
      return res.status(403).send("Please Enter Valid Email And Password")
    }
    return res.status(403).send("Please Enter Valid Email And Password") 
  };

  authenticateUser(password,userObj);

});

// logout botton
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

// basic make an URL and add to database
app.post("/urls", (req, res) => {
  const id = req.cookies["user_id"];
  if(!id) {
    return res.send("Please Login or Register")
  }
  const longURLnew = req.body.longURL;
  const newID = generateRandomString();
  // adds new object to database
  urlDatabase[`${newID}`] = {
    longURL: longURLnew,
    userID: id,
  };
  res.redirect(`/urls/${newID}`);
});

// deletes a URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.cookies["user_id"];
  const shortURL = req.params.id;
  if (!id) {
    console.log("user tried to delet id without login or without owning id");
    return res.send("Cannot delete Id if not logged in or if pilfering others ids")
  };
  if (!shortURL) {
    console.log("User Tried deleting nonexistant id");
    return res.send("/id Does Not Exist")
  };

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// catches the urls/:id/EDIT action from urls_index.ejs and redirects to the show page for that id at line 37
app.post("/urls/:id/EDIT", (req, res) => {
  const id = req.cookies["user_id"];
  const shortURL = req.params.id;
  if (!id) {
    console.log("Cannot edit unowned IDs");
    return res.send("Cannot edit unowned ids")
  };
  res.redirect(`/urls/${shortURL}`);
});

// yeets a post at the url and replaces the urlDatabse entry at that id with what you filled in on  the edit form in url_show.ejs at line 25
app.post("/urls/EDIT/:shortURL", (req, res) => {
  const id = req.cookies["user_id"];
  const newURL = req.body.newURL;
  const urlid = req.params.shortURL;
  urlDatabase[urlid] = {
    longURL: newURL,
    userID: id,
  };
  res.redirect("/urls");
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
    return res.status(400).send("Email or password cannot be empty");
  };

  if (findUser(userInfo.email)) {
    return res.status(400).send("Email already in use");
  };

  // generates a user object if it doesnt already exist and redirects us to the registration page if it does
  // checks if passwords match
  if (userInfo.psw !== userInfo.psw_re) {
    return res.redirect("/register");
  };

  const newID = generateRandomString();
  users[newID] = {
    id: newID,
    email: userInfo.email,
    password: userInfo.psw,
  };

  res.cookie("user_id", newID);
  res.redirect("/urls");

});

///listen
app.listen(PORT, () => {
  console.log(`Express_server listening on Port: ${PORT}!`);
});


