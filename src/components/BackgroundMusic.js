import React, { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import instrumentalMusic from '../assets/instrumental.mp3';

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const { isMusicOn, musicVolume, isMusicMuted } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isMusicOn && !isMusicMuted) {
        audio.play().catch(e => console.log("Audio play failed", e));
        audio.volume = musicVolume;
      } else {
        audio.pause();
      }
    }
  }, [isMusicOn, musicVolume, isMusicMuted]);

  return <audio ref={audioRef} src={instrumentalMusic} loop />;
}
