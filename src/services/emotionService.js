import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const AUDIO_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

// ── Keyword fallbacks (used when API key is missing or API fails) ──────────────

const FALLBACK_EMOTION = (text) => {
  const t = text.toLowerCase();
  if (t.includes('happy') || t.includes('great') || t.includes('excited') || t.includes('joy')) return 'happy';
  if (t.includes('sad') || t.includes('cry') || t.includes('depressed')) return 'sad';
  if (t.includes('anxious') || t.includes('worry') || t.includes('nervous') || t.includes('panic')) return 'anxious';
  if (t.includes('stress') || t.includes('overwhelmed') || t.includes('burnout') || t.includes('tired')) return 'stressed';
  if (t.includes('angry') || t.includes('mad') || t.includes('hate') || t.includes('frustrated')) return 'angry';
  if (t.includes('lonely') || t.includes('alone') || t.includes('isolated') || t.includes('nobody')) return 'lonely';
  return 'neutral';
};

const FALLBACK_SAFETY = (text) => {
  const t = text.toLowerCase();
  if (
    t.includes('suicide') || t.includes('self harm') || t.includes('self-harm') ||
    t.includes('end my life') || t.includes('kill myself') || t.includes('want to die') ||
    t.includes('no reason to live') || t.includes('hurt myself')
  ) return 'HIGH_RISK';
  if (
    t.includes('hopeless') || t.includes('can\'t go on') || t.includes('burnout') ||
    t.includes('lonely') || t.includes('anxious') || t.includes('broke down')
  ) return 'MODERATE_DISTRESS';
  return 'SAFE';
};

// ── Emotion Detection — openai/gpt-oss-20b ────────────────────────────────────

const EMOTION_SYSTEM_PROMPT = `You are an emotion detection system for a mental wellness assistant.

Your task is to analyze the user's message and identify the dominant emotional state.

Possible emotions:
happy
sad
anxious
stressed
angry
lonely
neutral

Rules:
- Return ONLY the emotion label.
- Do not explain your reasoning.
- Output must be a single word.`;

export const detectEmotion = async (message) => {
  if (!GROQ_API_KEY) return FALLBACK_EMOTION(message);

  try {
    const response = await axios.post(CHAT_URL, {
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: EMOTION_SYSTEM_PROMPT },
        { role: 'user', content: `User message:\n${message}` }
      ],
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      reasoning_effort: 'medium',
      stream: false,
      stop: null
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const raw = response.data.choices[0].message.content.trim().toLowerCase();
    const validEmotions = ['happy', 'sad', 'anxious', 'stressed', 'angry', 'lonely', 'neutral'];

    // Extract first valid emotion word from response
    for (const word of raw.split(/\s+/)) {
      if (validEmotions.includes(word)) return word;
    }
    return FALLBACK_EMOTION(message);
  } catch (err) {
    console.warn('Emotion API error, using fallback:', err?.response?.data || err.message);
    return FALLBACK_EMOTION(message);
  }
};

// ── Crisis / Safety Detection — openai/gpt-oss-safeguard-20b ─────────────────

const CRISIS_SYSTEM_PROMPT = `You are a mental health safety detection system.

Your task is to analyze a user message and determine whether it contains signs of severe emotional distress or self-harm risk.

Categories:
SAFE
MODERATE_DISTRESS
HIGH_RISK

Definitions:

SAFE
Normal conversation or mild emotions.

MODERATE_DISTRESS
User expresses sadness, anxiety, loneliness, burnout, or emotional struggle.

HIGH_RISK
User expresses thoughts about:
- suicide
- self harm
- wanting to die
- hopelessness about living
- ending their life

Rules:
Return ONLY one of the three labels.`;

/**
 * detectCrisis
 * @returns {'SAFE' | 'MODERATE_DISTRESS' | 'HIGH_RISK'}
 */
export const detectCrisis = async (message) => {
  // Always run keyword check first — hard safety net
  const keywordResult = FALLBACK_SAFETY(message);
  if (keywordResult === 'HIGH_RISK') return 'HIGH_RISK';
  if (!GROQ_API_KEY) return keywordResult;

  try {
    const response = await axios.post(CHAT_URL, {
      model: 'openai/gpt-oss-safeguard-20b',
      messages: [
        { role: 'system', content: CRISIS_SYSTEM_PROMPT },
        { role: 'user', content: `User message:\n${message}` }
      ],
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      reasoning_effort: 'medium',
      stream: false,
      stop: null
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const raw = response.data.choices[0].message.content.trim().toUpperCase();
    if (raw.includes('HIGH_RISK')) return 'HIGH_RISK';
    if (raw.includes('MODERATE_DISTRESS')) return 'MODERATE_DISTRESS';
    return 'SAFE';
  } catch (err) {
    console.warn('Safety API error, using fallback:', err?.response?.data || err.message);
    return keywordResult;
  }
};

// ── Speech-to-Text — Whisper Large v3 ────────────────────────────────────────

export const transcribeAudio = async (audioBlob) => {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ API key not set. Please add VITE_GROQ_API_KEY to your .env file.');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-large-v3');
  formData.append('temperature', '0');
  formData.append('response_format', 'verbose_json');

  const response = await axios.post(AUDIO_URL, formData, {
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`
      // Content-Type is set automatically by axios for FormData
    }
  });

  return response.data.text;
};
