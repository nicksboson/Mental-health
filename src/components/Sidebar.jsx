import { Info, Link as LinkIcon, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isAnonymous, setIsAnonymous, currentEmotion }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-4 h-full relative overflow-y-auto z-10">
      <div className="space-y-6">
        {/* Anonymous Toggle */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Anonymous Mode</span>
            <button 
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${isAnonymous ? 'bg-blue-600' : 'bg-gray-300'} flex items-center`}
            >
              <motion.div 
                className="w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ x: isAnonymous ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {isAnonymous ? 'Chats are instantly wiped. No history saved.' : 'Your chat history is saved to your browser.'}
          </p>
        </div>

        {/* Emotion Indicator Info */}
        <div className="px-1">
          <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Current Emotion</h4>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600`}>
              {currentEmotion || 'Neutral'}
            </span>
          </div>
        </div>

        {/* Resources */}
        <div className="px-1">
          <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Helpful Resources</h4>
          <div className="space-y-2">
            <a href="https://indianhelpline.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-blue-50">
              <Phone size={16} /> <span>1800-599-0019 (KIRAN)</span>
            </a>
            <a href="https://www.aasra.info/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-blue-50">
              <LinkIcon size={16} /> <span>Aasra Helpline</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Brand Watermark Bottom */}
      <div className="mt-auto pt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1 opacity-60">
        <Info size={12} /> MindMitra AI Companion
      </div>
    </div>
  );
};

export default Sidebar;
