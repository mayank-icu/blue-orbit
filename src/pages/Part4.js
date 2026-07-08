import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Ocean life data with detailed information
const oceanLifeData = [
  // ##########################################
  // ### Epipelagic Zone (Sunlight)
  // ##########################################
  { name: "Phytoplankton", zone: "Epipelagic", depth_range: "0-50m", description: "These microscopic, plant-like organisms form the base of the entire marine food web. Through photosynthesis, they produce an estimated 50-80% of the world's oxygen.", top: "25%", left: "50%" },
  { name: "Coral Reef", zone: "Epipelagic", depth_range: "0-50m", description: "Often called 'rainforests of the sea,' these vibrant ecosystems are built by tiny animals called polyps. They support over 25% of all marine biodiversity.", top: "85%", left: "15%" },
  { name: "Kelp Forest", zone: "Epipelagic", depth_range: "5-40m", description: "Towering underwater forests of giant algae that grow in cool, nutrient-rich sunlit waters. They provide critical food and shelter for thousands of species.", top: "85%", left: "85%" },
  { name: "Sea Turtle", zone: "Epipelagic", depth_range: "0-200m", description: "Ancient marine reptiles that travel vast distances. They come to the surface to breathe but can dive to great depths to forage for food like jellyfish and seagrass.", top: "30%", left: "20%" },
  { name: "Manta Ray", zone: "Epipelagic", depth_range: "0-200m", description: "The world's largest ray, a graceful filter-feeder with a wingspan of up to 7 meters (23 feet). It glides through the sunlit zone, feeding on tiny zooplankton.", top: "55%", left: "75%" },
  { name: "Dolphin", zone: "Epipelagic", depth_range: "0-200m", description: "Highly intelligent and social marine mammals. They use echolocation to hunt for fish and squid in the upper layers of the ocean.", top: "40%", left: "40%" },

  // ##########################################
  // ### Mesopelagic Zone (Twilight)
  // ##########################################
  { name: "Oarfish", zone: "Mesopelagic", depth_range: "200-1,000m", description: "The world's longest bony fish, reaching up to 11 meters (36 feet). Its ribbon-like body and cryptic nature have likely inspired tales of sea serpents.", top: "25%", left: "20%" },
  { name: "Lanternfish", zone: "Mesopelagic", depth_range: "200-1,000m", description: "Possibly the most abundant vertebrate on Earth, these small fish have light-emitting organs (photophores) arranged in species-specific patterns.", top: "50%", left: "50%" },
  { name: "Vampire Squid", zone: "Mesopelagic", depth_range: "600-900m", description: "Living in a minimum-oxygen zone, this unique cephalopod uses bioluminescent arm-tips and mucus clouds to defend itself in the perpetual twilight.", top: "75%", left: "80%" },
  { name: "Hatchetfish", zone: "Mesopelagic", depth_range: "200-1,000m", description: "These fish have an ultra-thin, silver body and large, upward-facing eyes. Their photophores on their belly provide counter-illumination, hiding their silhouette from predators below.", top: "60%", left: "30%" },
  { name: "Barreleye Fish", zone: "Mesopelagic", depth_range: "600-800m", description: "A bizarre fish with a completely transparent, fluid-filled head. Its tube-like eyes can rotate upwards to see prey through its own forehead.", top: "30%", left: "75%" },

  // ##########################################
  // ### Bathypelagic Zone (Midnight)
  // ##########################################
  { name: "Anglerfish", zone: "Bathypelagic", depth_range: "1,000-3,000m", description: "The iconic deep-sea predator, the female uses a bioluminescent lure filled with glowing bacteria to attract unsuspecting prey in the pitch-black darkness.", top: "40%", left: "35%" },
  { name: "Gulper Eel", zone: "Bathypelagic", depth_range: "500-3,000m", description: "Also known as the pelican eel, its most notable feature is a loosely hinged, enormous mouth that allows it to swallow prey much larger than itself.", top: "65%", left: "75%" },
  { name: "Viperfish", zone: "Bathypelagic", depth_range: "1,000-2,500m", description: "A ferocious predator with fang-like teeth so long they don't fit inside its mouth. It uses a photophore on a long dorsal spine as a lure, similar to an anglerfish.", top: "30%", left: "65%" },
  { name: "Goblin Shark", zone: "Bathypelagic", depth_range: "1,200-1,500m", description: "A 'living fossil' with a distinctive blade-like snout and protrusible jaws. It can suddenly extend its jaws to snatch prey, detecting it via electroreceptors in its snout.", top: "70%", left: "20%" },

  // ##########################################
  // ### Abyssopelagic Zone (The Abyss)
  // ##########################################
  { name: "Giant Squid", zone: "Abyssopelagic", depth_range: "3,000-5,000m", description: "A legendary creature with the largest eyes in the animal kingdom, used to capture faint glimmers of bioluminescence. It is a primary food source for sperm whales.", top: "45%", left: "55%" },
  { name: "Dumbo Octopus", zone: "Abyssopelagic", depth_range: "3,000-4,000m", description: "Named for the large, ear-like fins on its head, this octopus 'flies' through the abyss by flapping its fins. It is one of the deepest-living octopus species.", top: "70%", left: "80%" },
  { name: "Cusk Eel", zone: "Abyssopelagic", depth_range: "2,000-6,000m", description: "These eel-like fish are common inhabitants of the abyssal plain. They are highly adapted to scavenging for food in a resource-scarce environment.", top: "80%", left: "25%" },
  
  // ##########################################
  // ### Hadalpelagic Zone (The Trenches)
  // ##########################################
  { name: "Hadal Snailfish", zone: "Hadalpelagic", depth_range: "6,000-8,200m", description: "One of the deepest-living fish ever discovered, its soft, gelatinous body is built to withstand pressures over 800 times that of the surface. It is the apex predator in its trench environment.", top: "60%", left: "50%" },
  { name: "Giant Amphipod", zone: "Hadalpelagic", depth_range: ">6,000m", description: "A super-sized version of the common shrimp-like crustacean. In the extreme pressure of the hadal zone, these scavengers can grow up to 30 cm (1 foot) in length.", top: "75%", left: "30%" },

  // ##########################################
  // ### Benthic Zone (The Seafloor Interface)
  // ##########################################
  { name: "Tripod Fish", zone: "Benthic", depth_range: "4,000-6,000m", description: "This unique fish rests on the muddy seafloor using three elongated fins as a 'tripod.' It faces into the current, waiting motionlessly to ambush small crustaceans.", top: "85%", left: "20%" },
  { name: "Sea Cucumber", zone: "Benthic", depth_range: "1,000-10,000m", description: "The 'earthworms of the sea,' these echinoderms crawl along the abyssal plain, ingesting sediment to digest the organic matter within, cleaning the seafloor.", top: "80%", left: "80%" },
  { name: "Xenophyophore", zone: "Benthic", depth_range: "500-10,600m", description: "A remarkable giant single-celled organism that can grow up to 20 cm wide. They build intricate shells from sediment and are abundant on the abyssal floor.", top: "90%", left: "50%" },
  { name: "Zombie Worm", zone: "Benthic", depth_range: "1,000-4,000m", description: "These bizarre worms have no mouth or stomach. They secrete acid to bore into the bones of dead whales on the seafloor, using symbiotic bacteria to digest the fats and oils inside.", top: "95%", left: "65%" },
  { name: "Glass Sponge Reef", zone: "Benthic", depth_range: "500-2,000m", description: "Ancient and fragile reefs built by sponges with silica skeletons. Once thought extinct, they form complex habitats for deep-sea creatures on seamounts and continental shelves.", top: "70%", left: "35%" },

  // ##########################################
  // ### Chemosynthetic Zone (Life Beyond the Sun)
  // ##########################################
  { name: "Hydrothermal Vents", zone: "Chemosynthetic", depth_range: "2,000-4,000m", description: "Deep-sea geysers, or 'black smokers,' that spew superheated, mineral-rich water from the Earth's crust. They support entire ecosystems based on chemical energy (chemosynthesis).", top: "80%", left: "25%" },
  { name: "Giant Tube Worms", zone: "Chemosynthetic", depth_range: "2,000-4,000m", description: "With no mouth or gut, these iconic vent creatures host symbiotic bacteria that convert toxic chemicals like hydrogen sulfide into energy for them to survive.", top: "90%", left: "35%" },
  { name: "Yeti Crab", zone: "Chemosynthetic", depth_range: "2,200-2,500m", description: "A crab with hairy arms that cultivates its own food source. It waves its claws over methane seeps or vents to farm the chemosynthetic bacteria it then eats.", top: "95%", left: "15%" },
  { name: "Pompeii Worm", zone: "Chemosynthetic", depth_range: "2,500-4,000m", description: "One of the most heat-tolerant animals on Earth. It lives on the sides of black smoker chimneys, with its tail in water as hot as 80°C (176°F) while its head stays in cooler water.", top: "85%", left: "50%" },
  { name: "Cold Seeps", zone: "Chemosynthetic", depth_range: "400-8,000m", description: "Less dramatic than vents, these are areas where methane and sulfide-rich fluids seep slowly from the seafloor. They support long-lived, slow-growing chemosynthetic communities like mussel beds.", top: "75%", left: "70%" }
];

