import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog";
import { Button } from "./button";
import { Switch } from "./switch";
import { Label } from "./label";
import { useAudio } from "@/lib/stores/useAudio";
import { useNavigate } from "react-router-dom";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";

// Color palette for fire safety tip style
const YELLOW_BG = "#FFF9E3";
const YELLOW_BORDER = "#FFE066";
const BROWN_TEXT = "#7C4A03";
const YELLOW_BTN = "#FFC72C";
const YELLOW_BTN_HOVER = "#FFD54F";

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
      <DialogContent
        style={{
          background: YELLOW_BG,
          border: `2px solid ${YELLOW_BORDER}`,
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(255, 199, 44, 0.08)',
          padding: '2rem',
          maxWidth: '500px',
          width: '90vw',
        }}
        className="sm:max-w-lg"
      >
        <DialogHeader
          style={{
            background: YELLOW_BG,
            borderBottom: `1px solid ${YELLOW_BORDER}`,
            paddingBottom: '1rem',
            marginBottom: '2rem',
          }}
        >
          <DialogTitle
            style={{
              color: BROWN_TEXT,
              fontWeight: 700,
              fontSize: '2.5rem',
              textAlign: 'left',
              marginBottom: '0.5rem',
            }}
          >
            Game Paused
          </DialogTitle>
          <DialogDescription
            style={{
              color: BROWN_TEXT,
              fontSize: '1.2rem',
              textAlign: 'left',
              lineHeight: '1.6',
            }}
          >
            Take a break or adjust your settings.
          </DialogDescription>
        </DialogHeader>
        
        <div
          style={{
            background: YELLOW_BG,
            color: BROWN_TEXT,
            fontSize: '1.2rem',
            marginBottom: '3rem',
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '2rem',
              borderBottom: `1px solid ${YELLOW_BORDER}`,
            }}
          >
            <Label htmlFor="sound" style={{ color: BROWN_TEXT, fontWeight: 500, fontSize: '1.2rem' }}>
              Sound
            </Label>
            <Switch
              id="sound"
              checked={!isMuted}
              onCheckedChange={toggleMute}
              className="data-[state=checked]:bg-yellow-400"
            />
          </div>
        </div>
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
          }}
        >
          <Button
            variant="outline"
            onClick={onClose}
            style={{
              background: YELLOW_BTN,
              color: BROWN_TEXT,
              fontWeight: 600,
              border: `1px solid ${YELLOW_BORDER}`,
              borderRadius: 8,
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(255, 199, 44, 0.08)',
            }}
            className="hover:bg-yellow-300"
          >
            Resume
          </Button>
          <Button
            variant="secondary"
            onClick={handleRestart}
            style={{
              background: YELLOW_BTN,
              color: BROWN_TEXT,
              fontWeight: 600,
              border: `1px solid ${YELLOW_BORDER}`,
              borderRadius: 8,
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(255, 199, 44, 0.08)',
            }}
            className="hover:bg-yellow-300"
          >
            Restart Level
          </Button>
          <Button
            variant="destructive"
            onClick={handleExit}
            style={{
              background: YELLOW_BTN,
              color: BROWN_TEXT,
              fontWeight: 600,
              border: `1px solid ${YELLOW_BORDER}`,
              borderRadius: 8,
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(255, 199, 44, 0.08)',
            }}
            className="hover:bg-yellow-300"
          >
            Exit to Menu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameMenu;
