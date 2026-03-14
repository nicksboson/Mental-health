import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2, Mic, Square, AlertTriangle } from 'lucide-react';
import ChatBubble from './ChatBubble';
import WellnessSuggestions from './WellnessSuggestions';
import { generateResponse } from '../services/groqService';
import { detectEmotion, detectCrisis, transcribeAudio } from '../services/emotionService';
import { useChatSession } from '../context/ChatContext';

const quickReplies = [
  "I feel stressed",
  "I'm anxious about exams",
  "I feel lonely",
  "I can't focus"
];

const ChatInterface = ({ isAnonymous, currentEmotion, setCurrentEmotion, hasCrisis, setHasCrisis }) => {
  const { recordEvent, clearSession } = useChatSession();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hi there, I am MindMitra. How are you feeling today? You can share anything with me. 💙', emotion: 'neutral' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [safetyLevel, setSafetyLevel] = useState('SAFE'); // 'SAFE' | 'MODERATE_DISTRESS' | 'HIGH_RISK'

  // Mic / recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Load / clear chat history based on anonymous mode
  useEffect(() => {
    if (!isAnonymous) {
      const saved = localStorage.getItem('mindmitra_chat');
      if (saved) {
        try { setMessages(JSON.parse(saved)); } catch { /* ignore corrupted data */ }
      }
    } else {
      // Clear session analytics too in anonymous mode
      clearSession();
      setMessages([{ id: 1, sender: 'ai', text: 'Hi there, I am MindMitra. How are you feeling today? You can share anything with me. 💙', emotion: 'neutral' }]);
    }
  }, [isAnonymous]);

  useEffect(() => {
    if (!isAnonymous && messages.length > 1) {
      localStorage.setItem('mindmitra_chat', JSON.stringify(messages));
    }
  }, [messages, isAnonymous]);

  // ── Main send handler ────────────────────────────────────────────────────────
  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage = { id: Date.now(), sender: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setMicError('');

    // Step 1: Run emotion + crisis detection in parallel
    const [detectedEmotion, detectedSafety] = await Promise.all([
      detectEmotion(trimmed),
      detectCrisis(trimmed)
    ]);

    setCurrentEmotion(detectedEmotion);
    setSafetyLevel(detectedSafety);

    // Step 2: If HIGH_RISK, trigger crisis overlay and stop
    if (detectedSafety === 'HIGH_RISK') {
      setHasCrisis(true);
      setIsTyping(false);
      return;
    }

    // Step 3: Build conversation history
    const history = messages
      .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
      .slice(-10);
    history.push({ role: 'user', content: trimmed });

    // Step 4: Call main chat model WITH emotion + safety context
    const aiResponseText = await generateResponse(history, detectedEmotion, detectedSafety);

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiResponseText,
      emotion: detectedEmotion,
      safetyLevel: detectedSafety
    }]);

    // Step 5: Record this event into the global session store → updates Dashboard live
    recordEvent(detectedEmotion, detectedSafety);

    setIsTyping(false);
  };

  // ── Microphone recording ─────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setIsTranscribing(true);
        try {
          const transcribed = await transcribeAudio(audioBlob);
          if (transcribed?.trim()) {
            setInput(prev => prev ? `${prev} ${transcribed.trim()}` : transcribed.trim());
          }
        } catch (err) {
          console.error('Transcription error:', err);
          setMicError(err?.response?.data?.error?.message || 'Transcription failed. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access error:', err);
      setMicError('Microphone access denied. Please allow mic permissions and try again.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleRecording = () => isRecording ? stopRecording() : startRecording();

  return (
    <div className="flex flex-col h-full w-full bg-white md:rounded-tl-2xl border-t md:border-l border-gray-100 shadow-sm relative pt-4 overflow-hidden">

      {/* MODERATE_DISTRESS soft banner — shown inside chat, not as a full overlay */}
      <AnimatePresence>
        {safetyLevel === 'MODERATE_DISTRESS' && (
          <motion.div
            key="moderate-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 md:mx-8 mt-1 mb-3 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
          >
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800 leading-snug">
              It sounds like you're going through a tough time. Remember — you're not alone.{' '}
              <a href="tel:18005990019" className="font-semibold underline underline-offset-2">Call KIRAN (1800-599-0019)</a> anytime.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-36">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <div key={msg.id} className="flex flex-col">
              <ChatBubble message={msg} />
              {msg.sender === 'ai' && index === messages.length - 1 && currentEmotion !== 'neutral' && (
                <WellnessSuggestions emotion={currentEmotion} />
              )}
            </div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex-shrink-0 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-500" />
              <span className="text-sm">MindMitra is thinking…</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-6 px-4 md:px-8">

        {/* Quick Replies — only shown on greeting */}
        {messages.length === 1 && (
          <div
            className="flex items-center gap-2 overflow-x-auto mb-4 pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSend(reply)}
                className="whitespace-nowrap flex-shrink-0 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-sm font-medium transition"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Recording / Transcribing status */}
        {isRecording && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-2 px-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-medium text-rose-500">Recording… tap ■ to stop</span>
          </motion.div>
        )}
        {isTranscribing && (
          <div className="flex items-center gap-2 mb-2 px-2">
            <Loader2 size={14} className="animate-spin text-blue-500" />
            <span className="text-xs font-medium text-blue-500">Transcribing with Whisper Large v3…</span>
          </div>
        )}
        {micError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-500 font-medium mb-2 px-2">
            {micError}
          </motion.p>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative flex items-end gap-2 bg-white rounded-3xl border border-gray-200 shadow-lg shadow-gray-200/50 p-2 focus-within:ring-2 ring-blue-500/20 focus-within:border-blue-300 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? 'Recording in progress…' : 'Type or use the mic…'}
            disabled={isRecording}
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none px-4 py-3 placeholder:text-gray-400 text-gray-800 disabled:opacity-40"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
          />

          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isTyping || isTranscribing || hasCrisis}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
            className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition mb-1
              ${isRecording
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40'
              }`}
          >
            {isRecording ? <Square size={16} strokeWidth={2.5} /> : <Mic size={18} />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isTyping || hasCrisis || isRecording}
            className="flex-shrink-0 w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-full flex items-center justify-center transition mb-1 mr-1"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-3 font-medium">
          MindMitra is an AI demo. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
