async function generateQuestions({ topic, numQuestions, difficulty }) {
  const API_KEY = process.env.GROQ_API_KEY;
  const AI_MODEL = process.env.AI_MODEL || 'llama-3.1-8b-instant';

  if (!API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in .env');
  }

  const timerMap = { easy: 25, medium: 18, hard: 12 };
  const timer = timerMap[difficulty] || 18;
  const count = Math.min(Math.max(1, parseInt(numQuestions, 10) || 5), 20);

  const prompt = `Generate ${count} quiz questions about "${topic}" at ${difficulty} difficulty.
Return ONLY a JSON array (no markdown, no code fences). Each object must have:
- "question": string
- "options": array of exactly 4 strings
- "answer": 0-based index of the correct option
- "category": string (e.g. "Science", "History", "Geography", "Sports", etc.)

Questions must be factual, educational, and age-appropriate.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`AI API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error('AI returned an empty response');
  }

  let parsed;
  try {
    const cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }

  const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);

  return questions.map((q, i) => ({
    id: `q-${Date.now()}-${i}`,
    question: q.question,
    options: q.options,
    answer: q.answer,
    category: q.category || 'General',
    round: i + 1,
    timer,
  }));
}

module.exports = { generateQuestions };
