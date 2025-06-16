import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TipIcon } from "@/assets/icons";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import { safetyTips } from "@/lib/data/safetyTips";

const EducationPopup: React.FC = () => {
  const { showTipPopup, currentTip, hideTip } = useFireSafetyGame();
  
  if (!currentTip) return null;
  
  const tip = safetyTips.find(t => t.id === currentTip);
  if (!tip) return null;

  return (
    <AnimatePresence>
      {showTipPopup && (
        <motion.div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
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
            <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/90">
              <CardHeader className="bg-yellow-100 dark:bg-yellow-800 border-b border-yellow-200 dark:border-yellow-700">
                <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <TipIcon className="text-yellow-600 dark:text-yellow-400" />
                  <span>Fire Safety Tip #{tip.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3 text-yellow-900 dark:text-yellow-100">{tip.title}</h3>
                <p className="text-yellow-800 dark:text-yellow-200">{tip.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-yellow-200 dark:border-yellow-700 pt-4">
                <Button 
                  onClick={() => hideTip()}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Got it!
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EducationPopup;
