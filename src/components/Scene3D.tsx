
import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

const GLB_URL = '/skal_service.glb';
const GLB_CACHE = 'skal-3d-assets-v1';

/**
 * Persistent cache strategy for the GLB:
 *  - On idle, store the file in the Cache Storage API so future visits are instant
 *    even without HTTP cache (cache-first, network fallback).
 *  - useGLTF.preload() warms the in-memory three.js loader cache for the current session.
 */
function warmGlbCache() {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  const run = async () => {
    try {
      const cache = await caches.open(GLB_CACHE);
      const hit = await cache.match(GLB_URL);
      if (hit) return;
      const res = await fetch(GLB_URL, { cache: 'force-cache' });
      if (res.ok) await cache.put(GLB_URL, res.clone());
    } catch {
      /* silent — cache is a nice-to-have */
    }
  };
  const ric: typeof requestIdleCallback | undefined =
    (window as any).requestIdleCallback;
  if (ric) ric(() => run(), { timeout: 3000 });
  else setTimeout(run, 1500);
}

if (typeof window !== 'undefined') {
  warmGlbCache();
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
