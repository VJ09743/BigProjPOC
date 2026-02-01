const OpenAI = require('openai');

/**
 * Azure OpenAI Provider
 * Uses Azure-hosted OpenAI models for code reviews
 * 
 * Required environment variables:
 * - AZURE_OPENAI_ENDPOINT: Your Azure OpenAI endpoint URL
 * - LLM_API_KEY: Your Azure OpenAI API key
 */
async function callLLM(prompt, agentType) {
  if (!process.env.AZURE_OPENAI_ENDPOINT) {
    throw new Error('AZURE_OPENAI_ENDPOINT environment variable is required for Azure OpenAI');
  }

  const openai = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.AZURE_OPENAI_ENDPOINT,
    defaultQuery: { 'api-version': '2024-02-15-preview' },
    defaultHeaders: { 'api-key': process.env.LLM_API_KEY },
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    max_tokens: 4096,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }]
  });

  return completion.choices[0].message.content;
}

module.exports = { callLLM };
