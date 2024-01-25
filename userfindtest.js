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
    psw: 'cat' 
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

console.log(findUser('dog@om'));


