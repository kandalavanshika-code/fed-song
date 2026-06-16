import React from 'react';
import { motion } from 'framer-motion';

export default function MusicCard({ song, onClick, showPlayIcon = false, isActive = false, isPlaying = false }) {
  // Handle both Deezer API structure and custom mock structure
  const title = song.title;
  const subtitle = song.artist?.name || song.artist || song.subtitle;
  const cover = song.album?.cover_medium || song.cover;

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={`relative bg-card p-4 rounded-[20px] transition-all duration-300 cursor-pointer flex flex-col group h-full
        ${isActive ? 'bg-surface border border-accent-primary/50 shadow-[0_10px_30px_rgba(139,92,246,0.15)]' : 'border border-white/5 hover:bg-surface shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]'}
      `}
    >
      <div className="relative overflow-hidden rounded-2xl mb-4 shadow-lg aspect-square bg-surface">
        <img 
          src={cover} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <div className="flex items-end gap-1 h-6">
              <div className="w-1.5 bg-accent-primary rounded-t-sm eq-bar h-full"></div>
              <div className="w-1.5 bg-accent-primary rounded-t-sm eq-bar h-full"></div>
              <div className="w-1.5 bg-accent-primary rounded-t-sm eq-bar h-full"></div>
              <div className="w-1.5 bg-accent-primary rounded-t-sm eq-bar h-full"></div>
            </div>
          </div>
        )}

        {showPlayIcon && (!isActive || !isPlaying) && (
          <div className="absolute bottom-3 right-3 w-12 h-12 bg-accent-primary text-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-[0_5px_15px_rgba(139,92,246,0.4)] z-10 hover:scale-105 hover:bg-accent-secondary">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
      
      <h3 className={`text-base mb-1 whitespace-nowrap overflow-hidden text-ellipsis font-bold transition-colors ${isActive ? 'text-accent-primary' : 'text-white'}`}>
        {title}
      </h3>
      <p className="text-sm text-text-secondary font-medium truncate">
        {subtitle}
      </p>
    </motion.div>
  );
}
