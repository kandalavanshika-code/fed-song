import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, ListMusic, MonitorSpeaker, Shuffle, Repeat } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function Player() {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    setVolume,
    togglePlay,
    playNext,
    playPrev,
    seek,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    isLiked,
    toggleLike
  } = usePlayer();

  const handleProgressChange = (e) => seek(Number(e.target.value));
  const handleVolumeChange = (e) => setVolume(Number(e.target.value) / 100);
  const toggleMute = () => setVolume(volume > 0 ? 0 : 1);

  const hasSong = !!currentSong;
  const liked = hasSong ? isLiked(currentSong.id) : false;

  const title = currentSong?.title || "No song selected";
  const artist = currentSong?.artist?.name || currentSong?.artist || "";
  const cover = currentSong?.album?.cover_medium || currentSong?.cover;

  return (
    <footer className="fixed bottom-[65px] md:bottom-0 left-0 w-full h-[85px] md:h-[100px] bg-background/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-4 md:px-8 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      
      {/* Left: Info Section */}
      <div className="flex items-center gap-4 w-1/3 min-w-[150px]">
        {hasSong ? (
          <>
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-surface">
              {cover && (
                <img 
                  src={cover} 
                  alt="Album Cover" 
                  className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
                />
              )}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm md:text-base font-bold text-white truncate hover:underline cursor-pointer">{title}</span>
              <small className="text-xs text-text-secondary truncate hover:underline cursor-pointer mt-0.5">{artist}</small>
            </div>
            <button 
              onClick={() => toggleLike(currentSong)}
              className={`hidden md:flex ml-2 transition-colors ${liked ? 'text-accent-primary' : 'text-text-secondary hover:text-white'}`}
            >
              <Heart size={20} className={liked ? "fill-current" : ""} />
            </button>
          </>
        ) : (
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-bold text-text-secondary">No song selected</span>
          </div>
        )}
      </div>

      {/* Center: Controls Section */}
      <div className="flex flex-col items-center justify-center w-1/3 max-w-[500px]">
        <div className="flex items-center gap-4 md:gap-6 mb-2">
          <button 
            onClick={toggleShuffle} 
            disabled={!hasSong}
            className={`hidden md:block transition-colors ${isShuffle ? 'text-accent-primary' : 'text-text-secondary hover:text-white'} disabled:opacity-50`}
          >
            <Shuffle size={18} />
          </button>
          
          <button onClick={playPrev} disabled={!hasSong} className="text-text-secondary hover:text-white disabled:opacity-50 transition-colors">
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay} 
            disabled={!hasSong}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100
              ${isPlaying ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]' : 'bg-white text-black'}`}
          >
            {isPlaying ? <Pause fill="currentColor" size={22} /> : <Play fill="currentColor" size={24} className="ml-1" />}
          </button>
          
          <button onClick={playNext} disabled={!hasSong} className="text-text-secondary hover:text-white disabled:opacity-50 transition-colors">
            <SkipForward size={20} />
          </button>

          <button 
            onClick={toggleRepeat} 
            disabled={!hasSong}
            className={`hidden md:block transition-colors ${isRepeat ? 'text-accent-primary' : 'text-text-secondary hover:text-white'} disabled:opacity-50`}
          >
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="hidden md:flex items-center gap-3 w-full">
          <span className="text-xs font-medium text-text-secondary w-10 text-right">{currentTime}</span>
          <div className="flex-1 group relative flex items-center h-4 cursor-pointer">
            <div className="absolute left-0 w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-100 relative" style={{ width: `${progress || 0}%` }} />
            </div>
            <input type="range" min="0" max="100" value={progress || 0} onChange={handleProgressChange} disabled={!hasSong} className="absolute left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
          </div>
          <span className="text-xs font-medium text-text-secondary w-10">{duration}</span>
        </div>
      </div>

      {/* Right: Actions Section */}
      <div className="hidden md:flex items-center justify-end gap-4 w-1/3">
        <button className="text-text-secondary hover:text-white transition-colors" title="Queue">
          <ListMusic size={18} />
        </button>
        <button className="text-text-secondary hover:text-white transition-colors" title="Connect to a device">
          <MonitorSpeaker size={18} />
        </button>
        <div className="flex items-center gap-2 w-[120px]">
          <button onClick={toggleMute} className="text-text-secondary hover:text-white transition-colors">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="flex-1 group relative flex items-center h-4 cursor-pointer">
            <div className="absolute left-0 w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-100" style={{ width: `${volume * 100}%` }} />
            </div>
            <input type="range" min="0" max="100" value={volume * 100} onChange={handleVolumeChange} className="absolute left-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        </div>
      </div>
      
      {/* Mobile Progress Bar */}
      <div className="md:hidden absolute bottom-0 left-0 w-full h-[2px] bg-surface">
        <div className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-100" style={{ width: `${progress || 0}%` }} />
      </div>
    </footer>
  );
}
