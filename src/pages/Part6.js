import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import endAudio from '../assets/end.wav';
import endSong from '../assets/end-song.mp3';
import blueOrbitLogo from '../assets/blue_orbit.png';

const subtitles = [
    { time: 1000, text: "As we rise from the oceans and soar into space…" },
    { time: 3000, text: "Our planet appears fragile, beautiful, and alive." },
    { time: 6000, text: "Every wave, every cloud, every breath of wind reminds us —" },
    { time: 10000, text: "Earth is our only home." },
    { time: 12000, text: "The choices we make today shape the oceans of tomorrow." },
    { time: 15500, text: "Protect our seas, our skies, and our future…" },
    { time: 19000, text: "before it’s too late." },
    { time: 21000, text: "The story of our planet is in our hands." },
];

const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        color: 'white',
        overflow: 'hidden',
        position: 'relative',
    },
    subtitleContainer: {
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '900px',
        textAlign: 'center',
        padding: '15px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '12px',
        fontSize: 'clamp(14px, 2.5vw, 20px)',
        lineHeight: '1.4',
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
    },
    endScreen: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        animation: 'fadeIn 2s ease-in-out',
        zIndex: 20,
    },
    logo: {
        width: 'clamp(200px, 40vw, 300px)',
        marginBottom: '40px',
    },
    replayButton: {
        padding: '10px 25px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: 'rgba(0, 212, 255, 0.9)',
        border: '2px solid white',
        borderRadius: '30px',
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'all 0.3s ease',
    },
    credits: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        fontSize: 'clamp(10px, 2vw, 12px)',
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'right',
        zIndex: 21,
    },
    subtitle: {
        fontSize: '24px',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
    },
};
// Safely play audio to avoid interruption errors
const playAudio = async (audio) => {
  try {
    await audio.play();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error("Audio playback failed:", error);
    }
  }
};

