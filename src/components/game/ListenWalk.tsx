import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { walkInput } from "./listenInput";

export type NearSpot = "wall" | "letter" | "window" | "lantern" | "seam" | "find" | null;

const SPOTS: {
  id: Exclude<NearSpot, null>;
  pos: [number, number, number];
  room: "lantern" | "dark" | "both";
}[] = [
  { id: "window", pos: [0, 1.55, -3.05], room: "lantern" },
  { id: "wall", pos: [-0.15, 1.5, -2.7], room: "lantern" },
  { id: "letter", pos: [1.55, 1.05, -0.55], room: "lantern" },
  { id: "lantern", pos: [1.7, 1.25, 0.15], room: "lantern" },
  { id: "seam", pos: [2.35, 1.5, 0.1], room: "lantern" },
  { id: "find", pos: [5.4, 1.2, 0.1], room: "dark" },
];

type Keys = Set<string>;

function useKeys(target: Keys) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => target.add(e.code);
    const up = (e: KeyboardEvent) => target.delete(e.code);
    const clear = () => target.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [target]);
}

function Walker({
  keys,
  heard,
  room,
  onNear,
  onCross,
}: {
  keys: Keys;
  heard: boolean;
  room: "lantern" | "dark";
  onNear: (id: NearSpot) => void;
  onCross: (next: "lantern" | "dark") => void;
}) {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(-0.08);
  const pos = useRef(new THREE.Vector3(0, 1.55, 1.55));
  const vel = useRef(0);
  const bank = useRef(0);
  const nearRef = useRef<NearSpot>(null);
  const heardRef = useRef(heard);
  const roomRef = useRef(room);
  heardRef.current = heard;
  roomRef.current = room;

  useEffect(() => {
    const probe = {
      getYaw: () => yaw.current,
      getSpeed: () => vel.current,
      getZ: () => pos.current.z,
      setForward: (v: number) => {
        walkInput.fy = v;
      },
      setKeys: (codes: string[]) => {
        keys.clear();
        for (const c of codes) keys.add(c);
      },
    };
    window.__controlsTest = probe;
    return () => {
      if (window.__controlsTest === probe) delete window.__controlsTest;
    };
  }, [keys]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      (window as unknown as { __f?: number }).__f =
        ((window as unknown as { __f?: number }).__f ?? 0) + 1;
      if (walkInput.locked) {
        yaw.current -= walkInput.lookX * 0.016;
        pitch.current = THREE.MathUtils.clamp(pitch.current - walkInput.lookY * 0.012, -1.15, 1.05);
        walkInput.lookX *= 0.72;
        walkInput.lookY *= 0.72;

        let f = walkInput.fy;
        let r = walkInput.fx;
        if (keys.has("KeyW") || keys.has("ArrowUp")) f += 1;
        if (keys.has("KeyS") || keys.has("ArrowDown")) f -= 1;
        if (keys.has("KeyD") || keys.has("ArrowRight")) r += 1;
        if (keys.has("KeyA") || keys.has("ArrowLeft")) r -= 1;
        f = THREE.MathUtils.clamp(f, -1, 1);
        r = THREE.MathUtils.clamp(r, -1, 1);

        const fx = -Math.sin(yaw.current);
        const fz = -Math.cos(yaw.current);
        const rx = Math.cos(yaw.current);
        const rz = -Math.sin(yaw.current);
        const wishLen = Math.min(1, Math.hypot(f, r));
        vel.current = wishLen * (f > 0.25 ? 2.75 : 2.35);
        const p = pos.current;
        if (wishLen > 0.01) {
          p.x += (fx * f + rx * r) * dt * 2.6;
          p.z += (fz * f + rz * r) * dt * 2.6;
        }

        const inDark = p.x > 2.55;
        if (inDark) {
          p.x = THREE.MathUtils.clamp(p.x, 2.45, 6.4);
          p.z = THREE.MathUtils.clamp(p.z, -1.55, 1.55);
          if (roomRef.current !== "dark" && heardRef.current) onCross("dark");
          if (!heardRef.current) p.x = 2.45;
        } else {
          p.x = THREE.MathUtils.clamp(p.x, -2.55, 2.55);
          p.z = THREE.MathUtils.clamp(p.z, -2.65, 2.65);
          if (roomRef.current === "dark") onCross("lantern");
        }
        p.y = 1.55;
        const wantBank = r * 0.09 + (f > 0.3 ? 0.015 : 0);
        bank.current = THREE.MathUtils.damp(bank.current, wantBank, 8, dt);
        camera.position.copy(p);
        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw.current;
        camera.rotation.x = pitch.current;
        camera.rotation.z = -bank.current;

        let best: NearSpot = null;
        let bestD = 1.65;
        for (const s of SPOTS) {
          if (s.room !== "both" && s.room !== (inDark ? "dark" : "lantern")) continue;
          const d = p.distanceTo(new THREE.Vector3(...s.pos));
          if (d < bestD) {
            bestD = d;
            best = s.id;
          }
        }
        if (best !== nearRef.current) {
          nearRef.current = best;
          onNear(best);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [camera, keys, onCross, onNear]);

  return null;
}

function Room({ night }: { night: boolean }) {
  const windowMap = useTexture("/art/bedroom.jpg");
  const darkMap = useTexture("/art/dark-room.jpg");
  windowMap.colorSpace = THREE.SRGBColorSpace;
  darkMap.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.6, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={night ? "#0c1014" : "#1a1612"} roughness={0.92} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[1.6, 3.15, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#0a0d10" />
      </mesh>
      <mesh position={[0, 1.55, -3.15]}>
        <boxGeometry args={[6.2, 3.2, 0.18]} />
        <meshStandardMaterial color="#2a2420" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, -3.04]}>
        <planeGeometry args={[1.35, 2.15]} />
        <meshStandardMaterial map={windowMap} emissive="#223" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[-3.05, 1.55, 0]}>
        <boxGeometry args={[0.18, 3.2, 6.4]} />
        <meshStandardMaterial color="#241f1b" />
      </mesh>
      <mesh position={[0, 1.55, 3.15]}>
        <boxGeometry args={[6.2, 3.2, 0.18]} />
        <meshStandardMaterial color="#1e1a17" />
      </mesh>
      <mesh position={[2.65, 2.45, 0]}>
        <boxGeometry args={[0.16, 1.4, 6.4]} />
        <meshStandardMaterial color="#1c1815" />
      </mesh>
      <mesh position={[2.65, 0.55, -1.7]}>
        <boxGeometry args={[0.16, 1.15, 3]} />
        <meshStandardMaterial color="#1c1815" />
      </mesh>
      <mesh position={[2.65, 0.55, 1.7]}>
        <boxGeometry args={[0.16, 1.15, 3]} />
        <meshStandardMaterial color="#1c1815" />
      </mesh>
      <mesh position={[4.7, 1.55, -1.7]}>
        <boxGeometry args={[4.2, 3.2, 0.16]} />
        <meshStandardMaterial color="#12151a" />
      </mesh>
      <mesh position={[4.7, 1.55, 1.7]}>
        <boxGeometry args={[4.2, 3.2, 0.16]} />
        <meshStandardMaterial color="#12151a" />
      </mesh>
      <mesh position={[6.7, 1.55, 0]}>
        <boxGeometry args={[0.16, 3.2, 3.5]} />
        <meshStandardMaterial map={darkMap} />
      </mesh>
      <mesh position={[-1.85, 0.42, -0.2]}>
        <boxGeometry args={[1.7, 0.42, 2.3]} />
        <meshStandardMaterial color="#3a2040" />
      </mesh>
      <mesh position={[-1.85, 0.72, -0.9]}>
        <boxGeometry args={[1.55, 0.22, 0.7]} />
        <meshStandardMaterial color="#5a3560" />
      </mesh>
      <mesh position={[1.7, 0.72, -0.35]}>
        <boxGeometry args={[1.35, 0.12, 2.1]} />
        <meshStandardMaterial color="#3a2a1c" />
      </mesh>
      <mesh position={[1.7, 0.34, -0.35]}>
        <boxGeometry args={[1.2, 0.64, 1.9]} />
        <meshStandardMaterial color="#2a1e14" />
      </mesh>
      <mesh position={[1.55, 0.8, -0.7]}>
        <boxGeometry args={[0.38, 0.02, 0.48]} />
        <meshStandardMaterial color="#d8c9a0" emissive="#b89a55" emissiveIntensity={0.12} />
      </mesh>
      <pointLight position={[1.75, 1.35, 0.1]} intensity={1.6} distance={6} color="#e8c36a" />
      <pointLight position={[5.3, 1.4, 0]} intensity={night ? 0.55 : 0.2} distance={4} color="#4ad4e8" />
      <hemisphereLight args={["#6a7a88", "#1a120c", 0.35]} />
    </group>
  );
}

export function ListenWalk({
  heard,
  room,
  onNear,
  onCross,
}: {
  heard: boolean;
  room: "lantern" | "dark";
  locked?: boolean;
  onNear: (id: NearSpot) => void;
  onCross: (next: "lantern" | "dark") => void;
}) {
  const keys = useRef<Keys>(new Set()).current;
  useKeys(keys);

  return (
    <Canvas
      frameloop="always"
      camera={{ fov: 72, position: [0, 1.55, 1.55], near: 0.08, far: 40 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false }}
      style={{ touchAction: "none", height: "100%", width: "100%" }}
    >
      <color attach="background" args={[room === "dark" ? "#07090c" : "#0b1016"]} />
      <fog attach="fog" args={[room === "dark" ? "#07090c" : "#0b1016", 4.5, 14]} />
      <Room night={room === "dark"} />
      <Walker keys={keys} heard={heard} room={room} onNear={onNear} onCross={onCross} />
    </Canvas>
  );
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getZ?: () => number;
      setForward?: (v: number) => void;
      setKeys?: (codes: string[]) => void;
    };
  }
}
