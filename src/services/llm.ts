export const mockLLMStream = async function* (
  prompt: string,
): AsyncIterable<string> {
  const response = `Based on the provided context, here's a relevant answer to your question. 
    The information suggests that ${prompt.slice(0, 50)}... [Mock response]`;

  const words = response.split(' ');
  for (const word of words) {
    yield word + ' ';
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};
