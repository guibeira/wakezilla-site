interface WakezillaMascotProps {
  className?: string;
}

export function WakezillaMascot({ className = '' }: WakezillaMascotProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="100" cy="130" rx="45" ry="50" className="fill-current" />

      {/* Head */}
      <circle cx="100" cy="65" r="40" className="fill-current" />

      {/* Eye white */}
      <circle cx="115" cy="55" r="12" fill="white" />

      {/* Eye pupil */}
      <circle cx="118" cy="52" r="6" fill="#1a1a1a" />

      {/* Eye shine */}
      <circle cx="120" cy="50" r="2" fill="white" />

      {/* Mouth */}
      <path
        d="M 85 80 Q 100 95 115 80"
        stroke="#1a1a1a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Teeth */}
      <path
        d="M 92 82 L 92 88 L 96 82"
        fill="white"
        stroke="white"
        strokeWidth="1"
      />
      <path
        d="M 104 82 L 104 88 L 108 82"
        fill="white"
        stroke="white"
        strokeWidth="1"
      />

      {/* Left arm */}
      <ellipse cx="65" cy="120" rx="12" ry="20" className="fill-current" transform="rotate(-20 65 120)" />

      {/* Right arm */}
      <ellipse cx="135" cy="120" rx="12" ry="20" className="fill-current" transform="rotate(20 135 120)" />

      {/* Left leg */}
      <ellipse cx="75" cy="175" rx="15" ry="20" className="fill-current" />

      {/* Right leg */}
      <ellipse cx="125" cy="175" rx="15" ry="20" className="fill-current" />

      {/* Spikes on back */}
      <polygon points="100,25 105,40 95,40" className="fill-current" />
      <polygon points="85,30 90,48 80,48" className="fill-current" />
      <polygon points="115,30 120,48 110,48" className="fill-current" />

      {/* Tail */}
      <path
        d="M 55 140 Q 30 150 25 170 Q 35 165 40 175"
        stroke="currentColor"
        strokeWidth="15"
        fill="none"
        strokeLinecap="round"
      />

      {/* Belly highlight */}
      <ellipse cx="100" cy="135" rx="30" ry="35" fill="white" opacity="0.15" />

      {/* Small arm details (claws) */}
      <circle cx="58" cy="135" r="3" fill="white" opacity="0.2" />
      <circle cx="142" cy="135" r="3" fill="white" opacity="0.2" />
    </svg>
  );
}
