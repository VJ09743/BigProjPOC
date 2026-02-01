/**
 * Mistral AI Provider
 * Uses Mistral Large model for code reviews
 * 
 * Installation: npm install @mistralai/mistralai
 */
async function callLLM(prompt, agentType) {
  const MistralClient = require('@mistralai/mistralai').default;
  
  const mistral = new MistralClient(process.env.LLM_API_KEY);

  const response = await mistral.chat({
    model: 'mistral-large-latest',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    maxTokens: 4096,
  });

  return response.choices[0].message.content;
}

module.exports = { callLLM };
