// localStorage persistence helpers for training data and puppet data

export interface TrainingData {
  xiaohongshu: string;
  feishu: string;
  thoughts: string;
  accountSync: string;
}

export interface PuppetPersonality {
  style: "rational" | "emotional" | "deep";
  colorScheme: string[];
  elements: string[];
}

export interface PuppetData {
  personality: PuppetPersonality;
  description: string;
  tags: string[];
  values: string[];
}

export function saveTrainingData(data: TrainingData) {
  if (typeof window !== "undefined") {
    localStorage.setItem("trainingData", JSON.stringify(data));
  }
}

export function getTrainingData(): TrainingData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("trainingData");
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function savePuppetData(data: PuppetData) {
  if (typeof window !== "undefined") {
    localStorage.setItem("puppetData", JSON.stringify(data));
  }
}

export function getPuppetData(): PuppetData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("puppetData");
    return data ? JSON.parse(data) : null;
  }
  return null;
}
