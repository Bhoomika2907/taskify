import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

const mainlayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F4]">
      <Navbar />
      <main className="max-w-7xl mx-auto p-8">
        {/* Outlet is where the specific page content (like Dashboard) will appear */}
        <Outlet />
      </main>
    </div>
  );
};

export default mainlayout;