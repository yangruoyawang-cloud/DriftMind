import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 辅助函数：脱敏显示 API Key
function maskKey(key: string | undefined) {
  if (!key) return "未定义";
  if (key.length <= 8) return "***";
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 路由 - Gemini 生成诗意回应
  app.post("/api/generate", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    
    const geminiKey = process.env.GEMINI_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;
    const apiKey = geminiKey || googleKey;

    console.log(`[Server] API Request. Keys status: GEMINI=${maskKey(geminiKey)}, GOOGLE=${maskKey(googleKey)}`);

    if (!apiKey) {
      console.error("[Error] No API Key found in environment variables.");
      return res.status(500).json({ 
        error: "环境变量中缺失 API Key。请在 AI Studio 设置(Settings) -> Secrets 中添加 GEMINI_API_KEY。" 
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      const text = response.text || "……";
      console.log("[Server] Poetic response generated successfully");
      res.json({ text });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[Gemini Error]", errorMessage);
      if (errorMessage.includes("SAFETY") || errorMessage.includes("blocked")) {
        return res.json({ text: "[SAFETY_TRIGGERED]", isSafetyTriggered: true });
      }
      res.status(500).json({ error: `Gemini API 错误: ${errorMessage}` });
    }
  });

  // API 路由 - 用户画像总结
  app.post("/api/summarize", async (req, res) => {
    const { content, systemInstruction, responseSchema } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: content,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("[Gemini Summarize Error]", error);
      res.status(500).json({ error: "总结分析失败" });
    }
  });

  // API 路由 - 书籍详情（带搜索）
  app.post("/api/book-info", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });

      res.json({ text: response.text || "暂无相关资料。" });
    } catch (error) {
      console.error("[Gemini Book Info Error]", error);
      res.status(500).json({ error: "抓取书籍资料失败" });
    }
  });

  // Vite 模式适配
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
