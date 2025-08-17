
import React, { useState, useEffect } from 'react';
import { AiOutlineSearch } from "react-icons/ai";

const Movie = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [expanded, setExpanded] = useState({}); // ✅ track read more

    const changeHandler = (event) => {
        setQuery(event.target.value);
    };

    // 🔥 Fetch random movies (default)
    async function fetchRandomMovies() {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=c65ac3965ae26ddb09abd6bcaff90067`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // Shuffle movies randomly and take first 6
            const shuffled = [...data.results].sort(() => 0.5 - Math.random());
            setMovies(shuffled.slice(0, 6));
        }
    }

    // 🔍 Fetch search movies
    async function fetchData() {
        if (!query) return; 
        const url = `https://api.themoviedb.org/3/search/movie?api_key=c65ac3965ae26ddb09abd6bcaff90067&query=${query}`;
        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results || []);
    }

    const toggleReadMore = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Load random movies on first render
    useEffect(() => {
        fetchRandomMovies();
    }, []);

    return (
        <div className='flex flex-col items-center bg-black min-h-screen text-white p-4'>
            <h1 className='text-4xl font-bold mt-2'>MovieHouse</h1>

            {/* Search Box */}
            <div className='flex items-center mt-4'>
                <input 
                    type="text" 
                    placeholder="Search for a movie..." 
                    value={query} 
                    onChange={changeHandler} 
                    className='border text-black border-gray-300 rounded p-2 mr-2'
                    onKeyDown={(e) => e.key === "Enter" && fetchData()} // ✅ search on Enter
                />
                <button 
                    onClick={fetchData} 
                    className='bg-white text-black p-3 rounded'
                >
                    <AiOutlineSearch />
                </button>
            </div>

            {/* Movies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-5xl">
                {movies.length > 0 ? (
                    movies.map((movie) => {
                        const isExpanded = expanded[movie.id];
                        const overview = movie.overview || "";

                        return (
                            <div key={movie.id} className='bg-gray-800 p-4 rounded shadow-md'>
                                {movie.poster_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                        alt={movie.title} 
                                        className='rounded mb-3'
                                    />
                                ) : (
                                    <div className="h-64 flex items-center justify-center bg-gray-700 rounded mb-3">
                                        <p className="text-gray-400">No Image</p>
                                    </div>
                                )}
                                <h2 className='text-xl font-semibold'>{movie.title}</h2>
                                
                                {/* Description with Read More */}
                                <p className='text-gray-400 text-sm mt-2'>
                                    {isExpanded 
                                        ? overview 
                                        : overview.length > 200 
                                            ? overview.slice(0, 200) + "..." 
                                            : overview}
                                </p>
                                {overview.length > 200 && (
                                    <button 
                                        onClick={() => toggleReadMore(movie.id)} 
                                        className='text-blue-400 mt-2 underline'
                                    >
                                        {isExpanded ? "Read Less" : "Read More"}
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-400 mt-4">No movies found 🎬</p>
                )}
            </div>
        </div>
    );
};

export default Movie;
