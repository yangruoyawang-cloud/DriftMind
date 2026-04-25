import { motion } from "motion/react";

const QUOTES = [
  { text: "世间一切有为法，如梦幻泡影，如露亦如电，应作如是观。", author: "《金刚经》" },
  { text: "我认为，每一个不曾起舞的日子，都是对生命的辜负。", author: "尼采" },
  { text: "你要自己发光，而不是借谁的光。", author: "鲁米" }
];

export default function Quotes() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-10 pt-20 pb-32"
    >
      <div className="space-y-4 mb-16">
        <h1 className="text-3xl font-serif tracking-[0.4em] text-ink/90">经典引用</h1>
        <p className="text-[10px] text-ink/30 tracking-[0.2em] font-light max-w-[200px] leading-relaxed">
          从文学、哲学、佛学中，找到与你共鸣的声音。
        </p>
      </div>

      <div className="space-y-12">
        {QUOTES.map((quote, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="space-y-8 bg-white/20 p-10 rounded-[2rem] border border-white/40 shadow-sm"
          >
            <p className="text-ink/80 font-serif leading-[2.2] text-lg">
              {quote.text}
            </p>
            <div className="flex justify-end pr-4">
              <p className="text-ink/30 text-xs font-light tracking-[0.2em]">—— {quote.author}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
