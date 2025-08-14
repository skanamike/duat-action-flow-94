import { useEffect, useState } from "react";

const AnimatedSupplyChain = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Major shipping ports with approximate coordinates (scaled to SVG viewBox)
  const ports = [
    { id: "shanghai", name: "Shanghai", x: 720, y: 180 },
    { id: "singapore", name: "Singapore", x: 680, y: 280 },
    { id: "rotterdam", name: "Rotterdam", x: 480, y: 140 },
    { id: "losangeles", name: "Los Angeles", x: 180, y: 200 },
    { id: "hamburg", name: "Hamburg", x: 490, y: 130 },
    { id: "dubai", name: "Dubai", x: 590, y: 220 },
    { id: "hongkong", name: "Hong Kong", x: 710, y: 190 },
    { id: "tokyo", name: "Tokyo", x: 780, y: 170 },
    { id: "newyork", name: "New York", x: 280, y: 170 },
    { id: "london", name: "London", x: 460, y: 140 },
  ];

  // Major shipping routes
  const routes = [
    { from: "shanghai", to: "losangeles", delay: 0 },
    { from: "singapore", to: "rotterdam", delay: 1.5 },
    { from: "hongkong", to: "newyork", delay: 3 },
    { from: "tokyo", to: "losangeles", delay: 4.5 },
    { from: "dubai", to: "hamburg", delay: 2 },
    { from: "shanghai", to: "singapore", delay: 1 },
    { from: "singapore", to: "dubai", delay: 3.5 },
    { from: "rotterdam", to: "newyork", delay: 2.5 },
    { from: "london", to: "shanghai", delay: 4 },
    { from: "losangeles", to: "singapore", delay: 5 },
  ];

  const getPort = (id: string) => ports.find(port => port.id === id);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-background to-muted rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <svg
        viewBox="0 0 900 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Continental outlines (simplified) */}
        <g fill="none" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2">
          {/* North America */}
          <path d="M 50 100 Q 150 80 250 120 Q 300 140 320 180 Q 280 220 200 240 Q 100 250 50 200 Z" />
          {/* Europe */}
          <path d="M 400 100 Q 500 90 550 120 Q 520 160 480 170 Q 420 160 400 140 Z" />
          {/* Asia */}
          <path d="M 600 80 Q 750 70 850 120 Q 820 200 780 220 Q 700 240 650 200 Q 580 150 600 120 Z" />
          {/* Africa */}
          <path d="M 450 200 Q 520 180 580 220 Q 560 300 520 320 Q 480 300 450 260 Z" />
        </g>

        {/* Shipping routes with animations */}
        {routes.map((route, index) => {
          const fromPort = getPort(route.from);
          const toPort = getPort(route.to);
          
          if (!fromPort || !toPort) return null;

          return (
            <g key={`route-${index}`}>
              {/* Base route line */}
              <line
                x1={fromPort.x}
                y1={fromPort.y}
                x2={toPort.x}
                y2={toPort.y}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              
              {/* Animated status line */}
              <line
                x1={fromPort.x}
                y1={fromPort.y}
                x2={toPort.x}
                y2={toPort.y}
                strokeWidth="3"
                strokeLinecap="round"
                className="route-animation"
                style={{
                  animationDelay: `${route.delay}s`,
                }}
              />
            </g>
          );
        })}

        {/* Port nodes */}
        {ports.map((port) => (
          <g key={port.id}>
            {/* Port glow effect */}
            <circle
              cx={port.x}
              cy={port.y}
              r="8"
              fill="hsl(var(--primary))"
              opacity="0.3"
              className="animate-pulse"
            />
            {/* Main port circle */}
            <circle
              cx={port.x}
              cy={port.y}
              r="4"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth="2"
              className="port-node"
            />
          </g>
        ))}

        {/* Activity indicators */}
        <g>
          {ports.slice(0, 3).map((port, index) => (
            <circle
              key={`activity-${port.id}`}
              cx={port.x}
              cy={port.y}
              r="12"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              opacity="0"
              className="activity-ring"
              style={{
                animationDelay: `${index * 2}s`,
              }}
            />
          ))}
        </g>
      </svg>

      {/* Status overlay */}
      <div className="absolute top-4 left-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2 px-2 py-1 bg-background/80 rounded-md backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-background/80 rounded-md backdrop-blur-sm">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-muted-foreground">Delayed</span>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-background/80 rounded-md backdrop-blur-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-muted-foreground">Disrupted</span>
        </div>
      </div>

      <style>{`
        .route-animation {
          stroke: #22c55e;
          animation: routeStatus 6s infinite;
        }

        .port-node {
          filter: drop-shadow(0 0 4px hsl(var(--primary)));
        }

        .activity-ring {
          animation: activityPulse 4s infinite;
        }

        @keyframes routeStatus {
          0%, 20% {
            stroke: #22c55e;
            opacity: 0.8;
          }
          30%, 50% {
            stroke: #eab308;
            opacity: 1;
          }
          60%, 80% {
            stroke: #ef4444;
            opacity: 1;
          }
          90%, 100% {
            stroke: #22c55e;
            opacity: 0.8;
          }
        }

        @keyframes activityPulse {
          0% {
            r: 4;
            opacity: 1;
          }
          50% {
            r: 16;
            opacity: 0.3;
          }
          100% {
            r: 20;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedSupplyChain;