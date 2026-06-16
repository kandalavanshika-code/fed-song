import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const formatDuration = (seconds) => {
  if (typeof seconds === 'string' && seconds.includes(':')) return seconds; // Mock data fallback
  if (!seconds) return '0:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

export default function SongListItem({ song, index, onPlay, isActive, isPlaying }) {
  const { toggleLike, isLiked, addToQueue } = usePlayer();
  const liked = isLiked(song.id);

  const title = song.title;
  const artist = song.artist?.name || song.artist;
  const album = song.album?.title || song.album;
  const cover = song.album?.cover_small || song.album?.cover_medium || song.cover;
  const duration = formatDuration(song.duration);

  return (
    <motion.div 
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      className={`group flex items-center gap-4 py-2 px-4 rounded-lg cursor-pointer transition-colors
        ${isActive ? 'bg-white/5' : ''}
      `}
      onClick={() => onPlay(song)}
    >
      <div className="w-8 flex justify-center text-text-secondary relative">
        {isActive && isPlaying ? (
           <div className="flex items-end gap-[2px] h-4">
             <div className="w-1 bg-accent-primary rounded-t-sm eq-bar h-full"></div>
             <div className="w-1 bg-accent-primary rounded-t-sm eq-bar h-full"></div>
             <div className="w-1 bg-accent-primary rounded-t-sm eq-bar h-full"></div>
           </div>
        ) : (
          <>
            <span className={`group-hover:hidden ${isActive ? 'text-accent-primary font-bold' : ''}`}>{index + 1}</span>
            <Play size={16} className="hidden group-hover:block fill-current text-white" />
          </>
        )}
      </div>
      
      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
        {cover && <img src={cover} alt={title} className="w-10 h-10 rounded object-cover flex-shrink-0 bg-surface" />}
        <div className="flex flex-col truncate">
          <span className={`text-sm font-medium truncate ${isActive ? 'text-accent-primary' : 'text-white'}`}>
            {title}
          </span>
          <span className="text-xs text-text-secondary truncate group-hover:text-white/80 transition-colors">
            {artist}
          </span>
        </div>
      </div>

      <div className="hidden md:block flex-1 text-sm text-text-secondary truncate group-hover:text-white/80 transition-colors">
        {album}
      </div>

      <div className="flex items-center gap-4 text-text-secondary">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song);
          }}
          className={`opacity-0 group-hover:opacity-100 transition-all ${liked ? 'opacity-100 text-accent-primary' : 'hover:text-white'}`}
        >
          <Heart size={18} className={liked ? "fill-current" : ""} />
        </button>
        <span className="text-sm w-10 text-right">{duration}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(song);
          }}
          className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
          title="Add to Queue"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </motion.div>
  );
}