const oceanLayers = [
  { 
    name: 'Epipelagic', 
    subtitle: 'Sunlight Zone: 0-200m',
    background: 'linear-gradient(to bottom, #E0F7FF 0%, #87CEEB 30%, #4A90E2 70%, #2E5C8A 100%)',
    light: 100,
    temp: '15-20',
    pressure: '1-20',
    description: "The sunlit world. Photosynthesis drives a vibrant ecosystem, supporting the vast majority of familiar marine life, from plankton to whales.",
    creatures: oceanLifeData.filter(c => c.zone === 'Epipelagic')
  },
  { 
    name: 'Mesopelagic', 
    subtitle: 'Twilight Zone: 200-1,000m',
    background: 'linear-gradient(to bottom, #2E5C8A 0%, #1E3A5F 40%, #0F1F3D 80%, #050B1A 100%)',
    light: 1,
    temp: '5-10',
    pressure: '20-100',
    description: "Sunlight fades to a faint twilight. Life here is adapted to low light, with many species using bioluminescence to hunt, mate, and defend themselves.",
    creatures: oceanLifeData.filter(c => c.zone === 'Mesopelagic')
  },
  { 
    name: 'Bathypelagic', 
    subtitle: 'Midnight Zone: 1,000-4,000m',
    background: 'linear-gradient(to bottom, #050B1A 0%, #020510 50%, #000000 100%)',
    light: 0,
    temp: '2-4',
    pressure: '100-400',
    description: "Beyond the reach of any sunlight, this is a world of total darkness and immense pressure. The only light is produced by the creatures themselves.",
    creatures: oceanLifeData.filter(c => c.zone === 'Bathypelagic')
  },
  { 
    name: 'Abyssopelagic', 
    subtitle: 'The Abyss: 4,000-6,000m',
    background: 'linear-gradient(to bottom, #000000 0%, #000000 50%, #0A0010 100%)',
    light: 0,
    temp: '0-2',
    pressure: '400-600',
    description: "The 'bottomless' plain. Life is sparse and adapted to near-freezing temperatures and crushing pressure, surviving on the 'marine snow' falling from above.",
    creatures: oceanLifeData.filter(c => c.zone === 'Abyssopelagic')
  },
  { 
    name: 'Hadalpelagic', 
    subtitle: 'The Trenches: 6,000-11,000m',
    background: 'linear-gradient(to bottom, #0A0010 0%, #120020 50%, #1A0030 100%)',
    light: 0,
    temp: '1-4',
    pressure: '600-1100',
    description: "Named after Hades, this zone exists only in the deepest oceanic trenches. The pressure is extreme, equivalent to over 1,100 times that at the surface.",
    creatures: oceanLifeData.filter(c => c.zone === 'Hadalpelagic')
  },
  { 
    name: 'Benthic Zone', 
    subtitle: 'The Seafloor Interface: Variable Depths',
    background: 'linear-gradient(to bottom, #1A0030 0%, #2D1B3D 40%, #3A2547 80%, #4A3355 100%)',
    light: 0,
    temp: '1-4',
    pressure: 'Varies',
    description: "The true bottom. This isn't a water layer, but the vast expanse of silt, clay, and rock of the ocean floor. Life here consists of crawlers, burrowers, and scavengers adapted to a two-dimensional existence on the seafloor.",
    creatures: oceanLifeData.filter(c => c.zone === 'Benthic')
  },
  { 
    name: 'Chemosynthetic Zone', 
    subtitle: 'Life Beyond the Sun: Vents & Seeps',
    background: 'linear-gradient(to bottom, #4A3355 0%, #3D1F2F 30%, #5C2A1F 60%, #8B3A1A 80%, #B04E22 100%)',
    light: 0,
    temp: '2-400',
    pressure: '200-1100',
    description: "At the ultimate depths, life is decoupled from the sun. Powered by chemical energy from Earth's interior, hydrothermal vents and cold seeps support ecosystems of extremophile bacteria, forming an entirely alien food web independent of photosynthesis.",
    creatures: oceanLifeData.filter(c => c.zone === 'Chemosynthetic')
  },
];

