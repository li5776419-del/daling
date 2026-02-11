export interface ActResult<T = Record<string, unknown>> {
  sessionId: string;
  data: T;
}

export async function parseActStream<T = Record<string, unknown>>(
  response: Response
): Promise<ActResult<T>> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let sessionId = "";
  let content = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          if (parsed.sessionId && !parsed.choices) {
            sessionId = parsed.sessionId;
            continue;
          }
          if (parsed.choices?.[0]?.delta?.content) {
            content += parsed.choices[0].delta.content;
          }
        } catch {
          // skip
        }
      }
    }
  }

  return {
    sessionId,
    data: JSON.parse(content) as T,
  };
}

export const INTIMACY_ACTION_CONTROL = `仅输出合法 JSON 对象，不要解释。
输出结构：{"sentiment": "positive"|"negative"|"neutral", "intimacy_delta": number, "emotion": string}。
sentiment: 根据用户消息的情感倾向判断。
intimacy_delta: 亲密度变化值，范围 -5 到 +5。积极互动为正，消极为负，中性为 0。
emotion: 用一个中文词描述用户当前的情绪，如"开心"、"难过"、"好奇"、"感动"等。
信息不足时返回 {"sentiment": "neutral", "intimacy_delta": 0, "emotion": "平静"}。`;
