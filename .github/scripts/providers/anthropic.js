const Anthropic = require('@anthropic-ai/sdk');

/**
 * Anthropic (Claude) Provider
 * Uses Claude Sonnet 4 model for code reviews
 */
async function callLLM(prompt, agentType) {
  const anthropic = new Anthropic({
    apiKey: process.env.LLM_API_KEY
  });

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

module.exports = { callLLM };
