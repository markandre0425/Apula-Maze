import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FireIcon } from "@/assets/icons";
import SafetyQuiz from "@/components/ui/safety-quiz";

const QuizPage: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-50 to-orange-50 dark:from-red-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <FireIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
          <h1 className="text-xl sm:text-2xl font-bold">APULA Fire Safety Quiz</h1>
        </div>
        
        <Link to="/safety-guide" className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4">
            Back to Safety Guide
          </Button>
        </Link>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container max-w-4xl mx-auto p-3 sm:p-4 flex flex-col">
        {!hasStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <Card className="w-full max-w-xl">
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6 flex flex-col items-center text-center">
                <FireIcon className="h-16 w-16 sm:h-20 sm:w-20 text-red-500 mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Test Your Fire Safety Knowledge</h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                  Challenge yourself with questions about fire prevention, emergency response, 
                  and safety procedures. See how much you've learned!
                </p>
                <div className="grid gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm">
                  <Button 
                    size="default" 
                    className="w-full h-11 sm:h-12 bg-red-600 hover:bg-red-700 text-base sm:text-lg"
                    onClick={() => setHasStarted(true)}
                  >
                    Start Quiz
                  </Button>
                  
                  <Link to="/" className="w-full">
                    <Button variant="outline" size="default" className="w-full h-11 sm:h-12 text-base sm:text-lg">
                      Return to Main Menu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="my-2 sm:my-4"
          >
            <SafetyQuiz />
          </motion.div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <p>FSG - Fire Safety Game © 2023 | Educational game for all ages</p>
      </footer>
    </div>
  );
};

export default QuizPage;