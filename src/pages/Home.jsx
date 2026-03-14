import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Activity, Heart, Shield, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="text-blue-600" size={24} />,
    title: 'AI Chat Companion',
    description: 'A 24/7 empathetic listener ready to support you.'
  },
  {
    icon: <Activity className="text-emerald-500" size={24} />,
    title: 'Emotion Detection',
    description: 'Understanding how you feel to provide tailored support.'
  },
  {
    icon: <Heart className="text-rose-500" size={24} />,
    title: 'Wellness Guidance',
    description: 'Personalized tips and exercises for your mental well-being.'
  },
  {
    icon: <Shield className="text-amber-500" size={24} />,
    title: 'Crisis Support',
    description: 'Immediate resources when you need professional help.'
  }
];

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-4rem)] px-4 py-12 pb-24 md:pb-12 space-y-24 bg-[#F8FAFC]">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 mt-12">
        <br />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
        >
          MindMitra <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            Your AI Mental Wellness Companion
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          24/7 anonymous support. AI-powered emotional understanding. Personalized wellness guidance.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link to="/chat" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
            Start Chatting <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center">
            Explore Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default Home;
