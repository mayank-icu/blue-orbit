// src/components/preloaders/ThunderPreloader.js

import React from 'react';

const keyframes = `
  @keyframes thunder {
    0%, 100% { background-color: rgba(0,0,0,0.8); }
    50% { background-color: rgba(255,255,255,0.8); }
  }
`;

const styles = {
  preloader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 200,
    animation: 'thunder 1s 2',
    pointerEvents: 'none',
  },
};

export default function ThunderPreloader() {
  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.preloader}></div>
    </>
  );
}
