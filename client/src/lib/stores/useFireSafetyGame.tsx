import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useAudio } from "./useAudio";
import { levels } from "../data/levels";

export type GamePhase = "menu" | "playing" | "paused" | "levelComplete" | "gameOver";

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface FireHazard {
  id: string;
  x: number;
  y: number;
  size: number;
  extinguished: boolean;
}

export interface CollectibleItem {
  id: string;
  x: number;
  y: number;
  type: "extinguisher" | "mask" | "exit" | "tip";
  collected: boolean;
  tipId?: number;
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  mapWidth: number;
  mapHeight: number;
  startPosition: PlayerPosition;
  exitPosition: PlayerPosition;
  timeLimit: number;
  hazards: FireHazard[];
  collectibles: CollectibleItem[];
  obstacles: { x: number; y: number; width: number; height: number }[];
  completed: boolean;
  unlocked: boolean;
}

// Score tracking for high scores
export interface LevelScore {
  levelId: number;
  score: number;
  completionTime: number;  // Time remaining when completed
  firesExtinguished: number;
  itemsCollected: number;
  tipsFound: number;
  timestamp: number;  // When the score was achieved
}

interface FireSafetyGameState {
  phase: GamePhase;
  currentLevel: number;
  levels: GameLevel[];
  player: {
    position: PlayerPosition;
    inventory: {
      extinguishers: number;
      masks: number;
    };
    health: number;
    oxygenLevel: number;
  };
  score: number;
  timeRemaining: number;
  tipsCollected: number[];
  showTipPopup: boolean;
  currentTip: number | null;

  // High score tracking
  highScores: LevelScore[];
  firesExtinguished: number;
  itemsCollected: number;

  // Notification system for extinguisher respawn
  showNotification: boolean;
  notificationMessage: string;

  // Actions
  startGame: (levelId: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  movePlayer: (dx: number, dy: number) => void;
  collectItem: (itemId: string) => void;
  extinguishFire: (fireId: string) => void;
  completeLevel: () => void;
  restartLevel: () => void;
  gameOver: () => void;
  exitLevel: () => void;
  decreaseTime: () => void;
  showTip: (tipId: number) => void;
  hideTip: () => void;
  updatePlayerHealth: (amount: number) => void;
  updatePlayerOxygen: (amount: number) => void;
  unlockNextLevel: () => void;
  getHighScores: (levelId: number) => LevelScore[];
  showExtinguisherNotification: (message: string) => void;
}

export const useFireSafetyGame = create<FireSafetyGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    currentLevel: 1,
    levels: levels,
    player: {
      position: { x: 0, y: 0 },
      inventory: {
        extinguishers: 0,
        masks: 0,
      },
      health: 100,
      oxygenLevel: 100,
    },
    score: 0,
    timeRemaining: 0,
    tipsCollected: [],
    showTipPopup: false,
    currentTip: null,

    // New properties for enhanced scoring
    highScores: [],
    firesExtinguished: 0,
    itemsCollected: 0,

    // Notification system for extinguisher respawn
    showNotification: false,
    notificationMessage: "",

    startGame: (levelId) => {
      const level = get().levels.find(l => l.id === levelId);
      if (!level || !level.unlocked) return;

      const { playHit } = useAudio.getState();
      playHit(); // Play sound effect

      set({
        phase: "playing",
        currentLevel: levelId,
        player: {
          position: { ...level.startPosition },
          inventory: {
            extinguishers: 0,
            masks: 0,
          },
          health: 100,
          oxygenLevel: 100,
        },
        timeRemaining: level.timeLimit,
        score: 0,
        itemsCollected: 0,
        firesExtinguished: 0,
        tipsCollected: [],
      });
    },

    pauseGame: () => {
      set({ phase: "paused" });
    },

    resumeGame: () => {
      set({ phase: "playing" });
    },

