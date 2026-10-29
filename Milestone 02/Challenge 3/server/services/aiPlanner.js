const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const assertAiConfigured = () => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('AI planning is not configured. Set OPENAI_API_KEY on the backend.');
    error.statusCode = 503;
    throw error;
  }
};

const generateTaskPlan = async (goal, tasks, fetchImpl = fetch) => {
  assertAiConfigured();

  let response;
  try {
    response = await fetchImpl('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: 'You are TaskNest, a practical task-planning assistant. Use only the user goal and provided incomplete tasks. Prioritize important tasks, suggest at most three concrete next steps, and keep the plan concise. Never claim to change, save, or complete tasks. If there are no tasks, say so and suggest adding one.'
          },
          {
            role: 'user',
            content: JSON.stringify({ goal, tasks })
          }
        ]
      }),
      signal: AbortSignal.timeout(20000)
    });
  } catch (error) {
    const serviceError = new Error(
      'The AI provider could not be reached. Please try again later.',
      { cause: error }
    );
    serviceError.statusCode = 502;
    throw serviceError;
  }

  if (!response.ok) {
    const error = new Error('The AI provider could not complete the plan. Please try again later.');
    error.statusCode = 502;
    throw error;
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    const invalidResponse = new Error(
      'The AI provider returned an invalid response. Please try again.',
      { cause: error }
    );
    invalidResponse.statusCode = 502;
    throw invalidResponse;
  }
  const plan = result?.choices?.[0]?.message?.content;
  if (typeof plan !== 'string' || !plan.trim()) {
    const error = new Error('The AI provider returned an empty plan. Please try again.');
    error.statusCode = 502;
    throw error;
  }

  return { plan: plan.trim(), model: MODEL };
};

module.exports = { assertAiConfigured, generateTaskPlan };
