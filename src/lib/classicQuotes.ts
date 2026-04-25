type ClassicQuote = {
  text: string;
  author: string;
  tags: string[];
  source: "cn" | "global";
};

const CLASSIC_QUOTES: ClassicQuote[] = [
  { text: "道可道，非常道；名可名，非常名。", author: "《道德经》", tags: ["存在", "语言", "无常", "哲学"], source: "cn" },
  { text: "知人者智，自知者明。", author: "《道德经》", tags: ["自我", "认知", "觉察"], source: "cn" },
  { text: "上善若水。", author: "《道德经》", tags: ["柔软", "德行", "处世"], source: "cn" },
  { text: "祸兮福之所倚，福兮祸之所伏。", author: "《道德经》", tags: ["辩证", "命运", "变化"], source: "cn" },
  { text: "合抱之木，生于毫末；九层之台，起于累土。", author: "《道德经》", tags: ["成长", "积累", "行动"], source: "cn" },
  { text: "大音希声，大象无形。", author: "《道德经》", tags: ["美学", "哲学", "空灵"], source: "cn" },
  { text: "己所不欲，勿施于人。", author: "《论语》", tags: ["关系", "伦理", "边界"], source: "cn" },
  { text: "逝者如斯夫，不舍昼夜。", author: "《论语》", tags: ["时间", "流动", "生命"], source: "cn" },
  { text: "学而不思则罔，思而不学则殆。", author: "《论语》", tags: ["学习", "反思", "成长"], source: "cn" },
  { text: "三人行，必有我师焉。", author: "《论语》", tags: ["谦逊", "学习", "关系"], source: "cn" },
  { text: "君子和而不同。", author: "《论语》", tags: ["关系", "包容", "伦理"], source: "cn" },
  { text: "知之者不如好之者，好之者不如乐之者。", author: "《论语》", tags: ["学习", "热爱", "生命"], source: "cn" },
  { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原《离骚》", tags: ["坚持", "探索", "成长"], source: "cn" },
  { text: "长太息以掩涕兮，哀民生之多艰。", author: "屈原《离骚》", tags: ["悲悯", "现实", "生命"], source: "cn" },
  { text: "亦余心之所善兮，虽九死其犹未悔。", author: "屈原《离骚》", tags: ["信念", "坚持", "尊严"], source: "cn" },
  { text: "人生天地之间，若白驹之过隙，忽然而已。", author: "《庄子》", tags: ["时间", "无常", "生命"], source: "cn" },
  { text: "相濡以沫，不如相忘于江湖。", author: "《庄子》", tags: ["关系", "自由", "放下"], source: "cn" },
  { text: "吾生也有涯，而知也无涯。", author: "《庄子》", tags: ["学习", "有限", "无限"], source: "cn" },
  { text: "至人无己，神人无功，圣人无名。", author: "《庄子》", tags: ["自我", "超越", "哲学"], source: "cn" },
  { text: "天地与我并生，而万物与我为一。", author: "《庄子》", tags: ["存在", "整体", "哲学"], source: "cn" },
  { text: "安能摧眉折腰事权贵，使我不得开心颜。", author: "李白《梦游天姥吟留别》", tags: ["自我", "自由", "尊严"], source: "cn" },
  { text: "长风破浪会有时，直挂云帆济沧海。", author: "李白《行路难》", tags: ["希望", "坚持", "勇气"], source: "cn" },
  { text: "天生我材必有用，千金散尽还复来。", author: "李白《将进酒》", tags: ["自信", "生命", "热情"], source: "cn" },
  { text: "举杯邀明月，对影成三人。", author: "李白《月下独酌》", tags: ["孤独", "诗意", "自处"], source: "cn" },
  { text: "行到水穷处，坐看云起时。", author: "王维《终南别业》", tags: ["平静", "转折", "接纳"], source: "cn" },
  { text: "明月松间照，清泉石上流。", author: "王维《山居秋暝》", tags: ["自然", "宁静", "诗意"], source: "cn" },
  { text: "大漠孤烟直，长河落日圆。", author: "王维《使至塞上》", tags: ["广阔", "孤独", "壮美"], source: "cn" },
  { text: "独在异乡为异客，每逢佳节倍思亲。", author: "王维《九月九日忆山东兄弟》", tags: ["乡愁", "关系", "情感"], source: "cn" },
  { text: "无边落木萧萧下，不尽长江滚滚来。", author: "杜甫《登高》", tags: ["历史", "时间", "苍茫"], source: "cn" },
  { text: "会当凌绝顶，一览众山小。", author: "杜甫《望岳》", tags: ["志向", "勇气", "成长"], source: "cn" },
  { text: "读书破万卷，下笔如有神。", author: "杜甫《奉赠韦左丞丈二十二韵》", tags: ["学习", "积累", "表达"], source: "cn" },
  { text: "朱门酒肉臭，路有冻死骨。", author: "杜甫《自京赴奉先县咏怀五百字》", tags: ["现实", "社会", "悲悯"], source: "cn" },
  { text: "两个黄鹂鸣翠柳，一行白鹭上青天。", author: "杜甫《绝句》", tags: ["自然", "明亮", "生机"], source: "cn" },
  { text: "沉舟侧畔千帆过，病树前头万木春。", author: "刘禹锡《酬乐天扬州初逢席上见赠》", tags: ["重生", "希望", "转折"], source: "cn" },
  { text: "旧时王谢堂前燕，飞入寻常百姓家。", author: "刘禹锡《乌衣巷》", tags: ["历史", "变迁", "现实"], source: "cn" },
  { text: "千淘万漉虽辛苦，吹尽狂沙始到金。", author: "刘禹锡《浪淘沙》", tags: ["坚持", "磨炼", "成长"], source: "cn" },
  { text: "同是天涯沦落人，相逢何必曾相识。", author: "白居易《琵琶行》", tags: ["共情", "关系", "命运"], source: "cn" },
  { text: "回眸一笑百媚生，六宫粉黛无颜色。", author: "白居易《长恨歌》", tags: ["爱情", "美", "历史"], source: "cn" },
  { text: "野火烧不尽，春风吹又生。", author: "白居易《赋得古原草送别》", tags: ["重生", "生命", "韧性"], source: "cn" },
  { text: "离离原上草，一岁一枯荣。", author: "白居易《赋得古原草送别》", tags: ["无常", "生命", "季节"], source: "cn" },
  { text: "春江潮水连海平，海上明月共潮生。", author: "张若虚《春江花月夜》", tags: ["宇宙", "时间", "诗意"], source: "cn" },
  { text: "江畔何人初见月？江月何年初照人？", author: "张若虚《春江花月夜》", tags: ["存在", "时间", "哲学"], source: "cn" },
  { text: "海上生明月，天涯共此时。", author: "张九龄《望月怀远》", tags: ["思念", "关系", "时间"], source: "cn" },
  { text: "前不见古人，后不见来者。", author: "陈子昂《登幽州台歌》", tags: ["孤独", "历史", "存在"], source: "cn" },
  { text: "念天地之悠悠，独怆然而涕下。", author: "陈子昂《登幽州台歌》", tags: ["宇宙", "孤独", "情感"], source: "cn" },
  { text: "山重水复疑无路，柳暗花明又一村。", author: "陆游《游山西村》", tags: ["困境", "转折", "希望"], source: "cn" },
  { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游《冬夜读书示子聿》", tags: ["行动", "实践", "学习"], source: "cn" },
  { text: "零落成泥碾作尘，只有香如故。", author: "陆游《卜算子·咏梅》", tags: ["品格", "坚持", "尊严"], source: "cn" },
  { text: "小楼一夜听春雨，深巷明朝卖杏花。", author: "陆游《临安春雨初霁》", tags: ["日常", "春天", "诗意"], source: "cn" },
  { text: "莫道不销魂，帘卷西风，人比黄花瘦。", author: "李清照《醉花阴》", tags: ["情感", "思念", "细腻"], source: "cn" },
  { text: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。", author: "李清照《声声慢》", tags: ["孤独", "情绪", "细腻"], source: "cn" },
  { text: "此情无计可消除，才下眉头，却上心头。", author: "李清照《一剪梅》", tags: ["思念", "情感", "无奈"], source: "cn" },
  { text: "生当作人杰，死亦为鬼雄。", author: "李清照《夏日绝句》", tags: ["气节", "勇气", "尊严"], source: "cn" },
  { text: "大江东去，浪淘尽，千古风流人物。", author: "苏轼《念奴娇·赤壁怀古》", tags: ["历史", "时间", "豪迈"], source: "cn" },
  { text: "回首向来萧瑟处，归去，也无风雨也无晴。", author: "苏轼《定风波》", tags: ["心境", "超然", "接纳"], source: "cn" },
  { text: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。", author: "苏轼《定风波》", tags: ["自由", "勇气", "从容"], source: "cn" },
  { text: "不识庐山真面目，只缘身在此山中。", author: "苏轼《题西林壁》", tags: ["认知", "局限", "哲学"], source: "cn" },
  { text: "但愿人长久，千里共婵娟。", author: "苏轼《水调歌头》", tags: ["思念", "祝愿", "关系"], source: "cn" },
  { text: "欲把西湖比西子，淡妆浓抹总相宜。", author: "苏轼《饮湖上初晴后雨》", tags: ["美", "自然", "诗意"], source: "cn" },
  { text: "众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。", author: "辛弃疾《青玉案·元夕》", tags: ["寻找", "顿悟", "关系"], source: "cn" },
  { text: "醉里挑灯看剑，梦回吹角连营。", author: "辛弃疾《破阵子》", tags: ["理想", "历史", "壮志"], source: "cn" },
  { text: "了却君王天下事，赢得生前身后名。", author: "辛弃疾《破阵子》", tags: ["责任", "理想", "历史"], source: "cn" },
  { text: "少年不识愁滋味，爱上层楼。", author: "辛弃疾《丑奴儿》", tags: ["成长", "青春", "情绪"], source: "cn" },
  { text: "而今识尽愁滋味，欲说还休。", author: "辛弃疾《丑奴儿》", tags: ["成长", "成熟", "情绪"], source: "cn" },
  { text: "人生若只如初见，何事秋风悲画扇。", author: "纳兰性德《木兰花令》", tags: ["关系", "无常", "思念"], source: "cn" },
  { text: "等闲变却故人心，却道故人心易变。", author: "纳兰性德《木兰花令》", tags: ["关系", "变化", "情感"], source: "cn" },
  { text: "一生一代一双人，争教两处销魂。", author: "纳兰性德《画堂春》", tags: ["爱情", "思念", "孤独"], source: "cn" },
  { text: "我是人间惆怅客，知君何事泪纵横。", author: "纳兰性德《浣溪沙》", tags: ["共情", "情绪", "人间"], source: "cn" },
  { text: "采菊东篱下，悠然见南山。", author: "陶渊明《饮酒》", tags: ["自然", "平静", "自处"], source: "cn" },
  { text: "结庐在人境，而无车马喧。", author: "陶渊明《饮酒》", tags: ["自处", "宁静", "边界"], source: "cn" },
  { text: "羁鸟恋旧林，池鱼思故渊。", author: "陶渊明《归园田居》", tags: ["乡愁", "本真", "自由"], source: "cn" },
  { text: "久在樊笼里，复得返自然。", author: "陶渊明《归园田居》", tags: ["自由", "自然", "回归"], source: "cn" },
  { text: "面朝大海，春暖花开。", author: "海子《面朝大海，春暖花开》", tags: ["希望", "生活", "温柔"], source: "cn" },
  { text: "从明天起，做一个幸福的人。", author: "海子《面朝大海，春暖花开》", tags: ["愿望", "生活", "希望"], source: "cn" },
  { text: "黑夜给了我黑色的眼睛，我却用它寻找光明。", author: "顾城《一代人》", tags: ["希望", "黑暗", "寻找"], source: "cn" },
  { text: "你站在桥上看风景，看风景的人在楼上看你。", author: "卞之琳《断章》", tags: ["视角", "关系", "哲学"], source: "cn" },
  { text: "世界以痛吻我，要我报之以歌。", author: "泰戈尔《飞鸟集》", tags: ["痛苦", "转化", "希望"], source: "global" },
  { text: "生如夏花之绚烂，死如秋叶之静美。", author: "泰戈尔《飞鸟集》", tags: ["生命", "美", "无常"], source: "global" },
  { text: "我们把世界看错了，反说它欺骗我们。", author: "泰戈尔《飞鸟集》", tags: ["认知", "现实", "哲学"], source: "global" },
  { text: "当你为错过太阳而哭泣的时候，你也要再错过群星了。", author: "泰戈尔《飞鸟集》", tags: ["遗憾", "当下", "希望"], source: "global" },
  { text: "If you shed tears when you miss the sun, you also miss the stars.", author: "Tagore, Stray Birds", tags: ["遗憾", "当下", "希望"], source: "global" },
  { text: "The world puts off its mask of vastness to its lover.", author: "Tagore, Stray Birds", tags: ["爱", "世界", "诗意"], source: "global" },
  { text: "世界上只有一种真正的英雄主义，就是在认清生活真相之后依然热爱生活。", author: "罗曼·罗兰", tags: ["勇气", "现实", "希望"], source: "global" },
  { text: "我认为，每一个不曾起舞的日子，都是对生命的辜负。", author: "尼采", tags: ["生命", "热情", "行动"], source: "global" },
  { text: "你要自己发光，而不是借谁的光。", author: "鲁米", tags: ["自我", "独立", "价值"], source: "global" },
  { text: "未经审视的人生不值得过。", author: "苏格拉底", tags: ["自省", "哲学", "人生"], source: "global" },
  { text: "认识你自己。", author: "德尔斐箴言", tags: ["自我", "觉察", "哲学"], source: "global" },
  { text: "我唯一知道的是我一无所知。", author: "苏格拉底", tags: ["谦逊", "认知", "哲学"], source: "global" },
  { text: "幸福在于灵魂的德性活动。", author: "亚里士多德", tags: ["幸福", "德性", "行动"], source: "global" },
  { text: "我们反复做的事造就了我们。", author: "亚里士多德", tags: ["习惯", "成长", "行动"], source: "global" },
  { text: "Man is by nature a political animal.", author: "Aristotle", tags: ["社会", "关系", "哲学"], source: "global" },
  { text: "一切都在流动，无物常驻。", author: "赫拉克利特", tags: ["变化", "无常", "时间"], source: "global" },
  { text: "No man ever steps in the same river twice.", author: "Heraclitus", tags: ["变化", "无常", "时间"], source: "global" },
  { text: "To be, or not to be: that is the question.", author: "Shakespeare, Hamlet", tags: ["存在", "抉择", "痛苦"], source: "global" },
  { text: "There is nothing either good or bad, but thinking makes it so.", author: "Shakespeare, Hamlet", tags: ["认知", "评价", "哲学"], source: "global" },
  { text: "The fault, dear Brutus, is not in our stars, but in ourselves.", author: "Shakespeare, Julius Caesar", tags: ["责任", "命运", "自我"], source: "global" },
  { text: "All the world’s a stage, and all the men and women merely players.", author: "Shakespeare, As You Like It", tags: ["人生", "角色", "哲学"], source: "global" },
  { text: "Love all, trust a few, do wrong to none.", author: "Shakespeare, All’s Well That Ends Well", tags: ["关系", "伦理", "边界"], source: "global" },
  { text: "I think, therefore I am.", author: "Descartes", tags: ["存在", "理性", "哲学"], source: "global" },
  { text: "Cogito, ergo sum.", author: "Descartes", tags: ["存在", "理性", "哲学"], source: "global" },
  { text: "人是自由的，却无往不在枷锁之中。", author: "卢梭《社会契约论》", tags: ["自由", "社会", "矛盾"], source: "global" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", tags: ["谦逊", "认知", "哲学"], source: "global" },
  { text: "Liberty consists in doing what one desires.", author: "John Stuart Mill", tags: ["自由", "责任", "选择"], source: "global" },
  { text: "地狱即他人。", author: "萨特《禁闭》", tags: ["关系", "存在", "冲突"], source: "global" },
  { text: "他人是我的镜子。", author: "萨特", tags: ["自我", "关系", "存在"], source: "global" },
  { text: "真正严肃的哲学问题只有一个，那就是自杀。", author: "加缪《西西弗神话》", tags: ["存在", "荒诞", "生命"], source: "global" },
  { text: "我们必须想象西西弗是幸福的。", author: "加缪《西西弗神话》", tags: ["荒诞", "坚持", "自由"], source: "global" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus", tags: ["希望", "韧性", "生命"], source: "global" },
  { text: "The only way out is through.", author: "Robert Frost", tags: ["困境", "坚持", "勇气"], source: "global" },
  { text: "Two roads diverged in a wood, and I— I took the one less traveled by.", author: "Robert Frost", tags: ["选择", "人生", "独立"], source: "global" },
  { text: "Do not go gentle into that good night.", author: "Dylan Thomas", tags: ["抗争", "生命", "勇气"], source: "global" },
  { text: "Rage, rage against the dying of the light.", author: "Dylan Thomas", tags: ["抗争", "生命", "坚持"], source: "global" },
  { text: "I have measured out my life with coffee spoons.", author: "T. S. Eliot", tags: ["日常", "时间", "现代性"], source: "global" },
  { text: "April is the cruellest month.", author: "T. S. Eliot", tags: ["季节", "情绪", "现代性"], source: "global" },
  { text: "Not all those who wander are lost.", author: "J. R. R. Tolkien", tags: ["探索", "自我", "旅程"], source: "global" },
  { text: "Even the smallest person can change the course of the future.", author: "J. R. R. Tolkien", tags: ["希望", "行动", "勇气"], source: "global" },
  { text: "It is our choices that show what we truly are.", author: "J. K. Rowling", tags: ["选择", "自我", "价值"], source: "global" },
  { text: "Happiness can be found even in the darkest of times.", author: "J. K. Rowling", tags: ["希望", "黑暗", "光"], source: "global" },
  { text: "A room without books is like a body without a soul.", author: "Cicero", tags: ["阅读", "精神", "成长"], source: "global" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche", tags: ["意义", "韧性", "生命"], source: "global" },
  { text: "That which does not kill us makes us stronger.", author: "Nietzsche", tags: ["痛苦", "成长", "韧性"], source: "global" },
  { text: "Become who you are.", author: "Nietzsche", tags: ["自我", "成长", "存在"], source: "global" },
  { text: "One must still have chaos in oneself to be able to give birth to a dancing star.", author: "Nietzsche", tags: ["创造", "混沌", "生命"], source: "global" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi", tags: ["疗愈", "痛苦", "灵性"], source: "global" },
  { text: "Wherever you are, and whatever you do, be in love.", author: "Rumi", tags: ["爱", "当下", "灵性"], source: "global" },
  { text: "What you seek is seeking you.", author: "Rumi", tags: ["寻找", "命运", "灵性"], source: "global" },
  { text: "Out beyond ideas of wrongdoing and rightdoing, there is a field. I’ll meet you there.", author: "Rumi", tags: ["超越", "关系", "灵性"], source: "global" },
  { text: "Stay close to anything that makes you glad you are alive.", author: "Hafez", tags: ["生命", "喜悦", "当下"], source: "global" },
  { text: "I am large, I contain multitudes.", author: "Walt Whitman", tags: ["自我", "复杂性", "接纳"], source: "global" },
  { text: "Do I contradict myself? Very well then I contradict myself.", author: "Walt Whitman", tags: ["自我", "矛盾", "接纳"], source: "global" },
  { text: "Hope is the thing with feathers.", author: "Emily Dickinson", tags: ["希望", "诗意", "生命"], source: "global" },
  { text: "Forever is composed of nows.", author: "Emily Dickinson", tags: ["当下", "时间", "存在"], source: "global" },
  { text: "Tell all the truth but tell it slant.", author: "Emily Dickinson", tags: ["真相", "表达", "诗意"], source: "global" },
  { text: "I took a deep breath and listened to the old brag of my heart: I am, I am, I am.", author: "Sylvia Plath", tags: ["生命", "存在", "自我"], source: "global" },
  { text: "And still, like dust, I’ll rise.", author: "Maya Angelou", tags: ["韧性", "尊严", "重生"], source: "global" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou", tags: ["表达", "痛苦", "写作"], source: "global" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot", tags: ["成长", "希望", "可能"], source: "global" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", tags: ["行动", "开始", "成长"], source: "global" },
  { text: "Courage is resistance to fear, mastery of fear, not absence of fear.", author: "Mark Twain", tags: ["勇气", "恐惧", "成长"], source: "global" },
  { text: "The unexamined life is not worth living.", author: "Socrates", tags: ["自省", "哲学", "人生"], source: "global" },
  { text: "Know thyself.", author: "Delphi Maxim", tags: ["自我", "觉察", "哲学"], source: "global" },
  { text: "He who knows others is wise; he who knows himself is enlightened.", author: "Lao Tzu", tags: ["自我", "认知", "觉察"], source: "global" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", tags: ["自然", "节奏", "从容"], source: "global" },
  { text: "When I let go of what I am, I become what I might be.", author: "Lao Tzu", tags: ["放下", "成长", "变化"], source: "global" },
  { text: "Those who know do not speak. Those who speak do not know.", author: "Lao Tzu", tags: ["沉默", "智慧", "边界"], source: "global" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", tags: ["行动", "开始", "坚持"], source: "global" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", tags: ["美学", "简洁", "创造"], source: "global" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci", tags: ["学习", "成长", "热爱"], source: "global" },
  { text: "Where there is shouting, there is no true knowledge.", author: "Leonardo da Vinci", tags: ["沟通", "智慧", "边界"], source: "global" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius", tags: ["美", "认知", "觉察"], source: "global" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", tags: ["坚持", "节奏", "成长"], source: "global" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", tags: ["失败", "重生", "韧性"], source: "global" },
  { text: "Silence is a true friend who never betrays.", author: "Confucius", tags: ["沉默", "关系", "自处"], source: "global" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", tags: ["自我", "力量", "成长"], source: "global" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson", tags: ["自我", "独立", "勇气"], source: "global" },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson", tags: ["自然", "耐心", "节奏"], source: "global" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", tags: ["生活", "简化", "觉察"], source: "global" },
  { text: "The only true journey is the one within.", author: "Rainer Maria Rilke", tags: ["自我", "旅程", "内在"], source: "global" },
  { text: "Let everything happen to you: beauty and terror. Just keep going. No feeling is final.", author: "Rainer Maria Rilke", tags: ["接纳", "情绪", "坚持"], source: "global" },
  { text: "Perhaps all the dragons in our lives are princesses who are only waiting to see us once beautiful and brave.", author: "Rainer Maria Rilke", tags: ["恐惧", "转化", "勇气"], source: "global" },
  { text: "Be patient toward all that is unsolved in your heart.", author: "Rainer Maria Rilke", tags: ["耐心", "内在", "成长"], source: "global" },
  { text: "No tree, it is said, can grow to heaven unless its roots reach down to hell.", author: "Carl Jung", tags: ["成长", "阴影", "深度"], source: "global" },
  { text: "I am not what happened to me, I am what I choose to become.", author: "Carl Jung", tags: ["自我", "选择", "成长"], source: "global" },
  { text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.", author: "Carl Jung", tags: ["阴影", "觉察", "成长"], source: "global" },
  { text: "Your vision will become clear only when you can look into your own heart.", author: "Carl Jung", tags: ["自省", "内在", "认知"], source: "global" },
  { text: "Between stimulus and response there is a space.", author: "Viktor E. Frankl", tags: ["自由", "选择", "觉察"], source: "global" },
  { text: "When we are no longer able to change a situation, we are challenged to change ourselves.", author: "Viktor E. Frankl", tags: ["改变", "成长", "韧性"], source: "global" },
  { text: "Those who have a why to live can bear almost any how.", author: "Viktor E. Frankl", tags: ["意义", "韧性", "生命"], source: "global" },
  { text: "The meaning of life is to give life meaning.", author: "Viktor E. Frankl", tags: ["意义", "生命", "行动"], source: "global" },
  { text: "This too shall pass.", author: "Persian adage", tags: ["无常", "疗愈", "时间"], source: "global" },
  { text: "What is to give light must endure burning.", author: "Viktor E. Frankl", tags: ["奉献", "痛苦", "成长"], source: "global" },
  { text: "Do not spoil what you have by desiring what you have not.", author: "Epicurus", tags: ["知足", "欲望", "平衡"], source: "global" },
  { text: "Freedom is secured not by the fulfilling of one's desires, but by the removal of desire.", author: "Epictetus", tags: ["自由", "欲望", "自律"], source: "global" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca", tags: ["焦虑", "认知", "现实"], source: "global" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca", tags: ["准备", "机会", "行动"], source: "global" },
  { text: "He who fears death will never do anything worth of a man who is alive.", author: "Seneca", tags: ["死亡", "勇气", "生命"], source: "global" },
  { text: "You have power over your mind — not outside events.", author: "Marcus Aurelius", tags: ["控制", "内在", "自律"], source: "global" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius", tags: ["幸福", "认知", "思想"], source: "global" },
  { text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", author: "Marcus Aurelius", tags: ["美", "宇宙", "生命"], source: "global" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius", tags: ["行动", "德性", "实践"], source: "global" },
  { text: "It is not things themselves that disturb us, but our judgments about them.", author: "Epictetus", tags: ["认知", "情绪", "哲学"], source: "global" },
  { text: "No great thing is created suddenly.", author: "Epictetus", tags: ["耐心", "积累", "成长"], source: "global" },
  { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd", tags: ["舒适区", "冒险", "成长"], source: "global" },
  { text: "We are what we repeatedly do.", author: "Will Durant", tags: ["习惯", "行动", "成长"], source: "global" },
  { text: "The best way out is always through.", author: "Robert Frost", tags: ["困境", "穿越", "勇气"], source: "global" },
  { text: "You cannot step twice into the same river.", author: "Heraclitus", tags: ["无常", "时间", "变化"], source: "global" },
  { text: "In a gentle way, you can shake the world.", author: "Mahatma Gandhi", tags: ["温柔", "行动", "改变"], source: "global" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", tags: ["行动", "责任", "改变"], source: "global" },
  { text: "The weak can never forgive. Forgiveness is the attribute of the strong.", author: "Mahatma Gandhi", tags: ["宽恕", "力量", "关系"], source: "global" },
  { text: "An eye for an eye only ends up making the whole world blind.", author: "Mahatma Gandhi", tags: ["冲突", "伦理", "和平"], source: "global" },
  { text: "You become what you believe.", author: "Oprah Winfrey", tags: ["信念", "自我", "成长"], source: "global" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi", tags: ["当下", "行动", "未来"], source: "global" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", tags: ["信念", "未来", "限制"], source: "global" },
  { text: "Life shrinks or expands in proportion to one’s courage.", author: "Anais Nin", tags: ["勇气", "生命", "成长"], source: "global" },
  { text: "We don't see things as they are, we see them as we are.", author: "Anais Nin", tags: ["认知", "自我", "投射"], source: "global" },
  { text: "And now that you don't have to be perfect, you can be good.", author: "John Steinbeck", tags: ["完美主义", "接纳", "成长"], source: "global" },
  { text: "What matters in life is not what happens to you but what you remember and how you remember it.", author: "Gabriel Garcia Marquez", tags: ["记忆", "叙事", "生命"], source: "global" },
  { text: "No one is too small to make a difference.", author: "Greta Thunberg", tags: ["行动", "影响", "勇气"], source: "global" },
  { text: "Courage starts with showing up and letting ourselves be seen.", author: "Brene Brown", tags: ["脆弱", "勇气", "关系"], source: "global" },
  { text: "Imperfection is not inadequacy; it is a reminder that we're all in this together.", author: "Brene Brown", tags: ["接纳", "关系", "成长"], source: "global" },
  { text: "人生如逆旅，我亦是行人。", author: "苏轼《临江仙》", tags: ["旅程", "无常", "从容"], source: "cn" },
  { text: "人生到处知何似，应似飞鸿踏雪泥。", author: "苏轼《和子由渑池怀旧》", tags: ["人生", "痕迹", "无常"], source: "cn" },
  { text: "欲穷千里目，更上一层楼。", author: "王之涣《登鹳雀楼》", tags: ["视野", "成长", "行动"], source: "cn" },
  { text: "白日依山尽，黄河入海流。", author: "王之涣《登鹳雀楼》", tags: ["时间", "自然", "壮阔"], source: "cn" },
  { text: "但使龙城飞将在，不教胡马度阴山。", author: "王昌龄《出塞》", tags: ["责任", "守护", "历史"], source: "cn" },
  { text: "秦时明月汉时关，万里长征人未还。", author: "王昌龄《出塞》", tags: ["历史", "战争", "苍凉"], source: "cn" },
  { text: "洛阳亲友如相问，一片冰心在玉壶。", author: "王昌龄《芙蓉楼送辛渐》", tags: ["品格", "友情", "纯粹"], source: "cn" },
  { text: "莫愁前路无知己，天下谁人不识君。", author: "高适《别董大》", tags: ["友情", "鼓励", "前路"], source: "cn" },
  { text: "千里黄云白日曛，北风吹雁雪纷纷。", author: "高适《别董大》", tags: ["离别", "苍茫", "情绪"], source: "cn" },
  { text: "劝君更尽一杯酒，西出阳关无故人。", author: "王维《送元二使安西》", tags: ["离别", "友情", "思念"], source: "cn" },
  { text: "渭城朝雨浥轻尘，客舍青青柳色新。", author: "王维《送元二使安西》", tags: ["离别", "清晨", "情绪"], source: "cn" },
  { text: "柴门闻犬吠，风雪夜归人。", author: "刘长卿《逢雪宿芙蓉山主人》", tags: ["归途", "温度", "人间"], source: "cn" },
  { text: "月落乌啼霜满天，江枫渔火对愁眠。", author: "张继《枫桥夜泊》", tags: ["夜", "愁", "孤独"], source: "cn" },
  { text: "姑苏城外寒山寺，夜半钟声到客船。", author: "张继《枫桥夜泊》", tags: ["夜", "旅途", "寂静"], source: "cn" },
  { text: "春眠不觉晓，处处闻啼鸟。", author: "孟浩然《春晓》", tags: ["春天", "自然", "轻盈"], source: "cn" },
  { text: "夜来风雨声，花落知多少。", author: "孟浩然《春晓》", tags: ["无常", "春天", "细腻"], source: "cn" },
  { text: "野旷天低树，江清月近人。", author: "孟浩然《宿建德江》", tags: ["孤独", "夜", "自然"], source: "cn" },
  { text: "移舟泊烟渚，日暮客愁新。", author: "孟浩然《宿建德江》", tags: ["旅途", "黄昏", "愁"], source: "cn" },
  { text: "空山新雨后，天气晚来秋。", author: "王维《山居秋暝》", tags: ["秋天", "自然", "宁静"], source: "cn" },
  { text: "竹喧归浣女，莲动下渔舟。", author: "王维《山居秋暝》", tags: ["日常", "自然", "生机"], source: "cn" },
  { text: "深林人不知，明月来相照。", author: "王维《竹里馆》", tags: ["独处", "月", "宁静"], source: "cn" },
  { text: "独坐幽篁里，弹琴复长啸。", author: "王维《竹里馆》", tags: ["独处", "音乐", "自处"], source: "cn" },
  { text: "白发三千丈，缘愁似个长。", author: "李白《秋浦歌》", tags: ["愁", "夸张", "情绪"], source: "cn" },
  { text: "疑是银河落九天。", author: "李白《望庐山瀑布》", tags: ["自然", "想象", "壮美"], source: "cn" },
  { text: "飞流直下三千尺。", author: "李白《望庐山瀑布》", tags: ["自然", "力量", "壮美"], source: "cn" },
  { text: "举头望明月，低头思故乡。", author: "李白《静夜思》", tags: ["乡愁", "月", "思念"], source: "cn" },
  { text: "床前明月光，疑是地上霜。", author: "李白《静夜思》", tags: ["月", "夜", "思乡"], source: "cn" },
  { text: "朝辞白帝彩云间，千里江陵一日还。", author: "李白《早发白帝城》", tags: ["速度", "旅程", "自由"], source: "cn" },
  { text: "两岸猿声啼不住，轻舟已过万重山。", author: "李白《早发白帝城》", tags: ["解脱", "旅程", "转折"], source: "cn" },
  { text: "春风又绿江南岸，明月何时照我还。", author: "王安石《泊船瓜洲》", tags: ["乡愁", "春天", "归去"], source: "cn" },
  { text: "不畏浮云遮望眼，自缘身在最高层。", author: "王安石《登飞来峰》", tags: ["视野", "信念", "勇气"], source: "cn" },
  { text: "千门万户曈曈日，总把新桃换旧符。", author: "王安石《元日》", tags: ["新年", "更新", "希望"], source: "cn" },
  { text: "衣带渐宽终不悔，为伊消得人憔悴。", author: "柳永《蝶恋花》", tags: ["爱情", "执着", "思念"], source: "cn" },
  { text: "今宵酒醒何处？杨柳岸，晓风残月。", author: "柳永《雨霖铃》", tags: ["离别", "夜", "思念"], source: "cn" },
  { text: "多情自古伤离别，更那堪冷落清秋节。", author: "柳永《雨霖铃》", tags: ["离别", "秋", "情绪"], source: "cn" },
  { text: "问君能有几多愁？恰似一江春水向东流。", author: "李煜《虞美人》", tags: ["愁", "无尽", "情绪"], source: "cn" },
  { text: "剪不断，理还乱，是离愁。", author: "李煜《相见欢》", tags: ["离愁", "纠结", "情绪"], source: "cn" },
  { text: "别是一般滋味在心头。", author: "李煜《相见欢》", tags: ["情绪", "复杂", "细腻"], source: "cn" },
  { text: "昨夜西风凋碧树。独上高楼，望尽天涯路。", author: "晏殊《蝶恋花》", tags: ["孤独", "远望", "成长"], source: "cn" },
  { text: "无可奈何花落去，似曾相识燕归来。", author: "晏殊《浣溪沙》", tags: ["无常", "循环", "感伤"], source: "cn" },
  { text: "小园香径独徘徊。", author: "晏殊《浣溪沙》", tags: ["独处", "回忆", "情绪"], source: "cn" },
  { text: "春色满园关不住，一枝红杏出墙来。", author: "叶绍翁《游园不值》", tags: ["生机", "突破", "春天"], source: "cn" },
  { text: "不知细叶谁裁出，二月春风似剪刀。", author: "贺知章《咏柳》", tags: ["春天", "自然", "想象"], source: "cn" },
  { text: "少小离家老大回，乡音无改鬓毛衰。", author: "贺知章《回乡偶书》", tags: ["乡愁", "时间", "归来"], source: "cn" },
  { text: "儿童相见不相识，笑问客从何处来。", author: "贺知章《回乡偶书》", tags: ["时间", "身份", "感慨"], source: "cn" },
  { text: "人生自古谁无死，留取丹心照汗青。", author: "文天祥《过零丁洋》", tags: ["气节", "历史", "信念"], source: "cn" },
  { text: "山河破碎风飘絮，身世浮沉雨打萍。", author: "文天祥《过零丁洋》", tags: ["命运", "历史", "无常"], source: "cn" },
  { text: "苟利国家生死以，岂因祸福避趋之。", author: "林则徐", tags: ["责任", "担当", "信念"], source: "cn" },
  { text: "我自横刀向天笑，去留肝胆两昆仑。", author: "谭嗣同《狱中题壁》", tags: ["勇气", "气节", "抗争"], source: "cn" },
  { text: "横眉冷对千夫指，俯首甘为孺子牛。", author: "鲁迅", tags: ["担当", "人民", "气节"], source: "cn" },
  { text: "寄意寒星荃不察，我以我血荐轩辕。", author: "鲁迅", tags: ["热忱", "担当", "信念"], source: "cn" },
  { text: "真的猛士，敢于直面惨淡的人生。", author: "鲁迅", tags: ["勇气", "现实", "担当"], source: "cn" },
  { text: "愿中国青年都摆脱冷气，只是向上走。", author: "鲁迅", tags: ["青年", "希望", "行动"], source: "cn" },
  { text: "我是天空里的一片云，偶尔投影在你的波心。", author: "徐志摩《偶然》", tags: ["相遇", "短暂", "诗意"], source: "cn" },
  { text: "你记得也好，最好你忘掉。", author: "徐志摩《偶然》", tags: ["放下", "相遇", "关系"], source: "cn" },
  { text: "你站在桥上看风景，看风景的人在楼上看你。", author: "卞之琳《断章》", tags: ["视角", "关系", "哲学"], source: "cn" },
  { text: "This too shall pass.", author: "Persian adage", tags: ["无常", "疗愈", "时间"], source: "global" },
  { text: "Everything can be taken from a man but one thing: the last of the human freedoms.", author: "Viktor E. Frankl", tags: ["自由", "尊严", "选择"], source: "global" },
  { text: "I can be changed by what happens to me. But I refuse to be reduced by it.", author: "Maya Angelou", tags: ["韧性", "自我", "成长"], source: "global" },
  { text: "You must have chaos within you to give birth to a dancing star.", author: "Nietzsche", tags: ["创造", "混沌", "成长"], source: "global" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", tags: ["行动", "意义", "影响"], source: "global" },
  { text: "The greatest weapon against stress is our ability to choose one thought over another.", author: "William James", tags: ["认知", "情绪", "选择"], source: "global" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", tags: ["信念", "行动", "开始"], source: "global" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", tags: ["行动", "当下", "现实"], source: "global" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", tags: ["希望", "视角", "光"], source: "global" },
  { text: "The only journey is the journey within.", author: "Rainer Maria Rilke", tags: ["内在", "旅程", "自我"], source: "global" },
  { text: "No feeling is final.", author: "Rainer Maria Rilke", tags: ["情绪", "无常", "疗愈"], source: "global" },
  { text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle", tags: ["耐心", "成长", "结果"], source: "global" },
  { text: "We are what we think.", author: "Buddha", tags: ["认知", "心念", "自我"], source: "global" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha", tags: ["平静", "内在", "修行"], source: "global" },
  { text: "What you think, you become.", author: "Buddha", tags: ["认知", "自我", "成长"], source: "global" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", tags: ["认知", "心念", "成长"], source: "global" },
  { text: "Hatred does not cease by hatred, but only by love.", author: "Dhammapada", tags: ["关系", "慈悲", "修行"], source: "global" },
  { text: "Better than a thousand hollow words is one word that brings peace.", author: "Buddha", tags: ["语言", "平静", "智慧"], source: "global" },
  { text: "Three things cannot be long hidden: the sun, the moon, and the truth.", author: "Buddha", tags: ["真相", "时间", "觉察"], source: "global" },
  { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha", tags: ["自爱", "慈悲", "疗愈"], source: "global" },
  { text: "世间一切有为法，如梦幻泡影，如露亦如电，应作如是观。", author: "《金刚经》", tags: ["无常", "佛学", "放下"], source: "cn" },
  { text: "应无所住而生其心。", author: "《金刚经》", tags: ["执著", "放下", "佛学"], source: "cn" },
  { text: "凡所有相，皆是虚妄。", author: "《金刚经》", tags: ["空性", "无常", "佛学"], source: "cn" },
  { text: "若见诸相非相，即见如来。", author: "《金刚经》", tags: ["空性", "觉悟", "佛学"], source: "cn" },
  { text: "过去心不可得，现在心不可得，未来心不可得。", author: "《金刚经》", tags: ["时间", "当下", "佛学"], source: "cn" },
  { text: "色不异空，空不异色。", author: "《心经》", tags: ["佛学", "存在", "空性"], source: "cn" },
  { text: "色即是空，空即是色。", author: "《心经》", tags: ["空性", "佛学", "存在"], source: "cn" },
  { text: "受想行识，亦复如是。", author: "《心经》", tags: ["五蕴", "认知", "佛学"], source: "cn" },
  { text: "无眼耳鼻舌身意，无色声香味触法。", author: "《心经》", tags: ["空性", "佛学", "感知"], source: "cn" },
  { text: "无苦集灭道。", author: "《心经》", tags: ["解脱", "佛学", "修行"], source: "cn" },
  { text: "心无挂碍，无挂碍故，无有恐怖。", author: "《心经》", tags: ["恐惧", "放下", "平静"], source: "cn" },
  { text: "远离颠倒梦想，究竟涅槃。", author: "《心经》", tags: ["觉醒", "修行", "佛学"], source: "cn" },
  { text: "一切有为法，如梦幻泡影。", author: "《金刚经》", tags: ["无常", "佛学", "空性"], source: "cn" },
  { text: "诸恶莫作，众善奉行，自净其意。", author: "《法句经》", tags: ["修行", "伦理", "自律"], source: "cn" },
  { text: "一切皆流，无物常住。", author: "佛教格言", tags: ["无常", "时间", "佛学"], source: "cn" },
  { text: "观自在菩萨，行深般若波罗蜜多时。", author: "《心经》", tags: ["观照", "修行", "佛学"], source: "cn" },
  { text: "是故空中无色，无受想行识。", author: "《心经》", tags: ["空性", "佛学", "认知"], source: "cn" },
  { text: "菩提本无树，明镜亦非台。", author: "六祖慧能", tags: ["顿悟", "修行", "佛学"], source: "cn" },
  { text: "本来无一物，何处惹尘埃。", author: "六祖慧能", tags: ["空性", "放下", "佛学"], source: "cn" },
  { text: "一花一世界，一叶一如来。", author: "佛教偈语", tags: ["整体", "觉察", "佛学"], source: "cn" },
  { text: "The quieter you become, the more you are able to hear.", author: "Rumi", tags: ["沉默", "觉察", "灵性"], source: "global" },
  { text: "There are years that ask questions and years that answer.", author: "Zora Neale Hurston", tags: ["时间", "成长", "人生"], source: "global" },
  { text: "How we spend our days is, of course, how we spend our lives.", author: "Annie Dillard", tags: ["日常", "时间", "生命"], source: "global" },
  { text: "Attention is the rarest and purest form of generosity.", author: "Simone Weil", tags: ["专注", "关系", "慷慨"], source: "global" },
  { text: "Hope is a waking dream.", author: "Aristotle", tags: ["希望", "梦", "意识"], source: "global" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius", tags: ["思想", "心灵", "认知"], source: "global" },
  { text: "No one saves us but ourselves.", author: "Buddha", tags: ["自我", "责任", "修行"], source: "global" },
  { text: "Little by little, one travels far.", author: "J. R. R. Tolkien", tags: ["积累", "旅程", "成长"], source: "global" },
  { text: "The future enters into us, in order to transform itself in us, long before it happens.", author: "Rainer Maria Rilke", tags: ["未来", "成长", "转化"], source: "global" },
  { text: "Love is not consolation. It is light.", author: "Friedrich Nietzsche", tags: ["爱", "力量", "存在"], source: "global" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", tags: ["学习", "当下", "生命"], source: "global" },
  { text: "Our life is what our thoughts make it.", author: "Marcus Aurelius", tags: ["认知", "生活", "自我"], source: "global" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", tags: ["尝试", "失败", "成长"], source: "global" },
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein", tags: ["想象", "创造", "学习"], source: "global" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", tags: ["价值", "人生", "行动"], source: "global" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", tags: ["困境", "机会", "希望"], source: "global" },
  { text: "The true sign of intelligence is not knowledge but imagination.", author: "Albert Einstein", tags: ["智慧", "想象", "创造"], source: "global" },
  { text: "You must be the master of your own fate.", author: "Mary Shelley", tags: ["命运", "责任", "自我"], source: "global" },
  { text: "There is no charm equal to tenderness of heart.", author: "Jane Austen", tags: ["温柔", "关系", "人性"], source: "global" },
  { text: "I declare after all there is no enjoyment like reading.", author: "Jane Austen", tags: ["阅读", "喜悦", "生活"], source: "global" },
  { text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.", author: "Jane Austen", tags: ["阅读", "审美", "生活"], source: "global" }
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

export function getClassicQuoteCount() {
  return CLASSIC_QUOTES.length;
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
