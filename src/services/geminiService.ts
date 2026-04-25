import { Type } from "@google/genai";
import { UserProfile } from "../types";

const CORE_SYSTEM_INSTRUCTION = `你是一个融合文学、心理学、哲学与佛学气质的文本回应者。
浮白 / DriftMind 是一个极简、诗意、安静的自我感知空间。

任务：基于用户文本生成一段诗意的回应。
核心要求：
- 不提供建议或解决方案
- 不进行心理诊断
- 不使用标签化语言
- 使用模糊、感知性表达
- 不超过3句话
- 风格克制、安静、有留白
- 如果内容涉及极端负面情感，请切换到安全回应模式：生成温和支持性语句，建议联系现实资源。

回复风格：像是在山间或水边的一次无声对视。`;

export async function generatePoeticResponse(content: string, profile?: UserProfile) {
  const instruction = `${CORE_SYSTEM_INSTRUCTION}
  
  CRITICAL SAFETY RULE: 
  If the user's text contains any mention of suicide, self-harm, or extreme danger to themselves or others, you MUST return exactly and ONLY the following string: [SAFETY_TRIGGERED]
  Do not generate any poetic response in this case.`;

  const prompt = `用户历史摘要：${profile ? JSON.stringify(profile) : "无"}
用户文本：${content}`;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, systemInstruction: instruction })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const text = data.text || "……";
    return {
      text,
      isSafetyTriggered: text === "[SAFETY_TRIGGERED]"
    };
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { text: `在这一刻，静默也许是最好的回应。(原因: ${errorMessage})`, isSafetyTriggered: false };
  }
}

export async function summarizeUserProfile(entries: string[]) {
  const instruction = `总结这些文字并进行分析，使用第二人称“你”：
1. themes: 主题。
2. tone: 情绪基准。
3. style: 表达风格。
4. psychology: 心理深度分析（语气谦逊）。
5. philosophy: 价值观分值倾向。
以 JSON 格式输出。`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      themes: { type: Type.ARRAY, items: { type: Type.STRING } },
      tone: { type: Type.STRING },
      style: { type: Type.STRING },
      recent_shift: { type: Type.STRING },
      psychology: { type: Type.STRING },
      resonance: { type: Type.ARRAY, items: { type: Type.STRING } },
      philosophy: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            left: { type: Type.STRING },
            right: { type: Type.STRING },
            value: { type: Type.NUMBER }
          },
          required: ["left", "right", "value"]
        }
      }
    },
    required: ["themes", "tone", "style", "recent_shift", "psychology", "resonance", "philosophy"],
  };

  try {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content: `最近记录：\n${entries.join("\n---\n")}`,
        systemInstruction: instruction,
        responseSchema
      })
    });

    if (!res.ok) throw new Error("Summarize failed");
    return await res.json();
  } catch (error) {
    console.error("Profile Proxy Error:", error);
    return null;
  }
}

export async function getBookIntroduction(bookTitle: string) {
  const instruction = `你是一个专业的文学研究助手。直接输出整段 200 字左右的《${bookTitle}》背景与思想介绍，不使用 Markdown 语法。`;

  try {
    const res = await fetch("/api/book-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt: `介绍书籍《${bookTitle}》`,
        systemInstruction: instruction
      })
    });

    if (!res.ok) throw new Error("Book intro failed");
    const data = await res.json();
    return data.text || "暂无相关资料。";
  } catch (error) {
    console.error("Book Intro Proxy Error:", error);
    return "暂时未能抓取到相关资料。";
  }
}
