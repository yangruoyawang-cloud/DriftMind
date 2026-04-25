import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Sparkles } from "lucide-react";
import { generatePoeticResponse } from "../services/geminiService";
import { db, auth, handleFirestoreError } from "../lib/firebase";
import { collection, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { OperationType, JournalEntry } from "../types";
import SafetyGate from "./SafetyGate";
import EntryDetail from "./EntryDetail";

export default function Home() {
  const [title, setTitle] = useState(() => localStorage.getItem("draft_title") || "");
  const [content, setContent] = useState(() => localStorage.getItem("draft_content") || "");
  const [isReflecting, setIsReflecting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<JournalEntry | null>(null);
  const [showSafetyGate, setShowSafetyGate] = useState(false);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSyncSetting() {
      if (!auth.currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setCloudSyncEnabled(userDoc.data().cloudSync !== false);
        }
      } catch (error) {
        console.error("Error fetching sync status:", error);
      }
    }
    fetchSyncSetting();
  }, []);

  useEffect(() => {
    localStorage.setItem("draft_title", title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem("draft_content", content);
  }, [content]);

  const handleReflect = async () => {
    if ((!content.trim() && !title.trim()) || isReflecting) return;
    setIsReflecting(true);

    const currentTitle = title;
    const currentContent = content;

    try {
      setErrorDetails(null);
      const combinedInput = currentTitle.trim() ? `标题：${currentTitle}\n内容：${currentContent}` : currentContent;
      const { text, isSafetyTriggered } = await generatePoeticResponse(combinedInput);
      
      if (isSafetyTriggered) {
        setShowSafetyGate(true);
        setIsReflecting(false);
        return;
      }

      if (text.startsWith("在这一刻，静默也许是最好的回应。")) {
        setErrorDetails(text);
        return;
      }

      const newId = Math.random().toString(36).substring(7);
      const newEntry: JournalEntry = {
        id: newId,
        title: currentTitle.trim() || null,
        content: currentContent,
        response: text, 
        userId: auth.currentUser?.uid || "anonymous",
        createdAt: new Date().toISOString(),
        isFavorite: false,
        isSafetyTriggered: false, // It's safe since we didn't return early
      };

      if (auth.currentUser && cloudSyncEnabled) {
        const entryRef = doc(db, "entries", newId);
        await setDoc(entryRef, {
          ...newEntry,
          createdAt: serverTimestamp()
        });
      } else {
        const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
        localStorage.setItem("local_entries", JSON.stringify([newEntry, ...localEntries]));
      }
      
      setSubmittedEntry(newEntry);
      
      // Clear drafts
      setTitle("");
      setContent("");
      localStorage.removeItem("draft_title");
      localStorage.removeItem("draft_content");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "entries");
    } finally {
      setIsReflecting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-10 pt-24 pb-60">
      <AnimatePresence mode="wait">
        {showSafetyGate && <SafetyGate onClose={() => setShowSafetyGate(false)} />}
        
        {!submittedEntry ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-12 space-y-6">
              <h1 className="text-4xl font-serif tracking-[0.4em] text-ink/90">浮白</h1>
              <div className="space-y-1">
                <p className="text-ink/40 text-sm font-light tracking-[0.2em]">此刻，</p>
                <p className="text-ink/40 text-sm font-light tracking-[0.2em]">你想写下什么呢？</p>
              </div>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="添加一个标题（可选）"
              className="w-full bg-ink/[0.02] border-none focus:ring-0 focus:bg-ink/[0.05] outline-none rounded-xl px-4 py-3 text-xl font-serif mb-6 text-ink/80 placeholder-ink/20 transition-all duration-500"
            />

            <textarea
              id="write-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在这里输入或写下你的文字……"
              className="w-full bg-ink/[0.02] border-none focus:ring-0 focus:bg-ink/[0.05] outline-none rounded-2xl p-6 text-base font-light leading-[2.2] text-ink/70 placeholder-ink/20 resize-none flex-1 min-h-[300px] transition-all duration-500"
            />

            <div className="mt-8 flex flex-col items-center space-y-4">
              {errorDetails && (
                <p className="text-[10px] text-red-500/60 tracking-widest text-center animate-pulse mb-2">
                  {errorDetails}
                </p>
              )}
              <button
                onClick={handleReflect}
                disabled={(!content.trim() && !title.trim()) || isReflecting}
                className={`group flex flex-col items-center space-y-4 transition-all duration-1000 ${
                  (content.trim() || title.trim()) && !isReflecting ? "opacity-100" : "opacity-20"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center text-white shadow-2xl group-active:scale-95 transition-transform overflow-hidden relative">
                  {isReflecting ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Sparkles size={24} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <span className="text-[0.625rem] uppercase tracking-[0.4em] font-light text-stone-500">Save & Reflect</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <EntryDetail 
            entry={submittedEntry}
            onClose={() => setSubmittedEntry(null)}
            onUpdate={(updated) => setSubmittedEntry(updated)}
            onDelete={() => setSubmittedEntry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