export default function Part6() {
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [zoom, setZoom] = useState(2.5);
  const [showCredits, setShowCredits] = useState(false);
  const [showPrograms, setShowPrograms] = useState(false);
  const [programsData, setProgramsData] = useState([]);
 const { areSubtitlesOn, setIsMusicMuted, isMusicOn, musicVolume, isMusicMuted } = useAudio();
  
  const navigate = useNavigate();
  
  const narrationAudio = useMemo(() => new Audio(endAudio), []);
  const backgroundSong = useMemo(() => new Audio(endSong), []);
  const globeEl = useRef();

  // --- DATA PARSING ---
  useEffect(() => {
    const oceanProgramsText = `
    ## 🛰️ SWOT (Surface Water and Ocean Topography)
    Status: Ongoing
    
    The SWOT mission, a partnership between NASA and the French space agency CNES, is currently in its main operational phase. Think of it as creating the first-ever high-definition 3D map of the world's oceans, lakes, and rivers. By using advanced radar technology, SWOT is measuring the height of water surfaces with unprecedented accuracy.
    
    Why it's a big deal: For the first time, we can see small-scale ocean features like eddies and currents that are crucial for understanding how the ocean transports heat, carbon, and nutrients. This data is critical for improving climate models, managing fisheries, and predicting weather patterns.
    
    ## 🛰️ PACE (Plankton, Aerosol, Cloud, ocean Ecosystem)
    Status: Ongoing
    
    Launched in early 2024, NASA's PACE satellite is now providing the most advanced look at the color of the ocean ever. By analyzing the subtle shades of blue and green, scientists can identify the types and abundance of phytoplankton—the microscopic plant-like organisms that form the base of the marine food web.
    
    Why it's a big deal: Phytoplankton are the lungs of the ocean, producing a huge amount of Earth's oxygen and playing a key role in the global carbon cycle. By "seeing" the health of these plankton blooms in real-time, PACE is giving us a global check-up on the health of the ocean itself.
    
    ## 🤖 Argo Program
    Status: Ongoing (Global Fleet)
    
    The Argo program is a massive international effort, not a single mission, that has deployed a global fleet of over 4,000 robotic floats. These floats drift with the ocean currents and, every 10 days, dive down to 2,000 meters, measuring temperature and salinity as they rise back to the surface. They then transmit their data via satellite.
    
    Why it's a big deal: Argo provides the most comprehensive dataset we have of what's happening inside the ocean. It's our primary tool for tracking ocean heat content—a critical measure of climate change—and understanding how ocean properties change with depth and over time.
    
    ## 🚢 NOAA Ocean Exploration Expeditions
    Status: Ongoing / Upcoming
    
    NOAA's primary ship for exploration, the Okeanos Explorer, is almost constantly at sea on expeditions to map and explore unknown regions of the deep ocean. As of late 2025, it continues its mission in the Pacific. Using advanced sonar and remotely operated vehicles (ROVs), the ship maps the seafloor and sends back live, high-definition video from the abyss.
    
    Why it's a big deal: With over 80% of the ocean still unexplored, these missions are pure discovery. They routinely identify new species, discover new underwater volcanoes and hydrothermal vents, and map areas of the seafloor for the very first time, broadcasting it all live for anyone to watch.
    `;

    const parsedData = oceanProgramsText.split('## ').filter(s => s.trim()).map(chunk => {
      const lines = chunk.split('\n').filter(l => l.trim());
      const title = lines[0]?.trim();
      const status = lines[1]?.replace('Status:', '').trim();
      const description = lines.slice(2).join('\n').replace("Why it's a big deal:", '<strong>Why it\'s a big deal:</strong>');
      return { title, status, description };
    });
    setProgramsData(parsedData);
  }, []);

  // --- AUDIO & ANIMATION LIFECYCLE ---
  useEffect(() => {
    let audioStarted = false;
    const startPlayback = () => {
      if (audioStarted) return;
      audioStarted = true;

      // Play background music only if isMusicOn is true AND not globally muted
      if (isMusicOn && !isMusicMuted) {
        backgroundSong.volume = musicVolume;
        backgroundSong.loop = true;
        backgroundSong.currentTime = 0;
        playAudio(backgroundSong);
      }
      
      // Play narration audio only if not globally muted
      if (!isMusicMuted) {
        narrationAudio.currentTime = 0;
        playAudio(narrationAudio);
      }
    }

    startPlayback();

    const subtitleTimeouts = subtitles.map(sub =>
      setTimeout(() => setCurrentSubtitle(sub.text), sub.time)
    );

    const finishTimeout = setTimeout(() => setIsFinished(true), 32000);

    return () => {
      // Pause background music only if it was playing and not globally muted
      if (isMusicOn && !isMusicMuted) {
        backgroundSong.pause();
      }
      // Pause narration if not globally muted
      if (!isMusicMuted) {
        narrationAudio.pause();
      }
      subtitleTimeouts.forEach(clearTimeout);
      clearTimeout(finishTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMusicOn, musicVolume, isMusicMuted]);

  // Zoom-out animation
  useEffect(() => {
    if (isFinished) return;
    let animationFrame;
    const zoomOut = () => {
      setZoom(prevZoom => prevZoom * 1.003);
      animationFrame = requestAnimationFrame(zoomOut);
    };
    animationFrame = requestAnimationFrame(zoomOut);
    return () => cancelAnimationFrame(animationFrame);
  }, [isFinished]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: zoom }, 0);
    }
  }, [zoom]);

  // --- 3D OBJECTS ---
  const solarSystem = useMemo(() => [
    { name: 'Sun', texture: 'https://i.imgur.com/1Z1O6Lg.jpeg', size: 50, pos: { x: 0, y: 0, z: -5000 } },
    { name: 'Moon', texture: 'https://i.imgur.com/c4s5eY1.jpeg', size: 0.27, orbitRadius: 1.5, speed: 0.5 },
    { name: 'Mars', texture: 'https://i.imgur.com/o4q5JqH.jpeg', size: 0.53, orbitRadius: 15, speed: 0.1 },
  ], []);

  const satellites = useMemo(() => 
    [...Array(50).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: 1.1 + Math.random() * 0.4,
      speed: 0.01 + Math.random() * 0.02
    })), []
  );

  const meteorites = useMemo(() => 
    [...Array(20).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        alt: 2 + Math.random() * 3,
    })), []
  );

  const handleReplay = () => navigate('/');

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <Globe
          ref={globeEl}
          width={window.innerWidth}
          height={window.innerHeight}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="#4A90E2"
          atmosphereAltitude={0.2}
          customLayerData={[...solarSystem, ...satellites, ...meteorites]}
          customThreeObject={(d) => {
            if (d.name) { // Planets
              const geometry = new THREE.SphereGeometry(d.size, 32, 32);
              const material = new THREE.MeshPhongMaterial();
              new THREE.TextureLoader().load(d.texture, texture => {
                material.map = texture;
                material.needsUpdate = true;
              });
              if (d.name === 'Sun') {
                material.emissive = new THREE.Color(0xffff00);
                material.emissiveIntensity = 1.8;
              }
              return new THREE.Mesh(geometry, material);
            } else if (d.speed) { // Satellites
                const sat = new THREE.Group();
                const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.08), new THREE.MeshPhongMaterial({ color: 0xaaaaaa }));
                const panel1 = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.1), new THREE.MeshPhongMaterial({ color: 0x003366, side: THREE.DoubleSide }));
                panel1.position.x = 0.15;
                const panel2 = panel1.clone();
                panel2.position.x = -0.15;
                sat.add(body, panel1, panel2);
                return sat;
            } else { // Meteorites
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
                const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.6 });
                return new THREE.Points(geometry, material);
            }
          }}
          customThreeObjectUpdate={(obj, d, time) => {
            if (d.name) { // Planets
              if (d.name === 'Sun') {
                obj.position.set(d.pos.x, d.pos.y, d.pos.z);
              } else {
                const angle = time * d.speed / 1000;
                obj.position.set(Math.cos(angle) * d.orbitRadius, 0, Math.sin(angle) * d.orbitRadius);
              }
            } else if (d.speed) { // Satellites
                const angle = (time / 1000 * d.speed) + (d.lat * d.lng);
                const pos = globeEl.current.getCoords(d.lat, d.lng, d.alt);
                obj.position.set(pos.x, pos.y, pos.z);
                obj.rotation.y = angle;
            } else { // Meteorites
                obj.position.x += 0.05;
                if (obj.position.x > 10) {
                    obj.position.x = -10;
                    obj.position.y = (Math.random() - 0.5) * 10;
                }
            }
            return true;
          }}
        />

        {areSubtitlesOn && !isFinished && (
          <div style={styles.subtitleContainer}>
            <div style={{...styles.subtitle, animation: 'fadeIn 1s'}}>{currentSubtitle}</div>
          </div>
        )}

        {isFinished && (
          <div style={styles.endScreen}>
            <img src={blueOrbitLogo} alt="Blue Orbit Logo" style={styles.logo} />
            <button onClick={handleReplay} style={styles.replayButton}>Replay Experience</button>
            <button onClick={() => setShowPrograms(true)} style={{...styles.replayButton, animation: 'none', marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.1)'}}>Explore Ocean Programs</button>
            <div style={{position: 'absolute', bottom: '20px', left: '20px'}}>
                <button onClick={() => setShowCredits(true)} style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '12px'}}>Credits</button>
            </div>
          </div>
        )}

        {(showCredits || showPrograms) && (
            <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{background: 'rgba(10,10,10,0.9)', padding: '30px', borderRadius: '15px', width: 'min(800px, 90vw)', maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.2)'}}>
                    <h2 style={{marginTop: 0, color: '#4fc3f7'}}>{showCredits ? "Credits" : "Major Ocean Programs"}</h2>
                    {showCredits && (
                        <div style={{color: '#ccc', lineHeight: '1.8'}}>
                           
                           <p><strong>3D Globe & Rendering:</strong> react-globe.gl, Three.js, React.js</p>
<p><strong>UI & Data Handling:</strong> D3.js (specifically d3-scale for color mapping)</p>
<p><strong>Planet Textures:</strong> NASA's Blue Marble Collection, Solar System Scope</p>
<p><strong>Data Sources:</strong> NASA (OCO-2, MODIS, GRACE & GRACE-FO, SWOT, PACE, Sea Level Change Portal), NOAA (Ocean Acidification Program, Argo Program), European Partners (CNES, ESA)</p>
                        </div>
                    )}
                    {showPrograms && (
                        <div>
                            {programsData.map((p, i) => (
                                <div key={i} style={{marginBottom: '20px'}}>
                                    <h3 style={{color: '#eee'}}>{p.title}</h3>
                                    <p style={{color: '#00d4ff', fontStyle: 'italic'}}>{p.status}</p>
                                    <p style={{color: '#ccc', lineHeight: '1.6'}} dangerouslySetInnerHTML={{ __html: p.description }}></p>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => {setShowCredits(false); setShowPrograms(false);}} style={{...styles.replayButton, animation: 'none', fontSize: '14px', padding: '10px 25px', marginTop: '20px'}}>Close</button>
                </div>
            </div>
        )}
      </div>
    </>
  );
}
