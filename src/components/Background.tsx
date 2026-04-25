import { motion } from "motion/react";

interface BackgroundProps {
  variant?: "write" | "history" | "profile" | "brief";
}

export default function Background({ variant = "write" }: BackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-paper">
      {/* Heavy Paper Texture Overlay - ALWAYS ON */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `var(--paper-pattern)`,
        }}
      />

      {/* Atmospheric Ink & Gold Wash */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <filter id="inkDistortion">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="4" seed={variant === "write" ? 10 : (variant === "history" ? 20 : (variant === "brief" ? 40 : 30))} />
              <feDisplacementMap in="SourceGraphic" scale="50" />
            </filter>
            
            <linearGradient id="verticalInk" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="var(--ink-wash)" stopOpacity="0.4" />
              <stop offset="60%" stopColor="var(--ink-wash)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--bg-color)" stopOpacity="0" />
            </linearGradient>

            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Conditional Ink Layers */}
          {variant !== "profile" && (
            <>
              {/* Deep Bottom Layer */}
              <path
                d={variant === "write" 
                  ? "M-100,1000 L-100,800 Q300,700 500,900 Q800,1050 1100,800 L1100,1000 Z"
                  : (variant === "history" 
                    ? "M-100,1000 L-100,750 Q200,650 450,850 Q750,1050 1100,700 L1100,1000 Z"
                    : (variant === "brief"
                      ? "M-100,1000 L-100,600 Q250,500 500,750 Q750,1000 1100,550 L1100,1000 Z" // LARGER for brief
                      : "M-100,1000 L-100,900 Q200,800 400,950 Q700,1100 1100,850 L1100,1000 Z"))}
                fill="url(#verticalInk)"
                filter="url(#inkDistortion)"
                opacity="0.6"
              />

              {/* Side Wash (Vertical like the image) */}
              <path
                d={variant === "write"
                  ? "M850,1000 Q1100,600 900,200 Q750,0 1000,0 L1000,1000 Z"
                  : (variant === "history"
                    ? "M0,1000 Q-100,600 50,200 Q200,0 0,0 L0,1000 Z"
                    : (variant === "brief"
                      ? "M0,1000 Q150,800 50,400 Q-50,0 200,0 L0,0 L0,1000 Z" // Left wash for brief
                      : "M700,0 Q900,300 850,600 Q750,900 1000,1000 L1000,0 Z"))}
                fill="var(--ink-wash)"
                filter="url(#inkDistortion)"
                opacity={variant === "brief" ? "0.15" : "0.1"}
              />

              {/* Gold Veins / Accents */}
              <path
                 d={variant === "brief"
                   ? "M300,500 Q500,400 700,600 M100,400 Q300,200 200,100 M850,300 Q950,500 900,700"
                   : (variant === "write"
                     ? "M150,900 Q300,800 500,950 M800,400 Q950,200 850,100 M900,600 Q800,800 950,900"
                     : "M800,850 Q600,750 400,900 M300,700 Q150,600 100,800 M900,600 Q800,500 850,400")}
                 stroke="var(--gold-accent)"
                 strokeWidth="0.5"
                 fill="none"
                 opacity="0.3"
                 filter="url(#inkDistortion)"
              />

              {/* Diagonal Gold Thread */}
              <path
                 d={variant === "write"
                   ? "M900,100 Q800,500 950,900 M100,850 Q400,650 300,200"
                   : "M150,200 Q100,400 200,600 Q300,800 150,1000"}
                 stroke="var(--gold-accent)"
                 strokeWidth="0.3"
                 fill="none"
                 opacity="0.15"
                 filter="url(#inkDistortion)"
              />
            </>
          )}

          {/* Golden Glitter / Dust - ALWAYS ON */}
          {[...Array(60)].map((_, i) => (
             <motion.circle
               key={i}
               cx={Math.random() * 1000}
               cy={Math.random() * 1000}
               r={0.4 + Math.random() * 1.2}
               fill="var(--gold-accent)"
               opacity={0.2 + Math.random() * 0.4}
               filter="url(#goldGlow)"
               animate={{ 
                 opacity: [0.2, 0.5, 0.2],
                 scale: [1, 1.3, 1]
               }}
               transition={{ 
                 duration: 4 + Math.random() * 6, 
                 repeat: Infinity,
                 delay: Math.random() * 5
               }}
             />
          ))}
        </svg>
      </div>

      {/* Finishing Softness */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
}
