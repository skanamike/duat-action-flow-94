import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Create realistic earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Ocean blue background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e3a8a'); // Deep blue at poles
    gradient.addColorStop(0.5, '#1e40af'); // Ocean blue at equator
    gradient.addColorStop(1, '#1e3a8a'); // Deep blue at poles
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // More realistic continent shapes
    ctx.fillStyle = '#16a34a'; // Green for land
    
    // North America (more realistic shape)
    ctx.beginPath();
    ctx.moveTo(80, 120);
    ctx.quadraticCurveTo(120, 100, 180, 120);
    ctx.quadraticCurveTo(200, 140, 180, 180);
    ctx.quadraticCurveTo(120, 200, 80, 180);
    ctx.quadraticCurveTo(60, 150, 80, 120);
    ctx.fill();
    
    // South America
    ctx.beginPath();
    ctx.moveTo(160, 220);
    ctx.quadraticCurveTo(180, 200, 200, 240);
    ctx.quadraticCurveTo(190, 300, 170, 320);
    ctx.quadraticCurveTo(150, 310, 140, 280);
    ctx.quadraticCurveTo(150, 240, 160, 220);
    ctx.fill();
    
    // Europe/Africa
    ctx.beginPath();
    ctx.moveTo(480, 100);
    ctx.quadraticCurveTo(520, 90, 540, 120);
    ctx.quadraticCurveTo(550, 160, 530, 200);
    ctx.quadraticCurveTo(540, 260, 520, 300);
    ctx.quadraticCurveTo(500, 340, 480, 360);
    ctx.quadraticCurveTo(460, 320, 470, 280);
    ctx.quadraticCurveTo(460, 240, 480, 200);
    ctx.quadraticCurveTo(470, 160, 480, 120);
    ctx.quadraticCurveTo(470, 110, 480, 100);
    ctx.fill();
    
    // Asia
    ctx.beginPath();
    ctx.moveTo(580, 80);
    ctx.quadraticCurveTo(680, 70, 780, 100);
    ctx.quadraticCurveTo(820, 120, 800, 160);
    ctx.quadraticCurveTo(780, 200, 720, 180);
    ctx.quadraticCurveTo(650, 190, 600, 170);
    ctx.quadraticCurveTo(570, 140, 580, 100);
    ctx.quadraticCurveTo(575, 90, 580, 80);
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.moveTo(720, 280);
    ctx.quadraticCurveTo(780, 270, 800, 290);
    ctx.quadraticCurveTo(810, 310, 780, 320);
    ctx.quadraticCurveTo(740, 325, 720, 310);
    ctx.quadraticCurveTo(710, 295, 720, 280);
    ctx.fill();
    
    // Add some cloud texture with subtle white overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 20 + Math.random() * 40;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.003; // Slower, more realistic rotation
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial 
        map={earthTexture} 
        shininess={10}
        specular={new THREE.Color(0x111111)}
      />
    </mesh>
  );
}

export default function SpinningEarth() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Ambient light for overall illumination */}
        <ambientLight intensity={0.4} />
        
        {/* Main directional light (like the sun) */}
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.2}
          color="#ffffff"
        />
        
        {/* Subtle fill light from the opposite side */}
        <pointLight 
          position={[-3, -2, -3]} 
          intensity={0.3} 
          color="#4f46e5" 
        />
        
        <Earth />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.2}
          minDistance={4}
          maxDistance={12}
        />
      </Canvas>
      
      {/* Subtle overlay for atmosphere effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-slate-900/10 rounded-2xl" />
    </div>
  );
}