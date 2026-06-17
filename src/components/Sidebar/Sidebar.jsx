import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, ListMusic, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const mainLinks = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Search', path: '/search', icon: <Search size={22} /> },
    { name: 'Library', path: '/library', icon: <Library size={22} /> },
  ];

  const playlistLinks = [
    { name: 'Liked Songs', path: '/liked', icon: <Heart size={20} className="fill-current" /> },
    { name: 'Playlists', path: '/playlists', icon: <ListMusic size={20} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex flex-col w-[260px] bg-sidebar border-r border-white/5 h-full z-40 p-6"
      >
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            NeonBeats
          </h2>
        </div>
        
        <nav className="flex flex-col gap-8 flex-1">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4 ml-2">Menu</p>
            <ul className="flex flex-col gap-1">
              {mainLinks.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                        isActive 
                          ? 'bg-accent-primary/10 text-accent-primary' 
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4 ml-2">My Music</p>
            <ul className="flex flex-col gap-1">
              {playlistLinks.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                        isActive 
                          ? 'bg-accent-primary/10 text-accent-primary' 
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <button className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-[1.02]">
          <PlusCircle size={20} />
          New Playlist
        </button>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-[65px] bg-sidebar/90 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around items-center px-2 pb-safe">
        {mainLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
