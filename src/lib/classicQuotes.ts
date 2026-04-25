type ClassicQuote = {
  text: string;
  author: string;
  tags: string[];
  source: "cn" | "global";
};

const CLASSIC_QUOTES: ClassicQuote[] = [
  { text: "道可道，非常道；名可名，非常名。", author: "《道德经》", tags: ["存在", "语言", "无常", "哲学"], source: "cn" },
  { text: "知人者智，自知者明。", author: "《道德经》", tags: ["自我", "认知", "觉察"], source: "cn" },
  { text: "己所不欲，勿施于人。", author: "《论语》", tags: ["关系", "伦理", "边界"], source: "cn" },
  { text: "逝者如斯夫，不舍昼夜。", author: "《论语》", tags: ["时间", "流动", "生命"], source: "cn" },
  { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原《离骚》", tags: ["坚持", "探索", "成长"], source: "cn" },
  { text: "人生天地之间，若白驹之过隙，忽然而已。", author: "《庄子》", tags: ["时间", "无常", "生命"], source: "cn" },
  { text: "安能摧眉折腰事权贵，使我不得开心颜。", author: "李白《梦游天姥吟留别》", tags: ["自我", "自由", "尊严"], source: "cn" },
  { text: "行到水穷处，坐看云起时。", author: "王维《终南别业》", tags: ["平静", "转折", "接纳"], source: "cn" },
  { text: "面朝大海，春暖花开。", author: "海子《面朝大海，春暖花开》", tags: ["希望", "生活", "温柔"], source: "cn" },
  { text: "山重水复疑无路，柳暗花明又一村。", author: "陆游《游山西村》", tags: ["转折", "困境", "希望"], source: "cn" },
  { text: "世界上只有一种真正的英雄主义，就是在认清生活真相之后依然热爱生活。", author: "罗曼·罗兰", tags: ["勇气", "现实", "希望"], source: "global" },
  { text: "我认为，每一个不曾起舞的日子，都是对生命的辜负。", author: "尼采", tags: ["生命", "热情", "行动"], source: "global" },
  { text: "你要自己发光，而不是借谁的光。", author: "鲁米", tags: ["自我", "独立", "价值"], source: "global" },
  { text: "未经审视的人生不值得过。", author: "苏格拉底", tags: ["自省", "哲学", "人生"], source: "global" },
  { text: "一切都在流动，无物常驻。", author: "赫拉克利特", tags: ["变化", "无常", "时间"], source: "global" },
  { text: "To be, or not to be: that is the question.", author: "Shakespeare, Hamlet", tags: ["存在", "抉择", "痛苦"], source: "global" },
  { text: "The only way out is through.", author: "Robert Frost", tags: ["困境", "坚持", "勇气"], source: "global" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus", tags: ["希望", "韧性", "生命"], source: "global" },
  { text: "世间一切有为法，如梦幻泡影，如露亦如电，应作如是观。", author: "《金刚经》", tags: ["无常", "佛学", "放下"], source: "cn" },
  { text: "色不异空，空不异色。", author: "《心经》", tags: ["佛学", "存在", "空性"], source: "cn" },
  { text: "This too shall pass.", author: "Persian adage", tags: ["无常", "疗愈", "时间"], source: "global" },
];

const CLASSIC_QUOTE_LINES = CLASSIC_QUOTES.map((q) => `${q.text} —— ${q.author}`);
const CLASSIC_QUOTE_LINE_SET = new Set(CLASSIC_QUOTE_LINES);

function scoreQuote(quote: ClassicQuote, haystack: string): number {
  let score = 0;
  for (const tag of quote.tags) {
    if (haystack.includes(tag.toLowerCase())) score += 2;
  }
  if (haystack.includes(quote.author.toLowerCase())) score += 3;
  return score;
}

export function getClassicQuoteCards() {
  return CLASSIC_QUOTES.map(({ text, author }) => ({ text, author }));
}

export function selectClassicResonance(input: {
  entries?: string[];
  themes?: string[];
  tone?: string;
  style?: string;
  count?: number;
}) {
  const count = Math.max(1, Math.min(input.count ?? 3, CLASSIC_QUOTES.length));
  const haystack = [
    ...(input.entries || []),
    ...(input.themes || []),
    input.tone || "",
    input.style || "",
  ]
    .join("\n")
    .toLowerCase();

  const ranked = CLASSIC_QUOTES.map((q, index) => ({
    index,
    score: scoreQuote(q, haystack),
  })).sort((a, b) => b.score - a.score || a.index - b.index);

  const picks: number[] = [];
  const hasCn = () => picks.some((i) => CLASSIC_QUOTES[i].source === "cn");
  const hasGlobal = () => picks.some((i) => CLASSIC_QUOTES[i].source === "global");

  for (const { index } of ranked) {
    if (!picks.includes(index)) picks.push(index);
    if (picks.length >= count) break;
  }

  if (count >= 3) {
    if (!hasCn()) {
      const candidate = ranked.find(({ index }) => CLASSIC_QUOTES[index].source === "cn");
      if (candidate) picks[picks.length - 1] = candidate.index;
    }
    if (!hasGlobal()) {
      const candidate = ranked.find(({ index }) => CLASSIC_QUOTES[index].source === "global");
      if (candidate) picks[0] = candidate.index;
    }
  }

  const uniquePicks = Array.from(new Set(picks));
  for (const { index } of ranked) {
    if (uniquePicks.length >= count) break;
    if (!uniquePicks.includes(index)) uniquePicks.push(index);
  }
  return uniquePicks.map((index) => CLASSIC_QUOTE_LINES[index]);
}

export function sanitizeClassicResonance(input: string[] | undefined, fallbackCount = 3) {
  const valid = (input || []).filter((line) => CLASSIC_QUOTE_LINE_SET.has(line));
  if (valid.length >= fallbackCount) return valid.slice(0, fallbackCount);

  const missing = fallbackCount - valid.length;
  const fallback = CLASSIC_QUOTE_LINES.filter((line) => !valid.includes(line)).slice(0, missing);
  return [...valid, ...fallback];
}
