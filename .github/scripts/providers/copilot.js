/**
 * GitHub Copilot Provider
 * Uses GitHub's Models API with GitHub token authentication
 */
async function callLLM(prompt, agentType) {
  const { Octokit } = require('@octokit/rest');
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  // GitHub Copilot uses GitHub Models API
  // For now, fall back to GPT-4o via GitHub's models endpoint
  // This requires GitHub Copilot Enterprise or access to GitHub Models
  
  try {
    // Use GitHub's chat completion endpoint (if available)
    // Note: This endpoint might require specific GitHub permissions
    const response = await octokit.request('POST /models/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4096,
      temperature: 0.2
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    // If GitHub Models API is not available, provide helpful error
    if (error.status === 404) {
      throw new Error(
        'GitHub Copilot provider requires access to GitHub Models API.\n' +
        'This feature requires GitHub Copilot Enterprise or specific GitHub Models access.\n' +
        'Please use a different provider (OpenAI, Anthropic, Gemini, etc.) or contact GitHub support.\n' +
        'See: https://docs.github.com/en/enterprise-cloud@latest/copilot/github-copilot-enterprise/overview/enabling-github-copilot-enterprise-features'
      );
    }
    
    throw new Error(`GitHub Copilot API error: ${error.message}`);
  }
}

module.exports = { callLLM };
