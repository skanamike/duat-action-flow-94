export default function ShippingLanesOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Major Shipping Ports */}
        <circle cx="690" cy="180" r="4" className="fill-primary animate-pulse" />
        <circle cx="650" cy="240" r="4" className="fill-primary animate-pulse" />
        <circle cx="120" cy="220" r="4" className="fill-primary animate-pulse" />
        <circle cx="80" cy="180" r="4" className="fill-primary animate-pulse" />
        <circle cx="100" cy="400" r="4" className="fill-primary animate-pulse" />
        <circle cx="720" cy="350" r="4" className="fill-primary animate-pulse" />

        {/* Trans-Pacific Route */}
        <path
          d="M 690 180 Q 400 120 120 220"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          className="animate-[ping_3s_infinite]"
          opacity="0.8"
        />

        {/* Asia-Europe Route */}
        <path
          d="M 650 240 Q 350 200 80 180"
          stroke="hsl(var(--secondary))"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          style={{
            animation: "ping 4s infinite 1s"
          }}
          opacity="0.8"
        />

        {/* Asia-Americas Route */}
        <path
          d="M 720 350 Q 400 300 100 400"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          style={{
            animation: "ping 5s infinite 2s"
          }}
          opacity="0.8"
        />

        {/* Intra-Asia Route */}
        <path
          d="M 690 180 Q 720 260 650 240"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 3"
          style={{
            animation: "ping 2.5s infinite 0.5s"
          }}
          opacity="0.6"
        />

        {/* Europe-Americas Route */}
        <path
          d="M 80 180 Q 90 300 100 400"
          stroke="hsl(var(--secondary))"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="6 3"
          style={{
            animation: "ping 3.5s infinite 1.5s"
          }}
          opacity="0.6"
        />

        {/* Animated shipping vessels */}
        <circle r="2" className="fill-primary">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path="M 690 180 Q 400 120 120 220"
          />
        </circle>

        <circle r="2" className="fill-secondary">
          <animateMotion
            dur="10s"
            repeatCount="indefinite"
            path="M 650 240 Q 350 200 80 180"
          />
        </circle>

        <circle r="2" className="fill-accent">
          <animateMotion
            dur="12s"
            repeatCount="indefinite"
            path="M 720 350 Q 400 300 100 400"
          />
        </circle>
      </svg>
    </div>
  );
}