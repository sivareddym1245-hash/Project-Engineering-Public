const test = require('node:test');
const assert = require('node:assert/strict');
const { generateTaskPlan } = require('./aiPlanner');

test('sends the task context to the configured OpenAI model', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  let request;
  try {
    const result = await generateTaskPlan('Prepare for my exam', [
      { id: 1, title: 'Review notes', isImportant: true }
    ], async (url, options) => {
      request = { url, options };
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '1. Review the important notes.' } }]
        })
      };
    });

    assert.equal(result.model, 'gpt-4o-mini');
    assert.equal(result.plan, '1. Review the important notes.');
    assert.equal(request.url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(request.options.headers.Authorization, 'Bearer test-key');
    assert.deepEqual(JSON.parse(request.options.body).messages[1].content, JSON.stringify({
      goal: 'Prepare for my exam',
      tasks: [{ id: 1, title: 'Review notes', isImportant: true }]
    }));
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test('reports missing backend credentials without making a provider request', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    await assert.rejects(
      generateTaskPlan('Plan my day', [], async () => {
        assert.fail('Provider must not be called without a key');
      }),
      { message: 'AI planning is not configured. Set OPENAI_API_KEY on the backend.', statusCode: 503 }
    );
  } finally {
    if (previousKey !== undefined) process.env.OPENAI_API_KEY = previousKey;
  }
});

test('does not pass through provider failure details', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  try {
    await assert.rejects(
      generateTaskPlan('Plan my day', [], async () => ({
        ok: false,
        status: 401,
        text: async () => 'private provider diagnostic'
      })),
      { message: 'The AI provider could not complete the plan. Please try again later.', statusCode: 502 }
    );
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test('reports provider network failures as a gateway error', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  try {
    await assert.rejects(
      generateTaskPlan('Plan my day', [], async () => {
        throw new Error('private connection diagnostic');
      }),
      { message: 'The AI provider could not be reached. Please try again later.', statusCode: 502 }
    );
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test('rejects empty provider output', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  try {
    await assert.rejects(
      generateTaskPlan('Plan my day', [], async () => ({
        ok: true,
        json: async () => ({ choices: [{ message: { content: '  ' } }] })
      })),
      { message: 'The AI provider returned an empty plan. Please try again.', statusCode: 502 }
    );
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test('reports invalid provider JSON as a gateway error', async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  try {
    await assert.rejects(
      generateTaskPlan('Plan my day', [], async () => ({
        ok: true,
        json: async () => {
          throw new SyntaxError('invalid JSON');
        }
      })),
      { message: 'The AI provider returned an invalid response. Please try again.', statusCode: 502 }
    );
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});
