const OpenAI = require('openai');

/**
 * OpenAI Provider
 * Uses GPT-4o model for code reviews
 */
async function callLLM(prompt, agentType) {
  const openai = new OpenAI({
    apiKey: process.env.LLM_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }]
  });

  return completion.choices[0].message.content;
}

module.exports = { callLLM };
