const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    // Return error if username or password is missing
    return res.status(400).json({
      message:
        "Unable to register user, username and password must be provided",
    });
  }

  // Check if user already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add new user to the users array
  users.push({ username, password });
  return res
    .status(201)
    .json({ message: "User registered successfully, now you can login" });
});

// Get the book list available in the shop
/* public_users.get("/", function (req, res) {
  return res.status(200).json({ books });
}); */

const getBooksAsync = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 1000); // simulate a delay
  });
};

public_users.get("/", async function (req, res) {
  try {
    const books = await getBooksAsync();
    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Get book details based on ISBN
/* public_users.get("/isbn/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  return res.status(200).json({ book });
}); */

// Simulate fetching a book asynchronously
const getBookByISBN = async (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000); // Simulate a delay
  });
};

// Get book details by ISBN using async/await
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const book = await getBookByISBN(req.params.isbn);
    return res.status(200).json({ book });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author
/* public_users.get("/author/:author", function (req, res) {
  // Filter books by the author's name
  const filteredBooks = Object.values(books).filter(
    (book) => book.author === req.params.author
  );
  if (filteredBooks) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "No books found for this author." });
  }
}); */

// Simulate fetching books by author asynchronously
const getBooksByAuthor = async (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.author === author
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found for this author."));
      }
    }, 1000); // Simulate a delay
  });
};

// Get books by author using async/await
public_users.get("/author/:author", async function (req, res) {
  try {
    const booksByAuthor = await getBooksByAuthor(req.params.author);
    return res.status(200).json({ books: booksByAuthor });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title
/* public_users.get("/title/:title", function (req, res) {
  // Filter books by title
  const filteredBooks = Object.values(books).filter(
    (book) => book.title === req.params.title
  );
  if (filteredBooks) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "No books found for this title." });
  }
}); */
// Simulate fetching books by title asynchronously
const getBooksByTitle = async (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.title === title
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found for this title."));
      }
    }, 1000); // Simulate a delay
  });
};

// Get books by title using async/await
public_users.get("/title/:title", async function (req, res) {
  try {
    const booksByTitle = await getBooksByTitle(req.params.title);
    return res.status(200).json({ books: booksByTitle });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "No books found for this author." });
  }
});

module.exports.general = public_users;
