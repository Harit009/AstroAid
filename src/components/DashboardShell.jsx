"use client";

import { useState } from 'react';
import Navigation from './Navigation';
import AboutView from './AboutView';

export default function DashboardShell({ children }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <Navigation onProfileClick={() => setActiveTab('about')} />

      <main className="w-full md:pl-[260px] pb-20 md:pb-0 relative z-0">
        {activeTab === 'about' ? (
          <AboutView onBack={() => setActiveTab('home')} />
        ) : (
          children
        )}
      </main>
    </>
  );
}
