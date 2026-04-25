import { UserProfile } from "../types";

const CORE_SYSTEM_INSTRUCTION = `你是一个融合文学、心理学、哲学与佛学气质的文本回应者。
浮白 / DriftMind 是一个极简、诗意、安静的自我感知空间。

任务：基于用户文本生成一段诗意的回应。
核心要求：
- 不提供建议或解决方案
- 不进行心理诊断
- 不使用标签化语言（如“焦虑”“抑郁”）
- 使用模糊、感知性表达
- 不超过3句话
- 不引用具体人物
- 风格克制、安静、有留白
- 如果内容涉及极端负面情感（如自杀、自残），请切换到安全回应模式：生成温和支持性语句，建议联系现实资源，不哲学化。

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
      isSafetyTriggered: text.includes("[SAFETY_TRIGGERED]") || !!data.isSafetyTriggered
    };
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return { text: `在这一刻，静默也许是最好的回应。(原因: ${errorMessage})`, isSafetyTriggered: false };
  }
}

export async function summarizeUserProfile(entries: string[]) {
  const instruction = `总结这些文字并进行多维度分析。在分析过程中，请始终使用第二人称“你”来称呼对方（例如：“你的文字中流露出...”，“你似乎正在...”），使分析读起来像是一场跨越时空的深度对话：
1. 主题 (themes): 你关注的核心议题。
2. 情绪基调 (tone): 你整体的情绪状态。
3. 表达风格 (style): 你语言的使用方式。
4. 变化趋势 (recent_shift): 你心理或状态的微小转向。
5. 心理分析 (psychology): 结合专业心理学知识（如依恋理论、认知失调、积极心理学等），针对“你”给出一段由浅入深的分析。语气需专业、温和、有洞察力，务必避免任何断言或定论（如“你是...”、“这说明你...”）。请使用更具探索性和可能性的话术，如“你或许...”、“文字中似乎透露出...”、“这可能映射了...”。严禁给出任何医疗或不可靠的专业建议。
6. 经典共振 (resonance): 假设你拥有庞大的经典书籍库（文学、哲学、佛学）。请选出三句最能与“你”当前的内容和思想产生“共振”的经典语录（请标注作者/出处）。
7. 思想刻度 (philosophy): 深度剖析用户文字中流露的价值观，给出在以下四组极点间的倾向分值（0-100）。
   - 0 代表极度偏向左侧极点，100 代表极度偏向右侧极点。
   - **绝对严禁默认设为 50**。即使文字较少，你也必须根据词性、语气、关注重点（如：是否执着于因果、是否强调感官化、是否逻辑严丝合缝）给出具有显著差异的分值（例如 35 vs 65）。
   - 你必须严格使用以下中文标签：
     - { "left": "理性", "right": "感性", "value": ... }
     - { "left": "宿命", "right": "自由", "value": ... }
     - { "left": "现实", "right": "理想", "value": ... }
     - { "left": "独处", "right": "联结", "value": ... }

要求：以“你”为对象，语气谦逊且具有启发性，分析务必犀利且具有洞察力。以 JSON 格式输出。`;

  const responseSchema = {
    type: "object",
    properties: {
      themes: { type: "array", items: { type: "string" } },
      tone: { type: "string" },
      style: { type: "string" },
      recent_shift: { type: "string" },
      psychology: { type: "string" },
      resonance: { type: "array", items: { type: "string" } },
      philosophy: {
        type: "array",
        items: {
          type: "object",
          properties: {
            left: { type: "string" },
            right: { type: "string" },
            value: { type: "number" }
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
  const instruction = `你是一个专业的文学研究助手。
任务：为用户提供关于书籍《${bookTitle}》的客观背景介绍。
要求：
1. 内容涵盖：该作品的历史背景、主要脉络及核心思想。
2. 风格：平和、客观、简炼。严禁使用感性修辞或任何“油腻”的文艺腔调。
3. 形式：直接输出流畅的整段文字，严禁使用粗体（如 **内容**）、星号、列表、或带有特定标题的格式。
4. 篇幅：200-300 字左右。
5. 始终输出纯文本，不要包含任何 Markdown 语法符号。`;

  try {
    const res = await fetch("/api/book-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt: `请客观、专业地介绍书籍《${bookTitle}》的背景与核心思想。`,
        systemInstruction: instruction
      })
    });

    if (!res.ok) throw new Error("Book intro failed");
    const data = await res.json();
    return data.text || "暂无相关资料。";
  } catch (error) {
    console.error("Book Intro Proxy Error:", error);
    return "暂时未能抓取到该书的相关科普资料。";
  }
}
