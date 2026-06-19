import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import MusicCard from '../components/MusicCard/MusicCard';
import { usePlayer } from '../context/PlayerContext';
import { deezerApi } from '../services/deezerApi';
import { defaultTracks, defaultPlaylists } from '../data/defaultData';

export default function Home() {
  const { playSong, currentSong, isPlaying, recentlyPlayed } = usePlayer();
  const navigate = useNavigate();
  
  const [charts, setCharts] = useState({ tracks: [], playlists: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCharts() {
      try {
        const data = await deezerApi.getCharts();
        const apiTracks = data.tracks?.data || [];
        const apiPlaylists = data.playlists?.data || [];
        
        setCharts({
          tracks: apiTracks.length > 0 ? apiTracks : defaultTracks,
          playlists: apiPlaylists.length > 0 ? apiPlaylists : defaultPlaylists
        });
      } catch (error) {
        console.error("Failed to load charts, using defaults", error);
        setCharts({ tracks: defaultTracks, playlists: defaultPlaylists });
      } finally {
        setIsLoading(false);
      }
    }
    loadCharts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const heroSong = charts.tracks.length > 0 ? charts.tracks[0] : null;
  const trendingNow = charts.tracks.slice(1, 7);
  const popularPlaylists = charts.playlists.slice(0, 5);

  const genres = ['Pop', 'Hip Hop', 'Rock', 'Electronic', 'Jazz', 'Classical', 'R&B'];

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
      className="pb-10"
    >
      <Navbar />

      {/* Hero Banner */}
      {heroSong && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full rounded-3xl overflow-hidden mb-12 group cursor-pointer"
          onClick={() => playSong(heroSong, charts.tracks)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/80 to-accent-secondary/80 mix-blend-multiply z-10" />
          <img 
            src={heroSong.album?.cover_xl || heroSong.album?.cover_medium} 
            alt="Hero Background" 
            className="w-full h-[300px] md:h-[350px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-background via-background/40 to-transparent">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-secondary mb-2">Global Top Track</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
              {heroSong.title}
            </h1>
            <p className="text-lg text-white/80 font-medium mb-6">{heroSong.artist?.name}</p>
            
            <button 
              className="w-14 h-14 bg-accent-primary text-white rounded-full flex items-center justify-center hover:bg-accent-secondary transition-all shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                playSong(heroSong, charts.tracks);
              }}
            >
              <Play fill="currentColor" size={28} className="ml-1" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Genres Chips */}
      <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
        {genres.map((genre, idx) => (
          <motion.button 
            key={genre}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="whitespace-nowrap px-6 py-2.5 bg-surface border border-white/5 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-colors shadow-md"
          >
            {genre}
          </motion.button>
        ))}
      </div>

      <div className="space-y-12">
        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recently Played</h2>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex gap-6 overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide snap-x"
            >
              {recentlyPlayed.map((song) => (
                <div key={`recent-${song.id}`} className="min-w-[160px] md:min-w-[200px] snap-start">
                  <motion.div variants={itemVariants}>
                    <MusicCard 
                      song={song}
                      showPlayIcon={true}
                      isActive={currentSong?.id === song.id}
                      isPlaying={isPlaying}
                      onClick={() => playSong(song, recentlyPlayed)}
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Trending Now */}
        {trendingNow.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              {trendingNow.map((song) => (
                <motion.div key={`trending-${song.id}`} variants={itemVariants}>
                  <MusicCard 
                    song={song}
                    showPlayIcon={true}
                    isActive={currentSong?.id === song.id}
                    isPlaying={isPlaying}
                    onClick={() => playSong(song, charts.tracks)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Popular Playlists */}
        {popularPlaylists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Deezer Chart Playlists</h2>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {popularPlaylists.map((playlist) => (
                <motion.div key={playlist.id} variants={itemVariants}>
                  <MusicCard 
                    song={{
                      title: playlist.title,
                      subtitle: "By Deezer",
                      cover: playlist.picture_medium || playlist.picture
                    }}
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