    // Final rewritten movePlayer function - rebuilt from scratch
    movePlayer: (dx, dy) => {
      const { phase, player, currentLevel, levels } = get();
      if (phase !== "playing") return;

      const level = levels.find(l => l.id === currentLevel);
      if (!level) return;

      // SIMPLIFIED MOVEMENT LOGIC WITH CLEAR OUTPUT
      // These directions match the key presses:
      // - Positive X: Move RIGHT on screen
      // - Negative X: Move LEFT on screen
      // - Positive Y: Move DOWN on screen
      // - Negative Y: Move UP on screen

      console.log(`MOVE FROM: (${player.position.x}, ${player.position.y}) BY dx=${dx}, dy=${dy}`);

      // Calculate new position with clear boundary checks
      const newX = Math.max(0, Math.min(level.mapWidth, player.position.x + dx));
      const newY = Math.max(0, Math.min(level.mapHeight, player.position.y + dy));

      console.log(`NEW POSITION: (${newX}, ${newY})`);

      // Simple collision detection with obstacles
      let collision = false;
      const playerRadius = 0.4; // Reduced collision radius for tighter movement

      for (const obstacle of level.obstacles) {
        // Expand obstacle bounds slightly for better collision
        const obstacleLeft = obstacle.x - playerRadius;
        const obstacleRight = obstacle.x + obstacle.width + playerRadius;
        const obstacleTop = obstacle.y - playerRadius;
        const obstacleBottom = obstacle.y + obstacle.height + playerRadius;

        // Check if new position would collide
        if (newX > obstacleLeft && newX < obstacleRight &&
            newY > obstacleTop && newY < obstacleBottom) {
          collision = true;
          console.log("COLLISION with obstacle:", obstacle);
          break;
        }
      }


      // Update player position if no collision
      if (!collision) {
        set({
          player: {
            ...player,
            position: { x: newX, y: newY },
          },
        });
        console.log("MOVED to:", { x: newX, y: newY });
      } else {
        console.log("BLOCKED by obstacle - position unchanged");
      }

      // Check if player reached exit
      const distanceToExit = Math.sqrt(
        Math.pow(newX - level.exitPosition.x, 2) + 
        Math.pow(newY - level.exitPosition.y, 2)
      );

      // Check if close enough to exit
      if (distanceToExit < 1.5) {
        console.log("REACHED EXIT!");
        
        // Check if all fires are extinguished before allowing level completion
        const activeHazards = level.hazards.filter(h => !h.extinguished);
        
        if (activeHazards.length > 0) {
          // Prevent level completion and show warning
          console.log(`Cannot exit! ${activeHazards.length} fires still burning!`);
          
          // Show visual feedback
          const { playHit } = useAudio.getState();
          playHit(); // Play hit sound as warning
          
          // Show warning message using the existing tip system
          set({
            showTipPopup: true,
            currentTip: 999 // Special ID for fire warning
          });
          
          // Auto-hide the warning after 4 seconds
          setTimeout(() => {
            const currentState = get();
            if (currentState.currentTip === 999) {
              set({ 
                showTipPopup: false,
                currentTip: null 
              });
            }
          }, 4000);
          
          return; // Don't complete the level
        }
        
        // All fires are extinguished, allow level completion
        console.log("All fires extinguished! Level complete!");
        get().completeLevel();
      }
    },

    collectItem: (itemId) => {
      const { currentLevel, levels, player, tipsCollected, itemsCollected } = get();
      const levelIndex = levels.findIndex(l => l.id === currentLevel);
      if (levelIndex === -1) return;

      const collectibleIndex = levels[levelIndex].collectibles.findIndex(
        c => c.id === itemId && !c.collected
      );

      if (collectibleIndex === -1) return;

      const collectible = levels[levelIndex].collectibles[collectibleIndex];

      // Update collectible as collected
      const updatedLevels = [...levels];
      updatedLevels[levelIndex].collectibles[collectibleIndex].collected = true;

      // Update player inventory or score based on item type
      let updatedPlayer = { ...player };
      let updatedScore = get().score;
      let updatedTipsCollected = [...tipsCollected];
      let updatedItemsCollected = itemsCollected + 1;

      switch (collectible.type) {
        case "extinguisher":
          updatedPlayer.inventory.extinguishers += 1;
          updatedScore += 50;
          break;
        case "mask":
          updatedPlayer.inventory.masks += 1;
          updatedScore += 30;
          break;
        case "tip":
          if (collectible.tipId && !tipsCollected.includes(collectible.tipId)) {
            updatedTipsCollected.push(collectible.tipId);
            updatedScore += 100;
            // Show tip popup
            get().showTip(collectible.tipId);
          }
          break;
        case "exit":
          // Exit is handled in movePlayer
          break;
      }

      const { playSuccess } = useAudio.getState();
      playSuccess(); // Play collection sound

      set({
        levels: updatedLevels,
        player: updatedPlayer,
        score: updatedScore,
        tipsCollected: updatedTipsCollected,
        itemsCollected: updatedItemsCollected
      });
    },

