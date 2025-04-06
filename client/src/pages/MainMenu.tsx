import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FireIcon, ExtinguisherIcon, TipIcon } from "@/assets/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAudio } from "@/lib/stores/useAudio";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { toast } from "sonner";

const MainMenu: React.FC = () => {
  const { isMuted, toggleMute, backgroundMusic } = useAudio();
  
  // Start background music when the main menu loads
  useEffect(() => {
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, [backgroundMusic, isMuted]);
  
  // Handle audio toggle
  const handleAudioToggle = () => {
    toggleMute();
    
    // Play or pause background music based on new state
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      } else {
        backgroundMusic.pause();
      }
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-100 to-red-100 dark:from-red-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <FireIcon className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
          <h1 className="text-xl sm:text-2xl font-bold">Fire Safety Game</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="sound-toggle" className="sr-only">Sound</Label>
          <Switch 
            id="sound-toggle"
            checked={!isMuted}
            onCheckedChange={handleAudioToggle}
          />
          <span className="text-xs sm:text-sm font-medium">
            {isMuted ? "Sound Off" : "Sound On"}
          </span>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5 sm:mb-10"
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-2 sm:mb-4 text-red-600 dark:text-red-500">
            FSG
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-md mx-auto px-2">
            Learn fire safety skills through fun and interactive challenges
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col gap-3 sm:gap-4 w-full max-w-md px-4 sm:px-0"
        >
          <Link to="/game" className="w-full">
            <Button 
              size="lg" 
              className="w-full text-base sm:text-lg h-12 sm:h-14 bg-red-600 hover:bg-red-700"
              onClick={() => {
                // Start the first level
                const startGameStore = useFireSafetyGame.getState();
                startGameStore.startGame(1);
                toast.success("Starting the first level!");
              }}
            >
              Start Game
            </Button>
          </Link>
          
          <Link to="/levels" className="w-full">
            <Button size="lg" variant="outline" className="w-full text-base sm:text-lg h-12 sm:h-14">
              Choose Level
            </Button>
          </Link>
          
          <Link to="/safety-guide" className="w-full">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full text-base sm:text-lg h-12 sm:h-14 border-amber-500 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-950"
            >
              <TipIcon className="mr-2 h-5 w-5" />
              Safety Guide
            </Button>
          </Link>
        </motion.div>
        
        {/* Feature cards - always visible but in different layouts for mobile/desktop */}
        <div className="mt-8 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl px-4 sm:px-2">
          <FeatureCard 
            icon={<FireIcon className="h-8 sm:h-10 w-8 sm:w-10 text-red-500" />}
            title="Learn Fire Safety"
            description="Master essential fire safety skills that could save lives in emergencies."
          />
          
          <FeatureCard 
            icon={<ExtinguisherIcon className="h-8 sm:h-10 w-8 sm:w-10 text-red-500" />}
            title="Interactive Gameplay"
            description="Navigate through realistic scenarios and make quick decisions."
          />
          
          <FeatureCard 
            icon={<TipIcon className="h-8 sm:h-10 w-8 sm:w-10 text-amber-500" />}
            title="Educational Content"
            description="Collect safety tips and learn proper procedures for fire emergencies."
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <p>FSG - Fire Safety Game © 2023 | Educational game for all ages</p>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }} // Add tap feedback for mobile
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="touch-UI-element">
        <CardContent className="pt-4 sm:pt-6 flex flex-col items-center text-center">
          <div className="mb-3 sm:mb-4">{icon}</div>
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MainMenu;
