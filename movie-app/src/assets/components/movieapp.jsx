import React, { useState, useEffect } from "react";

const API_KEY = "dd04237d";

const defaultMovies = [
    "The Rip", "Freelance", "Frozen", "Avengers", "Luca", "Bleeding Steel", "Bunker", "Journey 2: The Mysterious Island", "Annabelle", "Playdate", "Titanic", "Moana", "Inception", "Jurassic World", "Interstellar", "Dragon", "Batman", "Around the World in 80 Days", "Joker", "Doctor G", "The Dark Knight", "Back to the Future", "Aliens", "Coco"
];

const MovieSearch = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMultipleMovies(defaultMovies);
    }, []);

    const fetchMultipleMovies = async (movieList) => {
        setLoading(true);
        setError("");
        try {
            const promises = movieList.map((title) =>
                fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`)
                    .then((res) => res.json())
            );
            const results = await Promise.all(promises);
            setMovies(results.filter((m) => m.Response === "True"));
        } catch (err) {
            setError("Something went wrong!");
        }
        setLoading(false);
    };

    const searchMovie = async () => {
        if (!query) return;
        setLoading(true);
        setError("");
        setMovies([]);

        try {
            const res = await fetch(
                `https://www.omdbapi.com/?t=${query}&apikey=${API_KEY}`
            );
            const data = await res.json();
            if (data.Response === "True") {
                setMovies([data]);
            } else {
                setError("Movie not found!");
            }
        } catch {
            setError("Something went wrong!");
        }
        setLoading(false);
    };

    const categories = ["Action", "Comedy", "Drama", "Horror", "Adventure"];


    return (
        <div className="app">
            <div className="banner">
                <h1 className="title">🎬 Movie Search App</h1>
                <p>Discover popular movies and search your favorite ones!</p>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search movie..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchMovie()}
                />
                <button onClick={searchMovie}>Search</button>
            </div>

            <div className="categories">
                {categories.map((cat) => (
                    <span key={cat} className="category-tag">
                        {cat}
                    </span>
                ))}
            </div>

            {loading && <div className="loader"></div>}
            {error && <p className="error">{error}</p>}
            
            {movies.length > 0 && !query && <h2 className="popular-heading">Popular Movies</h2>}

            <div className="movie-grid">
                {movies.map((movie, index) => (
                    <div className="movie-card" key={index}>
                        <img
                            src={
                                movie.Poster !== "N/A"
                                    ? movie.Poster
                                    : "https://via.placeholder.com/300x450"
                            }
                            alt={movie.Title}
                        />
                        <h3>{movie.Title}</h3>
                        <p>{movie.Year}</p>
                        <span>⭐ {movie.imdbRating}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieSearch;