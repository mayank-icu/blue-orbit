# BlueOrbit 🌍🚀

**BlueOrbit** is an interactive VR web experience that takes users on a journey from **space to the depths of the oceans**, visualizing NASA Earth observation datasets with immersive hotspots, animations, and AI-assisted insights.

---

## 🌟 Features

- **3D Globe & VR Interaction:** Explore Earth in 3D with zooming, rotating, and clickable hotspots using `react-globe.gl` and `Three.js`.
- **Immersive Audio & Narration:** Pre-recorded voice-over guides users through each part of the journey, with subtitles for accessibility.
- **Interactive Ocean & Sky Layers:** Explore atmosphere, ocean surface, and ocean depth layers with animated visuals.
- **AI-powered Q&A:** Users can click on animals or hotspots to ask questions and receive brief, factual answers.
- **NASA Data Visualization:** Real Earth observation data (aerosols, ocean temperature, plankton, sea level) is visualized for educational impact.
- **Responsive & Accessible:** Seated/standing VR navigation, toggleable audio, subtitles, and simple UI for all users.

---

## 🛠 Tech Stack

### **3D Globe & Rendering**
- React.js  
- react-globe.gl  
- Three.js  

### **UI & Data Handling**
- D3.js (specifically `d3-scale` for color mapping)  

### **Planet Textures**
- NASA Blue Marble Collection  
- Solar System Scope  

---

## 🌐 Data Sources

- **NASA**: OCO-2, MODIS, GRACE & GRACE-FO, SWOT, PACE, Sea Level Change Portal  
- **NOAA**: Ocean Acidification Program, Argo Program  
- **European Partners**: CNES, ESA  

These datasets are used to create interactive hotspots, animations, and visual overlays for a realistic and educational VR experience.

---

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mayank-icu/blue-orbit.git
