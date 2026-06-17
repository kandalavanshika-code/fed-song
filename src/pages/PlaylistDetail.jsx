import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import SongListItem from '../components/MusicCard/SongListItem';
import { usePlayer } from '../context/PlayerContext';
import { deezerApi } from '../services/deezerApi';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { playSong, currentSong, isPlaying } = usePlayer();
  
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPlaylist() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await deezerApi.getPlaylist(id);
        setPlaylist(data);
      } catch (err) {
        setError("Failed to load playlist details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPlaylist();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <div className="w-10 h-10 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-2xl font-bold mb-4">{error || "Playlist not found"}</h1>
        <Link to="/" className="text-accent-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const tracks = playlist.tracks?.data || [];

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playSong(tracks[0], tracks.slice(1));
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
        <img 
          src={playlist.picture_xl || playlist.picture_medium} 
          alt={playlist.title} 
          className="w-48 h-48 md:w-60 md:h-60 object-cover shadow-2xl flex-shrink-0 rounded-lg"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-wider text-text-secondary hidden md:block mb-2">Playlist</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">{playlist.title}</h1>
          <p className="text-sm text-text-secondary font-medium mb-4 max-w-xl">
            {playlist.description || "No description provided."}
          </p>
          <p className="text-sm text-text-secondary font-medium">
            <span className="text-white font-bold">{playlist.creator?.name || "Deezer"}</span> • {tracks.length} songs
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-6 mb-8 px-4 md:px-8">
        <button 
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="w-14 h-14 bg-accent-primary text-white rounded-full flex items-center justify-center hover:bg-accent-secondary transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Play fill="currentColor" size={28} className="ml-1" />
        </button>
      </div>

      <div className="px-4 md:px-8">
        {/* List Header */}
        {tracks.length > 0 ? (
          <div className="flex text-xs text-text-secondary uppercase tracking-wider border-b border-white/10 pb-2 mb-4 px-4 hidden md:flex">
            <div className="w-8 text-center">#</div>
            <div className="flex-1 min-w-[200px]">Title</div>
            <div className="flex-1">Album</div>
            <div className="w-[120px] text-right">Duration</div>
          </div>
        ) : (
          <div className="text-center py-10 text-text-secondary">
            This playlist is currently empty.
          </div>
        )}

        {/* Song List */}
        <div className="flex flex-col">
          {tracks.map((song, idx) => (
            <SongListItem 
              key={song.id}
              song={{...song, album: song.album || playlist}} 
              index={idx}
              onPlay={() => {
                const queue = tracks.slice(idx + 1);
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
