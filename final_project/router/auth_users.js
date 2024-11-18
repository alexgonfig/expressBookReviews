const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return !!users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return !!users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    // Return error if username or password is missing
    return res.status(400).json({
      message: "Unable to login, username or password is missing",
    });
  }

  // Check if user already exists
  if (!authenticatedUser(username, password)) {
    // Return error if invalid username or password
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }

  // Generate JWT access token
  let accessToken = jwt.sign(
    {
      data: password,
    },
    "access",
    { expiresIn: 60 * 60 }
  );

  // Store access token and username in session
  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.session.authorization.username;
  const review = req.body.review;
  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username = req.session.authorization.username;

  if (!book.reviews[username]) {
    return res.status(404).json({
      message: "Review not found for the user",
    });
  }

  delete book.reviews[username]; // Remove the review
  return res.status(200).json({
    message: "Review successfully deleted",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
