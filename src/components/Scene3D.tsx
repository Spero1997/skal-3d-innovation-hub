
import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Simple loading placeholder
function LoadingPlaceholder() {
  return <mesh>
    <sphereGeometry args={[0.5, 8, 8]} />
    <meshBasicMaterial color="#cccccc" wireframe />
  </mesh>;
}

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
      <torusKnotGeometry args={[1, 0.3, 32, 8]} /> {/* Further reduced geometry complexity */}
      <meshStandardMaterial 
        color="#F97316"
        roughness={0.3} 
        metalness={0.8} 
      />
    </mesh>
  );
}

// Create a simplified environment instead of loading HDR
function SimplifiedEnvironment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  );
}

export const Scene3D: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only render 3D scene when needed (after 100ms)
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-orange-500/20" />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="w-full h-full"
      dpr={[0.8, 1.2]} // Lower pixel ratio for better performance
      performance={{ min: 0.4 }} // Allow more performance scaling
      frameloop="demand" // Only render when needed
    >
      <SimplifiedEnvironment />
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <Model />
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
