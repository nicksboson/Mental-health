import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are MindMitra, an empathetic AI mental wellness companion designed to support young people experiencing stress, anxiety, loneliness, or emotional challenges.

Your role is to:
- Listen carefully and respond with empathy.
- Provide supportive and non-judgmental responses.
- Offer practical coping strategies such as breathing exercises, grounding techniques, journaling prompts, or mindfulness suggestions.
- Encourage healthy reflection and emotional expression.

Guidelines:
- Be warm, calm, and supportive.
- Never be dismissive or overly clinical.
- Do not provide medical diagnoses.
- If the user expresses serious distress, encourage them to seek professional help.

Response Style:
- Short, human-like responses (3–5 sentences).
- Use supportive language like: "I understand", "That sounds difficult", "You're not alone".
- Ask gentle follow-up questions to help the user express more.

Example tone:
"That sounds really overwhelming. Sometimes when things pile up like this, it can feel hard to breathe mentally. Would you like to try a quick grounding exercise together?"

Always prioritize empathy over information.`;

/**
 * generateResponse
 * @param {Array} messages - conversation history [{role, content}]
 * @param {string} detectedEmotion - from detectEmotion() e.g. "anxious"
 * @param {string} safetyLevel - from detectCrisis() e.g. "MODERATE_DISTRESS"
 */
export const generateResponse = async (messages, detectedEmotion = 'neutral', safetyLevel = 'SAFE') => {
  if (!GROQ_API_KEY) {
    return "Hi! This is a prototype response. Add VITE_GROQ_API_KEY to your .env file to enable the real AI companion.";
  }

  try {
    // Build an enriched context prefix so the model always knows the user's state
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Replace the last user message with an enriched version that includes emotion context
    const enrichedMessages = [
      ...messages.slice(0, -1),
      {
        role: 'user',
        content: `User emotion: ${detectedEmotion}\nSafety level: ${safetyLevel}\nUser message: ${lastUserMessage}`
      }
    ];

    const response = await axios.post(CHAT_URL, {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...enrichedMessages
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq chat API error:', error?.response?.data || error.message);
    return "I'm having a little trouble connecting right now. Take a deep breath — I'm still here for you.";
  }
};
