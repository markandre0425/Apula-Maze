import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { FireHazard as FireHazardType } from "@/lib/stores/useFireSafetyGame";
import ParticleSystem from "./ParticleSystem";

interface FireHazardProps {
  hazard: FireHazardType;
  onClick: () => void;
}

const FireHazard: React.FC<FireHazardProps> = ({ hazard, onClick }) => {
  const fireRef = useRef<THREE.Group>(null);
  const animationRef = useRef(0);
  
  // Track whether fire was just extinguished
  const [justExtinguished, setJustExtinguished] = useState(false);
  
  // Set justExtinguished to true when hazard becomes extinguished
  useEffect(() => {
    if (hazard.extinguished) {
      setJustExtinguished(true);
      // Reset after 2 seconds
      const timer = setTimeout(() => setJustExtinguished(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hazard.extinguished]);
  
  // Animate the fire with flickering and movement
  useFrame((_, delta) => {
    if (!fireRef.current || hazard.extinguished) return;
    
    animationRef.current += delta * 5;
    
    // Make the fire flicker and dance
    fireRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        child.position.y = Math.sin(animationRef.current + i) * 0.1 + 0.5;
        child.rotation.y += delta * 0.5;
        
        // Randomly scale the fire particles
        const scale = 0.8 + Math.sin(animationRef.current * 2 + i) * 0.2;
        child.scale.set(scale, scale, scale);
      }
    });
  });

  if (hazard.extinguished) {
    return (
      <group position={[hazard.x, 0, hazard.y]}>
        {/* Extinguished fire with smoke */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[hazard.size * 1.2, hazard.size * 1.2]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.4} />
        </mesh>
        
        {/* Smoke particles continue for a while after extinguishing */}
        {justExtinguished && (
          <ParticleSystem 
            position={[0, 0.2, 0]} 
            type="smoke" 
            count={25} 
            scale={hazard.size * 0.8}
          />
        )}
      </group>
    );
  }

  return (
    <group 
      ref={fireRef}
      position={[hazard.x, 0, hazard.y]}
      onClick={onClick}
    >
      {/* Fire base */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[hazard.size / 2, hazard.size / 1.5, 0.1, 16]} />
        <meshStandardMaterial 
          color="#ff3700" 
          emissive="#ff2200"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Traditional Fire particles - keep for solid appearance */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * hazard.size * 0.8,
            0.3 + i * 0.2,
            (Math.random() - 0.5) * hazard.size * 0.8
          ]}
          castShadow
        >
          <coneGeometry args={[hazard.size / 4, hazard.size / 2, 8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#ff7700" : "#ffcc00"} 
            emissive={i % 2 === 0 ? "#ff5500" : "#ffaa00"}
            emissiveIntensity={0.7}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Advanced particle system for fire */}
      <ParticleSystem 
        position={[0, 0.2, 0]} 
        type="fire" 
        count={30} 
        scale={hazard.size}
        color="#ff6600"
      />
      
      {/* Add some smoke particles above the fire */}
      <ParticleSystem 
        position={[0, hazard.size * 0.6, 0]} 
        type="smoke" 
        count={15} 
        scale={hazard.size * 0.7}
      />
      
      {/* Light source from fire */}
      <pointLight 
        color="#ff6600" 
        intensity={3} 
        distance={hazard.size * 8} 
        decay={2}
        position={[0, 0.7, 0]} 
      />
    </group>
  );
};

export default FireHazard;
