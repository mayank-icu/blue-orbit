import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [areSubtitlesOn, setAreSubtitlesOn] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  const value = {
    isMusicOn,
    setIsMusicOn,
    areSubtitlesOn,
    setAreSubtitlesOn,
    musicVolume,
    setMusicVolume,
    isMusicMuted,
    setIsMusicMuted,
  };

  return (
    <AudioContext.Provider value={value}>
        {children}
    </AudioContext.Provider>
  );
}
