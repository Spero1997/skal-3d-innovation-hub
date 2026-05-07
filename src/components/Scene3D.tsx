
import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

function Model({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * (isMobile ? 0.05 : 0.1);
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * (isMobile ? 0.05 : 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, isMobile ? 1 : 3]} />
      <meshStandardMaterial 
        color="#2a2a2a"
        roughness={isMobile ? 0.3 : 0.2} 
        metalness={isMobile ? 0.8 : 0.9}
        envMapIntensity={isMobile ? 1 : 1.5}
        wireframe
      />
    </mesh>
  );
}

function LoadingPlaceholder() {
  return <mesh>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshBasicMaterial color="#F97316" wireframe />
  </mesh>;
}

function InnerGlow({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      const scale = 0.6 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (isMobile) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color="#F5A623"
        emissive="#F97316"
        emissiveIntensity={2}
        roughness={1}
        metalness={0}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export const Scene3D: React.FC = () => {
  const isMobile = useIsMobile();
  const [disabled, setDisabled] = useState(false);

  if (disabled) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[hsl(var(--optimind-card))] rounded-2xl">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-black/10 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-black/5" />
          </div>
          <p className="text-muted-foreground text-xs mb-3">Scène 3D désactivée</p>
          <button 
            onClick={() => setDisabled(false)}
            className="text-xs text-foreground hover:underline"
          >
            Activer la 3D
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isMobile && (
        <button 
          onClick={() => setDisabled(true)}
          className="absolute top-2 right-2 z-10 text-[10px] text-muted-foreground bg-white/60 px-2 py-1 rounded-full hover:text-foreground transition-colors"
        >
          Désactiver 3D
        </button>
      )}
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        className="w-full h-full"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ 
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance'
        }}
        frameloop={isMobile ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.5} color="#FFF5E6" />
        {!isMobile && (
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1}
            intensity={1.5}
            castShadow
            color="#F5A623"
          />
        )}
        <directionalLight 
          position={[-5, 5, 5]} 
          intensity={isMobile ? 1.2 : 1}
          color="#FFFFFF"
        />
        {!isMobile && (
          <pointLight
            position={[0, -3, 2]}
            intensity={1.5}
            color="#F97316"
          />
        )}
        
        <Suspense fallback={<LoadingPlaceholder />}>
          <Model isMobile={isMobile} />
          <InnerGlow isMobile={isMobile} />
          {!isMobile && <Environment background={false} preset="studio" />}
        </Suspense>
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.25}
          autoRotate
          autoRotateSpeed={isMobile ? 0.3 : 0.5}
        />
      </Canvas>
    </div>
  );
};
