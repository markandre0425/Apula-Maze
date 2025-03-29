import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFireSafetyGame, LevelScore } from "@/lib/stores/useFireSafetyGame";
import { Button } from "@/components/ui/button";
import { ScoreIcon, TimerIcon, HeartIcon, TipIcon, FireIcon, ExtinguisherIcon } from "@/assets/icons";
import { toast } from "sonner";
import { safetyTips } from "@/lib/data/safetyTips";
import { useAudio } from "@/lib/stores/useAudio";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const LevelComplete: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentLevel, 
    levels, 
    score, 
    player, 
    timeRemaining, 
    tipsCollected,
    firesExtinguished,
    itemsCollected,
    exitLevel,
    restartLevel,
    unlockNextLevel,
    getHighScores
  } = useFireSafetyGame();
  
  // Animation states
  const [showScore, setShowScore] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  
  const level = levels.find(l => l.id === currentLevel);
  const nextLevel = levels.find(l => l.id === currentLevel + 1);
  
  // Calculate bonuses
  const timeBonus = Math.floor(timeRemaining * 5);
  const healthBonus = Math.floor(player.health * 2);
  const tipBonus = tipsCollected.filter(
    tip => level?.collectibles.some(c => c.tipId === tip)
  ).length * 100;
  
  const totalScore = score + timeBonus + healthBonus + tipBonus;
  
  // Play success sound when level is completed
  useEffect(() => {
    const { playSuccess } = useAudio.getState();
    playSuccess();
    
    // Unlock next level
    unlockNextLevel();
    
    // Show toast
    toast.success("Level Completed!", {
      description: "You've successfully completed the level!",
    });
    
    // Trigger animations with delays
    setTimeout(() => setShowScore(true), 500);
    setTimeout(() => setShowButtons(true), 1200);
  }, [unlockNextLevel]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg overflow-y-auto max-h-[90vh] border-2 border-indigo-300 dark:border-indigo-700"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4 text-green-600 dark:text-green-400 drop-shadow-md"
        >
          Level Completed!
        </motion.h1>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-4 sm:mb-6 text-center bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg"
        >
          <p className="text-base sm:text-xl font-semibold text-green-800 dark:text-green-300">
            You've successfully completed {level?.name}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={showScore ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="bg-white dark:bg-slate-800 p-3 sm:p-5 rounded-md mb-4 sm:mb-6 shadow-md border border-indigo-200 dark:border-indigo-800"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 flex items-center text-indigo-700 dark:text-indigo-300">
            <ScoreIcon className="mr-2 text-indigo-600 dark:text-indigo-400" size={16} />
            Score Breakdown
          </h2>
          
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-between bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-md"
            >
              <span className="font-medium text-indigo-700 dark:text-indigo-300">Base Score:</span>
              <span className="font-bold text-indigo-800 dark:text-indigo-200">{score}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md"
            >
              <span className="flex items-center font-medium text-yellow-700 dark:text-yellow-300">
                <TimerIcon className="mr-2 text-yellow-500" size={18} />
                Time Bonus:
              </span>
              <span className="font-bold text-yellow-700 dark:text-yellow-300">{timeBonus}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md"
            >
              <span className="flex items-center font-medium text-red-700 dark:text-red-300">
                <HeartIcon className="mr-2 text-red-500" size={18} />
                Health Bonus:
              </span>
              <span className="font-bold text-red-700 dark:text-red-300">{healthBonus}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md"
            >
              <span className="flex items-center font-medium text-amber-700 dark:text-amber-300">
                <TipIcon className="mr-2 text-amber-500" size={18} />
                Safety Tips Bonus:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-300">{tipBonus}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, type: "spring" }}
              className="border-t-2 border-indigo-200 dark:border-indigo-700 pt-3 mt-3 flex justify-between font-bold bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-md"
            >
              <span className="text-lg text-indigo-900 dark:text-indigo-100">Total Score:</span>
              <span className="text-lg text-indigo-900 dark:text-indigo-100">{totalScore}</span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Statistics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-5 rounded-md mb-4 sm:mb-6 shadow-md border border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center text-blue-700 dark:text-blue-300">
            <ScoreIcon className="mr-2 text-blue-500" size={16} />
            Level Statistics
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
              <FireIcon className="mr-2 text-red-500" size={18} />
              <div className="flex flex-col">
                <span className="text-sm text-blue-700 dark:text-blue-300">Fires Extinguished</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{firesExtinguished}</span>
              </div>
            </div>
            
            <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
              <ExtinguisherIcon className="mr-2 text-amber-500" size={18} />
              <div className="flex flex-col">
                <span className="text-sm text-blue-700 dark:text-blue-300">Items Collected</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{itemsCollected}</span>
              </div>
            </div>
            
            <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
              <TimerIcon className="mr-2 text-green-500" size={18} />
              <div className="flex flex-col">
                <span className="text-sm text-blue-700 dark:text-blue-300">Time Remaining</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{timeRemaining}s</span>
              </div>
            </div>
            
            <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
              <TipIcon className="mr-2 text-purple-500" size={18} />
              <div className="flex flex-col">
                <span className="text-sm text-blue-700 dark:text-blue-300">Tips Found</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{tipsCollected.length}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* High Scores Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-5 rounded-md mb-4 sm:mb-6 shadow-md border border-purple-200 dark:border-purple-800"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center text-purple-700 dark:text-purple-300">
            <ScoreIcon className="mr-2 text-purple-500" size={16} />
            High Scores
          </h2>
          
          <div className="overflow-y-auto max-h-32 sm:max-h-40">
            <table className="w-full text-xs sm:text-sm">
              <thead className="text-purple-800 dark:text-purple-300">
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <th className="py-1 sm:py-2 text-left">Rank</th>
                  <th className="py-1 sm:py-2 text-center">Score</th>
                  <th className="py-1 sm:py-2 text-center">Time</th>
                  <th className="py-1 sm:py-2 text-right hidden sm:table-cell">When</th>
                </tr>
              </thead>
              <tbody>
                {getHighScores(currentLevel).slice(0, 5).map((score, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-purple-100 dark:border-purple-800/50"
                  >
                    <td className="py-1 sm:py-2 font-bold text-purple-800 dark:text-purple-300">#{index + 1}</td>
                    <td className="py-1 sm:py-2 text-center font-bold text-purple-700 dark:text-purple-200">{score.score}</td>
                    <td className="py-1 sm:py-2 text-center text-purple-600 dark:text-purple-300">{score.completionTime}s</td>
                    <td className="py-1 sm:py-2 text-right text-xs text-purple-500 dark:text-purple-400 hidden sm:table-cell">
                      {formatDistanceToNow(new Date(score.timestamp), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
                {getHighScores(currentLevel).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-2 sm:py-4 text-center text-purple-500 dark:text-purple-400 italic">
                      No previous scores yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Safety tips learned */}
        {tipsCollected.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-amber-50 dark:bg-amber-900/20 p-3 sm:p-5 rounded-md mb-4 sm:mb-6 shadow-md border border-amber-200 dark:border-amber-800"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center text-amber-700 dark:text-amber-300">
              <TipIcon className="mr-2 text-amber-500" size={16} />
              Safety Tips Learned
            </h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {tipsCollected.map((tipId, index) => {
                const tip = safetyTips.find(t => t.id === tipId);
                return tip ? (
                  <motion.li 
                    key={tipId} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="text-amber-800 dark:text-amber-200 font-medium"
                  >
                    {tip.title}
                  </motion.li>
                ) : null;
              })}
            </ul>
            <div className="text-center mt-3">
              <Button
                variant="outline"
                className="border-amber-500 text-amber-700 hover:bg-amber-100 dark:border-amber-400 dark:text-amber-300 dark:hover:bg-amber-900/30"
                onClick={() => {
                  exitLevel();
                  navigate('/safety-guide');
                }}
              >
                <TipIcon className="mr-2" size={16} />
                View All Tips in Safety Guide
              </Button>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={showButtons ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex flex-col gap-2 sm:gap-4 mt-4 sm:mt-6"
        >
          {nextLevel && (
            <Button
              variant="default"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 text-sm sm:text-base shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                exitLevel();
                navigate('/levels');
              }}
            >
              Continue to Next Level
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            className="w-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-900/30 font-bold py-2 sm:py-3 text-sm sm:text-base shadow-md transition-all"
            onClick={() => restartLevel()}
          >
            Play Again
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-200 font-bold py-2 sm:py-3 text-sm sm:text-base shadow-md transition-all"
            onClick={() => {
              exitLevel();
              navigate('/');
            }}
          >
            Back to Menu
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LevelComplete;
