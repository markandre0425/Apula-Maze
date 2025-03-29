import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import MainMenu from "./pages/MainMenu";
import Game from "./pages/Game";
import LevelSelect from "./pages/LevelSelect";
import GameOver from "./pages/GameOver";
import SafetyGuide from "./pages/SafetyGuide";
import QuizPage from "./pages/QuizPage";
import NotFound from "./pages/not-found";
import { useAudio } from "./lib/stores/useAudio";
import { useScreenSize } from "./hooks/use-screen-size";
import { useIsMobile } from "./hooks/use-is-mobile";
import "@fontsource/inter";

// A responsive container component that adds appropriate scaling for different screen sizes
const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height, isPortrait } = useScreenSize();
  const isMobile = useIsMobile();
  
  // Get iOS-specific viewport height (addresses the iOS Safari 100vh issue)
  useEffect(() => {
    // Set CSS variable for the actual viewport height (for iOS Safari)
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
  
  // Calculate the ideal content scale based on screen size
  let contentScale = 1;
  
  // Scale down content for very narrow screens
  if (width < 360) {
    contentScale = 0.85;
  }
  
  // Set viewport meta tags programmatically for different screen sizes
  useEffect(() => {
    // Update the viewport meta tag based on orientation
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      if (isPortrait) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      } else {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0');
      }
    }
  }, [isPortrait]);

  return (
    <div 
      className="app-container w-full min-h-screen overflow-x-hidden"
      style={{
        minHeight: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh'
      }}
    >
      <div 
        className="content-wrapper w-full h-full"
        style={{
          transform: contentScale !== 1 ? `scale(${contentScale})` : 'none',
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

function App() {
  // Initialize audio elements
  useEffect(() => {
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");

    // Store audio elements in the global audio store
    const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio.getState();
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);

    // Cleanup function
    return () => {
      backgroundMusic.pause();
      hitSound.pause();
      successSound.pause();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ResponsiveContainer>
        <Router>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/play" element={<Game />} />
            <Route path="/game" element={<Game />} />
            <Route path="/levels" element={<LevelSelect />} />
            <Route path="/game-over" element={<GameOver />} />
            <Route path="/safety-guide" element={<SafetyGuide />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" />
        </Router>
      </ResponsiveContainer>
    </QueryClientProvider>
  );
}

export default App;
