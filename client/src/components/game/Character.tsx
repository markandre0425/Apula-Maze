import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { PlayerPosition } from "@/lib/stores/useFireSafetyGame";

interface CharacterProps {
  position: PlayerPosition;
  isMoving: boolean;
}

const Character: React.FC<CharacterProps> = ({ position, isMoving }) => {
  const characterRef = useRef<THREE.Group>(null);
  const moveAnimationRef = useRef(0);
  
  // Simple bobbing animation when moving
  useFrame((_, delta) => {
    if (!characterRef.current) return;
    
    if (isMoving) {
      moveAnimationRef.current += delta * 5;
      characterRef.current.position.y = Math.sin(moveAnimationRef.current) * 0.1 + 0.5;
    } else {
      moveAnimationRef.current = 0;
      characterRef.current.position.y = 0.5;
    }
  });

  // Map the player's 2D game coordinates to the 3D world
  // In THREE.js, the y-axis goes up, and z-axis is like the y-axis in 2D games
  // This means we need to: 
  // - x from game → x in THREE.js
  // - y from game → z in THREE.js
  
  return (
    <group 
      ref={characterRef}
      position={[position.x, 0.5, position.y]} // x, y, z in THREE.js (where y is up)
    >
      {/* Character body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#4287f5" emissive="#2255dd" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Character head */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#f7d9c4" />
      </mesh>
      
      {/* Character highlight (to make it more visible) */}
      <pointLight color="#ffffff" intensity={0.8} distance={2} decay={2} position={[0, 1, 0]} />
      
      {/* Text label floating above character */}
      <Text
        position={[0, 1.8, 0]}
        color="white"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        YOU
      </Text>
    </group>
  );
};

export default Character;
