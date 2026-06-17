import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ title }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="flex justify-between items-center mb-8 sticky top-0 z-30 bg-background/80 backdrop-blur-xl py-4 -mx-6 px-6 md:-mx-10 md:px-10">
      {title && (
        <h2 className="text-2xl font-bold text-white hidden md:block">{title}</h2>
      )}
      
      <form 
        onSubmit={handleSearch}
        className={`flex items-center gap-3 bg-surface border transition-all duration-300 rounded-full ml-auto overflow-hidden relative
          ${isFocused 
            ? 'w-full md:w-[350px] border-accent-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-surface/80' 
            : 'w-full md:w-[250px] border-white/10 hover:border-white/20'
          }
        `}
      >
        <div className={`pl-4 flex items-center transition-colors duration-300 ${isFocused ? 'text-accent-primary' : 'text-text-secondary'}`}>
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Artists, songs, or podcasts"
          className="bg-transparent border-none outline-none text-sm text-white w-full py-2.5 pr-4 placeholder:text-text-secondary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {/* Subtle background glow when focused */}
        {isFocused && (
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 pointer-events-none" />
        )}
      </form>
    </header>
  );
}
