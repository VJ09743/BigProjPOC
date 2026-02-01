/**
 * Google Gemini Provider
 * Uses Gemini Pro model for code reviews
 * 
 * Installation: npm install @google/generative-ai
 */
async function callLLM(prompt, agentType) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.2,
    },
  });

  return result.response.text();
}

module.exports = { callLLM };
