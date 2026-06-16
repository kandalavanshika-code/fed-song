import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Player from '../components/Player/Player';

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      {/* 
        On mobile: mb is 65px (bottom nav) + Player height.
        The Player on mobile acts as a mini-player above the bottom nav.
      */}
      <main className="flex-1 overflow-y-auto relative pb-[150px] md:pb-[100px] px-6 md:px-10">
        <Outlet />
      </main>
      <Player />
    </div>
  );
}
