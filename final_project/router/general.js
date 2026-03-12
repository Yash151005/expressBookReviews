const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let { isValid, authenticatedUser } = require("./auth_users.js");

const public_users = express.Router();
const BASE_URL = "http://localhost:5000";

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists! Please login." });
  }

  const { users } = require("./auth_users.js");
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 10 (Async): Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Using async/await with a Promise
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error("No books found"));
        }
      });
    };

    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Task 11 (Async): Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      });
    };

    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 12 (Async): Get book details based on Author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const booksByAuthor = [];
        const bookKeys = Object.keys(books);

        bookKeys.forEach(key => {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push({ isbn: key, ...books[key] });
          }
        });

        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject(new Error("No books found for this author"));
        }
      });
    };

    const result = await getBooksByAuthor(author);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Task 13 (Async): Get all books based on Title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const booksByTitle = [];
        const bookKeys = Object.keys(books);

        bookKeys.forEach(key => {
          if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            booksByTitle.push({ isbn: key, ...books[key] });
          }
        });

        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error("No books found with this title"));
        }
      });
    };

    const result = await getBooksByTitle(title);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;