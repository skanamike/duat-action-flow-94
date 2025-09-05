import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Major port coordinates (lat, lng)
const majorPorts = [
  { name: "Shanghai", lat: 31.2304, lng: 121.4737, continent: "Asia" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, continent: "Asia" },
  { name: "Rotterdam", lat: 51.9244, lng: 4.4777, continent: "Europe" },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, continent: "America" },
  { name: "Hamburg", lat: 53.5511, lng: 9.9937, continent: "Europe" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, continent: "Asia" },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694, continent: "Asia" },
  { name: "New York", lat: 40.7128, lng: -74.0060, continent: "America" },
];

// Shipping routes between major ports
const shippingRoutes = [
  [0, 1], // Shanghai - Singapore
  [0, 6], // Shanghai - Hong Kong
  [1, 5], // Singapore - Dubai
  [2, 4], // Rotterdam - Hamburg
  [3, 7], // Los Angeles - New York
  [5, 2], // Dubai - Rotterdam
  [1, 3], // Singapore - Los Angeles
  [2, 7], // Rotterdam - New York
];

// Convert lat/lng to 3D coordinates on sphere
const latLngToVector3 = (lat: number, lng: number, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Create curved path between two points on sphere
const createCurvedPath = (start: THREE.Vector3, end: THREE.Vector3) => {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(2.5); // Curve outward
  
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(50);
};

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Create earth texture (simple blue with green continents effect)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Ocean blue background
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Simple continent shapes
    ctx.fillStyle = '#22c55e';
    // North America
    ctx.fillRect(50, 80, 80, 60);
    // Europe/Africa
    ctx.fillRect(200, 70, 60, 100);
    // Asia
    ctx.fillRect(300, 60, 120, 80);
    // Australia
    ctx.fillRect(350, 150, 40, 30);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005; // Slow rotation
    }
  });

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]}>
      <meshPhongMaterial map={earthTexture} />
    </Sphere>
  );
}

function Ports() {
  const portsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (portsRef.current) {
      // Flash ports with different timings
      portsRef.current.children.forEach((port, index) => {
        const time = state.clock.elapsedTime;
        const flash = Math.sin(time * 2 + index * 0.5) * 0.5 + 0.5;
        const mesh = port as THREE.Mesh;
        if (mesh.material && 'opacity' in mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 + flash * 0.5;
        }
      });
    }
  });

  const portPositions = useMemo(() => {
    return majorPorts.map(port => latLngToVector3(port.lat, port.lng, 2.05));
  }, []);

  return (
    <group ref={portsRef}>
      {portPositions.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function ShippingLanes() {
  const lanesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (lanesRef.current) {
      // Animate shipping lanes
      lanesRef.current.children.forEach((lane, index) => {
        const time = state.clock.elapsedTime;
        const offset = Math.sin(time * 0.5 + index * 0.3) * 0.2;
        const line = lane as THREE.Line;
        if (line.material && 'opacity' in line.material) {
          (line.material as THREE.LineBasicMaterial).opacity = 0.4 + offset;
        }
      });
    }
  });

  const routeGeometries = useMemo(() => {
    return shippingRoutes.map(([startIdx, endIdx]) => {
      const start = latLngToVector3(majorPorts[startIdx].lat, majorPorts[startIdx].lng, 2.05);
      const end = latLngToVector3(majorPorts[endIdx].lat, majorPorts[endIdx].lng, 2.05);
      const points = createCurvedPath(start, end);
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  return (
    <group ref={lanesRef}>
      {routeGeometries.map((geometry, index) => (
        <line key={index}>
          <primitive attach="geometry" object={geometry} />
          <lineBasicMaterial 
            attach="material"
            color="#06b6d4" 
            transparent 
            opacity={0.6}
          />
        </line>
      ))}
    </group>
  );
}

export default function SpinningEarth() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1}
          castShadow
        />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#1e40af" />
        
        <Earth />
        <Ports />
        <ShippingLanes />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20 rounded-2xl" />
    </div>
  );
}