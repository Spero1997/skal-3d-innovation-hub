
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Improved Model component with better geometry
function Model() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smoother rotation
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Higher quality torusKnot with more segments for smoother appearance */}
      <torusKnotGeometry args={[1, 0.4, 128, 32]} />
      <meshStandardMaterial 
        color="#F97316"
        roughness={0.2} 
        metalness={0.9}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

// Improved loading placeholder
function LoadingPlaceholder() {
  return <mesh>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshBasicMaterial color="#cccccc" wireframe />
  </mesh>;
}

export const Scene3D: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="w-full h-full"
      dpr={[1, 2]} // Better resolution on high-DPI screens
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      {/* Improved lighting for better visual quality */}
      <ambientLight intensity={0.3} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <directionalLight 
        position={[-5, 5, 5]} 
        intensity={1}
        color="#ffffff"
      />
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <Model />
        {/* Use a more suitable environment preset for better reflections */}
        <Environment background={false} preset="studio" />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.25} // Reduced for smoother rotation
        autoRotate
        autoRotateSpeed={0.3} // Slowed down for more elegant movement
      />
    </Canvas>
  );
};
