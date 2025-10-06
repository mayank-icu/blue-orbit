// src/components/MainLayout.js

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';
import BackgroundMusic from './BackgroundMusic';


const partNames = [
    { path: "/", name: "The Beginning" },
    { path: "/part2", name: "The Atmosphere" },
    { path: "/part3", name: "Ocean Surface" },
    { path: "/part4", name: "The Deep" },
    { path: "/part5", name: "Before vs After" },
    { path: "/part6", name: "The Future" },
];

const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.44.17-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.34 8.41c-.11.2-.06.47.12.61l2.03 1.58c-.05.3-.07.64-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.06-.47-.12-.61l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="white"/>
    </svg>
);

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    boxSizing: 'border-box',
    pointerEvents: 'none',
  },
  icon: {
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
    pointerEvents: 'auto',
    textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
    position: 'relative',
  },
  mainContent: {
    height: '100vh',
    width: '100vw',
  },
  dropdown: {
      position: 'absolute',
      top: '40px',
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '8px',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '220px',
      border: '1px solid rgba(255,255,255,0.1)',
  },
  navLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '16px',
  }
};

export default function MainLayout({ children, isPart1Loading }) {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { areSubtitlesOn, setAreSubtitlesOn, isMusicOn, setIsMusicOn } = useAudio();
  const [currentPart, setCurrentPart] = useState(1);

  useEffect(() => {
      const currentPartIndex = partNames.findIndex(p => p.path === location.pathname);
      if(currentPartIndex !== -1) {
          setCurrentPart(currentPartIndex + 1);
      }
  }, [location.pathname]);

  const showHeader = !(location.pathname === '/' && isPart1Loading);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  return (
    <div>
      <BackgroundMusic />
      
      {showHeader && (
        <header style={styles.header}>
          <div style={styles.icon} onClick={toggleNav}>
            <span>{`[ ${currentPart} / 6 ]`}</span>
            {isNavOpen && (
                <div style={{...styles.dropdown, left: 0}}>
                    {partNames.map((part, index) => (
                        <Link key={index} style={styles.navLink} to={part.path}>{`Part ${index + 1}: ${part.name}`}</Link>
                    ))}
                </div>
            )}
          </div>
          <div style={styles.icon} onClick={toggleSettings}>
            <SettingsIcon />
            {isSettingsOpen && (
                <div style={styles.dropdown}>
                    <label style={{color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        Show Subtitles
                        <input type="checkbox" checked={areSubtitlesOn} onChange={() => setAreSubtitlesOn(!areSubtitlesOn)} />
                    </label>
                    <label style={{color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        Music
                        <input type="checkbox" checked={isMusicOn} onChange={() => setIsMusicOn(!isMusicOn)} />
                    </label>
                </div>
            )}
          </div>
        </header>
      )}
      <main style={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}