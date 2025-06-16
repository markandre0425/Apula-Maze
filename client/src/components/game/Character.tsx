import React, { useRef, Suspense, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { PlayerPosition } from "@/lib/stores/useFireSafetyGame";

// Preload the model
useGLTF.preload('/models/firefighter.glb');

interface CharacterProps {
  position: PlayerPosition;
  isMoving: boolean;
  isUsingExtinguisher?: boolean;
  extinguisherDirection?: [number, number, number];
  hasExtinguisher?: boolean;
}

const Character: React.FC<CharacterProps> = ({ position, isMoving, isUsingExtinguisher, extinguisherDirection, hasExtinguisher }) => {
  const characterRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const extinguisherRef = useRef<THREE.Group>(null);
  const moveAnimationRef = useRef(0);
  const [previousPosition, setPreviousPosition] = useState<PlayerPosition>(position);
  const [rotationY, setRotationY] = useState(0);
  const extinguisherAnimation = useRef(0);
  
  // Load the character model
  const { scene: characterModel, animations } = useGLTF('/models/firefighter.glb');
  const { actions, mixer } = useAnimations(animations, modelRef);
  
  // Handle movement direction and rotation
  useEffect(() => {
    if (isUsingExtinguisher && extinguisherDirection) {
      // Face the direction of extinguisher spray
      const angle = Math.atan2(extinguisherDirection[2], extinguisherDirection[0]);
      setRotationY(angle - Math.PI / 2);
    } else {
      const deltaX = position.x - previousPosition.x;
      const deltaY = position.y - previousPosition.y;
      
      if (Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01) {
        // Calculate rotation based on movement direction
        const angle = Math.atan2(deltaY, deltaX);
        setRotationY(angle - Math.PI / 2); // Adjust for model's forward direction
      }
    }
    
    setPreviousPosition(position);
  }, [position, previousPosition, isUsingExtinguisher, extinguisherDirection]);
  
  // Handle animations
  useEffect(() => {
    if (!actions) return;
    
    // Try to find appropriate animations from the model
    const walkAction = actions.Walk || actions.walk || actions.Running || actions.run || actions.Idle || Object.values(actions)[0];
    
    if (isUsingExtinguisher) {
      // Stop walking animation when using extinguisher
      if (walkAction) {
        walkAction.stop();
      }
    } else if (isMoving && walkAction) {
      walkAction.play();
      walkAction.setLoop(THREE.LoopRepeat, Infinity);
      walkAction.timeScale = 1.5; // Speed up the animation
    } else if (walkAction) {
      walkAction.stop();
    }
    
    return () => {
      if (walkAction) {
        walkAction.stop();
      }
    };
  }, [isMoving, isUsingExtinguisher, actions]);
  
  useFrame((_, delta) => {
    if (!characterRef.current || !modelRef.current) return;
    
    // Update animation mixer
    if (mixer) {
      mixer.update(delta);
    }
    
    if (isUsingExtinguisher) {
      // Extinguisher usage animation
      extinguisherAnimation.current += delta * 10;
      
      // Add recoil effect - slight backward lean and shake
      const recoilIntensity = 0.1;
      const shake = Math.sin(extinguisherAnimation.current) * recoilIntensity;
      
      // Lean back slightly when using extinguisher
      modelRef.current.rotation.x = -0.1 + shake * 0.5;
      
      // Add slight side-to-side shake for recoil
      modelRef.current.position.x = shake * 0.02;
      modelRef.current.position.z = Math.cos(extinguisherAnimation.current * 1.2) * 0.01;
      
      // Stance adjustment - spread legs slightly
      characterRef.current.position.y = 0.45; // Lower stance
      
      // Animate extinguisher if visible
      if (extinguisherRef.current) {
        // Add spray recoil to extinguisher
        extinguisherRef.current.rotation.x = shake * 0.3;
        extinguisherRef.current.position.y = 0.8 + shake * 0.05;
      }
      
    } else if (isMoving) {
      // Normal walking animation
      moveAnimationRef.current += delta * 8;
      characterRef.current.position.y = Math.sin(moveAnimationRef.current) * 0.05 + 0.5;
      
      // Add walking bob to the model
      modelRef.current.position.y = Math.sin(moveAnimationRef.current * 2) * 0.02;
      modelRef.current.rotation.x = 0; // Reset rotation
      modelRef.current.position.x = 0; // Reset position
      modelRef.current.position.z = 0;
      
      // Reset extinguisher animation
      extinguisherAnimation.current = 0;
      
    } else {
      // Idle state
      moveAnimationRef.current = 0;
      extinguisherAnimation.current = 0;
      characterRef.current.position.y = 0.5;
      modelRef.current.position.y = 0;
      modelRef.current.rotation.x = 0;
      modelRef.current.position.x = 0;
      modelRef.current.position.z = 0;
    }
    
    // Smooth rotation towards target direction
    if (modelRef.current.rotation.y !== rotationY) {
      const currentRotation = modelRef.current.rotation.y;
      const targetRotation = rotationY;
      
      // Handle rotation wrapping
      let diff = targetRotation - currentRotation;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      if (diff < -Math.PI) diff += 2 * Math.PI;
      
      modelRef.current.rotation.y += diff * delta * 10; // Smooth rotation
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
      <Suspense fallback={
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.2, 0.8]} /> {/* Smaller collision box */}
          <meshStandardMaterial color="#4287f5" />
        </mesh>
      }>
        <group ref={modelRef} scale={[2.0, 2.0, 2.0]} position={[0, -0.5, 0]}>
          <primitive object={characterModel.clone()} castShadow receiveShadow />
        </group>
      </Suspense>
      
      {/* Character highlight (to make it more visible) */}
      <pointLight color="#ffffff" intensity={0.8} distance={2} decay={2} position={[0, 1, 0]} />
      
      {/* Fire Extinguisher - visible when character has one */}
      {hasExtinguisher && (
        <group ref={extinguisherRef} position={[0.3, 0.8, 0.2]}>
          {/* Extinguisher body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
            <meshStandardMaterial color="#ff0000" />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.04, 0.08, 0.04]} />
            <meshStandardMaterial color="#880000" />
          </mesh>
          {/* Nozzle */}
          <mesh position={[0, -0.15, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
            <meshStandardMaterial color="#880000" />
          </mesh>
          {/* Hose */}
          <mesh position={[0, -0.1, 0.08]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      )}
      
      {/* Text label floating above character */}
      <Text
        position={[0, 2.5, 0]}
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
