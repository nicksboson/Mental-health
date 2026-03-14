import { motion } from 'framer-motion';

const emotionColors = {
  happy: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  sad: 'bg-violet-50 text-violet-600 border-violet-200',
  anxious: 'bg-blue-50 text-blue-600 border-blue-200',
  stressed: 'bg-amber-50 text-amber-600 border-amber-200',
  angry: 'bg-rose-50 text-rose-600 border-rose-200',
  lonely: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  neutral: 'bg-gray-50 text-gray-600 border-gray-200'
};

const emotionEmojis = {
  happy: '😊',
  sad: '😔',
  anxious: '😟',
  stressed: '😫',
  angry: '😠',
  lonely: '🫂',
  neutral: '😌'
};

const EmotionIndicator = ({ emotion = 'neutral' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${emotionColors[emotion]}`}
    >
      <span>{emotionEmojis[emotion]}</span>
      <span className="capitalize">{emotion}</span>
    </motion.div>
  );
};

export default EmotionIndicator;
