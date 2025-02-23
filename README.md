# One Line Review - Book Review Tracker

## 🎯 Project Description

One Line Review is a web application for tracking short book reviews with CRUD functionality and Open Library integration that helps bibliophiles organize their reading journey.

## 📦 Deliverables

- Full-stack Node.js/Express application
- PostgreSQL database integration
- Dynamic EJS templates
- Responsive CSS styling
- Open Library Covers API integration

## 🚀 Features

- 📖 Create, read, update, and delete book entries through your database
- ⭐ Organize books by rating, reading date or alphabetic order and search for books by title, author or ISBN
- 🖼️ Automatic book cover fetching from Open Library

## 🛠️ Technologies Used

| Component              | Technology                          |
|------------------------|-------------------------------------|
| **Backend Framework**  | Node.js + Express.js                |
| **Database**           | PostgreSQL                          |
| **Templating**         | EJS                                 |
| **API Client**         | Axios                               |
| **Styling**            | CSS3                                |

## 🔗 API Integration

- **Chosen API:** [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)

**API Features:**
- High-resolution book cover images
- Fallback to default cover when unavailable
- Caching mechanism for faster loads

## ⚙️ Environment Configuration

### 1. Clone or Download this Repository

   ```bash
   git clone https://github.com/phenriquels01/one-line-review.git
   cd one-line-review
   ```

### 2. Configure Environment Variables

#### Step 1: Create and edit `.env` file
Create a `.env` file in the project root (same directory as `index.js`) and edit the file with the following content:

```
.env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=BookRevs
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

**Notes:**
- Replace `your_postgres_user` and `your_postgres_password` with your actual credentials
- Keep `DB_HOST` as `localhost` for local environment

### 3. Database Setup

#### 3.1 Create Database
Execute in terminal:

```bash
createdb -U postgres BookRevs
```

#### 3.2 Execute SQL Script
Run initialization script:

```bash
psql -U postgres -d BookRevs -f queries.sql
```

**Important Notes:**
- Verify PostgreSQL user has file read permissions
- The queries.sql file contains the database schema and seed data for initial setup. If using a custom data path, update the script accordingly.

### 4. Install Dependencies

In the project root, execute:

```bash
npm install
```

*Development tip:*

```bash
npm install -g nodemon
```

### 5. Run the Application

Start the server:

```bash
nodemon index.js
```
or

```bash
node index.js
```

Once the server is running, open your browser and go to: http://localhost:3000