import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameWorld from "@/components/game/GameWorld";
import LevelComplete from "@/components/game/LevelComplete";
import GameMenu from "@/components/ui/game-menu";
import EducationPopup from "@/components/ui/education-popup";
import TouchControls from "@/components/ui/touch-controls";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { useTouchDevice } from "@/hooks/use-is-mobile";
import { toast } from "sonner";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTouchDevice = useTouchDevice();
  const { 
    phase, 
    currentLevel, 
    levels, 
    decreaseTime,
    pauseGame,
    resumeGame,
    movePlayer,
    collectItem,
    extinguishFire
  } = useFireSafetyGame();
  
  // Redirect to main menu if game is not in playing or levelComplete phase
  useEffect(() => {
    if (phase === "menu") {
      navigate('/');
    } else if (phase === "gameOver") {
      navigate('/game-over');
    }
  }, [phase, navigate]);
  
  // Setup timer to decrease time remaining
  useEffect(() => {
    if (phase !== "playing") return;
    
    const timer = setInterval(() => {
      decreaseTime();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [phase, decreaseTime]);
  
  // Setup ESC key to open/close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMenuOpen) {
          setIsMenuOpen(false);
          resumeGame();
        } else {
          setIsMenuOpen(true);
          pauseGame();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, pauseGame, resumeGame]);
  
  // Get current level
  const level = levels.find(l => l.id === currentLevel);
  
  // Show error if level not found
  if (!level) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Level not found. Please return to the main menu.</p>
      </div>
    );
  }
  
  // Handle mobile touch controls
  const handleTouchMove = (dx: number, dy: number) => {
    // Convert small increments for smooth movement
    const speed = 0.5;
    movePlayer(dx * speed, dy * speed);
  };
  
  const handleTouchAction = () => {
    if (!level) return;
    
    // Find the closest active fire to extinguish
    const player = useFireSafetyGame.getState().player;
    const activeHazards = level.hazards.filter(h => !h.extinguished);
    let closestHazard = null;
    let minDistance = Infinity;
    
    for (const hazard of activeHazards) {
      const distance = Math.sqrt(
        Math.pow(player.position.x - hazard.x, 2) + 
        Math.pow(player.position.y - hazard.y, 2)
      );
      
      if (distance < 3 && distance < minDistance) {
        minDistance = distance;
        closestHazard = hazard;
      }
    }
    
    if (closestHazard && player.inventory.extinguishers > 0) {
      extinguishFire(closestHazard.id);
    } else {
      // If no fire to extinguish, try to collect an item
      const collectibles = level.collectibles.filter(item => !item.collected);
      for (const item of collectibles) {
        const distance = Math.sqrt(
          Math.pow(player.position.x - item.x, 2) + 
          Math.pow(player.position.y - item.y, 2)
        );
        if (distance < 1.5) {
          collectItem(item.id);
          break;
        }
      }
    }
  };
  
  const handleStopMovement = () => {
    // Stop movement (used when touch controls are released)
  };
  
  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Game world */}
      <GameWorld levelId={currentLevel} />
      
      {/* Level complete overlay */}
      {phase === "levelComplete" && <LevelComplete />}
      
      {/* Pause menu */}
      <GameMenu 
        isOpen={isMenuOpen} 
        onClose={() => {
          setIsMenuOpen(false);
          resumeGame();
        }} 
      />
      
      {/* Education popup for tips */}
      <EducationPopup />
      
      {/* Mobile touch controls - only show on touch devices and when playing */}
      {isTouchDevice && phase === "playing" && (
        <TouchControls
          onMove={handleTouchMove}
          onAction={handleTouchAction}
          onStop={handleStopMovement}
        />
      )}
      
      {/* Mobile menu button - only show on touch devices */}
      {isTouchDevice && phase === "playing" && (
        <button
          className="fixed top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-md"
          onClick={() => {
            setIsMenuOpen(true);
            pauseGame();
          }}
        >
          Menu
        </button>
      )}
    </div>
  );
};

export default Game;
