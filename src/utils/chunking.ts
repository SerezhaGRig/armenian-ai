export const buildChunking =
  (maxTokens: number = 800, overlap: number = 100) =>
  (text: string): string[] => {
    const charsPerToken = 4;
    const maxChars = maxTokens * charsPerToken;
    const overlapChars = overlap * charsPerToken;

    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      let end = start + maxChars;

      if (end < text.length) {
        const lastPeriod = text.lastIndexOf('.', end);
        const lastNewline = text.lastIndexOf('\n', end);
        const breakPoint = Math.max(lastPeriod, lastNewline);

        if (breakPoint > start + maxChars / 2) {
          end = breakPoint + 1;
        }
      }

      chunks.push(text.slice(start, Math.min(end, text.length)).trim());
      start = end - overlapChars;
    }

    return chunks.filter((chunk) => chunk.length > 0);
  };