export default function Part4() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const layerHeight = window.innerHeight;
    const newLayer = Math.floor(scrollTop / layerHeight);

    setCurrentLayer(oldLayer => {
      const updatedLayer = Math.min(newLayer, oceanLayers.length - 1);
      if (oldLayer !== updatedLayer) {
        setSelectedElement(null);
      }
      return updatedLayer;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSend = async (question) => {
    if (!question.trim() || isGenerating) return;

    const userMessage = { sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    const pageContext = `Ocean Depth Explorer - Currently viewing ${oceanLayers[currentLayer].name} (${oceanLayers[currentLayer].subtitle})`;
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
    if (selectedElement) {
      const question = `Tell me more about the ${selectedElement.name}.`;
      setShowAIChat(true);
      handleSend(question);
    }
  };

  const styles = {
    keyframes: `
      @keyframes fadeInPage {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes ripple {
        0% { transform: translateY(0) scale(1); opacity: 0.3; }
        50% { transform: translateY(-20px) scale(1.05); opacity: 0.5; }
        100% { transform: translateY(0) scale(1); opacity: 0.3; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(5deg); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      .no-scrollbar::-webkit-scrollbar { display: none; }
    `,
    container: {
      width: '100vw',
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      animation: 'fadeInPage 1.5s ease-in-out forwards',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      position: 'relative'
    },
    layer: {
      width: '100%',
      height: '100vh',
      scrollSnapAlign: 'start',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      transition: 'opacity 0.5s ease'
    },
    waterEffect: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      animation: 'ripple 15s infinite ease-in-out',
      pointerEvents: 'none'
    },
    layerTitle: {
      position: 'absolute',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      zIndex: 2,
      pointerEvents: 'none'
    },
    layerName: {
      fontSize: 'clamp(32px, 6vw, 48px)',
      fontWeight: 'bold',
      marginBottom: '10px',
      textShadow: '0 0 20px rgba(0,0,0,0.8)'
    },
    layerSubtitle: {
      fontSize: 'clamp(14px, 3vw, 20px)',
      opacity: 0.9,
      textShadow: '0 0 10px rgba(0,0,0,0.6)'
    },
    creature: {
      position: 'absolute',
      width: 'clamp(60px, 10vw, 100px)',
      height: 'clamp(60px, 10vw, 100px)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      animation: 'float 6s infinite ease-in-out, fadeIn 1s ease-out',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(5px)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      zIndex: 3
    },
    creatureImage: {
      width: '80%',
      height: '80%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
    },
   infoPanel: {
    position: 'fixed',
    width: 'min(400px, 90vw)',
    padding: 'clamp(20px, 4vw, 30px)',
    maxHeight: '80vh', // Default max height

    // --- Default (Desktop) Position ---
    top: '20px',
    right: '20px',
    
    // --- Mobile Responsive Overrides ---
    ...(window.innerWidth <= 768 ? {
        top: '50%', // Center vertically
        right: 'auto', // Disable right constraint
        left: '50%', // Center horizontally
        transform: 'translate(-50%, -50%)', // Fine-tune centering
        maxHeight: '90vh', // Allow more screen utilization
    } : {}),

    // --- Shared Styles ---
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    color: 'white',
    backdropFilter: 'blur(15px)',
    animation: 'slideInRight 0.5s ease-out',
    overflowY: 'auto',
    zIndex: 200,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
},
    infoPanelTitle: {
      fontSize: 'clamp(24px, 5vw, 32px)',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#00d4ff'
    },
    infoPanelDepth: {
      fontSize: 'clamp(12px, 3vw, 16px)',
      color: '#aaa',
      marginBottom: '20px'
    },
    infoPanelDescription: {
      fontSize: 'clamp(14px, 3vw, 18px)',
      lineHeight: '1.6',
      marginBottom: '20px'
    },
    closeButton: {
      padding: '12px 30px',
      backgroundColor: '#00d4ff',
      border: 'none',
      borderRadius: '25px',
      color: 'black',
      cursor: 'pointer',
      fontSize: 'clamp(14px, 3vw, 16px)',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      width: '100%'
    },
    legendPanel: {
      position: 'fixed',
      bottom: '30px',
      left: '30px',
      padding: '20px 25px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '15px',
      color: 'white',
      fontSize: 'clamp(11px, 2vw, 13px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease',
      maxHeight: isLegendMinimized ? '50px' : '500px',
      overflow: 'hidden',
      zIndex: 100,
      width: 'min(300px, 80vw)'
    },
    nextButton: {
    position: 'absolute',
    
    // --- New Top Middle Positioning ---
    top: '30px', // Positioning it at the top with a 30px offset (padding top)
    left: '50%',
    transform: 'translateX(-50%)', // Center horizontally
    
    // --- Responsive Sizing (Kept from original code) ---
    padding: 'clamp(10px, 2vw, 15px) clamp(20px, 4vw, 35px)',
    fontSize: 'clamp(14px, 3vw, 18px)',
    
    // --- Original Shared Styles ---
    backgroundColor: 'rgba(0, 212, 255, 0.9)',
    border: 'none',
    borderRadius: '30px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    zIndex: 10,
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
},
    scrollDown: {
      position: 'absolute',
      bottom: '8%',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontSize: 'clamp(12px, 3vw, 16px)',
      animation: 'bounce 2s infinite',
      textShadow: '0 0 10px rgba(0,0,0,0.8)',
      zIndex: 5
    },
    aiButton: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: 'clamp(50px, 10vw, 60px)',
      height: 'clamp(50px, 10vw, 60px)',
      borderRadius: '50%',
      backgroundColor: '#00d4ff',
      border: 'none',
      cursor: 'pointer',
      fontSize: 'clamp(20px, 5vw, 28px)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0, 212, 255, 0.5)',
      zIndex: 999,
      transition: 'all 0.3s ease',
      animation: 'pulse 2s infinite'
    },
    chatPanel: {
      position: 'fixed',
      bottom: 'clamp(80px, 15vw, 100px)',
      right: 'clamp(15px, 3vw, 30px)',
      width: 'min(400px, 90vw)',
      height: 'min(500px, 70vh)',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderRadius: '20px',
      border: '2px solid #00d4ff',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 998,
      animation: 'slideInRight 0.3s ease',
      overflow: 'hidden'
    },
    chatHeader: {
      padding: '20px',
      backgroundColor: '#00d4ff',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 'clamp(14px, 3vw, 18px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    message: {
      padding: '12px 16px',
      borderRadius: '15px',
      maxWidth: '80%',
      wordWrap: 'break-word',
      fontSize: 'clamp(12px, 3vw, 14px)',
      lineHeight: '1.5'
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#00d4ff',
      color: 'white'
    },
    aiMessage: {alignSelf: 'flex-start',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    chatInput: {
      display: 'flex',
      padding: '15px',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      gap: '10px'
    },
    input: {
      flex: 1,
      padding: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      color: 'white',
      fontSize: 'clamp(12px, 3vw, 14px)',
      outline: 'none'
    },
    sendButton: {
      padding: '12px 20px',
      backgroundColor: '#00d4ff',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: 'clamp(12px, 3vw, 14px)',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <>
      <style>{styles.keyframes}</style>
      <div ref={containerRef} style={styles.container} className="no-scrollbar">
        {oceanLayers.map((layer, index) => (
          <div
            key={index}
            style={{
              ...styles.layer,
              background: layer.background,
            }}
          >
            <div style={styles.waterEffect}></div>
            
            <div style={styles.layerTitle}>
              <div style={styles.layerName}>{layer.name}</div>
              <div style={styles.layerSubtitle}>{layer.subtitle}</div>
            </div>

            {layer.creatures.map((creature, cIndex) => (
              <div
                key={cIndex}
                style={{
                  ...styles.creature,
                  top: creature.top,
                  left: creature.left,
                  animationDelay: `${cIndex * 0.5}s`
                }}
                onClick={() => setSelectedElement(creature)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={`../assets/creatures/${creature.name.replace(/\s+/g, '_')}.png`}
                  alt={creature.name}
                  style={styles.creatureImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML += `<span style="font-size: clamp(10px, 2vw, 12px); text-align: center; padding: 5px;">${creature.name}</span>`;
                  }}
                />
              </div>
            ))}

            {index < oceanLayers.length - 1 && (
              <div style={styles.scrollDown}>↓ Scroll Down ↓</div>
            )}

            {index === oceanLayers.length - 1 && (
              <button
                style={styles.nextButton}
                onClick={() => navigate('/part5')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 212, 255, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
                }}
              >
                Next →
              </button>
            )}
          </div>
        ))}

        {/* Environmental Data Panel - Fixed position with current layer data */}
        <div style={styles.legendPanel}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              marginBottom: isLegendMinimized ? 0 : '15px'
            }} 
            onClick={() => setIsLegendMinimized(!isLegendMinimized)}
          >
            <div style={{ fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 16px)' }}>
              Environmental Data
            </div>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: 'clamp(11px, 2vw, 13px)'
            }}>
              {isLegendMinimized ? "Show" : "Hide"}
            </button>
          </div>
          {!isLegendMinimized && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginTop: '10px'
              }}>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: 'clamp(20px, 4vw, 24px)'}}>☀️</div>
                  <div style={{marginTop: '5px', fontSize: 'clamp(11px, 2vw, 13px)'}}>
                    {oceanLayers[currentLayer].light}%
                  </div>
                  <div style={{fontSize: 'clamp(9px, 2vw, 11px)', color: '#94a3b8', marginTop: '2px'}}>
                    Light
                  </div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: 'clamp(20px, 4vw, 24px)'}}>🌡️</div>
                  <div style={{marginTop: '5px', fontSize: 'clamp(11px, 2vw, 13px)'}}>
                    {oceanLayers[currentLayer].temp}°C
                  </div>
                  <div style={{fontSize: 'clamp(9px, 2vw, 11px)', color: '#94a3b8', marginTop: '2px'}}>
                    Temperature
                  </div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: 'clamp(20px, 4vw, 24px)'}}>⚖️</div>
                  <div style={{marginTop: '5px', fontSize: 'clamp(11px, 2vw, 13px)'}}>
                    {oceanLayers[currentLayer].pressure} ATM
                  </div>
                  <div style={{fontSize: 'clamp(9px, 2vw, 11px)', color: '#94a3b8', marginTop: '2px'}}>
                    Pressure
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: 'clamp(10px, 2vw, 12px)',
                color: '#94a3b8',
                textAlign: 'center'
              }}>
                Currently viewing: {oceanLayers[currentLayer].name}
              </div>
            </>
          )}
        </div>

        {/* Info Panel - Fixed position */}
        {selectedElement && (
          <div style={styles.infoPanel}>
            <h2 style={styles.infoPanelTitle}>{selectedElement.name}</h2>
            <p style={styles.infoPanelDepth}>
              <strong>Depth Range:</strong> {selectedElement.depth_range}
            </p>
            <p style={styles.infoPanelDescription}>{selectedElement.description}</p>
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
                fontSize: 'clamp(12px, 3vw, 14px)',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
              }}
            >
            Ask AI
            </button>
            <button
              style={{...styles.closeButton, marginTop: '10px'}}
              onClick={() => setSelectedElement(null)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00a8cc';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00d4ff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Close
            </button>
          </div>
        )}

        {/* AI Chat Button */}
        <button
          style={styles.aiButton}
          onClick={() => setShowAIChat(!showAIChat)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Chat with Ocean AI"
        >
          💬
        </button>

        {/* AI Chat Panel */}
        {showAIChat && (
          <div style={styles.chatPanel}>
            <div style={styles.chatHeader}>
              <span>Ocean AI Assistant</span>
              <button
                onClick={() => setShowAIChat(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: 'clamp(18px, 4vw, 20px)',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1'
                }}
              >
                ✕
              </button>
            </div>
            <div style={styles.chatMessages}>
              {messages.length === 0 && (
                <div style={{ ...styles.message, ...styles.aiMessage }}>
                  Hi! I'm your ocean guide. Ask me anything about the creatures and zones you're exploring!
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.message,
                    ...(msg.sender === 'user' ? styles.userMessage : styles.aiMessage)
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {isGenerating && (
                <div style={{ ...styles.message, ...styles.aiMessage }}>
                  <span style={{opacity: 0.7}}>Thinking...</span>
                </div>
              )}
            </div>
            <div style={styles.chatInput}>
              <input
                type="text"
                placeholder="Ask about ocean life..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                style={styles.input}
                disabled={isGenerating}
              />
              <button
                onClick={() => handleSend(inputValue)}
                disabled={isGenerating || !inputValue.trim()}
                style={{
                  ...styles.sendButton,
                  opacity: isGenerating || !inputValue.trim() ? 0.5 : 1,
                  cursor: isGenerating || !inputValue.trim() ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && inputValue.trim()) {
                    e.currentTarget.style.backgroundColor = '#00a8cc';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00d4ff';
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}