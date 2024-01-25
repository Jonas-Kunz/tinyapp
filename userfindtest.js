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
  '6pGNzw': { 
    id: '6pGNzw', 
    email: 'dog@dog.com', 
    password: 'cat' 
  }
};


const findUser = function (email) {
  for (let user in users) {
    if (users[user].email === email) {
      const userObj = users[user]
      return userObj
    }
  }
  return null;
};

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

authenticateUser('dog@dog.com', "cat")

