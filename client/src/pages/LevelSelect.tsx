import React from "react";
import { useNavigate } from "react-router-dom";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import GameCard from "@/components/ui/game-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const LevelSelect: React.FC = () => {
  const navigate = useNavigate();
  const { levels, startGame } = useFireSafetyGame();
  
  const handleLevelSelect = (levelId: number) => {
    startGame(levelId);
    navigate('/play');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-100 dark:from-slate-900 dark:to-amber-950 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-8">
          <Button 
            variant="ghost" 
            className="self-start mb-2 sm:mb-0 sm:mr-4 px-2 sm:px-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-2xl sm:text-3xl font-bold">Select Level</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }} // Add touch feedback
            >
              <GameCard 
                level={level} 
                onClick={() => handleLevelSelect(level.id)} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
