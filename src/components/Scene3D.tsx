
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 3]} />
      <meshStandardMaterial 
        color="#8B7355"
        roughness={0.15} 
        metalness={0.95}
        envMapIntensity={2}
        wireframe
      />
    </mesh>
  );
}

function LoadingPlaceholder() {
  return <mesh>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshBasicMaterial color="#8B7355" wireframe />
  </mesh>;
}

export const Scene3D: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      className="w-full h-full"
      dpr={[1, 2]}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1}
        intensity={2}
        castShadow
        color="#D4A76A"
      />
      <directionalLight 
        position={[-5, 5, 5]} 
        intensity={0.8}
        color="#F5E6D3"
      />
      <pointLight
        position={[0, -3, 2]}
        intensity={1}
        color="#D4A76A"
      />
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <Model />
        <Environment background={false} preset="studio" />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.25}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
