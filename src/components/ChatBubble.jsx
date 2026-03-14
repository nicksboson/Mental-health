import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import EmotionIndicator from './EmotionIndicator';

const ChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex items-end gap-3 w-full mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div 
        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center 
        ${isUser ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}
      >
        {isUser ? <User size={18} /> : <Sparkles size={18} />}
      </div>
      
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && message.emotion && (
          <div className="mb-2">
            <EmotionIndicator emotion={message.emotion} />
          </div>
        )}
        
        <div 
          className={`px-5 py-3.5 shadow-sm leading-relaxed text-[15px]
          ${isUser 
            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md' 
            : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-md'}`}
        >
          {message.text}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
