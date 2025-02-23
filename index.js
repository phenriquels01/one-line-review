import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();
const port = 3000;


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


// DB Configuration
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


db.connect();


// Home Page Route
app.get("/", async (req, res) => {
  try {
    // Queries books from the database
    const result = await db.query('SELECT * FROM books ORDER BY created_at DESC LIMIT 10');
    
    // Maps the books to get the cover via Open Library API
    const booksWithCovers = await Promise.all(result.rows.map(async (book) => {
      const coverUrl = await getBookCover(book.isbn);
      return {
        ...book,
        coverUrl, // Adds the cover URL to the book
      };
    }));

    // Renders the home page with the books and their covers
    res.render("index", { books: booksWithCovers });
  } catch (error) {
    console.error('Error loading books:', error);
    res.status(500).send('Error loading books');
  }
});


// Function to get the book cover from Open Library API
async function getBookCover(isbn) {
  try {
    const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
    if (response.status === 200) {
      return response.request.res.responseUrl;
    } else {
      return '/default-cover.jpg';
    }
  } catch (error) {
    console.error('Error getting cover:', error);
    return '/default-cover.jpg';
  }
}


// Endpoint to fetch books via API (JSON)
app.get("/api/books", async (req, res) => {
  try {
    // 1. Validating the parameter
    const validSorts = ["newest", "oldest", "best", "worst", "az"];
    const sort = validSorts.includes(req.query.sort) ? req.query.sort : "newest";
    // 2. Sorting mapping
    const orderMap = {
      newest: "created_at DESC",
      oldest: "created_at ASC",
      best: "rating DESC NULLS LAST",
      worst: "rating ASC NULLS FIRST",
      az: "title ASC"
    };
    // 3. Database query
    const query = `SELECT * FROM books ORDER BY ${orderMap[sort]} LIMIT 10`;
    const result = await db.query(query); 
    // 4. Fetching book covers
    const booksWithCovers = await Promise.all(
      result.rows.map(async (book) => {
        try {
          const coverUrl = await getBookCover(book.isbn);
          return { ...book, coverUrl: coverUrl || '/images/default-cover.jpg' };
        } catch (error) {
          console.error(`Error getting cover for book ${book.isbn}:`, error);
          return { ...book, coverUrl: '/images/default-cover.jpg' };
        }
      })
    );
    // 5. JSON Response
    res.json({
      success: true,
      count: booksWithCovers.length,
      books: booksWithCovers
    });
  } catch (error) {
    console.error("Book API error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


// SEARCH Route
app.get('/api/search', async (req, res) => {
  try {
      const { query, type } = req.query;
      let searchQuery;

      switch(type) {
          case 'title':
              searchQuery = 'SELECT * FROM books WHERE title ILIKE $1';
              break;
          case 'author':
              searchQuery = 'SELECT * FROM books WHERE author ILIKE $1';
              break;
          case 'isbn':
              searchQuery = 'SELECT * FROM books WHERE isbn = $1';
              break;
          default:
              return res.status(400).json({ error: 'Invalid search type' });
      }

      const result = await db.query(
          searchQuery,
          type === 'isbn' ? [query] : [`%${query}%`]
      );

      res.json({ results: result.rows });
  } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Individual route for book review page
app.get('/books/:isbn', async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM books WHERE isbn = $1', [req.params.isbn]);
      
      if (result.rows.length === 0) {
          return res.status(404).send('Book not found');
      }
      
      const book = result.rows[0];
      res.render('book-review', { 
          book,
          coverUrl: await getBookCover(book.isbn)
      });
  } catch (error) {
      console.error('Book page error:', error);
      res.status(500).send('Internal server error');
  }
});


// Route to display the complete book list (Books List)
app.get('/books-list', async (req, res) => {
  try {
    // Queries all books ordered alphabetically by title
    const result = await db.query('SELECT * FROM books ORDER BY title ASC');
    
    // For each book, gets the cover URL
    const booksWithCovers = await Promise.all(result.rows.map(async (book) => {
      const coverUrl = await getBookCover(book.isbn);
      return {
        ...book,
        coverUrl: coverUrl || '/default-cover.jpg'
      };
    }));

    // Renders the books-list.ejs template passing the books
    res.render('books-list', { books: booksWithCovers });
  } catch (error) {
    console.error('Error loading book list:', error);
    res.status(500).send('Error loading book list');
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});