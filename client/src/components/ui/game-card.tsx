import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { GameLevel } from "@/lib/stores/useFireSafetyGame";
import { motion } from "framer-motion";
import { FireIcon, TipIcon } from "@/assets/icons";
import { Badge } from "./badge";

interface GameCardProps {
  level: GameLevel;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ level, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`transition-opacity duration-200 ${
        !level.unlocked ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      <Card className={level.completed ? "border-green-500" : ""}>
        <CardHeader className={`${level.completed ? "bg-green-50 dark:bg-green-900/20" : ""}`}>
          <CardTitle className="flex justify-between items-center">
            <span>{level.name}</span>
            {level.completed && (
              <Badge variant="success" className="bg-green-500">
                Completed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 sm:p-3 rounded-lg">
              <FireIcon className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500" />
            </div>
            
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{level.description}</p>
              
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm py-1">
                  <FireIcon className="h-3 w-3" />
                  <span>{level.hazards.length} Hazards</span>
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm py-1">
                  <TipIcon className="h-3 w-3" />
                  <span>
                    {level.collectibles.filter(c => c.type === "tip").length} Tips
                  </span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t pt-3 sm:pt-4">
          <Button
            onClick={onClick}
            disabled={!level.unlocked}
            className={`min-h-10 ${level.completed ? "bg-green-600 hover:bg-green-700" : ""}`}
            size="sm"
          >
            {level.completed ? "Play Again" : "Start Level"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GameCard;
