"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollStore } from "@/lib/scrollStore";

function Embers({ count, color, size, speed }: { count: number; color: string; size: number; speed: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = -50 + Math.random() * 62;
      seeds[i] = Math.random() * 100;
    }
    return { positions, seeds };
  }, [count]);

  useFrame(({ clock }, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += dt * speed * (0.4 + (seeds[i] % 1));
      arr[i * 3] += Math.sin(t * 0.4 + seeds[i]) * dt * 0.25;
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -10;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FilmRing({ z, radius, speed }: { z: number; radius: number; speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <group ref={ref} position={[0, 0, z]}>
      <mesh>
        <torusGeometry args={[radius, 0.04, 8, 90]} />
        <meshBasicMaterial color="#E50914" transparent opacity={0.35} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius * 0.55, Math.sin(a) * radius * 0.55, 0]}>
            <ringGeometry args={[radius * 0.12, radius * 0.135, 40]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function CameraRig() {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }, dt) => {
    const p = scrollStore.progress;
    const m = scrollStore.mouse;
    const k = 1 - Math.pow(0.001, dt);
    const tz = 8 - p * 42;
    const tx = m.x * 0.9 + Math.sin(p * Math.PI * 4) * 2.2;
    const ty = m.y * 0.6 + Math.cos(p * Math.PI * 3) * 1.1;
    camera.position.z += (tz - camera.position.z) * k;
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    target.set(m.x * 0.5, m.y * 0.3, camera.position.z - 10);
    camera.lookAt(target);
    camera.rotation.z += (Math.sin(p * Math.PI * 2) * 0.07 - camera.rotation.z) * k;
  });
  return null;
}

export default function Backdrop() {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]" aria-hidden>
      <Canvas
        dpr={[1, mobile ? 1.25 : 1.6]}
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 80 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 6, 46]} />
        <Embers count={mobile ? 450 : 1100} color="#E50914" size={0.07} speed={0.5} />
        <Embers count={mobile ? 300 : 800} color="#ffffff" size={0.03} speed={0.2} />
        <FilmRing z={-10} radius={5} speed={0.12} />
        <FilmRing z={-24} radius={7} speed={-0.08} />
        <FilmRing z={-38} radius={9} speed={0.06} />
        <CameraRig />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(229,9,20,0.14),transparent_55%)]" />
    </div>
  );
}
