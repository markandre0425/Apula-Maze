import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import Character from "./Character";
import FireHazard from "./FireHazard";
import ParticleSystem from "./ParticleSystem";
import { useFireSafetyGame } from "@/lib/stores/useFireSafetyGame";
import HUD from "./HUD";
import { useKeyboardControls } from "@react-three/drei";
import CollectibleItem from './CollectibleItem';

enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  interact = 'interact',
}

const keyMap = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.interact, keys: ['Space', 'KeyE'] },
];

interface GameWorldProps {
  levelId: number;
}

const GameWorld: React.FC<GameWorldProps> = ({ levelId }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [extinguisherEffect, setExtinguisherEffect] = useState<{
    active: boolean;
    position: [number, number, number];
    direction: [number, number, number];
  } | null>(null);

  const {
    player,
    levels,
    currentLevel,
    movePlayer,
    extinguishFire,
    collectItem,
    updatePlayerOxygen,
    updatePlayerHealth, // Added health update function
  } = useFireSafetyGame();

  // Find current level data
  const level = levels.find(l => l.id === currentLevel);

  // COMPLETELY REBUILT movement system from scratch
  useEffect(() => {
    if (!level) return;

    console.log("Character position:", player.position);
    console.log("Level dimensions:", level.mapWidth, level.mapHeight);

    // This function will convert user input to an intended movement direction
    // and pass it to the movement handler
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Key pressed:", e.code);

      // Disable default scrolling behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      const speed = 0.5; // Movement speed
      let dx = 0; // Change in X
      let dy = 0; // Change in Y

      // IMPORTANT: We're using a top-down 2D coordinate system:
      // +X = RIGHT, -X = LEFT
      // +Y = DOWN, -Y = UP

      // THIS IS CRITICAL: Our game and THREE.js coordinates are:
      // Game (X,Y) → THREE.js (X,Z)
      // Since we're using a top-down view, we need to:
      // - W/Up should DECREASE Y (move UP on the screen)
      // - S/Down should INCREASE Y (move DOWN on the screen)
      // - A/Left should DECREASE X (move LEFT on the screen)
      // - D/Right should INCREASE X (move RIGHT on the screen)

      // INVERSED DIRECTION MAPPING based on screen orientation
      // This is the key fix: inverting the coordinate changes to match what the user sees on screen
      switch(e.code) {
        case 'KeyW':
        case 'ArrowUp':
          // Move UP on screen = DECREASE Z in Three.js (our Y in game logic)
          console.log("UP key pressed - moving toward TOP of screen");
          dy = -speed; // Move up on screen (decrease Y coordinate)
          break;

        case 'KeyS':
        case 'ArrowDown':
          // Move DOWN on screen = INCREASE Z in Three.js (our Y in game logic)
          console.log("DOWN key pressed - moving toward BOTTOM of screen");
          dy = speed; // Move down on screen (increase Y coordinate)
          break;

        case 'KeyA':
        case 'ArrowLeft':
          // Move LEFT on screen = DECREASE X in Three.js (our X in game logic)
          console.log("LEFT key pressed - moving toward LEFT side of screen");
          dx = -speed; // Move left on screen (decrease X coordinate)
          break;

        case 'KeyD':
        case 'ArrowRight':
          // Move RIGHT on screen = INCREASE X in Three.js (our X in game logic)
          console.log("RIGHT key pressed - moving toward RIGHT side of screen"); 
          dx = speed; // Move right on screen (increase X coordinate)
          break;

        case 'KeyF': // New key for fire extinguisher
          console.log("EXTINGUISHER key pressed");
          if (player.inventory.extinguishers > 0) {
            // Find the closest active fire
            const activeHazards = level.hazards.filter(h => !h.extinguished);
            let closestHazard = null;
            let minDistance = Infinity;

            for (const hazard of activeHazards) {
              const distance = Math.sqrt(
                Math.pow(player.position.x - hazard.x, 2) + 
                Math.pow(player.position.y - hazard.y, 2)
              );

              if (distance < 3 && distance < minDistance) {
                minDistance = distance;
                closestHazard = hazard;
              }
            }

            if (closestHazard) {
              // Calculate direction vector from player to fire
              const dirX = closestHazard.x - player.position.x;
              const dirY = closestHazard.y - player.position.y;
              // Normalize the direction
              const length = Math.sqrt(dirX * dirX + dirY * dirY);
              const normalizedDir: [number, number, number] = [
                dirX / length,
                0, // Y direction in 3D space
                dirY / length
              ];

              // Set extinguisher effect
              setExtinguisherEffect({
                active: true, 
                position: [player.position.x, 0.5, player.position.y],
                direction: normalizedDir
              });

              // Show effect for 1 second
              setTimeout(() => {
                setExtinguisherEffect(null);
              }, 1000);

              // Extinguish the fire
              extinguishFire(closestHazard.id);
            }
          }
          break;

        case 'Space':
        case 'KeyE':
          // Interact with nearby items
          console.log("INTERACT key pressed");
          const collectibles = level.collectibles.filter(item => !item.collected);
          for (const item of collectibles) {
            const distance = Math.sqrt(
              Math.pow(player.position.x - item.x, 2) + 
              Math.pow(player.position.y - item.y, 2)
            );
            if (distance < 1.5) {
              collectItem(item.id);
              break;
            }
          }
          break;
      }

      // Apply movement if direction keys were pressed
      if (dx !== 0 || dy !== 0) {
        console.log(`Moving player by dx=${dx}, dy=${dy}`);
        console.log("BEFORE movement, player at:", player.position);

        movePlayer(dx, dy);
        setIsMoving(true);

        // Added a small delay to check the position after movement
        setTimeout(() => {
          console.log("AFTER movement, player at:", player.position);
        }, 100);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Stop character movement animation when keys are released
      if (['KeyW', 'ArrowUp', 'KeyS', 'ArrowDown', 'KeyA', 'ArrowLeft', 'KeyD', 'ArrowRight'].includes(e.code)) {
        console.log("Movement key released:", e.code);
        setIsMoving(false);
      }
    };

    // Register event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [level, player.position, movePlayer, collectItem]);

  // Update oxygen levels based on proximity to fires
  useEffect(() => {
    if (!level) return;

    const updateInterval = setInterval(() => {
      // Calculate proximity to active fires
      const activeHazards = level.hazards.filter(h => !h.extinguished);
      let totalFireProximity = 0;

      for (const hazard of activeHazards) {
        const distance = Math.sqrt(
          Math.pow(player.position.x - hazard.x, 2) + 
          Math.pow(player.position.y - hazard.y, 2)
        );

        // Enhanced damage zones
        if (distance < 1.0) {
          // Critical zone - severe damage
          updatePlayerHealth(-3);
        } else if (distance < 2.0) {
          // Danger zone - moderate damage
          updatePlayerHealth(-1);
          totalFireProximity += (2 - distance) * hazard.size;
        } else if (distance < 3) {
          // Warning zone - minor damage
          totalFireProximity += (3 - distance) * hazard.size;
        }
      }

      // Calculate oxygen change rate
      let oxygenChange = 0;

      if (totalFireProximity > 0) {
        // Decrease oxygen based on fire proximity
        oxygenChange = -totalFireProximity * 2;

        // If wearing a mask, reduce the oxygen depletion rate
        if (player.inventory.masks > 0) {
          oxygenChange = oxygenChange / 2;
        }
      } else {
        // Slowly recover oxygen when away from fires
        oxygenChange = 1;
      }

      updatePlayerOxygen(oxygenChange);
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [level, player.position, player.inventory.masks, updatePlayerOxygen, updatePlayerHealth]);

  if (!level) return null;

  return (
    <div className="w-full h-full relative">
      <Canvas shadows>
        {/* Orthographic camera for 2D-style view - reconfigured for true top-down view */}
        <OrthographicCamera
          makeDefault
          position={[level.mapWidth / 2, 20, level.mapHeight / 2]} // Centered on map
          zoom={40} // Increased zoom for better visibility
          near={0.1}
          far={1000}
          up={[0, 0, -1]} // This ensures "up" in the scene is actually "up" on screen
          rotation={[-Math.PI / 2, 0, 0]} // Look straight down
        />

        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[level.mapWidth / 2, 15, level.mapHeight / 2]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <hemisphereLight 
          args={["#bbeeff", "#ffe0bb", 0.5]} 
          position={[level.mapWidth / 2, 50, level.mapHeight / 2]} 
        />

        {/* Floor - properly centered to align with gameplay grid */}
        <group position={[level.mapWidth / 2, 0, level.mapHeight / 2]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[level.mapWidth, level.mapHeight]} />
            <meshStandardMaterial color="#a38566" roughness={0.7} />
          </mesh>
          {/* Guidelines to show coordinate system for debugging */}
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[level.mapWidth, 0.1]} />
            <meshBasicMaterial color="red" opacity={0.5} transparent />
          </mesh>
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, level.mapHeight]} />
            <meshBasicMaterial color="blue" opacity={0.5} transparent />
          </mesh>
        </group>

        {/* Walls and obstacles */}
        {level.obstacles.map((obstacle, index) => (
          <mesh
            key={index}
            position={[
              obstacle.x + obstacle.width / 2,
              1.0, // Increased height to match character
              obstacle.y + obstacle.height / 2,
            ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[obstacle.width, 2.0, obstacle.height]} /> {/* Taller walls */}
            <meshStandardMaterial color="#555555" />
          </mesh>
        ))}

        {/* Exit marker */}
        <CollectibleItem
          type="exit"
          position={[level.exitPosition.x, 0, level.exitPosition.y]}
          onClick={() => {}}
          canExit={level.hazards.every(h => h.extinguished)}
        />

        {/* Collectible items */}
        {level.collectibles.filter(item => !item.collected).map((item) => (
          <CollectibleItem
            key={item.id}
            type={item.type}
            position={[item.x, 0.5, item.y]}
            onClick={() => {
              const distance = Math.sqrt(
                Math.pow(player.position.x - item.x, 2) + 
                Math.pow(player.position.y - item.y, 2)
              );
              if (distance < 1.5) {
                collectItem(item.id);
              }
            }}
          />
        ))}

        {/* Fire hazards */}
        {level.hazards.map((hazard) => (
          <FireHazard
            key={hazard.id}
            hazard={hazard}
            onClick={() => {
              const distance = Math.sqrt(
                Math.pow(player.position.x - hazard.x, 2) + 
                Math.pow(player.position.y - hazard.y, 2)
              );
              if (distance < 3 && !hazard.extinguished && player.inventory.extinguishers > 0) {
                // Calculate direction vector from player to fire
                const dirX = hazard.x - player.position.x;
                const dirY = hazard.y - player.position.y;
                // Normalize the direction
                const length = Math.sqrt(dirX * dirX + dirY * dirY);
                const normalizedDir: [number, number, number] = [
                  dirX / length,
                  0, // Y direction in 3D space
                  dirY / length
                ];

                // Set extinguisher effect with player position and direction to fire
                setExtinguisherEffect({
                  active: true, 
                  position: [player.position.x, 0.5, player.position.y],
                  direction: normalizedDir
                });

                // Show effect for 1 second
                setTimeout(() => {
                  setExtinguisherEffect(null);
                }, 1000);

                // Extinguish the fire
                extinguishFire(hazard.id);
              }
            }}
          />
        ))}

        {/* Extinguisher particle effect */}
        {extinguisherEffect && extinguisherEffect.active && (
          <group position={extinguisherEffect.position}>
            <ParticleSystem
              position={[
                extinguisherEffect.direction[0] * 0.5, 
                0.3, 
                extinguisherEffect.direction[2] * 0.5
              ]}
              type="extinguish"
              count={50}
              scale={1.5}
              color="#aaddff"
            />
          </group>
        )}

        {/* Player character */}
        <Character 
          position={player.position} 
          isMoving={isMoving} 
          isUsingExtinguisher={extinguisherEffect?.active || false}
          extinguisherDirection={extinguisherEffect?.direction}
          hasExtinguisher={player.inventory.extinguishers > 0}
        />

        {/* Limited controls for camera adjustment */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={false}
          minZoom={15}
          maxZoom={50}
          target={[level.mapWidth / 2, 0, level.mapHeight / 2]}
        />
      </Canvas>

      {/* Heads-up display */}
      <HUD />
    </div>
  );
};

export default GameWorld;