
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Separate Model component for improved performance
function Model() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 64, 16]} /> {/* Reduced geometry complexity */}
      <meshStandardMaterial 
        color="#F97316"
        roughness={0.3} 
        metalness={0.8} 
      />
    </mesh>
  );
}

// Simple loading placeholder
function LoadingPlaceholder() {
  return <mesh>
    <sphereGeometry args={[0.5, 8, 8]} />
    <meshBasicMaterial color="#cccccc" wireframe />
  </mesh>;
}

export const Scene3D: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="w-full h-full"
      dpr={[1, 1.5]} // Limit pixel ratio for performance
      performance={{ min: 0.5 }} // Allow performance scaling
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <Model />
        <Environment preset="sunset" />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
