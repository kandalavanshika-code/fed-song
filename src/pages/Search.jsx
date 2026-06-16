import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Clock, X } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import SongListItem from '../components/MusicCard/SongListItem';
import { usePlayer } from '../context/PlayerContext';
import { deezerApi } from '../services/deezerApi';

// Custom Hook for Debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounce(query, 500);

  const { playSong, currentSong, isPlaying, searchHistory, addSearchToHistory, clearSearchHistory } = usePlayer();

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setError(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await deezerApi.searchTracks(debouncedQuery);
        setResults(data);
        if (data.length > 0) {
          addSearchToHistory(debouncedQuery);
        }
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = (song, idx) => {
    const queue = results.slice(idx + 1);
    playSong(song, queue);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-10 min-h-screen"
    >
      {/* We use a custom navbar setup for Search to put the input right at the top */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md pt-6 pb-4 px-4 md:px-8 border-b border-white/5 flex items-center justify-between">
        <h1 className="text-2xl font-bold hidden md:block">Search</h1>
        <div className="relative w-full md:w-[400px]">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface text-white placeholder-text-secondary rounded-full py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all shadow-inner"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      <div className="px-4 md:px-8 pt-6">
        {/* Empty State / Search History */}
        {!query && (
          <div className="mt-4">
            {searchHistory.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Searches</h2>
                  <button onClick={clearSearchHistory} className="text-sm font-semibold text-text-secondary hover:text-white transition-colors">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {searchHistory.map((historyItem, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setQuery(historyItem)}
                      className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      <Clock size={16} className="text-text-secondary" />
                      {historyItem}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 text-text-secondary" />
                </div>
                <h2 className="text-xl font-bold">Discover new music</h2>
                <p className="text-text-secondary max-w-sm">Search for your favorite artists, songs, podcasts, and more using the Deezer API.</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Searching...</h2>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center gap-4 py-2 px-4 animate-pulse bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-surface rounded-full" />
                <div className="w-10 h-10 bg-surface rounded" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-1/3 h-3 bg-surface rounded" />
                  <div className="w-1/4 h-2 bg-surface rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="mt-10 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-red-400">
            {error}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && results.length === 0 && !error && (
          <p className="text-text-secondary mt-10 text-center text-lg">No songs found for "{query}". Try checking your spelling.</p>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Top Results</h2>
            
            <div className="flex text-xs text-text-secondary uppercase tracking-wider border-b border-white/10 pb-2 mb-4 px-4 hidden md:flex">
              <div className="w-8 text-center">#</div>
              <div className="flex-1 min-w-[200px]">Title</div>
              <div className="flex-1">Album</div>
              <div className="w-[120px] text-right">Duration</div>
            </div>

            <div className="flex flex-col">
              {results.map((song, idx) => (
                <SongListItem 
                  key={song.id}
                  song={song}
                  index={idx}
                  onPlay={() => handlePlay(song, idx)}
                  isActive={currentSong?.id === song.id}
                  isPlaying={isPlaying}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
