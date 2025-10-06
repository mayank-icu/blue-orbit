import React, { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Send, X, MessageCircle, Info, ChevronDown, ChevronUp  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Ocean data with blooms, gyres, and currents
const oceanData = [
  // ##########################################
  // ### High Productivity Blooms & Upwellings
  // ##########################################
  {lat: 58.0, lng: -25.0, radius: 15, dataType: "bloom", region: "North Atlantic Bloom", label: "A massive explosion of phytoplankton each spring, so large it's visible from space. It forms the base of the entire North Atlantic food web."},
  {lat: -15.0, lng: -78.0, radius: 8, dataType: "bloom", region: "Peru-Chile Upwelling", label: "Driven by the Humboldt Current, this is the most productive marine ecosystem on Earth, supplying over 10% of the world's fish catch."},
  {lat: 38.0, lng: -125.0, radius: 7, dataType: "bloom", region: "California Current System", label: "Cold, nutrient-rich waters flow south, supporting diverse marine life from tiny krill to giant blue whales, but it's vulnerable to marine heatwaves."},
  {lat: -28.0, lng: 12.0, radius: 7, dataType: "bloom", region: "Benguela Current", label: "This powerful upwelling system off Africa's southwestern coast is characterized by cool, oxygen-rich waters that fuel immense biological productivity."},
  {lat: 0.0, lng: -120.0, radius: 12, dataType: "bloom", region: "Equatorial Pacific Upwelling", label: "A persistent band of cool water at the equator created by diverging currents. Its temperature is a key indicator of El Niño and La Niña events."},
  {lat: 15.0, lng: 62.0, radius: 9, dataType: "bloom", region: "Arabian Sea Bloom", label: "Experiences unique, massive blooms of Noctiluca scintillans, a type of phytoplankton that thrives in low-oxygen conditions driven by monsoon cycles."},
  {lat: -65.0, lng: 20.0, radius: 18, dataType: "bloom", region: "Southern Ocean Productivity Belt", label: "Fueled by iron and nutrients from melting ice, this circumpolar belt of phytoplankton is the foundation of the Antarctic food web, supporting penguins, seals, and whales."},
  {lat: 68.0, lng: 5.0, radius: 8, dataType: "bloom", region: "Norwegian Sea", label: "The mixing of warm Atlantic and cold Arctic waters creates a rich environment for plankton, supporting some of the world's largest cod and herring fisheries."},
  {lat: -45.0, lng: -60.0, radius: 10, dataType: "bloom", region: "Patagonian Shelf Break", label: "Where the shallow shelf meets the deep Atlantic, powerful currents dredge up nutrients, creating a rich feeding ground for fish, squid, and seabirds."},
  {lat: 47.0, lng: -50.0, radius: 9, dataType: "bloom", region: "Grand Banks of Newfoundland", label: "A world-renowned fishing ground where the cold Labrador Current and warm Gulf Stream meet, causing nutrient mixing and enormous phytoplankton blooms."},
  {lat: 55.0, lng: 150.0, radius: 11, dataType: "bloom", region: "Sea of Okhotsk", label: "Seasonal sea ice melt releases a massive amount of fresh water and nutrients, triggering one of the most intense and productive spring blooms in the world."},
  {lat: 10.0, lng: 52.0, radius: 7, dataType: "bloom", region: "Somali Coast Upwelling", label: "An incredibly powerful seasonal upwelling driven by the Somali Current during the summer monsoon, bringing cold, nutrient-rich water to the surface."},
  {lat: 40.0, lng: -10.0, radius: 6, dataType: "bloom", region: "Iberian Upwelling System", label: "Along the coasts of Spain and Portugal, seasonal winds drive coastal upwelling that supports important sardine and anchovy fisheries."},
  
  // ##########################################
  // ### Low Productivity Gyres (Ocean Deserts)
  // ##########################################
  {lat: 32.0, lng: -158.0, radius: 20, dataType: "gyre", region: "North Pacific Gyre", label: "This vast, stable region of the ocean has very low nutrient levels, making it a biological desert. It is also the location of the Great Pacific Garbage Patch."},
  {lat: -30.0, lng: -115.0, radius: 18, dataType: "gyre", region: "South Pacific Gyre", label: "Containing the clearest ocean water on Earth, this is the largest and most nutrient-depleted gyre, making it the marine equivalent of a desert."},
  {lat: 30.0, lng: -65.0, radius: 16, dataType: "gyre", region: "Sargasso Sea (N. Atlantic Gyre)", label: "A unique sea defined by ocean currents instead of land. Its calm waters and floating Sargassum seaweed provide a critical habitat for sea turtles and eels."},
  {lat: -28.0, lng: -35.0, radius: 15, dataType: "gyre", region: "South Atlantic Gyre", label: "A large, rotating current system with low nutrient availability at its center. Its clockwise rotation dominates the circulation of the South Atlantic."},
  {lat: -25.0, lng: 80.0, radius: 17, dataType: "gyre", region: "Indian Ocean Gyre", label: "This counter-clockwise gyre has low biological productivity and, like its Pacific counterpart, is a major zone of plastic debris accumulation."},

  // ##########################################
  // ### Major Ocean Currents
  // ##########################################
  {lat: 36.0, lng: -70.0, radius: 10, dataType: "current", region: "Gulf Stream", label: "A swift and powerful warm current that originates in the Gulf of Mexico and transports enormous amounts of heat across the Atlantic, strongly influencing weather in Europe."},
  {lat: 33.0, lng: 145.0, radius: 9, dataType: "current", region: "Kuroshio Current", label: "Meaning 'Black Tide' in Japanese due to its deep blue color, this is the Pacific's equivalent of the Gulf Stream, carrying warm tropical water northward."},
  {lat: -34.0, lng: 155.0, radius: 6, dataType: "current", region: "East Australian Current", label: "A warm, southward-flowing current that transports tropical marine life to subtropical regions and shapes weather patterns along Australia's east coast."},
  {lat: -55.0, lng: 100.0, radius: 25, dataType: "current", region: "Antarctic Circumpolar Current", label: "The planet's most powerful ocean current, it is the only one to flow completely around the globe, connecting the Atlantic, Pacific, and Indian Oceans."},
  {lat: 58.0, lng: -50.0, radius: 7, dataType: "current", region: "Labrador Current", label: "A cold, southward-flowing Arctic current that is famous for transporting icebergs, including the one that sank the Titanic, into North Atlantic shipping lanes."},
  {lat: 5.0, lng: 75.0, radius: 10, dataType: "current", region: "Indian Monsoon Currents", label: "A unique system where the ocean currents completely reverse direction twice a year, driven by the powerful shift in winds of the Indian summer and winter monsoons."},
  {lat: -35.0, lng: 25.0, radius: 8, dataType: "current", region: "Agulhas Current", label: "An incredibly strong and fast current flowing along the southeast coast of Africa, playing a key role in the exchange of water between the Indian and Atlantic Oceans."},
  {lat: 8.0, lng: 55.0, radius: 7, dataType: "current", region: "Somali Current", label: "A major western boundary current that is unique for reversing its flow with the monsoon seasons, becoming one of the fastest ocean currents in the world."},
  {lat: -35.0, lng: -45.0, radius: 9, dataType: "current", region: "Brazil Current", label: "A warm water current flowing south along the coast of Brazil, carrying tropical waters to the subtropical South Atlantic."},
  {lat: 25.0, lng: -25.0, radius: 10, dataType: "current", region: "Canary Current", label: "A cold, slow-moving current that flows south along the coast of Northwest Africa, contributing to the cool, arid climate of the Canary Islands and Sahara coast."},
  {lat: -30.0, lng: 110.0, radius: 6, dataType: "current", region: "Leeuwin Current", label: "An unusual warm current that flows southward against the prevailing winds along the coast of Western Australia, influencing the region's climate and marine ecosystems."},
  {lat: 55.0, lng: -145.0, radius: 12, dataType: "current", region: "Alaska Current", label: "A warm-water eddy that flows counter-clockwise in the Gulf of Alaska, keeping the coast of Alaska and British Columbia warmer than other subarctic regions."},
  {lat: 10.0, lng: -150.0, radius: 14, dataType: "current", region: "North Equatorial Current", label: "A major westward-flowing current in the Pacific and Atlantic oceans that is a primary driver of tropical circulation, feeding currents like the Gulf Stream and Kuroshio."},
  {lat: 5.0, lng: 150.0, radius: 11, dataType: "current", region: "Equatorial Counter Current", label: "A significant eastward-flowing current found in the Atlantic, Indian, and Pacific Oceans, flowing against the surrounding westward currents."}
];

export default function Part3() {
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showDataOverlay, setShowDataOverlay] = useState(true);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(0);
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);
  const navigate = useNavigate();
  
  const globeEl = useRef();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (globeEl.current && globeLoaded) {
      globeEl.current.pointOfView({ lat: 20, lng: -100, altitude: 2.5 }, 4000);
    }
  }, [globeLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => (prev + 0.1) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getColorForType = (dataType, pulse) => {
    const intensity = 0.8 + Math.sin(pulse) * 0.1;
    if (dataType === 'bloom') return `rgba(34, 197, 94, ${intensity})`;
    if (dataType === 'gyre') return `rgba(59, 130, 246, ${intensity})`;
    if (dataType === 'current') return `rgba(251, 146, 60, ${intensity})`;
    return 'rgba(255, 255, 255, 0.3)';
  };

  const polygonsData = useMemo(() => {
    if (!showDataOverlay) return [];
    
    return oceanData.map(spot => {
      const numPoints = 32;
      const coordinates = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const randomFactor = 0.8 + Math.random() * 0.4;
        const r = spot.radius * randomFactor;
        const lat = spot.lat + r * Math.cos(angle);
        const lng = spot.lng + r * Math.sin(angle);
        coordinates.push([lng, lat]);
      }
      coordinates.push(coordinates[0]);
      
      return {
        ...spot,
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      };
    });
  }, [showDataOverlay]);

  const handlePolygonClick = (polygon) => {
    setSelectedHotspot(polygon);
    if (globeEl.current) {
      globeEl.current.pointOfView(
        { lat: polygon.lat, lng: polygon.lng, altitude: 1.5 },
        2000
      );
    }
  };

  const handleSend = async (question) => {
    if (!question.trim() || isGenerating) return;

    const userMessage = { sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    const pageContext = "Part 3 - Ocean Systems Visualization showing ocean blooms, gyres, and currents";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;

    const body = {
      contents: [{
        parts: [{
          text: `Context: You are an AI assistant for the Blue Orbit project. The user is currently on the page: ${pageContext}. Answer concisely. Question: ${question}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 250,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", data);
        const errorMessage = data?.error?.message || "An unknown API error occurred.";
        throw new Error(errorMessage);
      }

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      let aiMessage;
      if (aiResponse) {
        aiMessage = { sender: 'ai', text: aiResponse };
      } else {
        console.error("Invalid response structure from API. Full response:", data);
        const blockReason = data.promptFeedback?.blockReason;
        if (blockReason) {
          aiMessage = { sender: 'ai', text: `My response was blocked. Reason: ${blockReason}. Please try a different question.` };
        } else {
          aiMessage = { sender: 'ai', text: `Sorry, I received an unexpected response from the API. The response is: ${JSON.stringify(data)}` };
        }
      }
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI request failed:", error);
      const aiMessage = { sender: 'ai', text: `Sorry, an error occurred: ${error.message}` };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskAiWhy = () => {
    if (selectedHotspot) {
      const question = `Why is the ${selectedHotspot.region} significant?`;
      setChatOpen(true);
      handleSend(question);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      position: 'relative',
      animation: 'fadeIn 2s ease-in-out forwards'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Globe
          ref={globeEl}
          width={window.innerWidth}
          height={window.innerHeight}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="#4a90e2"
          atmosphereAltitude={0.25}
          polygonsData={polygonsData}
          polygonCapColor={d => getColorForType(d.dataType, pulseAnimation)}
          polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
          polygonStrokeColor={() => '#ffffff'}
          polygonAltitude={d => hoveredHotspot === d ? 0.015 : 0.01}
          polygonLabel={d => `<div style="background: rgba(0,0,0,0.9); padding: 12px; border-radius: 8px; color: white; max-width: 250px;">
            <strong style="font-size: 16px; display: block; margin-bottom: 8px;">${d.region}</strong>
            <span style="font-size: 13px; color: #ddd;">${d.label}</span>
          </div>`}
          onPolygonClick={handlePolygonClick}
          onPolygonHover={setHoveredHotspot}
          onGlobeReady={() => setGlobeLoaded(true)}
        />
      </div>

     {/* Info Panel */}
{selectedHotspot && (
    <div style={{
        // --- Desktop/Default Styles ---
        position: 'absolute',
        top: '80px',
        right: '20px',
        width: '350px',
        maxHeight: '80vh',
        padding: '24px', // Default Padding (for desktop)

        // --- Mobile Responsive Overrides (Simulated conditional check) ---
        // This centers the card and sets the width/padding for small screens.
        ...(window.innerWidth <= 768 ? { // Common mobile breakpoint
            width: 'calc(100% - 40px)', // Full width minus 20px margin on each side
            top: '50%', // Center vertically
            left: '50%', // Center horizontally
            transform: 'translate(-50%, -50%)', // Fine-tune centering
            right: 'auto', // Override desktop's right constraint
            bottom: 'auto', // Keep centering consistent
            maxHeight: '90vh',
            padding: '20px', // Responsive Padding (for mobile)
        } : {}), // End of Mobile Overrides

        // --- Shared Styles ---
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        borderRadius: '20px',
        color: 'white',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        animation: 'slideIn 0.4s ease-out',
        overflowY: 'auto'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Info size={24} color="#4a90e2" />
                <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    backgroundColor: selectedHotspot.dataType === 'bloom' ? 'rgba(34, 197, 94, 0.2)' :
                                         selectedHotspot.dataType === 'gyre' ? 'rgba(59, 130, 246, 0.2)' :
                                         'rgba(251, 146, 60, 0.2)',
                    color: selectedHotspot.dataType === 'bloom' ? '#22c55e' :
                           selectedHotspot.dataType === 'gyre' ? '#3b82f6' : '#fb923c'
                }}>
                    {selectedHotspot.dataType}
                </span>
            </div>
            <button
                onClick={() => setSelectedHotspot(null)}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <X size={20} color="white" />
            </button>
        </div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: 'bold' }}>
            {selectedHotspot.region}
        </h2>
        <p style={{
            margin: 0,
            lineHeight: '1.6',
            fontSize: '15px',
            color: '#e0e0e0'
        }}>
            {selectedHotspot.label}
        </p>
        <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '14px',
            color: '#aaa'
        }}>
            <div style={{ marginBottom: '8px' }}>
                <strong>Coordinates:</strong> {selectedHotspot.lat.toFixed(2)}°, {selectedHotspot.lng.toFixed(2)}°
            </div>
            <div>
                <strong>Radius:</strong> ~{selectedHotspot.radius * 111} km
            </div>
        </div>
        <button
            onClick={handleAskAiWhy}
            style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '8px',
                color: '#93c5fd',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '14px',
                transition: 'all 0.3s ease',
            }}
        >
            Ask AI Why?
        </button>
    </div>
)}

   {/* Next Button */}
<button
    onClick={() => navigate('/part4')}
    style={{
        position: 'absolute',
        
        // --- Default (Desktop) Styles (Top Middle) ---
        top: '30px', // Positioning it at the top with a 30px offset
        left: '50%',
        transform: 'translateX(-50%)', // Center horizontally
        padding: '15px 40px',
        fontSize: '18px',
        
        // --- Mobile Overrides ---
        ...(window.innerWidth <= 768 ? {
            top: '20px', // Slightly less top padding on small screens
            padding: '10px 25px', // Smaller padding
            fontSize: '16px', // Smaller text
        } : {}),

        // --- Shared Styles ---
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '30px',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
        transition: 'all 0.3s ease',
        zIndex: 100, // Ensure it sits above the main content
    }}
    onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(34, 197, 94, 1)';
        e.target.style.transform = 'translateX(-50%) scale(1.05)';
        e.target.style.boxShadow = '0 12px 35px rgba(34, 197, 94, 0.6)';
    }}
    onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.9)';
        e.target.style.transform = 'translateX(-50%) scale(1)';
        e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
    }}
>
    Next: The Deep →
</button>

      {/* AI Chat Button */}
     {!chatOpen && (
         <button
             onClick={() => setChatOpen(true)}
             style={{
                 position: 'absolute',
                 bottom: '80px',
                 right: '30px',
                 width: '60px',
                 height: '60px',
                 borderRadius: '50%',
                 backgroundColor: '#3b82f6',
                 border: 'none',
                 color: 'white',
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)',
                 zIndex: 300,
                 transition: 'all 0.3s ease',
             }}
             onMouseEnter={(e) => {
                 e.target.style.transform = 'scale(1.1)';
                 e.target.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.7)';
             }}
             onMouseLeave={(e) => {
                 e.target.style.transform = 'scale(1)';
                 e.target.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.5)';
             }}
         >
             <MessageCircle size={28} />
         </button>
     )}
     
     {/* AI Chat Panel */}
     {chatOpen && (
         <div style={{
             // --- Desktop/Default Styles ---
             position: 'absolute',
             bottom: '20px',
             right: '20px',
             width: '380px',
             height: '500px',
     
             // --- Mobile Responsive Overrides (Simulated conditional check) ---
             // This centers the chat panel horizontally and adjusts its size for mobile.
             ...(window.innerWidth <= 768 ? { // Common mobile breakpoint
                 width: '90%', // Small size on mobile
                 height: '600px', // Reduced height for better screen fit
                 right: 'auto', // Override right constraint
                 left: '50%', // Center horizontally
                 transform: 'translateX(-50%)', // Fine-tune horizontal centering
             } : {}), // End of Mobile Overrides
     
             // --- Shared Styles ---
             backgroundColor: 'rgba(0, 0, 0, 0.95)',
             border: '2px solid rgba(255, 255, 255, 0.2)',
             borderRadius: '20px',
             display: 'flex',
             flexDirection: 'column',
             animation: 'slideIn 0.3s ease-out',
             zIndex: 300,
             boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
         }}>
             {/* Chat Header */}
             <div style={{
                 padding: '20px',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 backgroundColor: 'rgba(59, 130, 246, 0.1)',
             }}>
                 <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                     AI Assistant
                 </span>
                 <button
                     onClick={() => setChatOpen(false)}
                     style={{
                         background: 'rgba(255, 255, 255, 0.1)',
                         border: '1px solid rgba(255, 255, 255, 0.2)',
                         borderRadius: '50%',
                         width: '32px',
                         height: '32px',
                         color: 'white',
                         cursor: 'pointer',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                     }}
                 >
                     <X size={18} />
                 </button>
             </div>
     
             {/* Chat Messages */}
             <div style={{
                 flex: 1,
                 overflowY: 'auto',
                 padding: '20px',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '12px',
             }}>
                 {messages.length === 0 && (
                     <div style={{
                         color: '#94a3b8',
                         fontSize: '14px',
                         textAlign: 'center',
                         marginTop: '40px',
                         lineHeight: '1.6',
                     }}>
                          Ask me anything about ocean systems, blooms, gyres, or currents!
                     </div>
                 )}
                 {messages.map((msg, idx) => (
                     <div
                         key={idx}
                         style={{
                             alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                             maxWidth: '85%',
                             padding: '12px 16px',
                             borderRadius: '12px',
                             backgroundColor: msg.sender === 'user' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                             color: 'white',
                             fontSize: '14px',
                             lineHeight: '1.5',
                             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                         }}
                     >
                         {msg.text}
                     </div>
                 ))}
                 {isGenerating && (
                     <div style={{
                         alignSelf: 'flex-start',
                         padding: '12px 16px',
                         borderRadius: '12px',
                         backgroundColor: 'rgba(255, 255, 255, 0.1)',
                         color: '#94a3b8',
                         fontSize: '14px',
                     }}>
                         💭 Thinking...
                     </div>
                 )}
                 <div ref={chatEndRef} />
             </div>
     
             {/* Chat Input */}
             <div style={{
                 padding: '15px',
                 borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                 display: 'flex',
                 gap: '10px',
                 backgroundColor: 'rgba(0, 0, 0, 0.3)',
             }}>
                 <input
                     type="text"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                     placeholder="Ask a question..."
                     disabled={isGenerating}
                     style={{
                         flex: 1,
                         padding: '12px 16px',
                         borderRadius: '20px',
                         border: '1px solid rgba(255, 255, 255, 0.2)',
                         backgroundColor: 'rgba(255, 255, 255, 0.05)',
                         color: 'white',
                         fontSize: '14px',
                         outline: 'none',
                     }}
                 />
                 <button
                     onClick={() => handleSend(inputValue)}
                     disabled={isGenerating || !inputValue.trim()}
                     style={{
                         padding: '12px 16px',
                         borderRadius: '20px',
                         border: 'none',
                         backgroundColor: '#3b82f6',
                         color: 'white',
                         cursor: isGenerating || !inputValue.trim() ? 'not-allowed' : 'pointer',
                         opacity: isGenerating || !inputValue.trim() ? 0.5 : 1,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         transition: 'all 0.3s ease',
                     }}
                     onMouseEnter={(e) => {
                         if (!isGenerating && inputValue.trim()) {
                             e.target.style.backgroundColor = '#2563eb';
                         }
                     }}
                     onMouseLeave={(e) => {
                         e.target.style.backgroundColor = '#3b82f6';
                     }}
                 >
                     <Send size={18} />
                 </button>
             </div>
         </div>
     )}


      {/* Enhanced Legend */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        padding: '20px 25px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        color: 'white',
        fontSize: '13px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s ease',
        maxHeight: isLegendMinimized ? '50px' : '500px',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsLegendMinimized(!isLegendMinimized)}>
          <div style={{ fontWeight: 'bold', marginBottom: isLegendMinimized ? 0 : '15px', fontSize: '16px' }}>
            Ocean Data Types
          </div>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            {isLegendMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
        {!isLegendMinimized && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.8)', boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }} />
                <span>Blooms (High Productivity)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(251, 146, 60, 0.8)', boxShadow: '0 0 10px rgba(251, 146, 60, 0.6)' }} />
                <span>Currents</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.8)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)' }} />
                <span>Gyres (Low Productivity)</span>
              </div>
            </div>
            <div style={{
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Click any marker to view details
            </div>
          </>
        )}
      </div>
    </div>
  );
}