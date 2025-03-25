
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = '#ffffff' }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005;
    }
  });
  
  return (
    <mesh ref={mesh} position={position as [number, number, number]} rotation={rotation as [number, number, number]} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.8} 
        roughness={0.1} 
        envMapIntensity={1} 
      />
    </mesh>
  );
};

const FloatingCube = ({ position = [0, 0, 0], size = 0.5, color = '#00A8E8' }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime()) * 0.1;
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh 
      ref={mesh} 
      position={position as [number, number, number]} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial 
        color={hovered ? '#ffffff' : color} 
        metalness={0.5} 
        roughness={0.1} 
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

const Sphere = ({ position = [0, 0, 0], radius = 0.5, color = '#0074D9' }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.002;
      mesh.current.rotation.y += 0.002;
    }
  });
  
  return (
    <mesh ref={mesh} position={position as [number, number, number]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.2} 
        roughness={0.1} 
        envMapIntensity={1}
      />
    </mesh>
  );
};

const MainScene: React.FC = () => {
  return (
    <group>
      <Model position={[0, 0, 0]} color="#0074D9" scale={1.5} />
      <FloatingCube position={[-3, 0, -2]} size={0.8} color="#00A8E8" />
      <FloatingCube position={[3, 0.5, -1]} size={0.6} color="#0074D9" />
      <Sphere position={[2, -1, -3]} radius={1} color="#ffffff" />
      <Sphere position={[-2, 1, -2]} radius={0.5} color="#00A8E8" />
    </group>
  );
};

interface Scene3DProps {
  className?: string;
  enableOrbit?: boolean;
  enableZoom?: boolean;
  backgroundOpacity?: number;
}

export const Scene3D: React.FC<Scene3DProps> = ({ 
  className = "", 
  enableOrbit = false,
  enableZoom = false,
  backgroundOpacity = 0
}) => {
  return (
    <div className={`${className} w-full h-full`}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[`rgba(248, 249, 250, ${backgroundOpacity})`]} />
        <Environment preset="city" />
        <MainScene />
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={1.5} 
        />
        {enableOrbit && <OrbitControls enableZoom={enableZoom} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />}
      </Canvas>
    </div>
  );
};

export default Scene3D;
