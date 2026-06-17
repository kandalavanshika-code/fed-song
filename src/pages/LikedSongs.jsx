import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import SongListItem from '../components/MusicCard/SongListItem';
import { usePlayer } from '../context/PlayerContext';

export default function LikedSongs() {
  const { likedSongs, playSong, currentSong, isPlaying } = usePlayer();

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs.slice(1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-10"
    >
      <Navbar />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end gap-6 mb-10 pt-10 px-4 md:px-8">
        <div className="w-48 h-48 md:w-60 md:h-60 rounded-lg shadow-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex-shrink-0">
          <Heart size={80} className="text-white fill-current drop-shadow-md" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-wider text-text-secondary hidden md:block mb-2">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">Liked Songs</h1>
          <p className="text-sm text-text-secondary font-medium">
            <span className="text-white font-bold">{likedSongs.length} songs</span>
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-6 mb-8 px-4 md:px-8">
        <button 
          onClick={handlePlayAll}
          disabled={likedSongs.length === 0}
          className="w-14 h-14 bg-accent-primary text-white rounded-full flex items-center justify-center hover:bg-accent-secondary transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Play fill="currentColor" size={28} className="ml-1" />
        </button>
      </div>

      <div className="px-4 md:px-8">
        {/* List Header */}
        {likedSongs.length > 0 ? (
          <div className="flex text-xs text-text-secondary uppercase tracking-wider border-b border-white/10 pb-2 mb-4 px-4">
            <div className="w-8 text-center">#</div>
            <div className="flex-1 min-w-[200px]">Title</div>
            <div className="hidden md:block flex-1">Album</div>
            <div className="w-[120px] text-right">Duration</div>
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary">
            <Heart size={48} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-bold text-white mb-2">Songs you like will appear here</h2>
            <p>Save songs by tapping the heart icon.</p>
          </div>
        )}

        {/* Song List */}
        <div className="flex flex-col">
          {likedSongs.map((song, idx) => (
            <SongListItem 
              key={song.id}
              song={song}
              index={idx}
              onPlay={() => {
                const queue = likedSongs.slice(idx + 1);
                playSong(song, queue);
              }}
              isActive={currentSong?.id === song.id}
              isPlaying={isPlaying}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
