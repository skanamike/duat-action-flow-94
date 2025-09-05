import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Create dotted earth texture inspired by uploaded images
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Light gray/white background like the uploaded images
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Function to draw dotted landmass
    const drawDottedLand = (startX: number, startY: number, width: number, height: number, density = 0.3) => {
      ctx.fillStyle = '#1e293b'; // Dark dots for land
      const dotSize = 2;
      const spacing = 6;
      
      for (let x = startX; x < startX + width; x += spacing) {
        for (let y = startY; y < startY + height; y += spacing) {
          // Create organic shapes using noise-like pattern
          if (Math.random() < density) {
            // Vary dot positions slightly for organic feel
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetY = (Math.random() - 0.5) * 2;
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };
    
    // Draw continents with dotted pattern
    
    // North America
    drawDottedLand(60, 100, 140, 120, 0.4);
    
    // South America  
    drawDottedLand(140, 240, 80, 160, 0.35);
    
    // Europe
    drawDottedLand(480, 90, 80, 80, 0.45);
    
    // Africa
    drawDottedLand(500, 170, 60, 140, 0.4);
    
    // Asia
    drawDottedLand(580, 60, 180, 120, 0.35);
    drawDottedLand(620, 180, 140, 80, 0.3);
    
    // Australia
    drawDottedLand(720, 280, 70, 50, 0.4);
    
    // Add orange accent dots like in the uploaded images
    ctx.fillStyle = '#fb7185'; // Orange-red accent color
    const accentDots = [
      { x: 120, y: 160 }, // North America
      { x: 520, y: 200 }, // Africa/Middle East
      { x: 650, y: 120 }, // Asia
      { x: 750, y: 300 }, // Australia
      { x: 180, y: 280 }, // South America
    ];
    
    accentDots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002; // Smooth rotation
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial 
        map={texture} 
        transparent={true}
        opacity={1}
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