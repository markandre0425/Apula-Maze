import React from "react";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { 
  HeartIcon, 
  OxygenIcon, 
  TimerIcon, 
  ScoreIcon,
  ExtinguisherIcon,
  MaskIcon,
  FireIcon
} from "@/assets/icons";

const HUD: React.FC = () => {
  const { 
    player, 
    score,
    timeRemaining,
    levels,
    currentLevel,
    showNotification,
    notificationMessage,
  } = useFireSafetyGame();
  
  // Get current level and count active fires
  const level = levels.find(l => l.id === currentLevel);
  const activeFires = level ? level.hazards.filter(h => !h.extinguished).length : 0;
  const totalFires = level ? level.hazards.length : 0;
  
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
        
        {/* Middle row - Time, Score, Fire Counter */}
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
          
          {/* Fire Counter */}
          <div className="flex items-center gap-2 bg-black/50 p-2 rounded-md">
            <FireIcon className={activeFires > 0 ? "text-red-500" : "text-green-500"} />
            <span className={`font-medium ${activeFires > 0 ? "text-red-400" : "text-green-400"}`}>
              {activeFires}/{totalFires}
            </span>
            {activeFires === 0 && (
              <span className="text-green-400 text-sm ml-1">✓ EXIT OPEN</span>
            )}
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
      
      {/* Fire Safety Instructions - Show when fires are active (below controls) */}
      {activeFires > 0 && (
        <div className="absolute top-80 right-4 bg-red-900/95 border-2 border-red-500 p-4 rounded-xl w-80 shadow-2xl backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-2 mb-3">
            {/* Animated Fire Icon */}
            <div className="relative">
              <div className="w-5 h-5 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute top-0 w-5 h-5 bg-gradient-to-t from-red-700 via-orange-600 to-yellow-500 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-gradient-to-t from-yellow-300 to-white rounded-full animate-ping opacity-50"></div>
            </div>
            <h3 className="text-red-200 font-bold text-sm">🚨 FIRE SAFETY ALERT</h3>
          </div>
          <div className="text-red-100 text-xs space-y-2 leading-relaxed">
            <p className="flex items-center gap-2">
              <span className="animate-pulse">🔥</span>
              <strong className="text-red-300">{activeFires} fires</strong> are still burning!
            </p>
            <p className="flex items-center gap-2">
              <span className="animate-bounce">🧯</span>
              Collect extinguishers and press <strong className="bg-red-800/50 px-1 py-0.5 rounded text-yellow-300">F</strong> near fires
            </p>
            <p className="flex items-center gap-2">
              <span className="animate-pulse">🚪</span>
              Exit sign will turn <span className="text-green-400 font-bold animate-pulse">GREEN</span> when all fires are out
            </p>
            <p className="flex items-center gap-2">
              <span className="animate-bounce">⚠️</span>
              <strong className="text-yellow-300">You cannot evacuate until all fires are extinguished!</strong>
            </p>
          </div>
        </div>
      )}
      
      {/* Success Message - Show when all fires are extinguished (below controls) */}
      {activeFires === 0 && totalFires > 0 && (
        <div className="absolute top-80 right-4 bg-green-900/95 border-2 border-green-500 p-4 rounded-xl w-80 shadow-2xl backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-2 mb-3">
            {/* Animated Success Icons */}
            <div className="relative">
              <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-bounce flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border border-green-400 rounded-full animate-ping opacity-50"></div>
            </div>
            <h3 className="text-green-200 font-bold text-sm">🎉 ALL FIRES EXTINGUISHED!</h3>
          </div>
          <div className="text-green-100 text-xs space-y-2 leading-relaxed">
            <p className="flex items-center gap-2">
              <span className="animate-bounce">🎉</span>
              Great job! All <strong className="text-green-300">{totalFires} fires</strong> are out!
            </p>
            <p className="flex items-center gap-2">
              <span className="animate-pulse">🚪</span>
              The exit sign is now <span className="text-green-400 font-bold animate-pulse">GREEN</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="animate-bounce">✅</span>
              <strong className="text-yellow-300">You can now safely evacuate to the exit!</strong>
            </p>
          </div>
        </div>
      )}
      
      {/* Controls help - positioned in middle-right */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 p-3 rounded-md">
        <h3 className="text-white font-bold mb-2">Controls:</h3>
        <ul className="text-white text-sm">
          <li>WASD / Arrow Keys: Move</li>
          <li>E / Space: Interact with items</li>
          <li>F: Use extinguisher on nearest fire</li>
          <li>ESC: Pause</li>
        </ul>
      </div>
      
      {/* Extinguisher Respawn Notification */}
      {showNotification && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-900/95 border-2 border-blue-500 p-3 rounded-xl shadow-2xl backdrop-blur-sm pointer-events-none animate-bounce">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
            <span className="text-blue-100 font-bold text-sm">{notificationMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HUD;
