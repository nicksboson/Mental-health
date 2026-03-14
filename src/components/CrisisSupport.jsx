import { motion } from 'framer-motion';
import { AlertCircle, Phone, X } from 'lucide-react';

const CrisisSupport = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">You are not alone</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        You may be going through a very difficult moment right now. We care about you, and help is available unconditionally. Please consider speaking with a professional who can support you.
      </p>

      <div className="space-y-4">
        <a 
          href="tel:18005990019" 
          className="flex items-center justify-center gap-3 w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 px-4 rounded-xl font-semibold transition"
        >
          <Phone size={20} />
          Call KIRAN Helpline (India)
        </a>
        <a 
          href="https://indianhelpline.com/" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 py-3.5 px-4 rounded-xl font-medium transition"
        >
          View More Resources
        </a>
      </div>
    </motion.div>
  );
};

export default CrisisSupport;
