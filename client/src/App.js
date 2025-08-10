import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/watchlist");
      setWatchlist(res.data);
    } catch (error) {
      console.error("Error fetching watchlist", error);
    }
  };

  const searchMovies = async () => {
    if (!query) return;
    try {
      const res = await axios.get(
        `YOUR_API_KEY`
      );
      if (res.data.Search) {
        setSearchResults(res.data.Search);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching movies", error);
    }
  };

  const addToWatchlist = async (movie) => {
    try {
      await axios.post("http://localhost:5000/watchlist", movie);
      fetchWatchlist();
    } catch (error) {
      console.error("Error adding to watchlist", error);
    }
  };

  const removeFromWatchlist = async (imdbID) => {
    try {
      await axios.delete(`http://localhost:5000/watchlist/${imdbID}`);
      fetchWatchlist();
    } catch (error) {
      console.error("Error removing from watchlist", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Movie & Series Watchlist</h1>

      <div>
        <input
          type="text"
          value={query}
          placeholder="Search movies/series"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      <h2>Search Results</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {searchResults.length === 0 && <p>No results found.</p>}
        {searchResults.map((movie) => (
          <div
            key={movie.imdbID}
            style={{
              width: "150px",
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/150"
              }
              alt={movie.Title}
              style={{ width: "100%" }}
            />
            <h4>{movie.Title}</h4>
            <p>{movie.Year}</p>
            <button onClick={() => addToWatchlist(movie)}>
              Add to Watchlist
            </button>
          </div>
        ))}
      </div>

      <h2>My Watchlist</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {watchlist.length === 0 && <p>No movies in watchlist.</p>}
        {watchlist.map((movie) => (
          <div
            key={movie.imdbID}
            style={{
              width: "150px",
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            <img
              src={
                movie.poster !== "N/A"
                  ? movie.poster
                  : "https://via.placeholder.com/150"
              }
              alt={movie.title}
              style={{ width: "100%" }}
            />
            <h4>{movie.title}</h4>
            <p>{movie.year}</p>
            <button onClick={() => removeFromWatchlist(movie.imdbID)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
