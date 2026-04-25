import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LogIn, UserPlus } from "lucide-react";
import { signInWithGoogle } from "../lib/firebase";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-24">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-5xl font-light tracking-[0.4em] text-stone-900"
        >
          浮白
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1, duration: 2 }}
          className="text-stone-900 tracking-[0.2em] font-light text-sm italic"
        >
          DriftMind
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="w-full max-w-xs space-y-12"
      >
        <p className="text-center text-stone-400 font-light text-sm leading-relaxed tracking-widest">
          一个安静的文字宇宙，<br/>
          理解你，陪伴你，见证你。
        </p>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-4 bg-stone-900 text-stone-50 py-4 px-8 rounded-full shadow-2xl hover:shadow-stone-900/20 transition-all duration-700 active:scale-95 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          {loading ? (
            <div className="w-5 h-5 border-2 border-stone-500 border-t-stone-50 rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={20} strokeWidth={1} />
              <span className="text-sm font-light tracking-[0.3em]">进入宇宙</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-stone-300 font-light tracking-widest leading-relaxed">
          登录即代表你同意《浮白隐私政策》<br/>
          本应用不提供医疗建议
        </p>
      </motion.div>
    </div>
  );
}
