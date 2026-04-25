type ClassicQuote = {
  text: string;
  author: string;
  tags: string[];
};

const CLASSIC_QUOTES: ClassicQuote[] = [
  { text: "道可道，非常道；名可名，非常名。", author: "《道德经》", tags: ["存在", "语言", "无常", "哲学"] },
  { text: "知人者智，自知者明。", author: "《道德经》", tags: ["自我", "认知", "觉察"] },
  { text: "己所不欲，勿施于人。", author: "《论语》", tags: ["关系", "伦理", "边界"] },
  { text: "逝者如斯夫，不舍昼夜。", author: "《论语》", tags: ["时间", "流动", "生命"] },
  { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原《离骚》", tags: ["坚持", "探索", "成长"] },
  { text: "人生天地之间，若白驹之过隙，忽然而已。", author: "《庄子》", tags: ["时间", "无常", "生命"] },
  { text: "安能摧眉折腰事权贵，使我不得开心颜。", author: "李白《梦游天姥吟留别》", tags: ["自我", "自由", "尊严"] },
  { text: "行到水穷处，坐看云起时。", author: "王维《终南别业》", tags: ["平静", "转折", "接纳"] },
  { text: "世界上只有一种真正的英雄主义，就是在认清生活真相之后依然热爱生活。", author: "罗曼·罗兰", tags: ["勇气", "现实", "希望"] },
  { text: "我认为，每一个不曾起舞的日子，都是对生命的辜负。", author: "尼采", tags: ["生命", "热情", "行动"] },
  { text: "你要自己发光，而不是借谁的光。", author: "鲁米", tags: ["自我", "独立", "价值"] },
  { text: "世间一切有为法，如梦幻泡影，如露亦如电，应作如是观。", author: "《金刚经》", tags: ["无常", "佛学", "放下"] },
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

  return ranked.slice(0, count).map(({ index }) => CLASSIC_QUOTE_LINES[index]);
}

export function sanitizeClassicResonance(input: string[] | undefined, fallbackCount = 3) {
  const valid = (input || []).filter((line) => CLASSIC_QUOTE_LINE_SET.has(line));
  if (valid.length >= fallbackCount) return valid.slice(0, fallbackCount);

  const missing = fallbackCount - valid.length;
  const fallback = CLASSIC_QUOTE_LINES.filter((line) => !valid.includes(line)).slice(0, missing);
  return [...valid, ...fallback];
}
