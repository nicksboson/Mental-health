import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Wellness from './pages/Wellness';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wellness" element={<Wellness />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;
