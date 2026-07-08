// src/pages/Part1.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import startAudio from '../assets/start.wav';
import blueOrbitLogo from '../assets/blue_orbit.png';
import { useAudio } from '../context/AudioContext';

// --- STYLES ---
const keyframes = `
  @keyframes fadeInPage {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      background-position: 1000px 0;
      opacity: 0.5;
    }
  }
  @keyframes subtitleZoomIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const responsiveStyles = `
    @media (max-width: 768px) {
        .subtitle-text-responsive {
            font-size: 18px !important;
            padding: 15px !important;
        }
    }
`;

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#000',
    overflow: 'hidden',
    animation: 'fadeInPage 1s ease-in forwards',
    position: 'relative',
  },
  preloaderImage: {
    marginBottom: '20px',
    maxWidth: '300px',
    width: '60vw',
    height: 'auto',
    objectFit: 'contain',
  },
  shimmerText: {
    fontSize: '24px',
    color: 'rgba(255, 255, 255, 0.3)',
    background: 'linear-gradient(to right, #4d4d4d 20%, #ffffff 50%, #4d4d4d 80%)',
    backgroundSize: '2000px 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    animation: 'shimmer 4s infinite linear',
  },
  globeContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    cursor: 'grab',
  },
  subtitleContainer: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 10,
  },
  subtitleText: {
    width: 'auto',
    maxWidth: '80%',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: '15px',
    fontSize: '22px',
    color: '#fff',
    textShadow: '0 0 5px #000, 0 0 10px #000',
    opacity: 0,
    transition: 'opacity 0.5s ease-in-out',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    pointerEvents: 'auto',
  },
  subtitleVisible: {
    opacity: 1,
    animation: 'subtitleZoomIn 0.5s ease-out forwards',
  },
  startButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px 40px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(77, 150, 255, 0.9)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    cursor: 'pointer',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(77, 150, 255, 0.4)',
    animation: 'pulse 2s infinite',
    transition: 'all 0.3s ease',
  },
  startButtonHover: {
    backgroundColor: 'rgba(77, 150, 255, 1)',
    transform: 'translate(-50%, -50%) scale(1.05)',
    boxShadow: '0 12px 48px rgba(77, 150, 255, 0.6)',
  },
};
// --- END STYLES ---

const subtitles = [
    { time: 0, text: "Our planet" },
    { time: 1000, text: "a blue marble" },
    { time: 2000, text: "floating in endless space." },
    { time: 4000, text: "From the clouds above" },
    { time: 5500, text: "to the mysterious oceans below" },
    { time: 8000, text: "every layer tells a story." },
    { time: 10000, text: "Today, we'll dive through the atmosphere" },
    { time: 12000, text: "glide past the surface" },
    { time: 16000, text: "and journey into the deepest corners of the sea." },
    { time: 19000, text: "Ready to descend into the unknown?" },
    { time: 22000, text: "Hold your breath…" },
    { time: 24000, text: "the dive begins now." },
];

export default function Part1({ setIsLoading }) {
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [needsUserInteraction, setNeedsUserInteraction] = useState(true);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const navigate = useNavigate();
  const { areSubtitlesOn, setMusicVolume } = useAudio();
  const globeEl = useRef();
  const audioRef = useRef(null);
  const subtitleTimeoutsRef = useRef([]);
  const navigationTimeoutRef = useRef(null);

  const isLoading = !isMinTimePassed || !isGlobeLoaded;

  useEffect(() => {
    if(setIsLoading) {
      setIsLoading(isLoading);
    }
  }, [isLoading, setIsLoading]);

  const audio = useMemo(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio(startAudio);
      audioElement.preload = 'auto';
      // Set attributes to help with mobile playback
      audioElement.setAttribute('playsinline', '');
      audioElement.setAttribute('webkit-playsinline', '');
      return audioElement;
    }
    return null;
  }, []);

  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    // Minimum loading time
    setTimeout(() => {
        setIsMinTimePassed(true);
    }, 3000);
  }, []);

  const startExperience = () => {
    setNeedsUserInteraction(false);
    
    if (audioRef.current) {
      setMusicVolume(0.1);
      
      // Try to play audio with multiple fallback attempts
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
          })
          .catch(error => {
            console.error("Audio play failed:", error);
            // Retry once after a short delay
            setTimeout(() => {
              audioRef.current.play().catch(e => 
                console.error("Audio retry failed:", e)
              );
            }, 100);
          });
      }

      // Start subtitles
      subtitleTimeoutsRef.current = subtitles.map(sub =>
        setTimeout(() => {
          setCurrentSubtitle(sub.text);
        }, sub.time)
      );

      // Navigate to next page
      navigationTimeoutRef.current = setTimeout(() => {
        navigate('/part2');
      }, 27000);
    }
  };

  useEffect(() => {
    // Auto-start if audio can autoplay (desktop) or user already interacted
    if (!isLoading && !needsUserInteraction) {
      return;
    }

    if (!isLoading && audio) {
      // Try to autoplay (works on desktop)
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay succeeded (desktop)
            setNeedsUserInteraction(false);
            setMusicVolume(0.1);

            subtitleTimeoutsRef.current = subtitles.map(sub =>
              setTimeout(() => {
                setCurrentSubtitle(sub.text);
              }, sub.time)
            );

            navigationTimeoutRef.current = setTimeout(() => {
              navigate('/part2');
            }, 27000);
          })
          .catch(() => {
            // Autoplay failed (mobile) - show start button
            setNeedsUserInteraction(true);
          });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setMusicVolume(0.3);
      subtitleTimeoutsRef.current.forEach(clearTimeout);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [isLoading, navigate, audio, setMusicVolume]);

  useEffect(() => {
    // Continuous zoom and rotation effect
    if (!globeEl.current || isLoading) return;

    const globe = globeEl.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.2;
    globe.controls().enableZoom = false;

    const initialAltitude = 2.5;
    const finalAltitude = 1.8;
    const animationDuration = 27000;

    let startTime = null;
    let animationFrameId;

    const animateZoom = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        const currentAltitude = initialAltitude - (initialAltitude - finalAltitude) * progress;
        globe.pointOfView({ altitude: currentAltitude }, 0);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animateZoom);
        }
    };

    animationFrameId = requestAnimationFrame(animateZoom);

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [isLoading]);

  return (
    <>
      <style>{keyframes}</style>
      <style>{responsiveStyles}</style>
      <div style={styles.container}>
        {isLoading && (
          <>
            <img src={blueOrbitLogo} style={styles.preloaderImage} alt="Loading..." />
            <div style={styles.shimmerText}>Loading the depth...</div>
          </>
        )}
        <div style={{...styles.globeContainer, visibility: isLoading ? 'hidden' : 'visible'}}>
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              atmosphereColor="#4d96ff"
              atmosphereAltitude={0.2}
              onGlobeReady={() => setIsGlobeLoaded(true)}
            />
        </div>
        {!isLoading && needsUserInteraction && (
          <button
            style={{
              ...styles.startButton,
              ...(isButtonHovered ? styles.startButtonHover : {})
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={startExperience}
            onTouchStart={startExperience}
          >
            🌊 Start Journey
          </button>
        )}
        {!isLoading && !needsUserInteraction && areSubtitlesOn && (
            <div style={styles.subtitleContainer}>
                <div className="subtitle-text-responsive" style={{...styles.subtitleText, ...(currentSubtitle && styles.subtitleVisible) }}>
                    {currentSubtitle}
                </div>
            </div>
        )}
      </div>
    </>
  );
}