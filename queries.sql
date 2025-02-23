-- Removes table if it already exists
DROP TABLE IF EXISTS books;

-- Books table creation
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating NUMERIC(2,1) NOT NULL,
    review TEXT,
    isbn VARCHAR(13),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserting data (in here, you can insert your own data, these are just examples!)
INSERT INTO books (title, author, rating, review, isbn, created_at)
VALUES 
  ('The Lord of the Rings', 'J.R.R. Tolkien', 5.0, 'A masterpiece that defined modern fantasy.', '9780261103573', '2025-02-18 15:03:17.401406'),
  ('1984', 'George Orwell', 4.8, 'Chilling, timeless, and terrifyingly relevant.', '9780451524935', '2025-02-18 15:03:17.401406'),
  ('A Game of Thrones', 'George R.R. Martin', 4.7, 'An epic tale of power, betrayal, and survival.', '9780553593716', '2025-02-18 15:03:17.401406'),
  ('Brave New World', 'Aldous Huxley', 4.5, 'A disturbing yet fascinating vision of the future.', '9780060850524', '2025-02-18 15:15:01.611888'),
  ('Dune', 'Frank Herbert', 4.9, 'An extraordinary blend of sci-fi, politics, and philosophy.', '0441172660', '2025-02-18 15:46:41.319187'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 4.6, 'A dazzling yet tragic critique of the American Dream.', '9780743273565', '2025-02-18 17:19:08.891836'),
  ('Fahrenheit 451', 'Ray Bradbury', 4.7, 'A haunting warning about censorship and intellectual freedom.', '9781451673319', '2025-02-19 17:19:27.431116'),
  ('The Little Prince', 'Antoine de Saint-Exupéry', 4.8, 'A heartwarming story about love, loss, and the importance of seeing with the heart.', '9780156012195', '2025-02-20 12:18:52.90281'),
  ('The Da Vinci Code', 'Dan Brown', 4.5, 'A riveting thriller that masterfully blends art, history, and conspiracy.', '9780307474278', '2025-02-21 12:55:11.876117'),
  ('Watchmen', 'Alan Moore', 4.8, 'A groundbreaking graphic novel that challenges the concept of heroism in a gritty, realistic world.', '9780930289232', '2025-02-22 14:38:54.534207');