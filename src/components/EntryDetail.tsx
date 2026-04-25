import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Share2, Download, Bookmark, BookmarkCheck, Trash2, Loader2 } from "lucide-react";
import { JournalEntry, OperationType } from "../types";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { db, handleFirestoreError } from "../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

interface EntryDetailProps {
  entry: JournalEntry;
  onClose: () => void;
  onUpdate?: (updated: JournalEntry) => void;
  onDelete?: (id: string) => void;
}

export default function EntryDetail({ entry, onClose, onUpdate, onDelete }: EntryDetailProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleFavorite = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newStatus = !entry.isFavorite;
    try {
      await updateDoc(doc(db, "entries", entry.id), {
        isFavorite: newStatus
      });
      onUpdate?.({ ...entry, isFavorite: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `entries/${entry.id}`);
    }
  };

  const handleDelete = async () => {
    try {
      const isFirestore = entry.userId !== "anonymous";
      const deletedAt = new Date().toISOString();
      
      if (isFirestore) {
        await updateDoc(doc(db, "entries", entry.id), {
          isDeleted: true,
          deletedAt: deletedAt
        });
      } else {
        const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
        const updated = localEntries.map((e: any) => 
          e.id === entry.id ? { ...e, isDeleted: true, deletedAt } : e
        );
        localStorage.setItem("local_entries", JSON.stringify(updated));
      }
      
      onDelete?.(entry.id);
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `entries/${entry.id}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: entry.title || "浮白笔记",
          text: `${entry.content}\n\n浮白回应：${entry.response}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${entry.title ? entry.title + '\n' : ''}${entry.content}\n\n浮白回应：${entry.response}`);
        alert("已复制到剪贴板");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleSaveImage = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    
    // Brief delay to allow any state changes (like showing export-only branding) to reflect
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(exportRef.current!, {
          cacheBust: true,
          backgroundColor: '#f8f5f1',
          style: {
            padding: '60px 40px',
            borderRadius: '0',
            backgroundImage: `url('https://cdn.discordapp.com/attachments/1365507563065053256/1365511394142322749/img-R4g270u9uU8U9uU8uU8uU8uU.png?ex=67c5108f&is=67c3beff&hm=6a81e360678d8a573678505500e5e016f4417088b20a320309999a0a0309a0a0&')`,
            backgroundSize: 'cover',
            height: 'auto',
          }
        });
        saveAs(dataUrl, `fubai-${new Date(entry.createdAt).getTime()}.png`);
      } catch (err) {
        console.error("Failed to save image:", err);
      } finally {
        setIsExporting(false);
      }
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] bg-paper flex flex-col overflow-y-auto"
      style={{ 
        backgroundImage: `url('https://cdn.discordapp.com/attachments/1365507563065053256/1365511394142322749/img-R4g270u9uU8U9uU8uU8uU8uU.png?ex=67c5108f&is=67c3beff&hm=6a81e360678d8a573678505500e5e016f4417088b20a320309999a0a0309a0a0&')`, 
        backgroundSize: 'cover' 
      }}
    >
      <div className="flex flex-col p-10 min-h-full">
        {/* Header */}
        <div className={`flex justify-between items-center z-20 mb-10 transition-opacity ${isExporting ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-ink/20 hover:text-red-400/40 cursor-pointer transition-colors relative">
            <AnimatePresence mode="wait">
              {deletingId === entry.id ? (
                <motion.div 
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  className="bg-red-50/50 backdrop-blur-xl border border-red-100/50 rounded-2xl px-4 py-2 flex items-center space-x-6 shadow-xl shadow-red-900/5"
                >
                   <span className="text-[10px] text-red-500/80 tracking-[0.2em] font-medium uppercase">确认移出？</span>
                   <div className="flex items-center space-x-4">
                     <button onClick={handleDelete} className="text-[10px] text-red-600 hover:text-red-700 font-medium bg-red-100/50 px-3 py-1 rounded-lg active:scale-95 transition-all">确定</button>
                     <button onClick={() => setDeletingId(null)} className="text-[10px] text-ink/40 hover:text-ink/60 active:scale-95 transition-all px-2">取消</button>
                   </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={(e) => { e.stopPropagation(); setDeletingId(entry.id); }}
                >
                  <Trash2 size={20} strokeWidth={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="text-ink/20 hover:text-ink/60 cursor-pointer" onClick={onClose}>
            <X size={24} strokeWidth={1} />
          </div>
        </div>

        {/* Capturable Content */}
        <div ref={exportRef} className="space-y-16 flex-1">
          <div className="space-y-6">
            <p className="text-[10px] text-ink/20 uppercase tracking-[0.4em] font-light">
              {new Date(entry.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            {entry.title && (
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-ink tracking-wide leading-tight">{entry.title}</h2>
                <div className="h-[1px] w-8 bg-ink/20" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-[10px] text-ink/30 uppercase tracking-[0.3em] font-light">你写下的是：</p>
            <div className="text-ink/50 font-light text-sm leading-[2.2] border-l border-ink/5 pl-6 italic whitespace-pre-wrap">
              {entry.content}
            </div>
          </div>

          <div className="space-y-10 pb-20">
            <p className="text-[10px] text-ink/40 uppercase tracking-[0.3em] font-light">浮白回应你：</p>
            <div className="space-y-12">
              <p className="text-ink/90 font-serif text-base leading-[2.6] italic max-w-[95%] whitespace-pre-wrap">
                {entry.isSafetyTriggered 
                  ? "在这艰难时刻，浮白静默相伴。你并不孤单，请珍重眼下的光亮。" 
                  : entry.response}
              </p>
              <div className="h-[1px] w-12 bg-ink/10" />
            </div>
          </div>
          
          <div className={`pt-12 border-t border-ink/[0.03] transition-opacity duration-500 ${isExporting ? 'opacity-100' : 'opacity-0'}`}>
             <p className="text-[11px] text-ink/20 tracking-[0.6em] uppercase text-center font-serif">浮白 · Fubai</p>
             <p className="text-[8px] text-ink/10 tracking-[0.2em] text-center mt-2 uppercase font-light">AI Poetic Journal</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className={`mt-auto pt-20 flex justify-between items-center bg-transparent backdrop-blur-[2px] -mx-10 px-10 py-8 sticky bottom-0 transition-opacity ${isExporting ? 'opacity-0' : 'opacity-100'}`}>
          <button 
            onClick={onClose} 
            className="text-[10px] tracking-[0.4em] uppercase text-ink/40 hover:text-ink/60 transition-colors"
          >
            返回列表
          </button>
          <div className="flex space-x-12 text-ink/40">
              <button 
                onClick={handleShare}
                className="hover:text-ink/80 transition-colors"
              >
                <Share2 size={20} strokeWidth={1} />
              </button>
              <button 
                onClick={handleSaveImage}
                disabled={isExporting}
                className="hover:text-ink/80 transition-colors disabled:opacity-30"
              >
                {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} strokeWidth={1} />}
              </button>
              <button 
                onClick={() => handleToggleFavorite()}
                className="hover:text-ink/80 transition-colors"
              >
                {entry.isFavorite ? (
                  <BookmarkCheck size={20} strokeWidth={1} fill="currentColor" className="text-ink/60" />
                ) : (
                  <Bookmark size={20} strokeWidth={1} />
                )}
              </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
