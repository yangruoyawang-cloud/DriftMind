import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import Background from "./components/Background";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import History from "./components/History";
import Profile from "./components/Profile";
import Brief from "./components/Brief";
import Quotes from "./components/Quotes";
import UserPage from "./components/UserPage";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("write");
  const [theme, setTheme] = useState("跟随系统");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const themeValue = data.theme || "跟随系统";
        const fontSizeValue = data.fontSize || "standard";
        
        setTheme(themeValue);
        applyTheme(themeValue);
        applyFontSize(fontSizeValue);
      }
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const applyTheme = (themeName: string) => {
    const root = document.documentElement;
    let actualTheme = "paper";
    
    if (themeName === "浅色模式") actualTheme = "light";
    else if (themeName === "深色模式") actualTheme = "dark";
    else if (themeName === "古法宣纸") actualTheme = "paper";
    else if (themeName === "跟随系统") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    root.setAttribute("data-theme", actualTheme);
  };

  const applyFontSize = (fontSize: string) => {
    const root = document.documentElement;
    let size = "16px";
    if (fontSize === "fine") size = "14px";
    else if (fontSize === "bold") size = "20px";
    root.style.setProperty("--base-font-size", size);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border border-ink/10 border-t-ink/60 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Background />
        <Login />
      </>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-ink selection:text-paper relative">
      <Background variant={activeTab as any} />
      
      <main className="max-w-md mx-auto relative min-h-screen">
        {activeTab === "write" && <Home />}
        {activeTab === "history" && <History />}
        {activeTab === "profile" && <Profile />}
        {activeTab === "brief" && <Brief />}
        {activeTab === "quotes" && <Quotes />}
        {activeTab === "user" && <UserPage />}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Root alert for medical advice disclaimer */}
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div className="max-w-md mx-auto p-4 opacity-30 hover:opacity-100 transition-opacity">
           <p className="text-[0.5rem] text-center text-stone-400 font-light tracking-extra-widest">
             本应用不提供心理或医疗建议，仅用于文本理解与自我反思辅助
           </p>
        </div>
      </div>
    </div>
  );
}
