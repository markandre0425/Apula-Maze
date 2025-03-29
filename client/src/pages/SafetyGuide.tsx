import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TipIcon, FireIcon } from "@/assets/icons";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { safetyTips, SafetyTip } from "@/lib/data/safetyTips";

const SafetyGuide: React.FC = () => {
  const { tipsCollected } = useFireSafetyGame();
  const [activeTab, setActiveTab] = useState<"collected" | "all">("collected");
  
  // Sort tips: collected first, then by ID
  const sortedTips = [...safetyTips].sort((a, b) => {
    const aCollected = tipsCollected.includes(a.id);
    const bCollected = tipsCollected.includes(b.id);
    
    if (aCollected && !bCollected) return -1;
    if (!aCollected && bCollected) return 1;
    return a.id - b.id;
  });
  
  // Filter tips based on active tab
  const filteredTips = activeTab === "collected" 
    ? sortedTips.filter(tip => tipsCollected.includes(tip.id))
    : sortedTips;
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <TipIcon className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
          <h1 className="text-xl sm:text-2xl font-bold">Fire Safety Guide</h1>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <Link to="/quiz" className="w-1/2 sm:w-auto">
            <Button className="bg-red-600 hover:bg-red-700 w-full text-xs sm:text-sm" size="sm">
              Take Quiz
            </Button>
          </Link>
          <Link to="/" className="w-1/2 sm:w-auto">
            <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
              Back to Menu
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container max-w-6xl mx-auto p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-amber-600 dark:text-amber-500">
            Fire Safety Knowledge Center
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Learn essential fire safety skills that could save lives in emergencies. 
            Collect more tips by playing the game!
          </p>
        </motion.div>
        
        <Tabs 
          defaultValue="collected" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "collected" | "all")}
          className="w-full"
        >
          <div className="flex justify-center mb-4 sm:mb-6 px-1 sm:px-0">
            <TabsList className="w-full max-w-xs sm:max-w-md grid grid-cols-2">
              <TabsTrigger value="collected" className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2">
                <span className="flex items-center gap-1 sm:gap-2">
                  <TipIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">Collected ({tipsCollected.length}/{safetyTips.length})</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2">
                <span className="flex items-center gap-1 sm:gap-2">
                  <FireIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>All Tips</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="collected" className="mt-0">
            {tipsCollected.length === 0 ? (
              <div className="text-center p-4 sm:p-12 border rounded-lg bg-amber-50 dark:bg-amber-950/50">
                <TipIcon className="h-12 w-12 sm:h-16 sm:w-16 text-amber-400 mx-auto mb-3 sm:mb-4 opacity-50" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Tips Collected Yet</h3>
                <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                  Play the game to collect fire safety tips!
                </p>
                <Link to="/levels">
                  <Button size="sm" className="text-sm sm:text-base">Choose a Level</Button>
                </Link>
              </div>
            ) : (
              <TipGrid tips={filteredTips} collectedTips={tipsCollected} />
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <TipGrid 
              tips={filteredTips} 
              collectedTips={tipsCollected} 
              showLocked={true} 
            />
          </TabsContent>
        </Tabs>
        
        {/* Quiz Call to Action */}
        <div className="mt-8 sm:mt-12 mx-auto w-full max-w-lg px-2 sm:px-0">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-red-300 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-red-700 dark:text-red-400">Test Your Knowledge</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Ready to see how much you've learned? Challenge yourself with our fire safety quiz!
                  </p>
                </div>
                <Link to="/quiz" className="w-full sm:w-auto">
                  <Button className="bg-red-600 hover:bg-red-700 w-full min-h-9 sm:min-h-10" size="sm">
                    Take Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <p>FSG - Fire Safety Game © 2023 | Educational game for all ages</p>
      </footer>
    </div>
  );
};

interface TipGridProps {
  tips: SafetyTip[];
  collectedTips: number[];
  showLocked?: boolean;
}

const TipGrid: React.FC<TipGridProps> = ({ tips, collectedTips, showLocked = false }) => {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  
  if (tips.length === 0) {
    return (
      <div className="text-center p-4 sm:p-12">
        <p className="text-sm sm:text-base text-muted-foreground">No tips to display.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {tips.map((tip) => {
        const isCollected = collectedTips.includes(tip.id);
        const isExpanded = expandedTip === tip.id;
        
        if (!isCollected && !showLocked) return null;
        
        return (
          <motion.div
            key={tip.id}
            whileHover={{ y: -3 }} // Reduced hover effect
            whileTap={{ scale: 0.98 }} // Add tap feedback
            transition={{ type: "spring", stiffness: 300 }}
            className="h-full"
          >
            <Card className={`h-full ${isCollected ? 'border-amber-300' : 'border-gray-300 opacity-75'}`}>
              <CardHeader className={`py-2 sm:py-4 px-3 sm:px-6 ${isCollected ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-amber-800 dark:text-amber-200">
                  <TipIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${isCollected ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span>
                    Fire Safety Tip #{tip.id} 
                    {!isCollected && showLocked && ' (Locked)'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 sm:pt-6 px-3 sm:px-6">
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">{tip.title}</h3>
                
                {isCollected ? (
                  <div className="relative">
                    <ScrollArea className={isExpanded ? 'h-32 sm:h-40' : 'h-16 sm:h-20'}>
                      <p className="text-xs sm:text-sm text-muted-foreground">{tip.content}</p>
                    </ScrollArea>
                    
                    {tip.content.length > 100 && !isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-background to-transparent" />
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground italic">
                    Collect this tip by finding it in the game!
                  </p>
                )}
                
                {isCollected && tip.content.length > 100 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                    className="mt-2 w-full text-xs sm:text-sm h-7 sm:h-8"
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SafetyGuide;