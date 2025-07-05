const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./watchlist.db");

// Create watchlist table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS watchlist (
      imdbID TEXT PRIMARY KEY,
      title TEXT,
      year TEXT,
      poster TEXT
    )
  `);
});

module.exports = db;
