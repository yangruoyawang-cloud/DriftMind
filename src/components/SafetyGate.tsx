import { motion } from "motion/react";
import { Leaf } from "lucide-react";

interface SafetyGateProps {
  onClose: () => void;
}

export default function SafetyGate({ onClose }: SafetyGateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-paper overflow-y-auto transition-colors duration-700"
    >
      {/* Background Texture Overlay (Fixed) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] dark:opacity-[0.01]" />

      <div className="relative min-h-screen flex flex-col items-center px-10 pt-32 pb-20 z-10">
        {/* Top Icon */}
        <div className="mb-16">
          <Leaf className="text-stone-400 opacity-60" size={48} strokeWidth={0.5} />
        </div>

        {/* Message */}
        <div className="text-center space-y-8 mb-20 max-w-[280px]">
          <p className="text-ink/80 text-lg font-serif leading-[2] tracking-wide">
            浮白看见你正在经历一段艰难的时刻。
          </p>
          <div className="space-y-2">
            <p className="text-ink/60 text-base font-serif italic">请记得，你并不孤单，</p>
            <p className="text-ink/60 text-base font-serif italic">你值得被爱与被照顾。</p>
          </div>
          <p className="text-ink/40 text-sm mt-12 tracking-widest font-light">
            如果需要帮助，可以联系：
          </p>
        </div>

        {/* Helplines */}
        <div className="w-full space-y-4 mb-24 max-w-sm">
            { [
               { label: "全国心理援助热线", value: "12356" },
               { label: "生命热线", value: "400-161-9995" },
               { label: "紧急求助", value: "110 / 120" },
             ].map((item, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 + i * 0.1 }}
                 className="flex justify-between items-center px-8 py-5 border border-ink/5 bg-ink/[0.03] backdrop-blur-sm rounded-[1.5rem]"
               >
                 <span className="text-ink/50 text-sm font-light tracking-widest">{item.label}</span>
                 <span className="text-ink/80 text-base font-serif tracking-tighter">{item.value}</span>
               </motion.div>
             ))}
           </div>
   
           {/* Action */}
           <motion.button
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             onClick={onClose}
             className="w-full max-w-sm py-5 border border-ink/5 bg-ink/[0.05] backdrop-blur-md rounded-full text-ink/60 text-sm tracking-[0.6em] hover:bg-ink/[0.08] transition-all active:scale-95 shadow-sm mt-auto mb-12"
           >
             我知道了
           </motion.button>
      </div>

      {/* Bottom Illustration Fragment (Fixed) */}
      <div className="fixed bottom-0 left-0 w-full h-[38vh] pointer-events-none overflow-hidden z-0">
        <svg
          viewBox="0 0 1000 400"
          className="w-[120%] h-full -ml-[10%]"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="watercolor">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" seed="1" />
              <feDisplacementMap in="SourceGraphic" scale="25" />
            </filter>
            <linearGradient id="mountGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Back Mountain */}
          <path
            d="M-100,400 L-100,280 Q200,200 450,290 Q700,380 1100,200 L1100,400 Z"
            fill="url(#mountGrad)"
            className="text-ink"
            filter="url(#watercolor)"
            opacity="0.3"
          />
          
          {/* Middle Mountain */}
          <path
            d="M-100,400 L-100,320 Q300,240 600,340 Q850,440 1100,300 L1100,400 Z"
            fill="currentColor"
            className="text-ink"
            filter="url(#watercolor)"
            opacity="0.1"
          />

          {/* Front Mountain (Darker) */}
          <path
            d="M-100,400 L-100,350 Q250,300 500,360 Q750,420 1100,330 L1100,400 Z"
            fill="currentColor"
            className="text-ink"
            filter="url(#watercolor)"
            opacity="0.15"
          />

          {/* Gold Flecks / Stars */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1000}
              cy={250 + Math.random() * 150}
              r={0.5 + Math.random() * 1.5}
              fill="#D4AF37"
              opacity={0.2 + Math.random() * 0.5}
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 5}s` }}
            />
          ))}

          {/* Gold Line Accents */}
          <path
             d="M150,320 L250,280 M700,350 L850,310"
             stroke="#D4AF37"
             strokeWidth="0.3"
             opacity="0.3"
             filter="url(#watercolor)"
          />
        </svg>
      </div>
    </motion.div>
  );
}
