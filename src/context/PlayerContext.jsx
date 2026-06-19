import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { defaultTracks } from '../data/defaultData';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  // Audio state
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(1);
  
  // Queue & Playback modes
  const [queue, setQueue] = useState([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  // Persistent States
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem('neonbeats_liked');
    return saved ? JSON.parse(saved) : [defaultTracks[0], defaultTracks[2], defaultTracks[4]];
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem('neonbeats_recent');
    return saved ? JSON.parse(saved) : defaultTracks;
  });

  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('neonbeats_search');
    return saved ? JSON.parse(saved) : [];
  });

  const audioRef = useRef(new Audio());

  // Persistence Effects
  useEffect(() => localStorage.setItem('neonbeats_liked', JSON.stringify(likedSongs)), [likedSongs]);
  useEffect(() => localStorage.setItem('neonbeats_recent', JSON.stringify(recentlyPlayed)), [recentlyPlayed]);
  useEffect(() => localStorage.setItem('neonbeats_search', JSON.stringify(searchHistory)), [searchHistory]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const dur = audio.duration || 30; // Deezer previews are 30s max
      setProgress((current / dur) * 100 || 0);
      setCurrentTime(formatTime(current));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration || 30));
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat, queue]); // Depend on queue so playNext has fresh state

  // Handle currentSong change
  useEffect(() => {
    if (currentSong) {
      // Handle either mock audioSrc or Deezer preview
      audioRef.current.src = currentSong.preview || currentSong.audioSrc;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSong]);

  // Handle Play/Pause toggle
  useEffect(() => {
    if (isPlaying && currentSong) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const addToRecentlyPlayed = (song) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 20); // Keep last 20
    });
  };

  const playSong = (song, customQueue = null) => {
    if (!song) return;
    
    if (customQueue) {
      setQueue(customQueue);
    }
    
    setCurrentSong(song);
    setIsPlaying(true);
    addToRecentlyPlayed(song);
  };

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length > 0) {
      let nextIndex = 0;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
      const nextSong = queue[nextIndex];
      // Remove played song from queue
      setQueue(queue.filter((_, idx) => idx !== nextIndex));
      playSong(nextSong);
    } else {
      // If queue is empty, just stop
      setIsPlaying(false);
      audioRef.current.currentTime = 0;
    }
  };

  const playPrev = () => {
    // In a real app with history, we'd go back. Here we just restart the track.
    audioRef.current.currentTime = 0;
    if (!isPlaying) setIsPlaying(true);
  };

  const seek = (percentage) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (percentage / 100) * audio.duration;
    }
  };

  // Liked Songs
  const toggleLike = (song) => {
    setLikedSongs(prev => {
      const exists = prev.find(s => s.id === song.id);
      if (exists) {
        return prev.filter(s => s.id !== song.id);
      }
      return [...prev, song];
    });
  };

  const isLiked = (songId) => likedSongs.some(s => s.id === songId);

  // Queue
  const addToQueue = (song) => setQueue(prev => [...prev, song]);

  // Search History
  const addSearchToHistory = (query) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => setSearchHistory([]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        currentTime,
        duration,
        volume,
        setVolume,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        seek,
        isShuffle,
        toggleShuffle: () => setIsShuffle(!isShuffle),
        isRepeat,
        toggleRepeat: () => setIsRepeat(!isRepeat),
        queue,
        addToQueue,
        likedSongs,
        toggleLike,
        isLiked,
        recentlyPlayed,
        searchHistory,
        addSearchToHistory,
        clearSearchHistory
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
