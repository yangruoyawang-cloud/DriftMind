import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db, auth, handleFirestoreError } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { OperationType, JournalEntry } from "../types";
import { Search, Bookmark, Trash2, BookmarkCheck } from "lucide-react";
import EntryDetail from "./EntryDetail";

export default function History() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const fetchEntries = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "entries"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedEntries = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
      })) as JournalEntry[];

      // Merge with local entries and filter out deleted
      const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
      const merged = [...fetchedEntries, ...localEntries]
        .filter(e => !e.isDeleted)
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      
      setEntries(merged);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (entryId: string) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) return;

      const isFirestore = entry.userId !== "anonymous";
      const deletedAt = new Date().toISOString();
      
      if (isFirestore) {
        await updateDoc(doc(db, "entries", entryId), {
          isDeleted: true,
          deletedAt: deletedAt
        });
      } else {
        const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
        const updated = localEntries.map((e: any) => 
          e.id === entryId ? { ...e, isDeleted: true, deletedAt } : e
        );
        localStorage.setItem("local_entries", JSON.stringify(updated));
      }
      
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      if (selectedEntry?.id === entryId) {
        setSelectedEntry(null);
      }
      setDeletingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `entries/${entryId}`);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, entry: JournalEntry) => {
    e.stopPropagation();
    const newStatus = !entry.isFavorite;
    try {
      await updateDoc(doc(db, "entries", entry.id), {
        isFavorite: newStatus
      });
      setEntries(prev => prev.map(item => item.id === entry.id ? { ...item, isFavorite: newStatus } : item));
      if (selectedEntry?.id === entry.id) {
        setSelectedEntry(prev => prev ? { ...prev, isFavorite: newStatus } : null);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `entries/${entry.id}`);
    }
  };

  const confirmDeleteAction = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    setDeletingId(entryId);
  };

  return (
    <div className="min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-10 pt-20 pb-32"
      >
        <div className="flex justify-between items-end mb-16">
          <h1 className="text-3xl font-serif tracking-[0.4em] text-ink/90">历史</h1>
          <div className="text-ink/20 hover:text-ink/60 transition-colors pb-1">
            <Search size={20} strokeWidth={1} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border border-ink/10 border-t-ink/60 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-32 space-y-8">
             <div className="w-20 h-20 mx-auto bg-mist/30 rounded-2xl border border-ink/5 flex items-center justify-center">
                <div className="w-10 h-10 border border-ink/5 rotate-45" />
             </div>
             <p className="text-ink/20 font-light tracking-[0.3em] text-[10px]">此刻静默，尚未落笔</p>
          </div>
        ) : (
          <div className="space-y-16 relative">
            <div className="absolute left-[3.25rem] top-0 bottom-0 w-[1px] bg-ink/5" />
            
            {entries.map((entry, i) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.1 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedEntry(entry)}
                className="flex items-start space-x-6 group cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="w-24 shrink-0 transition-opacity group-hover:opacity-100 opacity-60">
                  <p className="text-[10px] text-ink/40 font-light tracking-widest break-all">
                    {new Date(entry.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\//g, ' / ')}
                  </p>
                </div>

                <div className="flex-1 space-y-4">
                   <div className="flex justify-between items-start space-x-4">
                      {entry.title ? (
                        <p className="text-ink text-base font-serif tracking-wide leading-relaxed line-clamp-1">
                          {entry.title}
                        </p>
                      ) : (
                        <p className="text-ink/80 text-sm font-light leading-relaxed line-clamp-2 italic">
                          {entry.content}
                        </p>
                      )}
                    <div className="flex flex-col items-center">
                      <AnimatePresence mode="wait">
                        {deletingId === entry.id ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, x: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 10 }}
                            className="bg-red-50/50 backdrop-blur-xl border border-red-100/50 rounded-2xl p-3 flex flex-col items-center space-y-3 shadow-xl shadow-red-900/5 min-w-[80px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                             <span className="text-[9px] text-red-500/80 tracking-[0.2em] uppercase font-medium">确认移出？</span>
                             <div className="flex items-center space-x-4">
                               <button 
                                 onClick={() => handleDelete(entry.id)}
                                 className="text-[10px] text-red-600 hover:text-red-700 transition-all active:scale-95 font-medium px-2 py-1 bg-red-100/50 rounded-lg"
                               >
                                 确定
                               </button>
                               <button 
                                 onClick={() => setDeletingId(null)}
                                 className="text-[10px] text-ink/40 hover:text-ink/60 transition-all active:scale-95 px-2 py-1"
                               >
                                 取消
                               </button>
                             </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="flex items-center space-x-3 shrink-0"
                          >
                             <button 
                                onClick={(e) => confirmDeleteAction(e, entry.id)}
                                className="p-2 text-ink/10 hover:text-red-400/40 transition-colors"
                             >
                                <Trash2 size={14} strokeWidth={1.5} />
                             </button>
                             <button 
                                onClick={(e) => handleToggleFavorite(e, entry)}
                                className={`p-2 transition-colors ${entry.isFavorite ? 'text-ink/60' : 'text-ink/10 hover:text-ink/30'}`}
                             >
                                {entry.isFavorite ? <BookmarkCheck size={16} strokeWidth={1.5} fill="currentColor" /> : <Bookmark size={16} strokeWidth={1.5} />}
                             </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                   </div>
                   <div className="h-[1px] w-4 bg-ink/10" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Entry Detail Overlay */}
      <AnimatePresence>
        {selectedEntry && (
          <EntryDetail 
            entry={selectedEntry} 
            onClose={() => setSelectedEntry(null)} 
            onUpdate={(updated) => {
              setSelectedEntry(updated);
              setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
            }}
            onDelete={(id) => {
              setEntries(prev => prev.filter(e => e.id !== id));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
