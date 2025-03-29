import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface TouchControlsProps {
  onMove: (dx: number, dy: number) => void;
  onAction: () => void;
  onStop: () => void;
  className?: string;
}

interface TouchButtonProps {
  isActive?: boolean;
  isAction?: boolean;
  onStart: () => void;
  onEnd: () => void;
  className?: string;
  label: React.ReactNode;
}

// A button component for touch controls
const TouchButton: React.FC<TouchButtonProps> = ({
  isActive = false,
  isAction = false,
  onStart,
  onEnd,
  className,
  label
}) => {
  return (
    <button
      type="button"
      className={cn(
        'touch-target flex items-center justify-center rounded-full w-16 h-16 md:w-20 md:h-20 text-white text-lg font-bold',
        isActive ? 'bg-red-500 opacity-90' : 'bg-gray-700 bg-opacity-60',
        isAction ? 'bg-yellow-500' : '',
        className
      )}
      onTouchStart={(e) => {
        e.preventDefault();
        onStart();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onEnd();
      }}
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
    >
      {label}
    </button>
  );
};

// A joystick component for movement
const TouchJoystick: React.FC<{
  onMove: (dx: number, dy: number) => void;
  onStop: () => void;
  className?: string;
}> = ({ onMove, onStop, className }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);
  
  // Store original position
  const basePositionRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!isActive) {
      // Reset the knob position when inactive
      setPosition({ x: 0, y: 0 });
      onStop();
    }
  }, [isActive, onStop]);

  // Handle touch start on joystick
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return; // Already tracking a touch
    
    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;
    
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect();
      basePositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    
    setIsActive(true);
  };

  // Handle touch move on joystick
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;
    
    // Find the touch with the stored identifier
    let activeTouch: React.Touch | undefined;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === touchIdRef.current) {
        activeTouch = e.touches[i];
        break;
      }
    }
    
    if (!activeTouch || !joystickRef.current) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate the touch position relative to the joystick center
    let dx = activeTouch.clientX - centerX;
    let dy = activeTouch.clientY - centerY;
    
    // Limit the movement to the joystick radius
    const maxRadius = rect.width / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    // Update visuals
    setPosition({ x: dx, y: dy });
    
    // Normalize and send to parent component
    const normalizedX = dx / maxRadius; // -1 to 1
    const normalizedY = dy / maxRadius; // -1 to 1
    
    // Only move if beyond a small threshold to prevent accidental movements
    if (Math.abs(normalizedX) > 0.1 || Math.abs(normalizedY) > 0.1) {
      onMove(normalizedX, normalizedY);
    } else {
      onStop();
    }
  };

  // Handle touch end on joystick
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Check if the released touch is the one we're tracking
    let touchFound = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchFound = true;
        break;
      }
    }
    
    if (touchFound) {
      touchIdRef.current = null;
      setIsActive(false);
    }
  };

  return (
    <div 
      ref={joystickRef}
      className={cn(
        'relative w-32 h-32 bg-gray-800 bg-opacity-30 rounded-full touch-action-none',
        isActive ? 'border-2 border-gray-400' : '',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div 
        ref={knobRef}
        className={cn(
          'absolute w-16 h-16 bg-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2',
          isActive ? 'bg-opacity-90' : 'bg-opacity-60'
        )}
        style={{ 
          left: `calc(50% + ${position.x}px)`, 
          top: `calc(50% + ${position.y}px)` 
        }}
      />
    </div>
  );
};

// Main touch controls component
export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onAction,
  onStop,
  className
}) => {
  return (
    <div className={cn('fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-between items-center', className)}>
      {/* Left side: Movement joystick */}
      <TouchJoystick onMove={onMove} onStop={onStop} />
      
      {/* Right side: Action buttons */}
      <div className="flex flex-col gap-4">
        <TouchButton 
          isAction 
          label="Action" 
          onStart={onAction} 
          onEnd={() => {}} 
          className="bg-red-500"
        />
      </div>
    </div>
  );
};

export default TouchControls;