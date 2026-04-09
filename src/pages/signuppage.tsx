import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  Mail, Lock, User, ShieldCheck, 
  ArrowRight, Briefcase, UserPlus 
} from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup/', formData);
      toast.success('Account created!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.email?.[0] || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Changed min-h-screen to h-screen and added overflow-hidden
    <div className="h-screen w-full flex items-center justify-center bg-[#09090b] relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        {/* Header - Compacted margins */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 shadow-xl mb-3">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Create Account</h1>
          <p className="text-zinc-400 text-xs">Join Taskify to start managing projects</p>
        </div>

        {/* Signup Card - Adjusted padding */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-7 rounded-[32px] backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-3">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-700 text-sm"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-700 text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-700 text-sm"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3.5 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm"
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  value={formData.role}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-2 shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Infrastructure Badge */}
          <div className="mt-6 flex items-center gap-2 justify-center py-2.5 px-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Enterprise Secure</span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-zinc-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-bold hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;