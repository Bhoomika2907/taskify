import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Hash, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    new_password: '',
  });

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password/', formData);
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error('Invalid OTP or Session expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#09090b] relative overflow-hidden text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl mb-4">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-zinc-400 text-sm">Enter the code sent to {formData.email}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-md">
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase mb-2">6-Digit OTP</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 tracking-[1em] font-mono text-center"
                  onChange={(e) => setFormData({...formData, otp: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : (
                <>Update Password <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;