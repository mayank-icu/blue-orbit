import React, { useState, useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import { MessageCircle, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Keyframes for animations
const keyframes = `
  @keyframes fadeInPage {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.3); opacity: 0.9; }
    100% { transform: scale(1); opacity: 0.6; }
  }
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes cloudFade {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// Expanded CO2 data from OCO-2
const co2Data = [
  // ##########################################
  // ### High Emission Industrial & Urban Hubs
  // ##########################################
  {
    "lat": 36.6, "lng": 104.2, "value": 428.5, "region": "North China Plain", "label": "High Emissions: Industrial & Urban Hub",
    "description": "Home to megacities like Beijing and Tianjin, this region is one of the world's most intensive industrial and agricultural zones. Emissions are driven by a high density of coal-fired power plants, heavy manufacturing, and immense transportation networks."
  },
  {
    "lat": 51.5, "lng": 7.5, "value": 426.8, "region": "Ruhr Valley, Germany", "label": "High Emissions: Industrial Heartland",
    "description": "Germany's historic industrial core, the Ruhr area, has a legacy of coal mining and steel production. While transitioning to cleaner energy, its dense population and remaining heavy industries still result in significant CO₂ emissions."
  },
  {
    "lat": 40.7, "lng": -74.0, "value": 425.2, "region": "US Northeast Corridor", "label": "High Emissions: Dense Urban Area",
    "description": "This megalopolis, stretching from Boston to Washington D.C., has enormous energy demands for residential heating, cooling, and transportation. High traffic volumes and numerous power plants contribute to its large carbon footprint."
  },
  {
    "lat": 28.7, "lng": 77.2, "value": 427.1, "region": "Delhi, India", "label": "High Emissions: Megacity Pollution",
    "description": "As one of the world's most populous megacities, Delhi's CO₂ levels are elevated by intense vehicular traffic, industrial activity in surrounding areas, and the burning of crop residue in neighboring states during certain seasons."
  },
  {
    "lat": -25.8, "lng": 29.3, "value": 424.5, "region": "Highveld, South Africa", "label": "High Emissions: Coal Power Plants",
    "description": "This plateau is the industrial heart of South Africa and is home to a cluster of massive coal-fired power plants. The nation's heavy reliance on coal for electricity generation makes this a significant global CO₂ hotspot."
  },
  {
    "lat": 35.7, "lng": 139.7, "value": 423.9, "region": "Tokyo, Japan", "label": "High Emissions: Major Metropolis",
    "description": "The Greater Tokyo Area is the most populous metropolitan area in the world. Its vast urban infrastructure, immense energy consumption for buildings, and extensive transportation systems result in high, concentrated CO₂ emissions."
  },
  {
    "lat": 19.4, "lng": -99.1, "value": 426.5, "region": "Mexico City, Mexico", "label": "High Emissions: Megacity in a Valley",
    "description": "Located in a high-altitude basin, Mexico City's geography traps pollutants. Emissions from its 22 million residents, extensive traffic, and local industry accumulate, leading to persistently high CO₂ concentrations."
  },
  {
    "lat": -23.5, "lng": -46.6, "value": 424.8, "region": "São Paulo, Brazil", "label": "High Emissions: South American Metropolis",
    "description": "As the largest city in the Southern Hemisphere, São Paulo's carbon footprint is driven by a massive fleet of vehicles and significant industrial and commercial energy use, despite Brazil's reliance on hydropower."
  },
  {
    "lat": -6.2, "lng": 106.8, "value": 425.9, "region": "Jakarta, Indonesia", "label": "High Emissions: Southeast Asian Megacity",
    "description": "Rapid urbanization, chronic traffic congestion, and surrounding industrial estates contribute to Jakarta's high emissions. The region also faces CO₂ release from the degradation of nearby peatlands."
  },
  {
    "lat": 25.3, "lng": 51.5, "value": 429.1, "region": "Persian Gulf", "label": "High Emissions: Oil & Gas Production",
    "description": "This region is the center of the global oil and gas industry. Emissions originate from the extraction, processing, and transport of fossil fuels, as well as from energy-intensive desalination plants common in the area."
  },
  {
    "lat": 30.0, "lng": 31.2, "value": 426.1, "region": "Cairo, Egypt", "label": "High Emissions: Arid Climate Megacity",
    "description": "Cairo's dense population, heavy traffic, and reliance on fossil fuels for electricity create a significant urban CO₂ dome. The surrounding arid environment offers little vegetation to absorb these emissions."
  },
  {
    "lat": 34.0, "lng": -118.2, "value": 423.5, "region": "Los Angeles, USA", "label": "High Emissions: Urban Sprawl & Transport",
    "description": "Los Angeles is infamous for its car-centric culture and extensive freeway system. Vehicular emissions are the primary source of CO₂, combined with industrial activity at its massive port complex."
  },
  {
    "lat": 45.4, "lng": 9.1, "value": 425.5, "region": "Po Valley, Italy", "label": "High Emissions: European Industrial Zone",
    "description": "The Po Valley is a major industrial, agricultural, and population hub in Southern Europe. Its geography often leads to stagnant air, trapping emissions from factories, vehicles, and intensive farming."
  },
  {
    "lat": 31.2, "lng": 121.4, "value": 428.8, "region": "Shanghai & Yangtze Delta", "label": "High Emissions: Global Manufacturing Hub",
    "description": "This region is a powerhouse of global manufacturing and shipping. A dense network of factories, the world's busiest port, and a metropolitan population over 100 million create one of the most intense emission zones on Earth."
  },
  {
    "lat": 55.7, "lng": 37.6, "value": 424.2, "region": "Moscow, Russia", "label": "High Emissions: Northern Megacity",
    "description": "Moscow's high CO₂ levels are driven by extensive urban traffic and a heavy reliance on natural gas for heating during its long, cold winters, powering a metropolitan area of over 20 million people."
  },
  {
    "lat": 50.3, "lng": 19.0, "value": 427.5, "region": "Silesia, Poland", "label": "High Emissions: Coal Belt",
    "description": "The Upper Silesian Coal Basin is one of Europe's most significant hard coal regions. The concentration of coal mines and coal-fired power plants makes it a major source of CO₂ emissions."
  },
  {
    "lat": 24.7, "lng": 46.7, "value": 428.2, "region": "Riyadh, Saudi Arabia", "label": "High Emissions: Oil-Powered Economy",
    "description": "As the capital of a major oil-producing nation, Riyadh's economy and lifestyle are energy-intensive. Emissions are high due to transportation and the heavy use of air conditioning powered by fossil fuels."
  },

  // ##########################################
  // ### CO₂ Sinks & Low Concentration Areas
  // ##########################################
  {
    "lat": -14.2, "lng": -51.9, "value": 412.1, "region": "Amazon Rainforest", "label": "CO₂ Sink: Photosynthesis",
    "description": "The Amazon is the world's largest tropical rainforest, acting as a vital carbon sink. Its dense vegetation absorbs vast amounts of CO₂ from the atmosphere through photosynthesis, though this ability is threatened by deforestation."
  },
  {
    "lat": 61.2, "lng": 105.3, "value": 414.3, "region": "Siberian Taiga", "label": "CO₂ Sink: Boreal Forest",
    "description": "This vast expanse of coniferous forest, the largest forested region on Earth, plays a crucial role in the global carbon cycle. Its trees and soils store enormous quantities of carbon, though it is vulnerable to wildfires."
  },
  {
    "lat": -2.5, "lng": 23.6, "value": 413.5, "region": "Congo Basin", "label": "CO₂ Sink: Tropical Forest",
    "description": "The world's second-largest tropical rainforest, the Congo Basin is a highly efficient carbon sink. It also contains vast peatlands which store billions of tons of carbon in the soil, making its preservation critical."
  },
  {
    "lat": -23.8, "lng": 133.7, "value": 415.0, "region": "Central Australia", "label": "Low Concentration: Remote Area",
    "description": "With minimal industrial activity and a very low population density, the Australian Outback has CO₂ levels close to the global background. Its vast, arid landscape is far from major emission sources."
  },
  {
    "lat": 48.0, "lng": -157.0, "value": 416.5, "region": "North Pacific Ocean", "label": "Background Level: Marine Air",
    "description": "Far from continental pollution sources, the air over the remote North Pacific represents a well-mixed, background level of atmospheric CO₂ for the Northern Hemisphere."
  },
  {
    "lat": -54.9, "lng": -120.0, "value": 412.8, "region": "Southern Ocean", "label": "CO₂ Sink: Ocean Absorption",
    "description": "The cold, stormy waters of the Southern Ocean are responsible for a significant portion of the ocean's total CO₂ uptake. The process is driven by both biological activity (plankton) and physical absorption into cold water."
  },
  {
    "lat": 59.5, "lng": -30.0, "value": 414.8, "region": "North Atlantic Ocean", "label": "CO₂ Sink: North Atlantic Bloom",
    "description": "Each spring, a massive bloom of phytoplankton occurs in the North Atlantic. These microscopic organisms consume huge quantities of CO₂ through photosynthesis, forming the base of the marine food web."
  },
  {
    "lat": 32.0, "lng": 88.0, "value": 415.5, "region": "The Tibetan Plateau", "label": "Low Concentration: High Altitude 'Third Pole'",
    "description": "Due to its extreme altitude and remoteness, the atmosphere over the Tibetan Plateau is largely free of direct pollution. It serves as a crucial monitoring area for background atmospheric conditions."
  },
  {
    "lat": -89.9, "lng": 0.0, "value": 411.8, "region": "Antarctica (South Pole)", "label": "Pristine Air: Global Baseline Station",
    "description": "The air over the Antarctic Plateau is the cleanest on Earth, furthest from any major emission sources. Monitoring stations here provide the global baseline for tracking the rise of greenhouse gases."
  },
  {
    "lat": 72.6, "lng": -40.5, "value": 416.2, "region": "Greenland Ice Sheet", "label": "Low Concentration: Remote Arctic Air",
    "description": "The vast ice sheet of Greenland is remote from major industrial centers, resulting in low background CO₂ concentrations, though the region is extremely sensitive to the warming effects of global emissions."
  },
  {
    "lat": 60.0, "lng": -110.0, "value": 414.5, "region": "Canadian Boreal Forest", "label": "CO₂ Sink: Temperate Rainforest",
    "description": "Canada's vast boreal forest is a critical carbon reservoir, storing nearly twice as much carbon per acre as tropical rainforests, primarily within its soils and wetlands."
  },
  {
    "lat": 0.0, "lng": 115.0, "value": 413.2, "region": "Borneo Peatlands", "label": "CO₂ Sink: Carbon-Rich Soil",
    "description": "The peat swamp forests of Borneo are one of the most carbon-dense ecosystems on Earth. The waterlogged soil prevents dead plant matter from fully decomposing, trapping immense amounts of carbon."
  },
  {
    "lat": 36.0, "lng": -122.0, "value": 415.8, "region": "California Kelp Forests", "label": "CO₂ Sink: Marine Ecosystem",
    "description": "Giant kelp forests along the Pacific coast are highly productive ecosystems that absorb CO₂ through photosynthesis. They represent a significant, though localized, form of blue carbon sequestration."
  },
  {
    "lat": -10.0, "lng": -150.0, "value": 412.5, "region": "South Pacific Gyre", "label": "Low Concentration: Ocean Desert",
    "description": "This remote ocean gyre is considered an 'ocean desert' with very low biological activity. Its distance from land masses results in CO₂ levels representative of the clean marine background of the Southern Hemisphere."
  },
  {
    "lat": -20.0, "lng": -75.0, "value": 414.0, "region": "Atacama Desert / Andes", "label": "Low Concentration: Arid & High Altitude",
    "description": "This region combines extreme aridity with high altitude, meaning there is very little biological activity and it is far from major emission sources. It's often used for astronomical observatories due to its clear, clean air."
  },

  // ##########################################
  // ### Variable & Specific Emission Sources
  // ##########################################
  {
    "lat": -6.0, "lng": 18.0, "value": 422.0, "region": "Central Africa", "label": "Variable Emissions: Biomass Burning",
    "description": "Seasonal agricultural burning and wildfires in the savannas and forests of Central Africa release large, periodic pulses of CO₂ into the atmosphere. The net effect on the carbon cycle is complex and varies year to year."
  },
  {
    "lat": -33.8, "lng": 151.2, "value": 419.8, "region": "Sydney, Australia", "label": "Moderate Emissions: Coastal Urban Area",
    "description": "Sydney's emissions are primarily from transportation and energy use. While significant, they are moderated by the clean marine air from the Pacific and Australia's increasing use of renewable energy sources."
  },
  {
    "lat": 19.0, "lng": 72.8, "value": 426.6, "region": "Mumbai, India", "label": "High Emissions: Coastal Megacity",
    "description": "Mumbai is a densely populated financial center with high emissions from traffic, industry, and energy production. Its coastal location helps disperse pollutants, but the sheer scale of activity keeps concentrations high."
  },
  {
    "lat": 6.5, "lng": 3.4, "value": 425.0, "region": "Lagos, Nigeria", "label": "High Emissions: Rapidly Growing Megacity",
    "description": "Lagos is one of the fastest-growing cities in the world. Its emissions are soaring due to rapid urbanization, heavy traffic congestion, and widespread use of diesel generators for electricity."
  },
  {
    "lat": 41.0, "lng": 29.0, "value": 423.8, "region": "Istanbul, Turkey", "label": "High Emissions: Transcontinental Hub",
    "description": "Straddling two continents, Istanbul is a massive urban and commercial hub. Its CO₂ emissions are driven by dense road traffic, shipping through the Bosphorus strait, and energy consumption by its 15 million residents."
  },
  {
    "lat": 56.8, "lng": -111.4, "value": 427.8, "region": "Alberta Oil Sands, Canada", "label": "High Emissions: Fossil Fuel Extraction",
    "description": "The Athabasca oil sands are a major source of fossil fuels. The energy-intensive process of extracting and upgrading bitumen into synthetic crude oil releases significant amounts of CO₂."
  },
  {
    "lat": 69.3, "lng": 88.2, "value": 428.0, "region": "Norilsk, Russia", "label": "High Emissions: Arctic Industrial Pollution",
    "description": "Norilsk is a major nickel and palladium mining and smelting center in the Siberian Arctic. Its industrial complex is one of the world's largest individual sources of sulfur dioxide and significant CO₂ emissions."
  },
  {
    "lat": 34.0, "lng": 69.0, "value": 419.5, "region": "Hindu Kush, Afghanistan", "label": "Low Concentration: Remote Mountain Range",
    "description": "The rugged and sparsely populated Hindu Kush mountain range has very low local emissions. Air quality here is primarily influenced by long-range transport of pollutants from other regions."
  },
  {
    "lat": -15.0, "lng": -55.0, "value": 422.5, "region": "Cerrado, Brazil", "label": "Variable Emissions: Agricultural Burning",
    "description": "The Cerrado, a vast tropical savanna, is a major agricultural frontier. Large-scale fires, often used to clear land for cattle ranching and soy cultivation, release enormous amounts of stored carbon into the atmosphere each year."
  },
  {
    "lat": -15.0, "lng": 133.0, "value": 421.0, "region": "Northern Australia Savanna", "label": "Variable Emissions: Seasonal Wildfires",
    "description": "Vast areas of the savanna in Northern Australia experience extensive wildfires annually during the dry season. While a natural part of the ecosystem, these fires release significant pulses of CO₂."
  },
  {
    "lat": 19.5, "lng": -155.5, "value": 418.0, "region": "Mauna Loa, Hawaii", "label": "Background Level: Key Observatory",
    "description": "The Mauna Loa Observatory provides the longest continuous record of atmospheric CO₂. Its remote mid-Pacific location is ideal for measuring well-mixed background air, making it a benchmark for global CO₂ trends."
  },
  {
    "lat": 25.0, "lng": 30.0, "value": 417.0, "region": "Sahara Desert", "label": "Low Concentration: Vast Arid Region",
    "description": "The Sahara has virtually no industrial emissions and very little biomass. Its atmosphere is primarily influenced by the global background, although massive dust storms can play a role in regional atmospheric chemistry."
  },
  {
    "lat": 10.8, "lng": 106.7, "value": 425.3, "region": "Ho Chi Minh City, Vietnam", "label": "High Emissions: Developing Economic Hub",
    "description": "This rapidly growing city is a major economic hub in Southeast Asia. Its emissions are rising quickly due to a boom in manufacturing, a dramatic increase in motorbikes and cars, and new urban development."
  }
];

// Cloud preloader component
const CloudPreloader = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'cloudFade 1s ease-out 2s forwards'
  }}>
    <div style={{
      fontSize: '3rem',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '20px', fontSize: '4rem' }}>☁️</div>
      <div>Entering Atmosphere...</div>
    </div>
  </div>
);

export default function Part2() {
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showClouds, setShowClouds] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);
  
  const globeEl = useRef();
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const pageContext = "Part 2 - The Living Atmosphere: Viewing CO₂ concentrations from NASA's OCO-2 data";

  useEffect(() => {
    const cloudsTimeout = setTimeout(() => setShowClouds(false), 3000);
    return () => clearTimeout(cloudsTimeout);
  }, []);

  useEffect(() => {
    if (globeEl.current && globeLoaded) {
      globeEl.current.pointOfView({ lat: 30, lng: -90, altitude: 2.5 }, 4000);
    }
  }, [globeLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Color mapping function
  const getColorFromValue = (value) => {
    if (value < 414) return 'rgba(59, 130, 246, 0.6)'; // Blue
    if (value < 418) return 'rgba(34, 197, 94, 0.6)'; // Green
    if (value < 422) return 'rgba(234, 179, 8, 0.6)'; // Yellow
    if (value < 426) return 'rgba(249, 115, 22, 0.6)'; // Orange
    return 'rgba(239, 68, 68, 0.6)'; // Red
  };

  const htmlElementsData = useMemo(() => 
    co2Data.map(spot => ({
      ...spot,
      color: getColorFromValue(spot.value),
      size: (spot.value - 410) / 2,
    })), 
  []);

  const handlePointClick = (point) => {
    console.log('Point clicked:', point); // Debug log
    setSelectedHotspot(point);
    if (globeEl.current) {
      globeEl.current.pointOfView({ 
        lat: point.lat, 
        lng: point.lng, 
        altitude: 1.5 
      }, 2000);
    }
  };

  const handleSend = async (question) => {
    if (!question.trim() || isGenerating) return;

    const userMessage = { sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;


    const body = {
      contents: [{
        parts: [{
          text: `Context: You are an AI assistant for the Blue Orbit project. The user is currently on the page: ${pageContext}. Answer concisely in 2-3 sentences. Question: ${question}`
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
          aiMessage = { sender: 'ai', text: `Sorry, I received an unexpected response from the API.` };
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
      const question = `Why is the CO₂ concentration at ${selectedHotspot.region} ${selectedHotspot.value} ppm?`;
      setChatOpen(true);
      handleSend(question);
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
        animation: 'fadeInPage 2s ease-in-out forwards',
        position: 'relative',
      }}>
        {showClouds && <CloudPreloader />}
        
        {/* Globe Container */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <Globe
            ref={globeEl}
            width={window.innerWidth}
            height={window.innerHeight}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            atmosphereColor="lightblue"
            atmosphereAltitude={0.25}
            htmlElementsData={htmlElementsData}
            htmlElement={d => {
              const el = document.createElement('div');
              const isHovered = hoveredPoint?.lat === d.lat && hoveredPoint?.lng === d.lng;
              el.innerHTML = `
                <div style="
                  width: ${d.size * 3}px;
                  height: ${d.size * 3}px;
                  border-radius: 50%;
                  background-color: ${d.color};
                  animation: pulse 2s infinite;
                  cursor: pointer;
                  opacity: ${isHovered ? '1' : '0.7'};
                  box-shadow: 0 0 ${isHovered ? '20px' : '10px'} ${d.color};
                "></div>
              `;
              el.style.pointerEvents = 'auto';
              el.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
                setHoveredPoint(d);
              });
              el.addEventListener('mouseleave', (e) => {
                e.stopPropagation();
                setHoveredPoint(null);
              });
              el.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Element clicked:', d.region);
                handlePointClick(d);
              });
              return el;
            }}
            onGlobeReady={() => setGlobeLoaded(true)}
          />
        </div>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -150%)',
            padding: '15px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '10px',
            color: 'white',
            pointerEvents: 'none',
            zIndex: 100,
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '300px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
              {hoveredPoint.region}
            </div>
            <div style={{ fontSize: '14px', color: '#93c5fd' }}>
              CO₂ Concentration: {hoveredPoint.value} ppm
            </div>
          </div>
        )}

  {/* Info Panel - Now with placeholder content */}
{selectedHotspot && (
    <div style={{
        // --- Desktop/Default Styles ---
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '80vh',
        padding: '30px', // Default Padding (for desktop)

        // --- Mobile Responsive Overrides (Simulated conditional check) ---
        // This logic centers the card and sets the width/padding for small screens.
        ...(window.innerWidth <= 768 ? {
            width: 'calc(100% - 40px)', // Full width minus 20px margin on each side
            top: '50%', // Center vertically
            left: '50%', // Center horizontally
            transform: 'translate(-50%, -50%)', // Fine-tune centering
            right: 'auto', // Remove right constraint
            bottom: 'auto', // Remove bottom constraint
            maxHeight: '90vh',
            padding: '20px', // Responsive Padding (for mobile)
        } : {}), // End of Mobile Overrides

        // --- Shared Styles ---
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '20px',
        color: 'white',
        backdropFilter: 'blur(15px)',
        animation: 'slideIn 0.5s ease-out',
        overflowY: 'auto',
        zIndex: 200,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#60a5fa', fontWeight: 'bold' }}>
                {selectedHotspot.region}
            </h3>
            <button
                onClick={() => setSelectedHotspot(null)}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                ×
            </button>
        </div>

        <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: getColorFromValue(selectedHotspot.value).replace('0.6', '1'),
            marginBottom: '10px',
            textShadow: `0 0 20px ${getColorFromValue(selectedHotspot.value).replace('0.6', '0.5')}`
        }}>
            {selectedHotspot.value} ppm
        </div>

        <div style={{
            fontSize: '15px',
            color: '#94a3b8',
            marginBottom: '20px',
            padding: '10px 15px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            borderLeft: `3px solid ${getColorFromValue(selectedHotspot.value).replace('0.6', '1')}`
        }}>
            {selectedHotspot.label}
        </div>

        <div style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#e2e8f0',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            {selectedHotspot.description}
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

        <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            fontSize: '13px',
            color: '#93c5fd'
        }}>
            <strong>📊 Data Source:</strong> NASA's Orbiting Carbon Observatory-2 (OCO-2)
        </div>
    </div>
)}

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
                    👋 Ask me anything about CO₂ concentrations, climate data, or this visualization!
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

 {/* Next Button */}
{!showClouds && (
    <button
        onClick={() => navigate('/part3')}
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
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '30px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 100, // Ensure it sits above the main content
        }}
        onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(59, 130, 246, 1)';
            e.target.style.transform = 'translateX(-50%) scale(1.05)';
            e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
            e.target.style.transform = 'translateX(-50%) scale(1)';
            e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
        }}
    >
        Next: Ocean Surface →
    </button>
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
              CO₂ Concentration Levels (ppm)
            </div>
            <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              {isLegendMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>
          {!isLegendMinimized && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.8)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)' }} />
                  <span>&lt;414 (Carbon Sinks)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.8)', boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }} />
                  <span>414-418 (Low)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(234, 179, 8, 0.8)', boxShadow: '0 0 10px rgba(234, 179, 8, 0.6)' }} />
                  <span>418-422 (Moderate)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.8)', boxShadow: '0 0 10px rgba(249, 115, 22, 0.6)' }} />
                  <span>422-426 (High)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.8)', boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)' }} />
                  <span>&gt;426 (Very High)</span>
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
    </>
  );
}