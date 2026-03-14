import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import Sidebar from '../components/Sidebar';
import CrisisSupport from '../components/CrisisSupport';

const Chat = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasCrisis, setHasCrisis] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full bg-[#F8FAFC]">
      <Sidebar 
        isAnonymous={isAnonymous} 
        setIsAnonymous={setIsAnonymous} 
        currentEmotion={currentEmotion} 
      />
      
      <div className="flex-1 flex flex-col pt-4 pb-0 px-0 relative w-full h-full overflow-hidden">
        <ChatInterface 
          isAnonymous={isAnonymous} 
          currentEmotion={currentEmotion}
          setCurrentEmotion={setCurrentEmotion}
          hasCrisis={hasCrisis}
          setHasCrisis={setHasCrisis}
        />
        
        {hasCrisis && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <CrisisSupport onClose={() => setHasCrisis(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
