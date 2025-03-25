
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial 
        color="#F97316" // Orange color from the SKAL logo
        roughness={0.3} 
        metalness={0.8} 
      />
    </mesh>
  );
}

export const Scene3D: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      
      <Model />
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <Environment preset="sunset" />
    </Canvas>
  );
};
