import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { auth } from "../lib/firebase";

export default function Brief() {
  const [dateRange, setDateRange] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const end = new Date();
    const creationTime = auth.currentUser?.metadata.creationTime;
    const start = creationTime ? new Date(creationTime) : new Date();
    
    // Check if user registered less than 3 days ago (too early for a meaningful "brief")
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      setIsNewUser(true);
    }

    const format = (d: Date) => {
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${m}.${day}`;
    };
    
    setDateRange(`(${format(start)} - ${format(end)})`);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-10 pt-20 pb-32"
    >
      <div className="space-y-4 mb-20">
        <h1 className="text-3xl font-serif tracking-[0.4em] text-ink/90">定期小结</h1>
        <p className="text-[10px] text-ink/30 tracking-[0.2em] font-light max-w-[200px] leading-relaxed">
          每周生成一段变化总结，见证自己的成长轨迹。
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="bg-mist/40 p-12 rounded-[2rem] border border-ink/5 backdrop-blur-md shadow-sm space-y-16"
      >
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-[10px] text-ink/80 uppercase tracking-[0.3em] font-medium">本期总结</h2>
            <p className="text-[8px] text-ink/20 tracking-[0.2em] font-light">{dateRange}</p>
          </div>
          <div className="h-[1px] w-8 bg-ink/10" />
        </div>

        <div className="space-y-10">
          {isNewUser ? (
            <div className="space-y-6 text-center py-10">
               <div className="w-1 h-1 bg-ink/20 mx-auto rounded-full" />
               <p className="text-ink/40 font-serif text-sm italic tracking-widest">
                 沉淀尚浅，叙述待补。<br/>
                 请保持记录，浮白将在首周结束后为你呈信。
               </p>
            </div>
          ) : (
            <p className="text-ink/70 font-serif text-sm leading-[2.4] italic text-justify">
              这段时间，你的文字里，“等待”的痕迹还在，但似乎不再那么紧张了。有些东西并没有消失，只是变得更轻了。
            </p>
          )}
        </div>

        <div className="pt-8 flex justify-center">
          {!isNewUser && (
            <button className="text-[10px] text-ink/30 tracking-[0.4em] uppercase border border-ink/5 px-6 py-3 rounded-full hover:bg-ink/5 transition-colors">
              查看历史小结
            </button>
          )}
        </div>
      </motion.div>
      
      <p className="text-[10px] text-center text-ink/20 font-light tracking-[0.3em] mt-24">
        —— 浮白与你一同见证
      </p>
    </motion.div>
  );
}
