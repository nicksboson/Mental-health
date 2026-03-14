import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageSquare, BarChart2, BookOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <></> },
    { path: '/chat', label: 'Chat', icon: <MessageSquare size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart2 size={20} /> },
    { path: '/wellness', label: 'Wellness Tips', icon: <BookOpen size={20} /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Heart size={18} fill="currentColor" />
            </div>
            <span className="font-semibold text-xl text-gray-900 tracking-tight">MindMitra</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="md:hidden flex">
             {/* Mobile space */}
          </div>
        </div>
      </div>
      
      {/* Mobile nav simple bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 text-xs transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <div className={`${isActive ? 'bg-blue-50' : ''} p-1.5 rounded-full`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
