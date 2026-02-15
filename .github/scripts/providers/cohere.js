/**
 * Cohere Provider
 * Uses Command R Plus model for code reviews
 * 
 * Installation: npm install cohere-ai
 */
async function callLLM(prompt, agentType) {
  const { CohereClient } = require('cohere-ai');
  
  const cohere = new CohereClient({ token: process.env.LLM_API_KEY });

  const response = await cohere.chat({
    model: 'command-r-plus',
    message: prompt,
    temperature: 0.2,
    maxTokens: 4096,
  });

  return response.text;
}

module.exports = { callLLM };
