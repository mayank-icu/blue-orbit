// src/components/preloaders/CloudPreloader.js

import React from 'react';

const keyframes = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const styles = {
  preloader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)', // Placeholder cloud texture
    backgroundSize: 'cover',
    zIndex: 100,
    animation: 'fadeOut 3s ease-out forwards',
    pointerEvents: 'none',
  },
};

export default function CloudPreloader() {
  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.preloader}></div>
    </>
  );
}
