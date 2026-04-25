import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, auth, handleFirestoreError } from "../lib/firebase";
import { doc, getDoc, setDoc, query, collection, where, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { OperationType, UserProfile } from "../types";
import { summarizeUserProfile, getBookIntroduction } from "../services/geminiService";
import { RefreshCw, BookOpen, Loader2, X } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bookDetails, setBookDetails] = useState<{ [key: string]: string }>({});
  const [loadingBook, setLoadingBook] = useState<string | null>(null);

  async function fetchProfile() {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, "profiles", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        const mappedProfile: UserProfile = {
          ...data,
          psychology: data.psychology || "",
          resonance: data.resonance || [],
          philosophy: data.philosophy || [],
          recentShift: data.recentShift || (data as any).recent_shift || "",
          updatedAt: (data as any).updatedAt?.toDate?.() ? (data as any).updatedAt.toDate().toISOString() : String(data.updatedAt)
        };
        setProfile(mappedProfile);

        // Auto-refresh if philosophy is missing or the profile is "empty"
        if (!mappedProfile.philosophy || mappedProfile.philosophy.length === 0) {
           handleRefresh(true);
        }
      } else {
        // No profile exists, try to generate one automatically
        handleRefresh(true);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `profiles/${auth.currentUser?.uid}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = async (silent = false) => {
    if (!auth.currentUser || isUpdating) return;
    setIsUpdating(true);
    setBookDetails({}); // Reset book details on refresh
    try {
      const entriesQuery = query(
        collection(db, "entries"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(entriesQuery);
      const entryTexts = querySnapshot.docs.map(doc => doc.data().content).filter(text => text !== "（基于安全指南，此段文字不予记录）");

      if (entryTexts.length < 1) {
        if (!silent) alert("写下至少 1 篇文字，以便浮白开始理解你。");
        return;
      }

      const newProfileData = await summarizeUserProfile(entryTexts);
      console.log("Raw Profile Data from Gemini:", newProfileData);
      
      if (newProfileData) {
        const fullProfile: UserProfile = {
          userId: auth.currentUser.uid,
          themes: newProfileData.themes || [],
          tone: newProfileData.tone || "",
          style: newProfileData.style || "",
          recentShift: (newProfileData as any).recent_shift || (newProfileData as any).recentShift || "",
          psychology: (newProfileData as any).psychology || "",
          resonance: newProfileData.resonance || [],
          philosophy: newProfileData.philosophy || [],
          updatedAt: new Date().toISOString()
        };
        console.log("Mapped Full Profile:", fullProfile);
        await setDoc(doc(db, "profiles", auth.currentUser.uid), {
          ...fullProfile,
          updatedAt: serverTimestamp()
        });
        setProfile(fullProfile);
      }
    } catch (error) {
       console.error("Refresh profile error", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBookClick = async (quote: string) => {
    const bookMatch = quote.match(/《([^》]+)》/);
    if (!bookMatch) return;
    const bookTitle = bookMatch[1];

    if (bookDetails[bookTitle]) {
      // If already open, just close it (handled by UI toggle logic elsewhere or same click)
      // For simplicity, we'll keep it open or refetch if clicked again? 
      // User said "click to generate", let's assume they want it persistent once clicked.
      return;
    }

    setLoadingBook(bookTitle);
    try {
      const intro = await getBookIntroduction(bookTitle);
      setBookDetails(prev => ({ ...prev, [bookTitle]: intro }));
    } catch (error) {
      console.error("Error fetching book intro:", error);
    } finally {
      setLoadingBook(null);
    }
  };

  const renderQuote = (quote: string, index: number) => {
    const bookMatch = quote.match(/《([^》]+)》/);
    const bookTitle = bookMatch ? bookMatch[1] : null;

    return (
      <motion.div 
        key={index}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.3 }}
        className="relative pl-10 group"
      >
          <div className="absolute left-0 top-1 w-1 h-1 rounded-full bg-ink/10 group-hover:bg-ink/30 transition-colors" />
          <div className="absolute left-0 top-3 bottom-0 w-[1px] bg-ink/5" />
          
          <div className="space-y-4 max-w-[95%]">
            <p className="text-ink/70 font-serif text-base leading-[2.4] italic mb-2">
              {quote}
            </p>

            {bookTitle && (
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => handleBookClick(quote)}
                  className={`flex items-center space-x-2 text-[10px] tracking-widest uppercase transition-all duration-500 w-fit ${
                    bookDetails[bookTitle] 
                      ? 'text-ink/60 font-medium' 
                      : 'text-ink/20 hover:text-ink/40'
                  }`}
                >
                  <BookOpen size={12} strokeWidth={1} />
                  <span>{bookDetails[bookTitle] ? "已开启作品视角" : `开启《${bookTitle}》视角`}</span>
                  {loadingBook === bookTitle && <Loader2 size={10} className="animate-spin ml-1" />}
                </button>

                <AnimatePresence>
                  {bookDetails[bookTitle] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-ink/[0.02] border-l border-ink/5 pl-4 py-4 pr-4 rounded-r-lg space-y-4 relative group/intro"
                    >
                      <button 
                         onClick={() => setBookDetails(prev => {
                           const next = { ...prev };
                           delete next[bookTitle];
                           return next;
                         })}
                         className="absolute top-4 right-4 opacity-0 group-hover/intro:opacity-100 transition-opacity text-ink/20 hover:text-ink/40"
                      >
                        <X size={12} strokeWidth={1} />
                      </button>
                      <div className="flex items-center space-x-2 opacity-30">
                         <div className="w-1 h-[1px] bg-ink" />
                         <span className="text-[8px] uppercase tracking-[0.2em] font-light">背景回响</span>
                      </div>
                      <p className="text-ink/60 text-xs font-light leading-relaxed text-justify">
                        {bookDetails[bookTitle]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-10 pt-20 pb-48 space-y-20"
    >
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-3xl font-serif tracking-[0.4em] text-ink/90">自我画像</h1>
          <p className="text-[10px] text-ink/30 tracking-[0.2em] font-light max-w-[200px] leading-relaxed">
            基于长期文字，生成主题、核心基调以及深度心理博弈的回响。
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isUpdating}
          className={`${isUpdating ? 'animate-spin' : ''} text-ink/20 hover:text-ink/60 transition-colors pb-2`}
        >
          <RefreshCw size={20} strokeWidth={1} />
        </button>
      </div>

      {isUpdating || loading ? (
        <div className="py-32 text-center space-y-12">
           <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-ink/5 border-t-ink/20 rounded-full"
              />
              <span className="text-[10px] text-ink/20 uppercase tracking-widest animate-pulse">解析中</span>
           </div>
           <p className="text-[10px] text-ink/30 tracking-widest italic">浮白正在感知你的文字脉络……</p>
        </div>
      ) : !profile ? (
        <div className="py-32 text-center space-y-8">
           <div className="w-16 h-16 mx-auto border border-ink/5 rounded-full flex items-center justify-center opacity-20">
              <div className="w-1 h-1 bg-ink rounded-full" />
           </div>
           <p className="text-[10px] text-ink/30 tracking-widest leading-relaxed">
             尚未收集到足够的叙述<br/>写下第一篇文字，浮白即可为你画像
           </p>
        </div>
      ) : (
        <div className="space-y-20">
          {/* Circular Visual */}
          <div className="flex justify-center">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t border-mist/40 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-b border-mist/30 rounded-full"
              />
              <div className="text-center z-10 space-y-2">
                <p className="text-[10px] text-ink/30 uppercase tracking-[0.3em] font-light">情绪基调</p>
                <p className="text-ink/80 font-serif text-base tracking-widest italic">{profile.tone}</p>
              </div>
            </div>
          </div>

          <section className="space-y-8">
             <h2 className="text-[10px] text-ink/30 uppercase tracking-[0.3em] font-light border-b border-ink/5 pb-2">思想刻度</h2>
             <div className="grid grid-cols-2 gap-x-10 gap-y-12">
                {(!profile.philosophy || profile.philosophy.length === 0 ? [
                  { left: "理性", right: "感性", value: 50 },
                  { left: "宿命", right: "自由", value: 50 },
                  { left: "现实", right: "理想", value: 50 },
                  { left: "独处", right: "联结", value: 50 },
                ] : profile.philosophy).map((dim, i) => {
                  const isDefault = !profile.philosophy || profile.philosophy.length === 0 || dim.value === 50;
                  return (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className={`text-[9px] tracking-wider transition-all duration-700 ${!isDefault && dim.value < 45 ? 'text-ink/60 font-medium scale-110' : 'text-ink/20 font-light'}`}>
                          {dim.left}
                        </span>
                        <span className={`text-[9px] tracking-wider transition-all duration-700 ${!isDefault && dim.value > 55 ? 'text-ink/60 font-medium scale-110' : 'text-ink/20 font-light'}`}>
                          {dim.right}
                        </span>
                      </div>
                      <div className="h-[1px] bg-ink/5 relative mx-1">
                         {/* Center axis */}
                         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-2 bg-ink/10" />
                         
                         {/* Value Indicator */}
                         <motion.div 
                           initial={{ left: "50%" }}
                           animate={{ left: `${dim.value}%` }}
                           transition={{ duration: 2.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                           className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-700 ${isDefault ? 'bg-ink/10' : 'bg-ink/40'}`}
                         >
                            {!isDefault && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-x-[-10px] inset-y-[-10px] bg-ink/[0.02] rounded-full" 
                              />
                            )}
                         </motion.div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </section>

          {/* Style & Shift */}
          <div className="grid grid-cols-2 gap-10">
            <section className="space-y-4">
              <h2 className="text-[10px] text-ink/30 uppercase tracking-[0.3em] font-light border-b border-ink/5 pb-2">表达风格</h2>
              <p className="text-ink/70 font-light text-xs leading-relaxed text-justify">{profile.style}</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-[10px] text-ink/30 uppercase tracking-[0.3em] font-light border-b border-ink/5 pb-2">变化趋势</h2>
              <p className="text-ink/70 font-light text-xs leading-relaxed text-justify">{profile.recentShift}</p>
            </section>
          </div>

          {/* Psychology Analysis Section */}
          <section className="space-y-8 bg-mist/10 p-8 rounded-[2rem] border border-ink/5 backdrop-blur-sm shadow-sm">
             <div className="flex items-center space-x-4">
                <div className="h-[1px] flex-1 bg-ink/10" />
                <h2 className="text-[10px] text-ink/40 uppercase tracking-[0.4em] font-medium">心理状态</h2>
                <div className="h-[1px] flex-1 bg-ink/10" />
             </div>
             <div className="space-y-6">
                <p className="text-ink/80 font-light text-sm leading-[2.2] text-justify">
                  {profile.psychology || "点击刷新以生成深度心理分析……"}
                </p>
                <div className="flex justify-center space-x-2 pt-2">
                  <div className="w-1 h-1 bg-ink/10 rounded-full" />
                  <div className="w-1 h-1 bg-ink/10 rounded-full" />
                  <div className="w-1 h-1 bg-ink/10 rounded-full" />
                </div>
             </div>
          </section>

          {/* Resonance Section */}
          <section className="space-y-12">
             <div className="flex flex-col items-center space-y-2">
                <h2 className="text-[10px] text-ink/30 uppercase tracking-[0.5em] font-light">经典共振</h2>
                <p className="text-[8px] text-ink/20 tracking-[0.2em] italic">Deep Resonance with the Classics</p>
             </div>
             <div className="space-y-16">
                {profile.resonance && profile.resonance.length > 0 ? (
                  profile.resonance.map((quote, i) => renderQuote(quote, i))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[10px] text-ink/20 tracking-[0.3em] uppercase">静待回响……</p>
                    <p className="text-[8px] text-ink/10 tracking-widest mt-2">请尝试刷新以重新同步思想共鸣</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      )}
    </motion.div>
  );
}
