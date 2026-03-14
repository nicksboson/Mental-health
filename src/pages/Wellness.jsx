import { motion } from 'framer-motion';
import { BookOpen, Wind, Coffee, Brain, ChevronRight } from 'lucide-react';

const categories = [
  {
    icon: <Wind size={24} className="text-blue-500" />,
    title: 'Breathing Exercises',
    description: 'Techniques to quickly calm your nervous system.',
    bgColor: 'bg-blue-50',
    items: ['4-7-8 Breathing', 'Box Breathing', 'Diaphragmatic Breathing']
  },
  {
    icon: <Brain size={24} className="text-emerald-500" />,
    title: 'Meditation & Mindfulness',
    description: 'Guided practices to ground yourself and stay present.',
    bgColor: 'bg-emerald-50',
    items: ['5-Minute Body Scan', 'Mindful Walking', 'Loving-Kindness Meditation']
  },
  {
    icon: <Coffee size={24} className="text-amber-500" />,
    title: 'Stress Management',
    description: 'Practical ways to handle academic and related stress.',
    bgColor: 'bg-amber-50',
    items: ['Progressive Muscle Relaxation', 'Journaling Prompts', 'Time-blocking technique']
  },
  {
    icon: <BookOpen size={24} className="text-rose-500" />,
    title: 'Study & Burnout Recovery',
    description: 'Tips to rest, recover, and study without burning out.',
    bgColor: 'bg-rose-50',
    items: ['Pomodoro Technique', 'Digital Detox Guide', 'Optimizing Sleep']
  }
];

const Wellness = () => {
  return (
    <div className="flex-1 w-full bg-[#F8FAFC] min-h-[calc(100vh-4rem)] p-4 md:p-8 pb-20">
      <div className="max-w-6xl mx-auto mt-4">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-3xl font-bold text-gray-900 tracking-tight"
          >
            Wellness Resource Library
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-500 max-w-2xl">
            Explore curated tools, techniques, and literature to build mental resilience, manage stress, and find peace of mind.
          </motion.p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl ${cat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{cat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-50 space-y-3">
                {cat.items.map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition text-sm group">
                    <span>{item}</span>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Wellness;
