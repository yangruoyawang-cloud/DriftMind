import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Bookmark, Trash2, HelpCircle, Info, ChevronLeft, Calendar, BookmarkCheck, Shield, Lock, Database, Bell, Sun, Type, UserCheck, Download } from "lucide-react";
import { auth, db, handleFirestoreError } from "../lib/firebase";
import { collection, query, where, getCountFromServer, getDocs, orderBy, doc, getDoc, setDoc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { JournalEntry, OperationType } from "../types";
import EntryDetail from "./EntryDetail";

export default function UserPage() {
  const user = auth.currentUser;
  const [entryCount, setEntryCount] = useState<number | null>(null);
  const [daysCount, setDaysCount] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [aboutSubPage, setAboutSubPage] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [appConfig, setAppConfig] = useState<{ logoURL: string } | null>(null);
  const [showManageApp, setShowManageApp] = useState(false);
  const [isUpdatingAppConfig, setIsUpdatingAppConfig] = useState(false);
  const [appUpdateMessage, setAppUpdateMessage] = useState<string | null>(null);
  const [subSetting, setSubSetting] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [userSettings, setUserSettings] = useState<{
    isPrivate: boolean;
    cloudSync: boolean;
    theme: string;
    fontSize: string;
    notifications: { dailyReminder: boolean; systemMessages: boolean };
    displayName: string;
    photoURL: string;
  }>({
    isPrivate: false,
    cloudSync: true,
    theme: "跟随系统",
    fontSize: "标准",
    notifications: { dailyReminder: true, systemMessages: false },
    displayName: "",
    photoURL: ""
  });
  const [loadingSetting, setLoadingSetting] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState("未知设备");
  const [location, setLocation] = useState("正在定位...");

  useEffect(() => {
    // Detect device
    const ua = navigator.userAgent;
    let device = "桌面端设备";
    if (/android/i.test(ua)) device = "Android 设备";
    else if (/iPad|iPhone|iPod/.test(ua)) device = "iOS 设备";
    else if (/Macintosh/.test(ua)) device = "Mac";
    else if (/Windows/.test(ua)) device = "Windows PC";
    
    setDeviceInfo(`${device} (${navigator.language})`);

    // Simple location detection (using a public free API)
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data.city && data.region) {
          setLocation(`${data.city}, ${data.country_name}`);
        }
      })
      .catch(() => setLocation("未知地点"));
  }, []);
  const [favorites, setFavorites] = useState<JournalEntry[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [trash, setTrash] = useState<JournalEntry[]>([]);
  const [loadingTrash, setLoadingTrash] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTrash = async () => {
    if (!user) return;
    setLoadingTrash(true);
    try {
      const q = query(
        collection(db, "entries"),
        where("userId", "==", user.uid),
        where("isDeleted", "==", true),
        orderBy("deletedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
        deletedAt: doc.data().deletedAt
      })) as JournalEntry[];
      
      const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
      const localTrash = localEntries.filter((e: any) => e.isDeleted);
      
      const merged = [...fetched, ...localTrash].sort((a, b) => 
        new Date(b.deletedAt || 0).getTime() - new Date(a.deletedAt || 0).getTime()
      );

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const filtered = merged.filter(e => new Date(e.deletedAt || 0) > thirtyDaysAgo);
      
      setTrash(filtered);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "trash");
    } finally {
      setLoadingTrash(false);
    }
  };

  useEffect(() => {
    if (showTrash) {
      fetchTrash();
    }
  }, [showTrash]);

  const handleRestore = async (entry: JournalEntry) => {
    try {
      const isFirestore = entry.userId !== "anonymous";
      if (isFirestore) {
        await updateDoc(doc(db, "entries", entry.id), {
          isDeleted: false,
          deletedAt: null
        });
      } else {
        const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
        const updated = localEntries.map((e: any) => 
          e.id === entry.id ? { ...e, isDeleted: false, deletedAt: null } : e
        );
        localStorage.setItem("local_entries", JSON.stringify(updated));
      }
      setTrash(prev => prev.filter(e => e.id !== entry.id));
      setEntryCount(prev => prev !== null ? prev + 1 : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `entries/${entry.id}`);
    }
  };

  const handlePermanentDelete = async (entry: JournalEntry) => {
    try {
      const isFirestore = entry.userId !== "anonymous";
      if (isFirestore) {
        await deleteDoc(doc(db, "entries", entry.id));
      } else {
        const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
        const filtered = localEntries.filter((e: any) => e.id !== entry.id);
        localStorage.setItem("local_entries", JSON.stringify(filtered));
      }
      setTrash(prev => prev.filter(e => e.id !== entry.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `entries/${entry.id}`);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    setLoadingFavorites(true);
    try {
      const q = query(
        collection(db, "entries"),
        where("userId", "==", user.uid),
        where("isFavorite", "==", true),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
      })) as JournalEntry[];
      setFavorites(fetched);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "favorites");
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    if (showFavorites) {
      fetchFavorites();
    }
  }, [showFavorites]);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      // Fetch entry count
      try {
        const q = query(collection(db, "entries"), where("userId", "==", user.uid));
        const snapshot = await getCountFromServer(q);
        const cloudCount = snapshot.data().count;
        const localEntries = JSON.parse(localStorage.getItem("local_entries") || "[]");
        setEntryCount(cloudCount + localEntries.length);
      } catch (error) {
        console.error("Error fetching entry count:", error);
      }

      // Calculate days count
      if (user.metadata.creationTime) {
        const createdDate = new Date(user.metadata.creationTime);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysCount(diffDays || 1); // Minimum 1 day
      }
    }

    fetchStats();
  }, [user]);

  useEffect(() => {
    async function fetchUserSettings() {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserSettings({
            isPrivate: data.isPrivate ?? false,
            cloudSync: data.cloudSync ?? true,
            theme: data.theme ?? "跟随系统",
            fontSize: data.fontSize ?? "标准",
            notifications: data.notifications ?? { dailyReminder: true, systemMessages: false },
            displayName: data.displayName ?? user.displayName ?? "",
            photoURL: data.photoURL ?? user.photoURL ?? ""
          });
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    }
    async function fetchAppConfig() {
      try {
        const configDoc = await getDoc(doc(db, "config", "global"));
        if (configDoc.exists()) {
          setAppConfig(configDoc.data() as { logoURL: string });
        }
      } catch (error) {
        console.error("Error fetching app config:", error);
      }
    }
    fetchUserSettings();
    fetchAppConfig();
  }, [user]);

  const [tempProfile, setTempProfile] = useState({ displayName: "", photoURL: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userSettings.displayName || userSettings.photoURL) {
      setTempProfile({
        displayName: userSettings.displayName || "",
        photoURL: userSettings.photoURL || ""
      });
    }
  }, [userSettings.displayName, userSettings.photoURL]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_WIDTH) {
              width *= MAX_WIDTH / height;
              height = MAX_WIDTH;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Use high quality compression (0.7) for JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setTempProfile(prev => ({ ...prev, photoURL: compressedDataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = async () => {
    setLoadingSetting("profile");
    try {
      if (tempProfile.displayName !== userSettings.displayName) {
        await updateSetting("displayName", tempProfile.displayName);
      }
      
      if (tempProfile.photoURL !== userSettings.photoURL) {
        // Now that we compress images, we can safely store them in Firestore
        // as long as they are under ~200kb (well within 1MB limit)
        if (tempProfile.photoURL.length < 500000) { // 500KB safety gate
          await updateSetting("photoURL", tempProfile.photoURL);
        } else {
          console.error("Image still too large after compression");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSetting(null);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    if (!user) return;
    setLoadingSetting(key);
    try {
      const updateData: any = { updatedAt: serverTimestamp() };
      
      // Handle nested notifications
      if (key.startsWith("notifications.")) {
        const subKey = key.split(".")[1];
        const newNotifications = {
          ...userSettings.notifications,
          [subKey]: value
        };
        updateData.notifications = newNotifications;
        setUserSettings(prev => ({
          ...prev,
          notifications: newNotifications
        }));
      } else {
        updateData[key] = value;
        setUserSettings(prev => ({ ...prev, [key]: value }));
      }

      await setDoc(doc(db, "users", user.uid), updateData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoadingSetting(null);
    }
  };

  const menuItems = [
    { icon: Bookmark, label: "我的收藏", onClick: () => setShowFavorites(true) },
    { icon: Trash2, label: "回收站", onClick: () => setShowTrash(true) },
    { icon: HelpCircle, label: "帮助与反馈", onClick: () => setShowHelp(true) },
    { icon: Shield, label: "设置与安全", onClick: () => setShowSettings(true) },
    { icon: Info, label: "关于浮白", onClick: () => setShowAbout(true) },
  ];

  if (user?.email === 'yangruoya.wang@gmail.com') {
    menuItems.splice(4, 0, { icon: Lock, label: "应用管理", onClick: () => setShowManageApp(true) });
  }

  if (showManageApp) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-10 pt-20 pb-32 min-h-screen"
      >
        <div className="flex items-center space-x-4 mb-16">
          <button onClick={() => setShowManageApp(false)} className="p-2 -ml-2 text-ink/40">
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">应用管理</h1>
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-1 h-3 bg-ink/20 rounded-full" />
              <span className="text-[11px] text-ink/40 tracking-widest uppercase font-medium">应用标识 APP LOGO</span>
            </div>
            
            <div className="bg-white/20 p-8 rounded-3xl border border-white/60 flex flex-col items-center space-y-8">
              <div className="w-24 h-24 bg-ink/5 rounded-full flex items-center justify-center border border-ink/5 overflow-hidden">
                <img 
                  src={appConfig?.logoURL || "/logo.svg"} 
                  alt="App Logo" 
                  className="w-14 h-14"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Ik04IDEyaDhtLTQgNHYtOCIvPjwvc3ZnPg==';
                  }}
                />
              </div>

              <div className="w-full space-y-4">
                <input 
                  type="file" 
                  accept="image/*"
                  id="logo-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const img = new Image();
                        img.src = reader.result as string;
                        img.onload = async () => {
                          const canvas = document.createElement('canvas');
                          const size = 120;
                          canvas.width = size;
                          canvas.height = size;
                          const ctx = canvas.getContext('2d');
                          ctx?.drawImage(img, 0, 0, size, size);
                          const compressed = canvas.toDataURL('image/png');
                          
                          setIsUpdatingAppConfig(true);
                          try {
                            await setDoc(doc(db, "config", "global"), {
                              logoURL: compressed,
                              updatedAt: serverTimestamp()
                            }, { merge: true });
                            setAppConfig({ logoURL: compressed });
                            setAppUpdateMessage("应用 Logo 已更新");
                            setTimeout(() => setAppUpdateMessage(null), 3000);
                          } catch (err) {
                            console.error(err);
                            setAppUpdateMessage("更新失败，请检查权限");
                            setTimeout(() => setAppUpdateMessage(null), 3000);
                          } finally {
                            setIsUpdatingAppConfig(false);
                          }
                        };
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <motion.label
                  whileTap={{ scale: 0.98 }}
                  htmlFor="logo-upload"
                  className="w-full py-4 bg-ink flex items-center justify-center space-x-3 text-white/90 text-[10px] tracking-[0.4em] uppercase rounded-2xl cursor-pointer shadow-xl shadow-ink/10"
                >
                  {isUpdatingAppConfig ? "正在上传..." : "上传新 LOGO"}
                </motion.label>
                {appUpdateMessage && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-center text-ink/60 font-medium tracking-widest pt-2"
                  >
                    {appUpdateMessage}
                  </motion.p>
                )}
                <p className="text-[8px] text-ink/20 text-center tracking-[0.2em]">建议上传 1:1 透明背景 PNG 图片</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showHelp) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-10 pt-20 pb-32 min-h-screen"
      >
        <div className="flex items-center space-x-4 mb-16">
          <button onClick={() => setShowHelp(false)} className="p-2 -ml-2 text-ink/40">
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">帮助与反馈</h1>
        </div>

        <div className="space-y-12 pb-10">
          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-1 h-3 bg-ink/20 rounded-full" />
              <span className="text-[11px] text-ink/40 tracking-widest uppercase font-medium">常见问题 FAQ</span>
            </div>
            
            <div className="space-y-3">
              {[
                { q: "内容会同步到云端吗？", a: "如果您开启了“数据与备份-云端同步”，您的每一条心情记录都会加密存储于云端。若未开启，数据将仅保留在您的本地浏览器缓存中。" },
                { q: "删除记录可以恢复吗？", a: "被删除的记录会进入“回收站”，您可以在 30 天内随时恢复。超过 30 天或手动彻底删除后将无法找回。" },
                { q: "关于 AI 回应的局限性？", a: "AI 系统基于当前的文学模型生成回应。它旨在提供情绪陪伴与映照，不具备替代专业心理咨询的功能。" },
                { q: "如何更换头像和昵称？", a: "进入“设置与安全 - 昵称与头像”，点击头像可选择本地图片，修改昵称后点击底部的保存按钮即可同步。" }
              ].map((item, i) => (
                <details key={i} className="group bg-white/10 rounded-2xl border border-white/40 overflow-hidden transition-all duration-300">
                  <summary className="list-none flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-sm text-ink/70 font-medium">{item.q}</span>
                    <ChevronRight size={14} className="text-ink/20 group-open:rotate-90 transition-transform duration-300 pointer-events-none" />
                  </summary>
                  <div className="px-6 pb-5 pt-1">
                    <p className="text-xs text-ink/50 leading-relaxed font-light">
                      {item.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-1 h-3 bg-ink/20 rounded-full" />
              <span className="text-[11px] text-ink/40 tracking-widest uppercase font-medium">意见反馈 Feedback</span>
            </div>

            <div className="bg-white/20 p-8 rounded-3xl border border-white/60 space-y-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {feedbackSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="py-12 flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center">
                      <BookmarkCheck size={24} className="text-ink/60" />
                    </div>
                    <p className="text-sm text-ink/70 font-medium tracking-widest">提交成功</p>
                    <p className="text-[10px] text-ink/30 italic">感谢您的声音，我们会细心聆听</p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      onClick={() => setFeedbackSubmitted(false)}
                      className="text-[10px] text-ink/40 hover:text-ink/60 underline underline-offset-4 pt-4"
                    >
                      继续反馈
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="space-y-3">
                      <label className="text-[9px] text-ink/30 uppercase tracking-[0.2em] ml-1">我想对浮白说...</label>
                      <textarea 
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="告诉我们您的想法，或描述您遇到的困难..."
                        rows={4}
                        disabled={isSubmittingFeedback}
                        className="w-full bg-ink/[0.02] border-none focus:ring-0 focus:bg-ink/[0.05] outline-none rounded-2xl px-6 py-5 text-sm font-light text-ink/80 placeholder-ink/20 transition-all duration-500 resize-none shadow-inner disabled:opacity-50"
                      />
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      disabled={!feedbackText.trim() || isSubmittingFeedback}
                      onClick={async () => {
                        setIsSubmittingFeedback(true);
                        try {
                          const feedbackId = Math.random().toString(36).substring(7);
                          await setDoc(doc(db, "feedback", feedbackId), {
                            content: feedbackText,
                            userId: user?.uid,
                            userEmail: user?.email || "",
                            createdAt: serverTimestamp()
                          });
                          setFeedbackSubmitted(true);
                          setFeedbackText("");
                        } catch (error) {
                          handleFirestoreError(error, OperationType.WRITE, "feedback");
                        } finally {
                          setIsSubmittingFeedback(false);
                        }
                      }}
                      className="w-full py-5 bg-ink/90 text-white/90 text-[10px] tracking-[0.6em] uppercase rounded-2xl shadow-xl shadow-ink/10 transition-all hover:bg-ink hover:shadow-2xl active:scale-[0.98] disabled:bg-ink/20 disabled:shadow-none"
                    >
                      {isSubmittingFeedback ? "正在送达..." : "提交反馈"}
                    </motion.button>
                    
                    <p className="text-[8px] text-ink/20 text-center tracking-[0.1em] italic">您的声音对浮白的成长至关重要</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Contact Info */}
          <div className="pt-6 text-center space-y-2">
            <p className="text-[9px] text-ink/20 tracking-[0.4em] uppercase">浮白 Fubai · v1.0.4</p>
            <p className="text-[8px] text-ink/20 tracking-[0.2em]">support@fubai.notreal</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showAbout) {
    if (aboutSubPage) {
      const getLegalContent = () => {
        switch(aboutSubPage) {
          case 'agreement':
            return {
              title: "用户协议",
              content: [
                { h: "1. 服务的本质", p: "浮白提供基于人工智能的情绪映射与交互服务。请理解 AI 生成的内容具有一定的随机性，仅供参考，不代表专业心理咨询建议。" },
                { h: "2. 用户准则", p: "您在使用过程中应遵守当地法律法规，不得利用本平台生成、存储或传播反动、暴力、色情等违规内容。一旦触发安全防御，相关输入将不予记录。" },
                { h: "3. 知识产权", p: "您在浮白创作的日记内容所有权归您个人所有。平台旨在保护您的隐私与创作权。" },
                { h: "4. 免责声明", p: "因不可抗力或不可预见的系统漏洞导致的故障，平台将尽力修复但不承担由此产生的间接损失。" }
              ]
            };
          case 'privacy':
            return {
              title: "隐私政策",
              content: [
                { h: "1. 数据存储方式", p: "默认情况下，您的日记存储在本地浏览器。若开启云端同步，数据将加密上传至受保护的云服务端。" },
                { h: "2. 信息安全保障", p: "我们采用端到端传输加密技术，除您本人外，任何包括平台维护人员在内的第三方均无法查看您的具体内容。" },
                { h: "3. 权限说明", p: "头像上传功能需访问您的存储空间或相机权限，仅用于提取图片并在您的设备及个人账户中展示。" },
                { h: "4. 用户控制权", p: "您拥有对个人数据的绝对控制权，包括随时手动删除记录或注销账户，所有云端备份将同步销毁。" }
              ]
            };
          case 'license':
            return {
              title: "开源许可",
              content: [
                { h: "Framer Motion", p: "Production-ready motion library for React. MIT License." },
                { h: "Lucide React", p: "Beautiful & consistent icon toolkit. ISC License." },
                { h: "Tailwind CSS", p: "A utility-first CSS framework. MIT License." },
                { h: "Google Firebase", p: "Cloud database and authentication platform." },
                { h: "React Hook Form", p: "Performant, flexible and extensible forms with easy-to-use validation." }
              ]
            };
          default: return { title: "", content: [] };
        }
      };

      const legal = getLegalContent();

      return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-10 pt-20 pb-32 min-h-screen"
        >
          <div className="flex items-center space-x-4 mb-16">
            <button onClick={() => setAboutSubPage(null)} className="p-2 -ml-2 text-ink/40">
              <ChevronLeft size={24} strokeWidth={1} />
            </button>
            <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">{legal.title}</h1>
          </div>
          <div className="space-y-10">
            {legal.content.map((section, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-[11px] text-ink/80 tracking-widest font-medium border-b border-ink/5 pb-2">
                  {section.h}
                </h3>
                <p className="text-xs text-ink/50 leading-relaxed font-light">
                  {section.p}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-10 pt-20 pb-32 min-h-screen"
      >
        <div className="flex items-center space-x-4 mb-16">
          <button onClick={() => setShowAbout(false)} className="p-2 -ml-2 text-ink/40">
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">关于浮白</h1>
        </div>

        <div className="space-y-16 max-w-sm mx-auto text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-ink/5 rounded-full mx-auto flex items-center justify-center border border-ink/5 overflow-hidden">
               <img src={appConfig?.logoURL || "/logo.svg"} alt="Fubai" className="w-12 h-12 opacity-80" onError={(e) => {
                 (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Ik04IDEyaDhtLTQgNHYtOCIvPjwvc3ZnPg==';
               }} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-serif tracking-[0.4em] text-ink/80">浮白 Fubai</h2>
              <p className="text-[10px] text-ink/20 tracking-[0.2em] uppercase">Vers. 1.0.4</p>
            </div>
          </div>

          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[10px] text-ink/30 uppercase tracking-[0.3em] font-medium block">我们的宗旨 / Our Mission</span>
              <div className="space-y-4 text-xs text-ink/50 leading-relaxed font-light">
                <p>
                  在这个快节奏的数字时代，我们往往拥有无数次对话，却少有一次真正属于自己的深呼吸。
                </p>
                <p>
                  浮白的诞生，是为了给万千负重前行的灵魂提供一处静谧的落脚点。我们不追求效率，不崇尚算法，只在乎您此时此刻最真实的感知。
                </p>
                <p>
                   通过文字的自然舒展与 AI 的温柔映照，我们希望让每一次情绪的起伏都能被看见，让每一个隐秘的念头都能得到一次不带审视的回应。
                </p>
                <p>
                  在这里，您可以卸下所有的伪装与克制，只向自己倾诉。浮白，既是您的分身，也是您的树洞，更是那抹照亮阴霾的微弱白光。
                </p>
              </div>
            </div>

            <div className="pt-10 border-t border-ink/5 space-y-4">
              <button 
                onClick={() => setAboutSubPage('agreement')}
                className="w-full flex justify-between items-center text-[10px] text-ink/30 tracking-widest hover:text-ink/60 transition-colors"
              >
                <span>用户协议</span>
                <ChevronRight size={12} />
              </button>
              <button 
                onClick={() => setAboutSubPage('privacy')}
                className="w-full flex justify-between items-center text-[10px] text-ink/30 tracking-widest hover:text-ink/60 transition-colors"
              >
                <span>隐私政策</span>
                <ChevronRight size={12} />
              </button>
              <button 
                onClick={() => setAboutSubPage('license')}
                className="w-full flex justify-between items-center text-[10px] text-ink/30 tracking-widest hover:text-ink/60 transition-colors"
              >
                <span>开源许可</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          <p className="text-[8px] text-ink/20 tracking-[0.2em] font-light italic">
            让每一片灵魂，都有诗意栖息的角落。
          </p>
        </div>
      </motion.div>
    );
  }

  if (showSettings) {
    const settingsCategories = [
      { 
        title: "账号与安全",
        items: [
          { icon: Shield, label: "昵称与头像", id: "profile" },
          { icon: Lock, label: "账号与隐私", id: "privacy" },
          { icon: Database, label: "数据与备份", id: "data" },
          { icon: UserCheck, label: "安全检测", id: "security" },
        ]
      },
      {
        title: "系统设置",
        items: [
          { icon: Bell, label: "通知设置", id: "notify" },
          { icon: Sun, label: "主题模式", id: "theme" },
          { icon: Type, label: "字体大小", id: "font" },
        ]
      }
    ];

    if (subSetting) {
      return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-10 pt-20 pb-32 min-h-screen"
        >
          <div className="flex items-center space-x-4 mb-16">
            <button onClick={() => { setSubSetting(null); setShowClearConfirm(false); }} className="p-2 -ml-2 text-ink/40">
              <ChevronLeft size={24} strokeWidth={1} />
            </button>
            <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">
              {subSetting === "profile" && "昵称与头像"}
              {subSetting === "privacy" && "账号与隐私"}
              {subSetting === "data" && "数据与备份"}
              {subSetting === "security" && "安全检测"}
              {subSetting === "notify" && "通知设置"}
              {subSetting === "theme" && "主题模式"}
              {subSetting === "font" && "字体大小"}
            </h1>
          </div>

          <div className="space-y-8">
            {subSetting === "profile" && (
              <div className="space-y-8">
                <div className="flex flex-col items-center space-y-6 mb-8">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-xl relative group cursor-pointer"
                  >
                    <img 
                      src={tempProfile.photoURL || user?.photoURL || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=250&auto=format&fit=crop"} 
                      alt="Avatar" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download size={20} className="text-white" />
                    </div>
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  <p className="text-[10px] text-ink/30 tracking-widest italic">点击上方头像更换本地图片</p>
                </div>

                <div className="bg-white/20 p-8 rounded-2xl border border-white/40 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] text-ink/30 uppercase tracking-[0.2em] ml-2">我的昵称</label>
                    <input 
                      type="text"
                      value={tempProfile.displayName}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="设置一个柔和的名字"
                      className="w-full bg-ink/[0.02] border-none focus:ring-0 focus:bg-ink/[0.05] outline-none rounded-xl px-4 py-3 text-sm font-serif text-ink/80 placeholder-ink/20 transition-all duration-500"
                    />
                  </div>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={saveProfileChanges}
                    disabled={loadingSetting === "profile"}
                    className="w-full py-4 bg-ink/5 hover:bg-ink/10 text-ink/60 hover:text-ink text-[10px] tracking-[0.4em] uppercase transition-all rounded-xl border border-ink/5 disabled:opacity-50"
                  >
                    {loadingSetting === "profile" ? "同步中..." : "保存修改"}
                  </motion.button>
                </div>
              </div>
            )}

            {subSetting === "privacy" && (
              <div className="space-y-6">
                <div className="bg-white/20 p-6 rounded-2xl border border-white/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink/60">账号ID</span>
                    <span className="text-xs font-mono text-ink/30 tracking-tight">{user?.uid.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink/60">绑定邮箱</span>
                    <span className="text-xs text-ink/40">{user?.email}</span>
                  </div>
                </div>
                <div className="bg-white/20 p-6 rounded-2xl border border-white/40 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-ink/60">私密账号</span>
                    <button 
                      onClick={() => updateSetting("isPrivate", !userSettings.isPrivate)}
                      disabled={loadingSetting === "isPrivate"}
                      className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${userSettings.isPrivate ? 'bg-ink/40' : 'bg-ink/10'} ${loadingSetting === "isPrivate" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <motion.div 
                        animate={{ x: userSettings.isPrivate ? 16 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                       />
                    </button>
                  </div>
                  <p className="text-[0.625rem] text-ink/20 leading-relaxed italic">开启后，你的心情记录将完全加密，仅在本地及云端同步，不参与任何去中心化推荐。</p>
                </div>
              </div>
            )}

            {subSetting === "data" && (
              <div className="space-y-6">
                 <div className="bg-white/20 p-6 rounded-2xl border border-white/40 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-sm text-ink/60">云端同步</span>
                      <p className="text-[0.625rem] text-ink/20 italic">开启后，记录将实时同步至云端，多端共享。</p>
                    </div>
                    <button 
                      onClick={() => updateSetting("cloudSync", !userSettings.cloudSync)}
                      disabled={loadingSetting === "cloudSync"}
                      className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${userSettings.cloudSync ? 'bg-ink/40' : 'bg-ink/10'} ${loadingSetting === "cloudSync" ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <motion.div 
                        animate={{ x: userSettings.cloudSync ? 16 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                       />
                    </button>
                 </div>
                 <button 
                  onClick={async () => {
                    if (!user) return;
                    const q = query(collection(db, "entries"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
                    const snapshot = await getDocs(q);
                    const data = snapshot.docs.map(doc => doc.data());
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `fubai-export-${new Date().getTime()}.json`;
                    a.click();
                  }}
                  className="w-full flex items-center justify-between p-6 bg-white/20 rounded-2xl border border-white/40 group active:scale-[0.98] transition-all"
                 >
                    <span className="text-sm text-ink/80 tracking-widest">导出全部记录 (JSON)</span>
                    <Download size={14} className="text-ink/20" />
                 </button>
                 <div className="relative">
                   <AnimatePresence mode="wait">
                     {!showClearConfirm ? (
                       <motion.button 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full flex items-center justify-between p-6 bg-white/20 rounded-2xl border border-white/40 group active:scale-[0.98] transition-all"
                       >
                          <span className="text-sm text-ink/80 tracking-widest">清除本地缓存</span>
                          <Trash2 size={14} className="text-ink/20" />
                       </motion.button>
                     ) : (
                       <motion.div 
                        key="confirm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full p-6 bg-red-50/30 rounded-2xl border border-red-200/20 flex flex-col items-center space-y-4"
                       >
                          <span className="text-xs text-red-500/60 tracking-[0.2em]">确定清除所有草稿并刷新应用？</span>
                          <div className="flex space-x-8">
                             <button 
                              onClick={() => {
                                localStorage.removeItem("draft_title");
                                localStorage.removeItem("draft_content");
                                window.location.reload();
                              }}
                              className="text-xs text-red-500 font-medium tracking-widest"
                             >
                               确定
                             </button>
                             <button 
                              onClick={() => setShowClearConfirm(false)}
                              className="text-xs text-ink/30 tracking-widest"
                             >
                               取消
                             </button>
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
              </div>
            )}

            {subSetting === "security" && (
              <div className="space-y-6">
                 <div className="bg-white/20 p-6 rounded-2xl border border-white/40 space-y-4">
                    <div className="flex items-center space-x-3 text-green-500/60">
                       <UserCheck size={16} />
                       <span className="text-sm font-light tracking-widest">环境安全</span>
                    </div>
                    <p className="text-xs text-ink/40 font-light">当前设备：{deviceInfo}</p>
                 </div>
                 <div className="p-6 space-y-4">
                    <p className="text-[0.625rem] text-ink/20 uppercase tracking-[0.3em]">最近登录活动</p>
                    <div className="text-xs text-ink/40 font-light space-y-6">
                       <div className="space-y-1">
                         <p className="text-ink/80">{new Date().toLocaleString('zh-CN')} · {location}</p>
                         <p className="text-[0.625rem] text-green-500/60 tracking-wider uppercase">当前会话 · 在线</p>
                       </div>
                       {user?.metadata.lastSignInTime && (
                         <div className="space-y-1 opacity-60">
                           <p>{new Date(user.metadata.lastSignInTime).toLocaleString('zh-CN')} · {location}</p>
                           <p className="text-[0.625rem] tracking-widest uppercase">上次登录活动</p>
                         </div>
                       )}
                       {user?.metadata.creationTime && (
                         <div className="space-y-1 opacity-40">
                           <p>{new Date(user.metadata.creationTime).toLocaleString('zh-CN')}</p>
                           <p className="text-[0.625rem] tracking-widest uppercase">账号注册时间</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            )}

            {subSetting === "notify" && (
              <div className="space-y-6">
                 <div className="bg-white/20 p-6 rounded-2xl border border-white/40 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-ink/60">每日落笔提醒</span>
                      <button 
                        onClick={() => updateSetting("notifications.dailyReminder", !userSettings.notifications.dailyReminder)}
                        className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${userSettings.notifications.dailyReminder ? 'bg-ink/40' : 'bg-ink/10'}`}
                      >
                        <motion.div 
                          animate={{ x: userSettings.notifications.dailyReminder ? 16 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                        />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-ink/60">系统消息通知</span>
                      <button 
                        onClick={() => updateSetting("notifications.systemMessages", !userSettings.notifications.systemMessages)}
                        className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${userSettings.notifications.systemMessages ? 'bg-ink/40' : 'bg-ink/10'}`}
                      >
                        <motion.div 
                          animate={{ x: userSettings.notifications.systemMessages ? 16 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                        />
                      </button>
                    </div>
                 </div>
                 <p className="text-[0.625rem] text-ink/20 text-center italic tracking-widest">在繁杂的世界里，浮白只会在安静时轻轻唤你。</p>
              </div>
            )}

            {subSetting === "theme" && (
              <div className="grid grid-cols-2 gap-4">
                 {["跟随系统", "浅色模式", "深色模式", "古法宣纸"].map((t) => (
                    <button 
                      key={t} 
                      onClick={() => updateSetting("theme", t)}
                      className={`p-6 rounded-2xl border transition-all text-center ${userSettings.theme === t ? 'border-ink/40 bg-white/40 ring-1 ring-ink/10' : 'border-white/40 bg-white/10'}`}
                    >
                       <span className="text-sm font-light text-ink/80 tracking-widest">{t}</span>
                    </button>
                 ))}
              </div>
            )}

            {subSetting === "font" && (
              <div className="space-y-12 py-10">
                 <div className="text-center space-y-4">
                   <p className={`text-ink/90 font-serif italic transition-all duration-300 ${userSettings.fontSize === 'fine' ? 'text-sm' : userSettings.fontSize === 'bold' ? 'text-2xl' : 'text-lg'}`}>
                     文字如浮白，在纸张上自由呼吸。
                   </p>
                 </div>
                 <div className="px-6 space-y-6">
                    <div className="h-1 bg-ink/10 rounded-full relative group">
                       <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-between items-center -mx-1">
                          {['fine', 'standard', 'bold'].map(size => (
                            <div 
                              key={size}
                              onClick={() => updateSetting("fontSize", size)}
                              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${userSettings.fontSize === size ? 'bg-white border-2 border-ink/40 w-4 h-4 z-10' : 'bg-ink/5 hover:bg-ink/20'}`} 
                            />
                          ))}
                       </div>
                    </div>
                    <div className="flex justify-between text-[0.625rem] text-ink/20 tracking-[0.2em]">
                       <span className={`cursor-pointer ${userSettings.fontSize === 'fine' ? 'text-ink/60' : ''}`} onClick={() => updateSetting("fontSize", 'fine')}>细腻</span>
                       <span className={`cursor-pointer ${userSettings.fontSize === 'standard' ? 'text-ink/60' : ''}`} onClick={() => updateSetting("fontSize", 'standard')}>标准</span>
                       <span className={`cursor-pointer ${userSettings.fontSize === 'bold' ? 'text-ink/60' : ''}`} onClick={() => updateSetting("fontSize", 'bold')}>苍劲</span>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-10 pt-20 pb-32 min-h-screen"
      >
        <div className="flex items-center space-x-4 mb-16">
          <button onClick={() => { setShowSettings(false); setSubSetting(null); setShowClearConfirm(false); }} className="p-2 -ml-2 text-ink/40">
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">设置与安全</h1>
        </div>

        <div className="space-y-12">
          {settingsCategories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <p className="text-[10px] text-ink/20 uppercase tracking-[0.4em] px-2">{category.title}</p>
              <div className="space-y-3">
                {category.items.map((item, i) => (
                  <button key={i} onClick={() => setSubSetting(item.id)} className="w-full flex items-center justify-between p-6 bg-white/20 rounded-2xl border border-white/40 hover:bg-white/40 transition-all group">
                    <div className="flex items-center space-x-4">
                      <item.icon size={18} strokeWidth={1} className="text-ink/40 group-hover:text-ink/80 transition-colors" />
                      <span className="text-sm font-light text-ink/80 tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-ink/20" />
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="pt-10">
             <button 
              className="w-full p-6 text-red-400/60 text-sm font-light tracking-[0.3em] uppercase border border-red-400/10 rounded-2xl hover:bg-red-50 transition-colors"
              onClick={() => auth.signOut()}
             >
                退出登录
             </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showFavorites) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-10 pt-20 pb-32 min-h-screen"
      >
        <div className="flex items-center space-x-4 mb-16">
          <button onClick={() => setShowFavorites(false)} className="p-2 -ml-2 text-ink/40">
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">我的收藏</h1>
        </div>

        {loadingFavorites ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border border-ink/10 border-t-ink/60 rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-32 space-y-6">
            <Bookmark size={32} strokeWidth={1} className="mx-auto text-ink/10" />
            <p className="text-ink/20 text-xs font-light tracking-widest leading-relaxed">
              尚未在文字里找到想珍藏的瞬间
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {favorites.map((entry) => (
              <motion.div 
                key={entry.id} 
                onClick={() => setSelectedEntry(entry)}
                whileHover={{ x: 4 }}
                className="space-y-6 border-b border-ink/5 pb-10 cursor-pointer group active:scale-[0.99] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-[10px] text-ink/30 font-light tracking-[0.2em]">
                     <Calendar size={12} strokeWidth={1} />
                     <span>{new Date(entry.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkCheck size={14} className="text-ink/30" />
                  </div>
                </div>
                <div className="space-y-4">
                  {entry.title && (
                    <h3 className="text-lg font-serif text-ink tracking-wide">{entry.title}</h3>
                  )}
                  <p className="text-sm text-ink/60 font-light leading-relaxed line-clamp-3 italic">
                    {entry.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Entry Detail Overlay */}
        <AnimatePresence>
          {selectedEntry && (
            <EntryDetail 
              entry={selectedEntry} 
              onClose={() => setSelectedEntry(null)} 
              onUpdate={(updated) => {
                setSelectedEntry(updated);
                if (!updated.isFavorite) {
                  setFavorites(prev => prev.filter(e => e.id !== updated.id));
                  setSelectedEntry(null);
                } else {
                  setFavorites(prev => prev.map(e => e.id === updated.id ? updated : e));
                }
              }}
              onDelete={(id) => {
                setFavorites(prev => prev.filter(e => e.id !== id));
                setEntryCount(prev => prev !== null ? prev - 1 : null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (showTrash) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-10 pt-20 pb-32 min-h-screen"
      >
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowTrash(false)} className="p-2 -ml-2 text-ink/40">
              <ChevronLeft size={24} strokeWidth={1} />
            </button>
            <h1 className="text-2xl font-serif tracking-[0.2em] text-ink/90">回收站</h1>
          </div>
          <div className="bg-ink/5 px-3 py-1 rounded-full">
             <span className="text-[10px] text-ink/30 tracking-widest">保留30天</span>
          </div>
        </div>

        {loadingTrash ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border border-ink/10 border-t-ink/60 rounded-full animate-spin" />
          </div>
        ) : trash.length === 0 ? (
          <div className="text-center py-32 space-y-6">
            <Trash2 size={32} strokeWidth={1} className="mx-auto text-ink/10" />
            <p className="text-ink/20 text-xs font-light tracking-widest leading-relaxed">
              这里空空如也，没有被遗落的思绪
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {trash.map((entry) => (
              <motion.div 
                key={entry.id} 
                className="space-y-6 border-b border-ink/5 pb-10 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-[10px] text-ink/30 font-light tracking-[0.2em]">
                     <Calendar size={12} strokeWidth={1} />
                     <span>删除于 {new Date(entry.deletedAt!).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <AnimatePresence mode="wait">
                      {deletingId === entry.id ? (
                        <motion.div 
                          initial={{ opacity: 0, x: 10, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 10, scale: 0.95 }}
                          className="bg-red-50/50 backdrop-blur-xl border border-red-100/50 rounded-2xl p-2 flex items-center space-x-4 shadow-lg shadow-red-900/5"
                        >
                           <span className="text-[9px] text-red-500/80 tracking-widest uppercase font-medium ml-2">彻底删除？</span>
                           <div className="flex items-center space-x-3">
                             <button 
                               onClick={() => handlePermanentDelete(entry)}
                               className="text-[10px] text-red-600 hover:text-red-700 font-medium px-3 py-1 bg-red-100/50 rounded-lg active:scale-95 transition-all"
                             >
                               是
                             </button>
                             <button 
                               onClick={() => setDeletingId(null)}
                               className="text-[10px] text-ink/40 hover:text-ink/60 px-2 active:scale-95 transition-all"
                             >
                               否
                             </button>
                           </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-4"
                        >
                          <button 
                            onClick={() => handleRestore(entry)}
                            className="text-[10px] text-ink/60 hover:text-ink tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            恢复
                          </button>
                          <button 
                            onClick={() => setDeletingId(entry.id)}
                            className="text-[10px] text-red-400/40 hover:text-red-500 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            删除
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="space-y-4">
                  {entry.title && (
                    <h3 className="text-lg font-serif text-ink tracking-wide opacity-60">{entry.title}</h3>
                  )}
                  <p className="text-sm text-ink/40 font-light leading-relaxed line-clamp-2 italic">
                    {entry.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-10 pt-24 pb-32 space-y-16"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-xl">
           <img 
            src={userSettings.photoURL || user?.photoURL || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=250&auto=format&fit=crop"} 
            alt="Avatar" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
           />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-serif text-ink group relative">
            {userSettings.displayName || "浮白与你同在"}
          </h2>
          <p className="text-[10px] text-ink/30 tracking-[0.3em] font-light">
             记录 {entryCount !== null ? entryCount : "..."} 条 · 陪伴 {daysCount !== null ? daysCount : "..."} 天
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-4">
        {menuItems.map((item, i) => (
          <button key={i} onClick={item.onClick} className="w-full flex items-center justify-between p-6 bg-white/20 rounded-2xl border border-white/40 hover:bg-white/40 transition-all group">
            <div className="flex items-center space-x-4">
              <item.icon size={18} strokeWidth={1} className="text-ink/40 group-hover:text-ink/80 transition-colors" />
              <span className="text-sm font-light text-ink/80 tracking-widest">{item.label}</span>
            </div>
            <ChevronRight size={16} strokeWidth={1} className="text-ink/20" />
          </button>
        ))}
      </div>

      <button 
        onClick={() => auth.signOut()}
        className="w-full py-4 text-[10px] text-ink/20 hover:text-ink/60 tracking-[0.4em] uppercase transition-colors"
      >
        退出宇宙
      </button>
    </motion.div>
  );
}
