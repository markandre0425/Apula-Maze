import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FireIcon, ExtinguisherIcon, TipIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from "@/assets/icons";
import { useAudio } from "@/lib/stores/useAudio";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isMuted, toggleMute, backgroundMusic } = useAudio();

  const tutorialSteps = [
    {
      title: "Welcome to Fire Safety Game!",
      content: "Learn how to navigate through fire hazards and save lives. This tutorial will teach you everything you need to know to play successfully.",
      icon: <FireIcon className="h-12 w-12 text-red-500" />,
      showControls: false
    },
    {
      title: "Game Objective",
      content: "Your mission is to navigate through the maze, collect fire extinguishers, and extinguish all active fires before time runs out. Stay safe and be quick!",
      icon: <ExtinguisherIcon className="h-12 w-12 text-red-500" />,
      showControls: false
    },
    {
      title: "Movement Controls",
      content: "Use the arrow keys or WASD to move your character around the maze.",
      icon: <div className="flex gap-2">
        <ArrowUpIcon className="h-8 w-8 text-blue-500" />
        <ArrowDownIcon className="h-8 w-8 text-blue-500" />
        <ArrowLeftIcon className="h-8 w-8 text-blue-500" />
        <ArrowRightIcon className="h-8 w-8 text-blue-500" />
      </div>,
      showControls: true
    },
    {
      title: "Collecting Items",
      content: "Walk over fire extinguishers and safety equipment to collect them. These items are essential for completing your mission and earning points.",
      icon: <ExtinguisherIcon className="h-12 w-12 text-green-500" />,
      showControls: false
    },
    {
      title: "Extinguishing Fires",
      content: "When you're close to a fire, press SPACEBAR to use your extinguisher. Make sure you have extinguishers in your inventory!",
      icon: <FireIcon className="h-12 w-12 text-orange-500" />,
      showControls: false
    },
    {
      title: "Time Management",
      content: "Each level has a time limit. Watch the timer and plan your route efficiently. Don't waste time getting lost in the maze!",
      icon: <div className="text-2xl font-bold text-red-500">⏰</div>,
      showControls: false
    },
    {
      title: "Level Completion",
      content: "Complete a level by extinguishing all fires and reaching the exit. Your score depends on time remaining, items collected, and fires extinguished.",
      icon: <div className="text-2xl font-bold text-green-500">🏆</div>,
      showControls: false
    },
    {
      title: "Safety Tips",
      content: "Remember: In real life, always call emergency services first, never enter burning buildings alone, and use proper safety equipment.",
      icon: <TipIcon className="h-12 w-12 text-amber-500" />,
      showControls: false
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-100 to-red-100 dark:from-red-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <FireIcon className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
          <h1 className="text-xl sm:text-2xl font-bold">Tutorial</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="text-xs sm:text-sm"
          >
            {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          <Card className="touch-UI-element">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {currentTutorial.icon}
              </div>
              <CardTitle className="text-2xl sm:text-3xl text-red-600 dark:text-red-500">
                {currentTutorial.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {currentTutorial.content}
              </p>

              {/* Progress indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStep
                          ? "bg-red-500"
                          : index < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="min-w-[100px]"
                >
                  Previous
                </Button>
                
                {currentStep === tutorialSteps.length - 1 ? (
                  <Link to="/game" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        // Start the first level
                        const startGameStore = useFireSafetyGame.getState();
                        startGameStore.startGame(1);
                      }}
                    >
                      Start Playing!
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={nextStep} className="min-w-[100px]">
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick navigation */}
        <div className="mt-8 flex gap-3">
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Menu
            </Button>
          </Link>
          <Link to="/safety-guide">
            <Button variant="outline" size="sm">
              Safety Guide
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <p>Step {currentStep + 1} of {tutorialSteps.length} | FSG - Fire Safety Game © 2023</p>
      </footer>
    </div>
  );
};

export default Tutorial;

