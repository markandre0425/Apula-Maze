import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CollectibleItemProps {
  type: "extinguisher" | "mask" | "tip" | "exit";
  position: [number, number, number];
  onClick: () => void;
  canExit?: boolean; // New prop to indicate if exit is available
}

const CollectibleItem: React.FC<CollectibleItemProps> = ({ type, position, onClick, canExit = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);

  // Animate the item floating and rotating
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    rotationRef.current += delta;
    groupRef.current.rotation.y = rotationRef.current;
    groupRef.current.position.y = position[1] + Math.sin(rotationRef.current * 2) * 0.1;
  });

  const getModel = () => {
    switch (type) {
      case "extinguisher":
        return (
          <group>
            {/* Fire Extinguisher Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
              <meshStandardMaterial color="#ff0000" />
            </mesh>
            {/* Handle */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.1, 0.2, 0.1]} />
              <meshStandardMaterial color="#880000" />
            </mesh>
            {/* Nozzle */}
            <mesh position={[0, -0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
              <meshStandardMaterial color="#880000" />
            </mesh>
          </group>
        );

      case "mask":
        return (
          <group>
            {/* Mask Body */}
            <mesh castShadow>
              <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#0055ff" transparent opacity={0.8} />
            </mesh>
            {/* Strap */}
            <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.3, 0.05, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#003388" />
            </mesh>
            {/* Filter */}
            <mesh position={[0, 0.1, 0.2]} castShadow>
              <boxGeometry args={[0.15, 0.15, 0.1]} />
              <meshStandardMaterial color="#003388" />
            </mesh>
          </group>
        );

      case "tip":
        return (
          <group>
            {/* Glowing Base */}
            <mesh position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
              <meshStandardMaterial 
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Scroll Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
              <meshStandardMaterial 
                color="#ffcc00"
                emissive="#ffcc00"
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Scroll Top */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
              <meshStandardMaterial 
                color="#ffdd44"
                emissive="#ffdd44"
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Scroll Bottom */}
            <mesh position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
              <meshStandardMaterial 
                color="#ffdd44"
                emissive="#ffdd44"
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Question Mark with Glow */}
            <Text
              position={[0, 0, 0.16]}
              rotation={[0, 0, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor="#885500"
            >
              ?
            </Text>
            
            {/* Floating Particles */}
            <group>
              {[...Array(8)].map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    Math.cos(i * Math.PI / 4) * 0.3,
                    Math.sin(rotationRef.current * 2 + i) * 0.1,
                    Math.sin(i * Math.PI / 4) * 0.3
                  ]}
                  scale={0.05}
                >
                  <sphereGeometry args={[1, 8, 8]} />
                  <meshStandardMaterial 
                    color="#ffcc00"
                    emissive="#ffcc00"
                    emissiveIntensity={0.8}
                  />
                </mesh>
              ))}
            </group>
          </group>
        );

      case "exit":
        const exitColor = canExit ? "#00aa00" : "#aa0000";
        const exitEmissive = canExit ? "#00aa00" : "#aa0000";
        const exitText = canExit ? "EXIT" : "LOCKED";
        const textColor = canExit ? "#ffffff" : "#ffaaaa";
        const outlineColor = canExit ? "#006600" : "#660000";
        
        return (
          <group>
            {/* Floating Exit Text */}
            <Text
              position={[0, 3, 0]}
              rotation={[0, 0, 0]}
              fontSize={1.2}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.3}
              outlineColor={outlineColor}
              fontWeight="bold"
            >
              {exitText}
            </Text>

            {/* Status Message */}
            {!canExit && (
              <Text
                position={[0, 2.2, 0]}
                rotation={[0, 0, 0]}
                fontSize={0.6}
                color="#ffaaaa"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.2}
                outlineColor="#660000"
                fontWeight="bold"
              >
                Extinguish all fires first!
              </Text>
            )}

            {/* Exit Door Frame */}
            <mesh castShadow>
              <boxGeometry args={[1.5, 2.5, 0.2]} />
              <meshStandardMaterial color={exitColor} />
            </mesh>
            {/* Exit Door */}
            <mesh position={[0, 0, 0.1]} castShadow>
              <boxGeometry args={[1.3, 2.3, 0.1]} />
              <meshStandardMaterial color={canExit ? "#00cc00" : "#cc0000"} />
            </mesh>
            
            {/* Large Exit Sign */}
            <group position={[0, 1.5, 0.2]}>
              {/* Sign Background */}
              <mesh>
                <boxGeometry args={[2, 1, 0.1]} />
                <meshStandardMaterial 
                  color={exitColor}
                  emissive={exitEmissive}
                  emissiveIntensity={canExit ? 0.5 : 0.3}
                />
              </mesh>
              
              {/* Exit Text */}
              <Text
                position={[0, 0, 0.06]}
                rotation={[0, 0, 0]}
                fontSize={0.8}
                color={textColor}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.2}
                outlineColor={outlineColor}
                fontWeight="bold"
              >
                {exitText}
              </Text>
              
              {/* Glowing Effect */}
              <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[2.2, 1.2, 0.05]} />
                <meshBasicMaterial 
                  color={canExit ? "#00ff00" : "#ff0000"}
                  transparent
                  opacity={canExit ? 0.2 : 0.15}
                />
              </mesh>
            </group>
            
            {/* Arrow Indicators - only show if exit is available */}
            {canExit && (
              <group position={[0, -0.8, 0.2]}>
                <mesh rotation={[0, 0, Math.PI / 4]}>
                  <boxGeometry args={[0.4, 0.1, 0.1]} />
                  <meshStandardMaterial 
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.5}
                  />
                </mesh>
                <mesh rotation={[0, 0, -Math.PI / 4]}>
                  <boxGeometry args={[0.4, 0.1, 0.1]} />
                  <meshStandardMaterial 
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            )}

            {/* Blocked indicators - show X if exit is blocked */}
            {!canExit && (
              <group position={[0, -0.8, 0.2]}>
                <mesh rotation={[0, 0, Math.PI / 4]}>
                  <boxGeometry args={[0.6, 0.1, 0.1]} />
                  <meshStandardMaterial 
                    color="#ff0000"
                    emissive="#ff0000"
                    emissiveIntensity={0.5}
                  />
                </mesh>
                <mesh rotation={[0, 0, -Math.PI / 4]}>
                  <boxGeometry args={[0.6, 0.1, 0.1]} />
                  <meshStandardMaterial 
                    color="#ff0000"
                    emissive="#ff0000"
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            )}
          </group>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
    >
      {getModel()}
      {type !== "exit" && (
        <group position={[0, 1, 0]}>
          {/* Background plane for better text visibility */}
          {type === "tip" && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.2, 0.5]} />
              <meshBasicMaterial color="#885500" transparent opacity={0.8} />
            </mesh>
          )}
          <Text
            position={[0, 0, 0]}
            color="#ffffff"
            fontSize={0.35}
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.15}
            outlineColor={
              type === "extinguisher" ? "#882200" :
              type === "mask" ? "#003388" :
              "#885500"
            }
          >
            {type === "extinguisher" ? "Extinguisher" :
             type === "mask" ? "Mask" :
             "Safety Tip"}
          </Text>
        </group>
      )}
    </group>
  );
};

export default CollectibleItem; 