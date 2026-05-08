
import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

function LogoModel({ paused, speed }: { paused: boolean; speed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/skal_service.glb');

  useFrame((_, delta) => {
    if (!groupRef.current || paused) return;
    // cap delta to avoid jumps after tab returns
    const d = Math.min(delta, 0.05);
    groupRef.current.rotation.y += d * speed;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={1.6} />
      </Center>
    </group>
  );
}

useGLTF.preload('/skal_service.glb');

function ProgressLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 select-none">
        <div className="w-32 h-[2px] bg-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[hsl(var(--tangerine))] transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Chargement {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

export const Scene3D: React.FC = () => {
  const isMobile = useIsMobile();
  const [disabled, setDisabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pause when off-screen (saves CPU/GPU)
  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  // Respect reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const paused = userPaused || hovered || !inView || prefersReducedMotion;
  const speed = isMobile ? 0.25 : 0.4; // slower, fluide

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
    <div
      ref={wrapRef}
      className="relative w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => setUserPaused((p) => !p)}
          className="text-[10px] mono uppercase tracking-[0.2em] text-muted-foreground bg-background/70 backdrop-blur px-2 py-1 rounded-full hover:text-foreground transition-colors border hairline"
        >
          {userPaused ? 'Lecture' : 'Pause'}
        </button>
        {isMobile && (
          <button
            onClick={() => setDisabled(true)}
            className="text-[10px] mono uppercase tracking-[0.2em] text-muted-foreground bg-background/70 backdrop-blur px-2 py-1 rounded-full hover:text-foreground transition-colors border hairline"
          >
            Désactiver
          </button>
        )}
      </div>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        className="w-full h-full"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ 
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance'
        }}
        frameloop={paused ? 'demand' : 'always'}
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
        
        <Suspense fallback={<ProgressLoader />}>
          <LogoModel paused={paused} speed={speed} />
          {!isMobile && <Environment background={false} preset="studio" />}
        </Suspense>
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.25}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};
