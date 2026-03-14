import { motion } from 'framer-motion';
import { mockWellnessTips } from '../data/mockWellnessTips';
import { Sparkles, CheckCircle } from 'lucide-react';

const WellnessSuggestions = ({ emotion }) => {
  if (!emotion || emotion === 'neutral') return null;

  const validTips = mockWellnessTips.filter(tip => tip.emotion === emotion);
  
  if (validTips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 mb-2 flex flex-col gap-2 w-full max-w-[75%]"
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
        <Sparkles size={14} className="text-blue-500" /> Suggested for you
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {validTips.map((tip, idx) => (
          <div 
            key={idx}
            className="flex-shrink-0 bg-white border border-blue-100 rounded-xl p-3 max-w-[200px] shadow-sm flex gap-2"
          >
            <div className="mt-0.5 min-w-[16px]">
              <CheckCircle size={16} className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-700 leading-snug">{tip.tip}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WellnessSuggestions;
