import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { PlayerProvider } from './context/PlayerContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Library from './pages/Library';
import Search from './pages/Search';
import LikedSongs from './pages/LikedSongs';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="library" element={<Library />} />
              <Route path="search" element={<Search />} />
              <Route path="liked" element={<LikedSongs />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="playlist/:id" element={<PlaylistDetail />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Router>
    </PlayerProvider>
  );
}

export default App;
