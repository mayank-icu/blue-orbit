import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Part1 from './pages/Part1';
import Part2 from './pages/Part2';
import Part3 from './pages/Part3';
import Part4 from './pages/Part4';
import Part5 from './pages/Part5';
import Part6 from './pages/Part6';
import { AudioProvider } from './context/AudioContext';

// Global styles for the entire app
const globalStyles = `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #000;
    color: white;
  }
`;

function App() {
  const [isPart1Loading, setIsPart1Loading] = useState(true);

  return (
    <>
      <style>{globalStyles}</style>
      <AudioProvider>
        <BrowserRouter>
          <MainLayout isPart1Loading={isPart1Loading}>
            <Routes>
              <Route path="/" element={<Part1 setIsLoading={setIsPart1Loading} />} />
              <Route path="/part2" element={<Part2 />} />
              <Route path="/part3" element={<Part3 />} />
              <Route path="/part4" element={<Part4 />} />
              <Route path="/part5" element={<Part5 />} />
              <Route path="/part6" element={<Part6 />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AudioProvider>
    </>
  );
}

export default App;