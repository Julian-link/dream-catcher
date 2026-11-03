import OpenAI from 'openai';

function getAiConfig() {
  const apiKey = process.env.AI_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.AI_URL || process.env.OPENAI_BASE_URL;
  const model = process.env.AI_MODEL || process.env.OPENAI_MODEL;

  if (!apiKey) {
    throw new Error('Server misconfigured: AI_KEY is missing');
  }
  if (!baseURL) {
    throw new Error('Server misconfigured: AI_URL is missing');
  }
  if (!model) {
    throw new Error('Server misconfigured: AI_MODEL is missing');
  }

  return { apiKey, baseURL, model };
}

// Call the model configured in Scrimba (AI_URL, AI_KEY, AI_MODEL).
export async function getDreamInterpretation(dreamText) {
  const { apiKey, baseURL, model } = getAiConfig();
  const openai = new OpenAI({ apiKey, baseURL });

  try {
    const message = await openai.chat.completions.create({
      model,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: 'You are a thoughtful dream interpreter. Be insightful but gentle, and consider common dream symbolism. Keep your interpretation to 2-3 paragraphs.'
        },
        {
          role: 'user',
          content: `Dream: ${dreamText}`
        }
      ]
    });
    return message.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`API error: ${error.message}`);
  }
}
