"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { scrollStore } from "@/lib/scrollStore";

const RINGS = [
  { r: 3.4, tilt: [1.2, 0.2], speed: 0.35, color: "#E50914" },
  { r: 4.6, tilt: [0.5, 0.9], speed: -0.25, color: "#ffffff" },
  { r: 5.8, tilt: [1.0, -0.6], speed: 0.18, color: "#E50914" },
  { r: 7.0, tilt: [0.2, 0.3], speed: -0.12, color: "#ffffff" },
] as const;

function Ring({ r, tilt, speed, color }: (typeof RINGS)[number]) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={[tilt[0], tilt[1], 0]}>
      <group ref={group}>
        <mesh>
          <torusGeometry args={[r, 0.012, 6, 160]} />
          <meshBasicMaterial color={color} transparent opacity={0.28} />
        </mesh>
        <mesh position={[r, 0, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[-r * 0.7, r * 0.7, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}

function Core() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame(({ camera }, dt) => {
    if (outer.current) {
      outer.current.rotation.y += dt * 0.2;
      outer.current.rotation.x += dt * 0.08;
    }
    if (inner.current) {
      inner.current.rotation.y -= dt * 0.3;
      inner.current.rotation.z += dt * 0.12;
    }
    const m = scrollStore.mouse;
    camera.position.x += (m.x * 1.2 - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += (m.y * 0.8 - camera.position.y) * Math.min(1, dt * 2);
    camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.1, 1]} />
        <meshBasicMaterial color="#E50914" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#E50914" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>
      {RINGS.map((rg, i) => (
        <Ring key={i} {...rg} />
      ))}
    </>
  );
}

/** Decorative 3D "core with orbiting rings" behind the skill tiles. No labels, no overlap. */
export default function SkillCore({ inView }: { inView: boolean }) {
  return (
    <Canvas
      frameloop={inView ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 13], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <Core />
    </Canvas>
  );
}
