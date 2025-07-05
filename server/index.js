const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Add movie to watchlist
app.post("/watchlist", (req, res) => {
  const { imdbID, Title, Year, Poster } = req.body;
  if (!imdbID || !Title) {
    return res.status(400).json({ error: "Missing movie data" });
  }
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO watchlist (imdbID, title, year, poster)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(imdbID, Title, Year, Poster, function (err) {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Movie saved to watchlist ✅" });
  });
  stmt.finalize();
});

// Get full watchlist
app.get("/watchlist", (req, res) => {
  db.all(`SELECT * FROM watchlist`, (err, rows) => {
    if (err) {
      console.error("Read error:", err);
      return res.status(500).json({ error: "Failed to read watchlist" });
    }
    res.json(rows);
  });
});

// Delete movie from watchlist by imdbID
app.delete("/watchlist/:imdbID", (req, res) => {
  const { imdbID } = req.params;
  const stmt = db.prepare("DELETE FROM watchlist WHERE imdbID = ?");
  stmt.run(imdbID, function (err) {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete movie" });
    }
    res.json({ message: "Movie removed" });
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
