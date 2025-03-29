import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog";
import { Button } from "./button";
import { Switch } from "./switch";
import { Label } from "./label";
import { useAudio } from "@/lib/stores/useAudio";
import { useNavigate } from "react-router-dom";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";

interface GameMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isMuted, toggleMute } = useAudio();
  const { exitLevel, restartLevel } = useFireSafetyGame();
  
  const handleRestart = () => {
    restartLevel();
    onClose();
  };
  
  const handleExit = () => {
    exitLevel();
    navigate('/');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Paused</DialogTitle>
          <DialogDescription>
            Take a break or adjust your settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="flex items-center gap-2">
              Sound
            </Label>
            <Switch
              id="sound"
              checked={!isMuted}
              onCheckedChange={toggleMute}
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Resume
          </Button>
          <Button variant="secondary" onClick={handleRestart} className="sm:w-auto w-full">
            Restart Level
          </Button>
          <Button variant="destructive" onClick={handleExit} className="sm:w-auto w-full">
            Exit to Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameMenu;
