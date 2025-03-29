import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./card";
import { Button } from "./button";
import { TipIcon } from "@/assets/icons";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { safetyTips } from "@/lib/data/safetyTips";
import { motion, AnimatePresence } from "framer-motion";

const EducationPopup: React.FC = () => {
  const { showTipPopup, currentTip, hideTip } = useFireSafetyGame();
  
  // Find the current tip
  const tip = currentTip !== null ? safetyTips.find(t => t.id === currentTip) : null;
  
  // Automatically hide the tip after 15 seconds
  useEffect(() => {
    if (showTipPopup) {
      const timeout = setTimeout(() => {
        hideTip();
      }, 15000);
      
      return () => clearTimeout(timeout);
    }
  }, [showTipPopup, hideTip]);
  
  if (!showTipPopup || !tip) return null;
  
  return (
    <AnimatePresence>
      {showTipPopup && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => hideTip()}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full mx-4"
          >
            <Card className="border-2 border-yellow-500">
              <CardHeader className="bg-amber-100 dark:bg-amber-900">
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <TipIcon className="text-amber-600" />
                  <span>Fire Safety Tip #{tip.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                <p className="text-muted-foreground">{tip.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button onClick={() => hideTip()}>Got it!</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EducationPopup;
