import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Emotion metadata ──────────────────────────────────────────────────────────
export const EMOTION_META = {
  happy:   { color: '#10B981', score: 5 },
  calm:    { color: '#3B82F6', score: 4 },
  neutral: { color: '#9CA3AF', score: 3 },
  lonely:  { color: '#6366F1', score: 2 },
  anxious: { color: '#F59E0B', score: 2 },
  stressed:{ color: '#EF4444', score: 1 },
  sad:     { color: '#8B5CF6', score: 1 },
  angry:   { color: '#DC2626', score: 1 },
};

const STORAGE_KEY = 'mindmitra_session';

const defaultSession = {
  events: [],          // { timestamp, emotion, safetyLevel, msgIndex }
  totalMessages: 0,
};

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultSession;
    } catch {
      return defaultSession;
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  /**
   * Called by ChatInterface after each AI reply.
   */
  const recordEvent = useCallback((emotion, safetyLevel) => {
    setSession(prev => ({
      totalMessages: prev.totalMessages + 1,
      events: [
        ...prev.events,
        {
          timestamp: Date.now(),
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          emotion,
          safetyLevel,
          score: EMOTION_META[emotion]?.score ?? 3,
        }
      ]
    }));
  }, []);

  const clearSession = useCallback(() => {
    setSession(defaultSession);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ChatContext.Provider value={{ session, recordEvent, clearSession }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatSession = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatSession must be used inside <ChatProvider>');
  return ctx;
};
