interface GenerationInput {
  category: "business" | "romantic" | "soul";
  selectedFiles: Array<{
    type: string;
    content: string;
    tags: string[];
  }>;
  userTags: string[];
  customDescription?: string;
}

interface PuppetPersonality {
  style: "rational" | "emotional" | "humorous" | "deep";
  colorScheme: string[];
  elements: string[];
  level: number;
}

export function generatePuppetPersonality(
  input: GenerationInput
): PuppetPersonality {
  // 1. Aggregate all content and tags
  const allContent = input.selectedFiles.map((f) => f.content).join(" ");
  const allTags = [
    ...input.selectedFiles.flatMap((f) => f.tags),
    ...input.userTags,
  ];

  // 2. Compute personality type via keyword matching
  let style: PuppetPersonality["style"] = "deep";

  const deepKeywords = ["哲学", "思考", "深度", "存在", "意义", "宇宙"];
  const emotionalKeywords = ["艺术", "感性", "浪漫", "情感", "温暖", "诗"];
  const humorousKeywords = ["幽默", "有趣", "搞笑", "轻松", "玩", "快乐"];
  const rationalKeywords = ["逻辑", "理性", "分析", "数据", "技术", "科学"];

  const score = (keywords: string[]) =>
    keywords.filter(
      (k) => allContent.includes(k) || allTags.includes(k)
    ).length;

  const deepScore = score(deepKeywords);
  const emotionalScore = score(emotionalKeywords);
  const humorScore = score(humorousKeywords);
  const rationalScore = score(rationalKeywords);

  const maxScore = Math.max(
    deepScore,
    emotionalScore,
    humorScore,
    rationalScore
  );
  if (maxScore === rationalScore) style = "rational";
  else if (maxScore === emotionalScore) style = "emotional";
  else if (maxScore === humorScore) style = "humorous";
  else style = "deep";

  // 3. Color scheme by category
  let colorScheme: string[];
  switch (input.category) {
    case "soul":
      colorScheme = ["#7C3AED", "#EC4899", "#F59E0B"];
      break;
    case "business":
      colorScheme = ["#2563EB", "#06B6D4", "#10B981"];
      break;
    case "romantic":
      colorScheme = ["#EC4899", "#F472B6", "#FB923C"];
      break;
    default:
      colorScheme = ["#7C3AED", "#4F46E5", "#EC4899"];
  }

  // 4. Extract top elements
  const elements = allTags.slice(0, 5);

  // 5. Level based on data volume
  const dataAmount = input.selectedFiles.length + allTags.length;
  let level = 1;
  if (dataAmount >= 20) level = 5;
  else if (dataAmount >= 15) level = 4;
  else if (dataAmount >= 10) level = 3;
  else if (dataAmount >= 5) level = 2;

  return { style, colorScheme, elements, level };
}
