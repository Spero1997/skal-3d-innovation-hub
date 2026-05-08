
import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

function LogoModel({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, '/skal-logo.svg');

  useMemo(() => {
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  // Aspect 690:290 ≈ 2.38
  const w = 4.2;
  const h = w * (290 / 690);
  const depth = 0.18;

  return (
    <group ref={groupRef}>
      {/* front face */}
      <mesh position={[0, 0, depth / 2]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* back face (mirrored) */}
      <mesh position={[0, 0, -depth / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* edge / thickness */}
      <mesh>
        <boxGeometry args={[w, h, depth]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
}

function LoadingPlaceholder() {
  return (
    <mesh>
      <planeGeometry args={[3, 1.3]} />
      <meshBasicMaterial color="#141414" />
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
          <LogoModel isMobile={isMobile} />
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
