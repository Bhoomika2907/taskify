import { Layout, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
      <Logo className="w-9 h-9" variant="light" /> 
        <span className="text-xl font-bold tracking-tight">Taskify</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <UserIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold text-white uppercase bg-black rounded-full">
            {user?.role}
          </span>
        </div>
        <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default navbar;