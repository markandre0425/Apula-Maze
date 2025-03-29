import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreIcon, FireIcon, TipIcon } from "@/assets/icons";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { motion } from "framer-motion";
import { safetyTips } from "@/lib/data/safetyTips";

const GameOver: React.FC = () => {
  const navigate = useNavigate();
  const { 
    score, 
    tipsCollected,
    currentLevel,
    levels,
    exitLevel,
    restartLevel
  } = useFireSafetyGame();
  
  // Redirect to main menu if refreshed on this page
  useEffect(() => {
    if (currentLevel === 0) {
      navigate('/');
    }
  }, [currentLevel, navigate]);
  
  // Get a random safety tip
  const randomTip = safetyTips[Math.floor(Math.random() * safetyTips.length)];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-gray-900 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-red-600">
          <CardHeader className="bg-red-950 py-3 sm:py-6">
            <CardTitle className="text-center text-white flex items-center justify-center gap-2 text-lg sm:text-xl">
              <FireIcon className="text-red-500 h-5 w-5 sm:h-6 sm:w-6" />
              Game Over
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-base sm:text-xl mb-2">You didn't make it out safely!</p>
              <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold">
                <ScoreIcon className="text-yellow-500 h-5 w-5 sm:h-6 sm:w-6" />
                <span>Score: {score}</span>
              </div>
            </div>
            
            <div className="bg-muted p-3 sm:p-4 rounded-md mb-3 sm:mb-4">
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Safety Tip:</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{randomTip.content}</p>
            </div>
            
            {tipsCollected.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">Tips Collected: {tipsCollected.length}</h3>
                <ul className="text-xs sm:text-sm list-disc pl-5">
                  {tipsCollected.map(tipId => {
                    const tip = safetyTips.find(t => t.id === tipId);
                    return tip ? (
                      <li key={tipId} className="mb-1">{tip.title}</li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-6">
            <Button 
              variant="default" 
              size="default" 
              className="w-full bg-red-600 hover:bg-red-700 min-h-10"
              onClick={() => {
                restartLevel();
                navigate('/play');
              }}
            >
              Try Again
            </Button>
            
            {tipsCollected.length > 0 && (
              <Button
                variant="secondary"
                size="default"
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-200 min-h-10"
                onClick={() => {
                  exitLevel();
                  navigate('/safety-guide');
                }}
              >
                <TipIcon className="mr-2 h-4 w-4" />
                View Safety Guide
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="default" 
              className="w-full min-h-10"
              onClick={() => {
                exitLevel();
                navigate('/');
              }}
            >
              Back to Menu
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default GameOver;
