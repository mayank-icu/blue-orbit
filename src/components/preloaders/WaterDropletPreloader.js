// src/components/preloaders/WaterDropletPreloader.js

import React from 'react';

const keyframes = `
  @keyframes fall {
    from { transform: translateY(-100px); opacity: 1; }
    to { transform: translateY(100vh); opacity: 0; }
  }
`;

const styles = {
  preloader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
    pointerEvents: 'none',
  },
  droplet: {
    position: 'absolute',
    width: '2px',
    height: '10px',
    backgroundColor: 'lightblue',
    borderRadius: '50%',
    animation: 'fall 2s linear infinite',
  },
};

const droplets = Array.from({ length: 50 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}vw`,
  animationDelay: `${Math.random() * 2}s`,
}));

export default function WaterDropletPreloader() {
  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.preloader}>
        {droplets.map(droplet => (
          <div key={droplet.id} style={{ ...styles.droplet, left: droplet.left, animationDelay: droplet.animationDelay }}></div>
        ))}
      </div>
    </>
  );
}
