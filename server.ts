import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Use the platform-provided PORT in production deployments.
  const PORT = Number(process.env.PORT || 3000);
  const API_RATE_LIMIT_WINDOW_MS = Number(process.env.API_RATE_LIMIT_WINDOW_MS || 60_000);
  const API_RATE_LIMIT_MAX = Number(process.env.API_RATE_LIMIT_MAX || 30);

  // Required on Render/Proxy so req.ip reflects the caller IP.
  app.set("trust proxy", 1);
  app.use(express.json());

  const ipHitMap = new Map<string, { count: number; resetAt: number }>();
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipHitMap.entries()) {
      if (now >= data.resetAt) ipHitMap.delete(ip);
    }
  }, Math.max(30_000, API_RATE_LIMIT_WINDOW_MS)).unref();

  function apiRateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.path === "/api/health") return next();

    const now = Date.now();
    const ip = req.ip || "unknown";
    const current = ipHitMap.get(ip);

    if (!current || now >= current.resetAt) {
      ipHitMap.set(ip, { count: 1, resetAt: now + API_RATE_LIMIT_WINDOW_MS });
      return next();
    }

    if (current.count >= API_RATE_LIMIT_MAX) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfterMs: current.resetAt - now,
      });
    }

    current.count += 1;
    return next();
  }

  app.use("/api", apiRateLimit);

  // 基础健康检查
  app.get("/health", (req, res) => res.send("OK"));

  // 健康检查接口 - 用于排查环境变量
  app.get("/api/health", (req, res) => {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
    res.json({
      status: "ok",
      diagnostics: {
        HAS_KEY: !!key,
        NODE_ENV: process.env.NODE_ENV,
      }
    });
  });

  // API 代理接口
  app.post("/api/generate", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { systemInstruction, temperature: 0.8 }
      });
      res.json({ text: response.text || "……" });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "AI 调用失败" });
    }
  });

  app.post("/api/summarize", async (req, res) => {
    const { content, systemInstruction, responseSchema } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: content,
        config: { systemInstruction, responseMimeType: "application/json", responseSchema }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (err: any) {
      res.status(500).json({ error: "分析失败" });
    }
  });

  app.post("/api/book-info", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey });
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { systemInstruction, tools: [{ googleSearch: {} }] as any }
      });
      res.json({ text: response.text || "暂无相关资料。" });
    } catch (err: any) {
      res.status(500).json({ error: "抓取书籍信息失败" });
    }
  });

  // Vite 处理
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA 兜底路由：使用 *catchall 语法适配 Express v5
    app.get("*catchall", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
