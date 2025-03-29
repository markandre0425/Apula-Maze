import React from "react";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { 
  HeartIcon, 
  OxygenIcon, 
  TimerIcon, 
  ScoreIcon,
  ExtinguisherIcon,
  MaskIcon
} from "@/assets/icons";

const HUD: React.FC = () => {
  const { 
    player, 
    score,
    timeRemaining,
  } = useFireSafetyGame();
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
      <div className="flex flex-col gap-2 max-w-md">
        {/* Top row - Health, Oxygen */}
        <div className="flex gap-4 items-center">
          {/* Health bar */}
          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-md">
            <HeartIcon className="text-red-500" />
            <div className="h-4 w-32 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${player.health}%` }}
              />
            </div>
            <span className="text-white font-medium">{Math.floor(player.health)}%</span>
          </div>
          
          {/* Oxygen bar */}
          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-md">
            <OxygenIcon className="text-blue-400" />
            <div className="h-4 w-32 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${player.oxygenLevel}%` }}
              />
            </div>
            <span className="text-white font-medium">{Math.floor(player.oxygenLevel)}%</span>
          </div>
        </div>
        
        {/* Middle row - Time, Score */}
        <div className="flex gap-4 items-center">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-md">
            <TimerIcon className="text-yellow-400" />
            <span className="text-white font-medium">{formatTime(timeRemaining)}</span>
          </div>
          
          {/* Score */}
          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-md">
            <ScoreIcon className="text-yellow-400" />
            <span className="text-white font-medium">{score}</span>
          </div>
        </div>
        
        {/* Bottom row - Inventory */}
        <div className="flex gap-4 items-center">
          {/* Extinguishers */}
          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-md">
            <ExtinguisherIcon className="text-red-500" />
            <span className="text-white font-medium">
              {player.inventory.extinguishers}
            </span>
          </div>
          
          {/* Masks */}
          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-md">
            <MaskIcon className="text-blue-400" />
            <span className="text-white font-medium">
              {player.inventory.masks}
            </span>
          </div>
        </div>
      </div>
      
      {/* Controls help */}
      <div className="absolute bottom-4 right-4 bg-black/50 p-3 rounded-md">
        <h3 className="text-white font-bold mb-2">Controls:</h3>
        <ul className="text-white text-sm">
          <li>WASD / Arrow Keys: Move</li>
          <li>E / Space: Interact with items</li>
          <li>F: Use extinguisher on nearest fire</li>
          <li>ESC: Pause</li>
        </ul>
      </div>
    </div>
  );
};

export default HUD;