    extinguishFire: (fireId) => {
      const { currentLevel, levels, player, firesExtinguished } = get();
      const levelIndex = levels.findIndex(l => l.id === currentLevel);
      if (levelIndex === -1) return;

      // Check if player has extinguisher
      if (player.inventory.extinguishers <= 0) return;

      const fireIndex = levels[levelIndex].hazards.findIndex(
        f => f.id === fireId && !f.extinguished
      );

      if (fireIndex === -1) return;

      // Calculate distance to fire
      const fire = levels[levelIndex].hazards[fireIndex];
      const distance = Math.sqrt(
        Math.pow(player.position.x - fire.x, 2) + 
        Math.pow(player.position.y - fire.y, 2)
      );

      // Only extinguish if close enough
      if (distance <= 3) {
        const updatedLevels = [...levels];
        updatedLevels[levelIndex].hazards[fireIndex].extinguished = true;

        const { playHit } = useAudio.getState();
        playHit(); // Play extinguish sound

        // Award more points for larger fires
        const sizeBonus = Math.floor(fire.size * 50);
        const scoreIncrease = 100 + sizeBonus;

        // Generate a new extinguisher at a random location
        const level = updatedLevels[levelIndex];
        const spawnNewExtinguisher = () => {
          let attempts = 0;
          let newPosition;
          
          // Try to find a valid spawn position (not on obstacles, hazards, or other items)
          do {
            newPosition = {
              x: Math.floor(Math.random() * (level.mapWidth - 2)) + 1,
              y: Math.floor(Math.random() * (level.mapHeight - 2)) + 1
            };
            attempts++;
          } while (attempts < 50 && isPositionOccupied(newPosition, level));
          
          // If we found a valid position, spawn the extinguisher
          if (attempts < 50) {
            const newExtinguisher: CollectibleItem = {
              id: `ext_respawn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              x: newPosition.x,
              y: newPosition.y,
              type: "extinguisher",
              collected: false
            };
            
            level.collectibles.push(newExtinguisher);
            console.log(`New extinguisher spawned at (${newPosition.x}, ${newPosition.y})`);
            
            // Show notification to player
            get().showExtinguisherNotification(`🧯 New fire extinguisher spawned at (${newPosition.x}, ${newPosition.y})!`);
            
            // Auto-hide notification after 3 seconds
            setTimeout(() => {
              set({ 
                showNotification: false,
                notificationMessage: "" 
              });
            }, 3000);
          } else {
            console.log("Failed to find valid spawn position for new extinguisher");
            
            // Show fallback notification
            get().showExtinguisherNotification("🧯 New fire extinguisher spawned somewhere on the map!");
            
            // Auto-hide notification after 3 seconds
            setTimeout(() => {
              set({ 
                showNotification: false,
                notificationMessage: "" 
              });
            }, 3000);
          }
        };

        // Helper function to check if a position is occupied
        const isPositionOccupied = (pos: {x: number, y: number}, level: any) => {
          // Check if position is too close to player
          const playerDistance = Math.sqrt(
            Math.pow(player.position.x - pos.x, 2) + 
            Math.pow(player.position.y - pos.y, 2)
          );
          if (playerDistance < 2) return true;

          // Check obstacles
          for (const obstacle of level.obstacles) {
            if (pos.x >= obstacle.x && pos.x < obstacle.x + obstacle.width &&
                pos.y >= obstacle.y && pos.y < obstacle.y + obstacle.height) {
              return true;
            }
          }

          // Check active fires
          for (const hazard of level.hazards) {
            if (!hazard.extinguished) {
              const hazardDistance = Math.sqrt(
                Math.pow(hazard.x - pos.x, 2) + 
                Math.pow(hazard.y - pos.y, 2)
              );
              if (hazardDistance < 2) return true;
            }
          }

          // Check existing collectibles
          for (const collectible of level.collectibles) {
            if (!collectible.collected) {
              const collectibleDistance = Math.sqrt(
                Math.pow(collectible.x - pos.x, 2) + 
                Math.pow(collectible.y - pos.y, 2)
              );
              if (collectibleDistance < 1.5) return true;
            }
          }

          // Check exit position
          const exitDistance = Math.sqrt(
            Math.pow(level.exitPosition.x - pos.x, 2) + 
            Math.pow(level.exitPosition.y - pos.y, 2)
          );
          if (exitDistance < 2) return true;

          return false;
        };

        // Spawn new extinguisher
        spawnNewExtinguisher();

        set({
          levels: updatedLevels,
          player: {
            ...player,
            inventory: {
              ...player.inventory,
              extinguishers: player.inventory.extinguishers - 1,
            },
          },
          score: get().score + scoreIncrease,
          firesExtinguished: firesExtinguished + 1,
        });
      }
    },

    completeLevel: () => {
      const { 
        currentLevel, 
        levels, 
        timeRemaining, 
        player, 
        score, 
        tipsCollected, 
        firesExtinguished, 
        itemsCollected,
        highScores
      } = get();

      const { playSuccess } = useAudio.getState();
      playSuccess(); // Play success sound

      // Mark current level as completed
      const updatedLevels = levels.map(level => 
        level.id === currentLevel ? { ...level, completed: true } : level
      );

      // Calculate bonus points based on remaining time and health
      const timeBonus = Math.floor(timeRemaining * 5);
      const healthBonus = Math.floor(player.health * 2);
      const totalScore = score + timeBonus + healthBonus;

      // Record high score
      const newScore: LevelScore = {
        levelId: currentLevel,
        score: totalScore,
        completionTime: timeRemaining,
        firesExtinguished,
        itemsCollected,
        tipsFound: tipsCollected.length,
        timestamp: Date.now()
      };

      // Add to high scores
      const updatedHighScores = [...highScores, newScore];

      set({
        phase: "levelComplete",
        levels: updatedLevels,
        score: totalScore,
        highScores: updatedHighScores,
      });

      // Unlock next level if available
      get().unlockNextLevel();
    },

    restartLevel: () => {
      const { currentLevel, levels } = get();
      const level = levels.find(l => l.id === currentLevel);
      if (!level) return;

      set({
        phase: "playing",
        player: {
          position: { ...level.startPosition },
          inventory: {
            extinguishers: 0,
            masks: 0,
          },
          health: 100,
          oxygenLevel: 100,
        },
        timeRemaining: level.timeLimit,
        score: 0,
        itemsCollected: 0,
        firesExtinguished: 0,
        tipsCollected: [],
      });
    },

    gameOver: () => {
      set({ phase: "gameOver" });
    },

    exitLevel: () => {
      set({ phase: "menu" });
    },

    decreaseTime: () => {
      const { timeRemaining, phase } = get();
      if (phase !== "playing") return;

      if (timeRemaining <= 0) {
        get().gameOver();
        return;
      }

      set({ timeRemaining: timeRemaining - 1 });
    },

    showTip: (tipId) => {
      set({ 
        showTipPopup: true,
        currentTip: tipId,
      });
    },

    hideTip: () => {
      set({ 
        showTipPopup: false,
        currentTip: null,
      });
    },

    updatePlayerOxygen: (amount) => {
      const { player, phase } = get();
      if (phase !== "playing") return;

      const newOxygen = Math.max(0, Math.min(100, player.oxygenLevel + amount));

      // If oxygen reaches 0, decrease health
      if (newOxygen <= 0) {
        const newHealth = player.health - 5;

        if (newHealth <= 0) {
          set({
            player: {
              ...player,
              oxygenLevel: 0,
              health: 0,
            },
          });
          get().gameOver();
          return;
        }

        set({
          player: {
            ...player,
            oxygenLevel: 0,
            health: newHealth,
          },
        });
      } else {
        set({
          player: {
            ...player,
            oxygenLevel: newOxygen,
          },
        });
      }
    },

    updatePlayerHealth: (amount: number) => {
      const { player, phase } = get();
      if (phase !== "playing") return;

      const newHealth = Math.max(0, Math.min(100, player.health + amount));
      
      if (newHealth <= 0) {
        set({
          player: {
            ...player,
            health: 0
          }
        });
        get().gameOver();
        return;
      }

      set({
        player: {
          ...player,
          health: newHealth
        }
      });
    },

    unlockNextLevel: () => {
      const { currentLevel, levels } = get();
      const nextLevelId = currentLevel + 1;

      const nextLevelIndex = levels.findIndex(l => l.id === nextLevelId);
      if (nextLevelIndex === -1) return; // No next level

      const updatedLevels = [...levels];
      updatedLevels[nextLevelIndex].unlocked = true;

      set({ levels: updatedLevels });
    },

    // Get high scores for a specific level, sorted by score (highest first)
    getHighScores: (levelId: number) => {
      const { highScores } = get();
      return highScores
        .filter(score => score.levelId === levelId)
        .sort((a, b) => b.score - a.score);
    },

    showExtinguisherNotification: (message: string) => {
      set({
        showNotification: true,
        notificationMessage: message,
      });
    },
  }))
);