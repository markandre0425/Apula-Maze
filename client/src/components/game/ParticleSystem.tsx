import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  count?: number;
  position: [number, number, number];
  scale?: number;
  color?: string;
  type: 'fire' | 'smoke' | 'extinguish';
  active?: boolean;
}

const ParticleSystem: React.FC<ParticleProps> = ({
  count = 50,
  position,
  scale = 1,
  color,
  type = 'fire',
  active = true,
}) => {
  // Refs to hold and update particles
  const particlesRef = useRef<THREE.Points>(null);
  const particlesGeometryRef = useRef<THREE.BufferGeometry>(null);
  
  // Create particles
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Randomize initial positions
      const x = (Math.random() - 0.5) * scale;
      const y = Math.random() * scale;
      const z = (Math.random() - 0.5) * scale;
      
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
      
      // Size based on particle type
      if (type === 'fire') {
        sizes[i] = 0.5 + Math.random() * 0.5;
      } else if (type === 'smoke') {
        sizes[i] = 0.3 + Math.random() * 0.7;
      } else if (type === 'extinguish') {
        sizes[i] = 0.2 + Math.random() * 0.4;
      }
      
      // Speed and lifetime
      speeds[i] = 0.03 + Math.random() * 0.05;
      lifetimes[i] = Math.random(); // Random initial lifetime
    }
    
    return { positions: temp, sizes, speeds, lifetimes };
  }, [count, scale, type]);
  
  // Set up texture based on particle type
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    // Draw appropriate particle texture
    if (type === 'fire') {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 130, 60, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 60, 30, 0.5)');
      gradient.addColorStop(1, 'rgba(180, 30, 30, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    } else if (type === 'smoke') {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(180, 180, 180, 0.9)');
      gradient.addColorStop(0.5, 'rgba(150, 150, 150, 0.6)');
      gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    } else if (type === 'extinguish') {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(220, 240, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(200, 230, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [type]);
  
  // Main animation loop - simplified to avoid TypeScript issues with Float32Array
  useFrame((_, delta) => {
    if (!particlesRef.current || !particlesGeometryRef.current || !active) return;
    
    // Get direct access to the position attribute
    const positionAttribute = particlesGeometryRef.current.attributes.position;
    
    // Update each particle directly
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = positionAttribute.getX(i);
      let y = positionAttribute.getY(i);
      let z = positionAttribute.getZ(i);
      
      // Apply movement based on particle type
      if (type === 'fire') {
        y += particles.speeds[i] * (1 + Math.sin(Date.now() * 0.001 + i) * 0.2);
        x += Math.sin(Date.now() * 0.002 + i) * 0.005;
        z += Math.cos(Date.now() * 0.002 + i) * 0.005;
      } else if (type === 'smoke') {
        y += particles.speeds[i] * 0.5;
        x += Math.sin(Date.now() * 0.001 + i) * 0.01;
        z += Math.cos(Date.now() * 0.001 + i) * 0.01;
      } else if (type === 'extinguish') {
        // Enhanced extinguisher spray behavior
        const time = Date.now() * 0.001;
        const particleAge = particles.lifetimes[i];
        
        // Forward spray movement (assuming spray goes in positive Z direction)
        y += particles.speeds[i] * 0.3; // Slight upward movement
        z += particles.speeds[i] * 4; // Main forward spray
        
        // Add realistic spray spread and turbulence
        const spread = particleAge * 0.5; // Increase spread over time
        x += Math.sin(time + i) * 0.02 * spread;
        y += Math.cos(time * 1.5 + i) * 0.01 * spread;
        
        // Add gravity effect
        y -= particles.speeds[i] * particleAge * 0.5;
        
        // Update particle age
        particles.lifetimes[i] += delta * 2;
      }
      
      // Check if particle should reset (based on type and bounds)
      if (type === 'extinguish') {
        // Reset extinguisher particles based on distance or lifetime
        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance > scale * 3 || particles.lifetimes[i] > 1) {
          x = (Math.random() - 0.5) * 0.1;
          y = Math.random() * 0.1;
          z = (Math.random() - 0.5) * 0.1;
          particles.lifetimes[i] = 0; // Reset lifetime
        }
      } else if (y > scale * 2) {
        x = (Math.random() - 0.5) * scale;
        y = Math.random() * 0.2; // Start near bottom
        z = (Math.random() - 0.5) * scale;
      }
      
      // Update position
      positionAttribute.setXYZ(i, x, y, z);
    }
    
    // Mark the position attribute as needing an update
    positionAttribute.needsUpdate = true;
    
    // Rotate slightly for better visual effect
    particlesRef.current.rotation.y += delta * 0.1;
  });
  
  // Determine color based on particle type if not explicitly specified
  const particleColor = color || 
    (type === 'fire' ? '#ff5500' : 
     type === 'smoke' ? '#999999' : 
     '#aaddff');
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry ref={particlesGeometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={texture}
        color={particleColor}
        opacity={0.8}
      />
    </points>
  );
};

export default ParticleSystem;