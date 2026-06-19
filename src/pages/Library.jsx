import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import MusicCard from '../components/MusicCard/MusicCard';
import { deezerApi } from '../services/deezerApi';
import { defaultPlaylists } from '../data/defaultData';

export default function Library() {
  const navigate = useNavigate();
  
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlaylists() {
      try {
        const data = await deezerApi.getCharts();
        const apiPlaylists = data.playlists?.data || [];
        setPlaylists(apiPlaylists.length > 0 ? apiPlaylists : defaultPlaylists);
      } catch (error) {
        console.error("Failed to load library playlists, using defaults", error);
        setPlaylists(defaultPlaylists);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlaylists();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  const tabs = ['Playlists', 'Podcasts', 'Artists', 'Albums'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <div className="w-10 h-10 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar title="Your Library" />
      
      <div className="px-4 md:px-8">
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          {tabs.map((tab, idx) => (
            <button 
              key={tab}
              className={`text-sm font-bold transition-colors ${idx === 0 ? 'text-accent-primary relative' : 'text-text-secondary hover:text-white'}`}
            >
              {tab}
              {idx === 0 && (
                <span className="absolute -bottom-[17px] left-0 w-full h-[2px] bg-accent-primary rounded-t-full shadow-[0_-2px_10px_rgba(139,92,246,0.8)]" />
              )}
            </button>
          ))}
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        >
          {playlists.map((playlist) => (
            <motion.div key={playlist.id} variants={itemVariants}>
              <MusicCard 
                song={{
                  title: playlist.title,
                  subtitle: "Playlist",
                  cover: playlist.picture_medium || playlist.picture
                }}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
