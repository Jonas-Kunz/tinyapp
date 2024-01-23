const express = require("express");
const app = express();
const PORT = 8080; // default port
// crappy key generator: just loops six time and selects arandom character.
function generateRandomString() {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  let randString = "";
  for (let i = 0; i < 6; i++) {
    randString += chars[Math.floor(Math.random() * (62 - 0) + 0)]
  }
  return randString
};

// sets app to use ejs as its view engine
app.set("view engine", "ejs");
// mock data base to hold urls

// translates forms to readable stuff
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
                
//gets for various paths
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/urls");
});
/////gets
app.get("/urls", (req, res) => {
  const shortURL = req.params.id;
  const templateVars = { urls: urlDatabase, shortURL};
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// seriously dont forget about [] notation it helps to break down stuff in understandable variables
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL
  let newID = generateRandomString();
  urlDatabase[newID] = longURL;
  res.redirect(`/urls/${newID}`);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id] 
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase)
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

//////posts
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
})

///listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});