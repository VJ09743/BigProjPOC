/**
 * GitHub Copilot Provider
 * Uses GitHub's Models API with GitHub token authentication
 * 
 * IMPORTANT: This requires GitHub Copilot ENTERPRISE or GitHub Models API access.
 * Regular GitHub Copilot Pro/Individual subscriptions ($10-20/month) do NOT provide API access.
 * 
 * For automated reviews with Copilot Pro subscription, please use a different provider:
 * - Gemini (cheapest: ~$1-2/month)
 * - OpenAI (~$2-4/month)
 * - Anthropic (~$4-8/month)
 */
async function callLLM(prompt, agentType) {
  const { Octokit } = require('@octokit/rest');
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  // GitHub Copilot uses GitHub Models API
  // This endpoint requires GitHub Copilot Enterprise or GitHub Models API access
  
  try {
    // Use GitHub's chat completion endpoint (if available)
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
    if (error.status === 404 || error.status === 403) {
      throw new Error(
        '❌ GitHub Copilot API Access Required\n\n' +
        'This feature requires GitHub Copilot ENTERPRISE or GitHub Models API access.\n' +
        'Regular Copilot Pro/Individual subscriptions ($10-20/month) do NOT provide API access.\n\n' +
        '✅ RECOMMENDED ALTERNATIVES for Automated Reviews:\n' +
        '   • Gemini (cheapest): ~$1-2/month - Set LLM_PROVIDER=gemini\n' +
        '   • OpenAI: ~$2-4/month - Set LLM_PROVIDER=openai\n' +
        '   • Anthropic: ~$4-8/month - Set LLM_PROVIDER=anthropic\n\n' +
        'See: https://docs.github.com/en/copilot/github-copilot-enterprise/overview/about-github-copilot-enterprise\n' +
        'Or update your GitHub Secrets with a different LLM_PROVIDER'
      );
    }
    
    throw new Error(`GitHub Copilot API error: ${error.message}`);
  }
}

module.exports = { callLLM };
