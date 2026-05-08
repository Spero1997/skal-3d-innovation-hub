
import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TOUCH } from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

const GLB_URL = '/skal_service.glb';

// Best-effort: clear any previously poisoned Cache Storage entry for the GLB
// (older versions stored the response which could be an HTML redirect in preview).
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.delete('skal-3d-assets-v1').catch(() => {});
}

function LogoModel({ paused, speed }: { paused: boolean; speed: number }) {
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(GLB_URL);

  // Auto-orient: detect the flattest axis (depth) and turn it toward the camera (+Z).
  // Then auto-scale to fit a target size so the logo is always visible.
  const { orientedScene, scale } = React.useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Find the smallest dimension — that's the "depth" of the extrusion.
    const dims: Array<{ axis: 'x' | 'y' | 'z'; v: number }> = [
      { axis: 'x', v: size.x },
      { axis: 'y', v: size.y },
      { axis: 'z', v: size.z },
    ];
    dims.sort((a, b) => a.v - b.v);
    const depthAxis = dims[0].axis;

    const orient = new THREE.Group();
    // Rotate so the depth axis becomes Z (face toward camera)
    if (depthAxis === 'x') orient.rotation.y = Math.PI / 2;
    else if (depthAxis === 'y') orient.rotation.x = Math.PI / 2;
    orient.add(cloned);

    // Compute scale to fit ~3.2 units on the largest visible dimension.
    const maxVisible = Math.max(dims[1].v, dims[2].v);
    const target = 3.2;
    const s = maxVisible > 0 ? target / maxVisible : 1;

    return { orientedScene: orient, scale: s };
  }, [scene]);

  useFrame((_, delta) => {
    if (!spinRef.current || paused) return;
    const d = Math.min(delta, 0.05);
    // Spin like a wheel facing the camera
    spinRef.current.rotation.z += d * speed;
  });

  return (
    <group ref={spinRef}>
      <Center>
        <primitive object={orientedScene} scale={scale} />
      </Center>
    </group>
  );
}

useGLTF.preload(GLB_URL);

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

  const paused = userPaused || !inView || prefersReducedMotion;
  // Speed up on hover to attract attention
  const speed = (isMobile ? 0.25 : 0.4) * (hovered ? 2.2 : 1);

  if (disabled) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-foreground rounded-none">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border border-[hsl(var(--cream))/0.2] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--tangerine))/0.4]" />
          </div>
          <p className="text-[hsl(var(--cream))/0.6] text-xs mb-3 mono uppercase tracking-[0.2em]">Scène 3D désactivée</p>
          <button 
            onClick={() => setDisabled(false)}
            className="text-xs text-[hsl(var(--tangerine))] hover:underline mono uppercase tracking-[0.2em]"
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
      className="relative w-full h-full overflow-hidden bg-foreground cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Aurora glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 55%, hsl(var(--tangerine)/0.35) 0%, hsl(var(--tangerine)/0.08) 35%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full z-0"
        style={{ background: 'radial-gradient(circle, hsl(var(--tangerine)/0.25), transparent 70%)', filter: 'blur(60px)' }}
      />

      {/* Editorial corner labels */}
      <div className="absolute top-4 left-4 z-10 mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.5]">
        ◦ Identité · 3D
      </div>
      <div className="absolute bottom-4 left-4 z-10 mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.5]">
        Skal Service / Manifeste
      </div>
      <div className="absolute bottom-4 right-4 z-10 mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--cream))/0.5] hidden sm:block">
        {hovered ? '↻ Faites pivoter — cliquez & glissez' : 'Survolez · cliquez · faites pivoter'}
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setUserPaused((p) => !p)}
          className="text-[10px] mono uppercase tracking-[0.2em] text-[hsl(var(--cream))/0.7] bg-[hsl(var(--cream))/0.06] backdrop-blur px-3 py-1.5 rounded-full hover:text-[hsl(var(--cream))] hover:bg-[hsl(var(--cream))/0.12] transition-colors border border-[hsl(var(--cream))/0.15]"
        >
          {userPaused ? 'Lecture' : 'Pause'}
        </button>
        {isMobile && (
          <button
            onClick={() => setDisabled(true)}
            className="text-[10px] mono uppercase tracking-[0.2em] text-[hsl(var(--cream))/0.7] bg-[hsl(var(--cream))/0.06] backdrop-blur px-3 py-1.5 rounded-full hover:text-[hsl(var(--cream))] transition-colors border border-[hsl(var(--cream))/0.15]"
          >
            Désactiver
          </button>
        )}
      </div>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        className="w-full h-full relative z-[1]"
        style={{ touchAction: 'none' }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ 
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance'
        }}
        frameloop={paused ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.35} color="#FFF5E6" />
        {!isMobile && (
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1}
            intensity={2}
            castShadow
            color="#F5A623"
          />
        )}
        <directionalLight 
          position={[-5, 5, 5]} 
          intensity={isMobile ? 1.4 : 1.2}
          color="#FFFFFF"
        />
        {!isMobile && (
          <pointLight
            position={[0, -3, 2]}
            intensity={2}
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
          enableRotate
          rotateSpeed={hovered ? 0.9 : isMobile ? 0.7 : 0.25}
          autoRotate={hovered && !userPaused}
          autoRotateSpeed={2.5}
          touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.ROTATE }}
        />
      </Canvas>
    </div>
  );
};
