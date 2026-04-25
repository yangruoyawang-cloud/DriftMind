import { PenLine, History, BarChart3, BookOpen, User, Feather } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "history", icon: History, label: "历史" },
    { id: "profile", icon: BarChart3, label: "自我" },
    { id: "write", icon: Feather, label: "书写" }, // Center button
    { id: "brief", icon: BookOpen, label: "小结" },
    { id: "user", icon: User, label: "我的" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-paper/60 backdrop-blur-xl border-t border-black/5 pb-safe">
        <div className="flex justify-between items-center px-4 h-24 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCenter = tab.id === "write";

            if (isCenter) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative -top-6 flex flex-col items-center justify-center"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 ${
                    isActive ? "bg-ink text-paper scale-110 shadow-2xl" : "bg-ink/80 text-paper/80"
                  }`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className={`text-[0.625rem] mt-2 font-light tracking-widest transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-40"}`}>书写</span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-500 w-12 pb-2 ${
                  isActive ? "text-ink" : "text-ink/30"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 1.5 : 1} />
                <span className="text-[0.625rem] font-light tracking-widest">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-6 w-1 h-1 bg-ink rounded-full" />
                )}
              </button>
            );
          })}
        </div>
    </div>
  );
}
