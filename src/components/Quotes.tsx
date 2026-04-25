import { motion } from "motion/react";
import { getClassicQuoteCards } from "../lib/classicQuotes";

export default function Quotes() {
  const quotes = getClassicQuoteCards();

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
        {quotes.map((quote, i) => (
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
