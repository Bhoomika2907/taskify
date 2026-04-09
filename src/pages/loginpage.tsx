// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import api from '../services/api';
// import { toast } from 'react-hot-toast';
// import { Layout, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

// const LoginPage = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await api.post('/auth/login/', { email, password });
      
//       // Save data to AuthContext (tokens + user info)
//       login(
//         { access: response.data.access, refresh: response.data.refresh }, 
//         response.data.user
//       );

//       toast.success(`Welcome back, ${response.data.user.name}!`);
//       navigate('/dashboard');
//     } catch (error: any) {
//       toast.error('Invalid email or password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-6">
//       {/* Background subtle glow */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//         <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
//         <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Logo and Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 shadow-xl mb-4">
//             <Layout className="w-9 h-9 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Taskify</h1>
//           <p className="text-zinc-400 text-sm">Enter your credentials to access your workspace</p>
//         </div>

//         {/* Login Card */}
//         <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
//           <form onSubmit={handleLogin} className="space-y-5">
//             <div>
//               <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 ml-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
//                 <input 
//                   type="email" 
//                   placeholder="name@company.com" 
//                   className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-700"
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-2 ml-1">
//                 <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
//                   Password
//                 </label>
//                 <Link to="/forgot-password" size="sm" className="text-xs text-blue-500 hover:text-blue-400 font-medium">
//                   Forgot?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
//                 <input 
//                   type="password" 
//                   placeholder="••••••••" 
//                   className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-700"
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <button 
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-2"
//             >
//               {loading ? (
//                 <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
//               ) : (
//                 <>
//                   Sign In
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-8 flex items-center gap-2 justify-center py-3 px-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
//             <ShieldCheck className="w-4 h-4 text-emerald-500" />
//             <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Secure Enterprise Authentication</span>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="mt-8 text-center text-zinc-500 text-sm">
//           New to Taskify?{' '}
//           <Link to="/signup" className="text-white font-bold hover:underline underline-offset-4">
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login/', { email, password });
      login(
        { access: response.data.access, refresh: response.data.refresh },
        response.data.user
      );
      toast.success(`Welcome back, ${response.data.user.name}!`);
      navigate('/dashboard');
    } catch {
      toast.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          background: #080810;
          font-family: 'Geist', 'SF Pro Display', system-ui, sans-serif;
          display: grid;
          grid-template-columns: 70fr 30fr;
          position: relative;
          overflow: hidden;
        }

        .lp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%);
          top: -200px; left: -150px;
          animation: blobMove1 14s ease-in-out infinite;
        }
        .blob-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
          bottom: -100px; left: 30%;
          animation: blobMove2 18s ease-in-out infinite;
        }
        .blob-3 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%);
          top: 30%; left: 55%;
          animation: blobMove3 22s ease-in-out infinite;
        }

        @keyframes blobMove1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(60px,-40px) scale(1.08); }
          66% { transform: translate(-20px,60px) scale(0.96); }
        }
        @keyframes blobMove2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-60px,-50px) scale(1.1); }
        }
        @keyframes blobMove3 {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-30px,40px); }
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── LEFT PANEL (70%) ── */
        .lp-left {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 80px;
          border-right: 1px solid rgba(255,255,255,0.05);
          min-height: 100vh;
        }

        /* Logo */
        .lp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .lp-logo.show { opacity: 1; transform: translateY(0); }
        .logo-mark {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Geist', sans-serif;
          font-weight: 700;
          font-size: 40px;
          color: #fff;
          letter-spacing: -0.3px;
        }

        /* Center hero */
        .lp-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 0;
          max-width: 680px;
        }

        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.22);
          border-radius: 100px;
          padding: 6px 16px;
          margin-bottom: 32px;
          width: fit-content;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease;
        }
        .lp-badge.show { opacity: 1; transform: translateY(0); }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 8px rgba(99,102,241,0.8);
        }
        .badge-text {
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }

        .lp-headline {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(44px, 5.5vw, 72px);
          color: #fff;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease;
        }
        .lp-headline.show { opacity: 1; transform: translateY(0); }
        .lp-headline em {
          font-style: italic;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 45%, #67e8f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-sub {
          font-size: 17px;
          color: rgba(255,255,255,0.38);
          line-height: 1.7;
          max-width: 520px;
          font-weight: 400;
          margin-bottom: 56px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s 0.3s ease, transform 0.6s 0.3s ease;
        }
        .lp-sub.show { opacity: 1; transform: translateY(0); }

        /* Feature cards — horizontal row */
        .feature-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 64px;
        }

        .feat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.2s, background 0.2s;
        }
        .feat-card.show { opacity: 1; transform: translateY(0); }
        .feat-card:hover {
          border-color: rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.05);
        }
        .feat-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          margin-bottom: 12px;
        }
        .feat-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          margin-bottom: 4px;
          letter-spacing: -0.2px;
        }
        .feat-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          line-height: 1.5;
          font-weight: 400;
        }

        /* Stats bar */
        .stats-bar {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 28px 32px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s 0.55s ease, transform 0.6s 0.55s ease;
        }
        .stats-bar.show { opacity: 1; transform: translateY(0); }

        .stat-item {
          flex: 1;
          text-align: center;
        }
        .stat-item:not(:last-child) {
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 26px;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        /* Bottom footer of left */
        .lp-left-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.5s 0.65s ease, transform 0.5s 0.65s ease;
        }
        .lp-left-footer.show { opacity: 1; transform: translateY(0); }
        .footer-text {
          font-size: 12px;
          color: rgba(255,255,255,0.18);
          font-weight: 400;
        }
        .footer-links {
          display: flex;
          gap: 20px;
        }
        .footer-links a {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: rgba(255,255,255,0.5); }

        /* ── RIGHT PANEL (30%) ── */
        .lp-right {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 44px;
          background: rgba(255,255,255,0.015);
        }

        .form-wrapper {
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.7s 0.3s ease, transform 0.7s 0.3s ease;
        }
        .form-wrapper.show { opacity: 1; transform: translateX(0); }

        .form-header {
          margin-bottom: 36px;
        }
        .form-header h2 {
          font-family: 'Instrument Serif', serif;
          font-size: 30px;
          color: #fff;
          letter-spacing: -0.6px;
          margin-bottom: 6px;
          line-height: 1.1;
        }
        .form-header p {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          font-weight: 400;
        }

        .input-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }

        .input-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
          display: block;
        }

        .input-wrap { position: relative; }

        .lp-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          padding: 12px 14px 12px 40px;
          color: #fff;
          font-size: 13px;
          font-family: 'Geist', sans-serif;
          font-weight: 400;
          outline: none;
          transition: all 0.2s ease;
          -webkit-appearance: none;
        }
        .lp-input::placeholder { color: rgba(255,255,255,0.18); }
        .lp-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .input-icon {
          position: absolute;
          left: 13px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.18);
          transition: color 0.2s;
          display: flex; align-items: center;
          pointer-events: none;
        }
        .input-icon.active { color: #818cf8; }

        .input-action {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.18);
          font-size: 11px; font-weight: 500;
          padding: 2px 4px;
          font-family: 'Geist', sans-serif;
          transition: color 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .input-action:hover { color: rgba(255,255,255,0.45); }

        .forgot-row {
          display: flex; justify-content: flex-end;
          margin-top: -6px; margin-bottom: 22px;
        }
        .forgot-link {
          color: rgba(165,180,252,0.5);
          font-size: 11px; font-weight: 500;
          text-decoration: none;
          font-family: 'Geist', sans-serif;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #a5b4fc; }

        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 11px;
          border: none; cursor: pointer;
          font-size: 13px; font-weight: 600;
          font-family: 'Geist', sans-serif;
          letter-spacing: 0.1px;
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          color: #fff;
          position: relative; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
          margin-bottom: 18px;
        }
        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 40px rgba(99,102,241,0.35);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-inner {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; position: relative; z-index: 1;
        }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .or-row {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
        }
        .or-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .or-text {
          font-size: 10px; color: rgba(255,255,255,0.18);
          font-weight: 500; letter-spacing: 0.5px;
          text-transform: uppercase; white-space: nowrap;
        }

        .signup-link {
          display: block; text-align: center;
          padding: 12px;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          font-family: 'Geist', sans-serif; font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.02);
          margin-bottom: 28px;
        }
        .signup-link:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.05);
          color: rgba(255,255,255,0.7);
        }

        .trust-row {
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex; align-items: center; gap: 5px;
          color: rgba(255,255,255,0.18); font-size: 10px; font-weight: 500;
        }
        .trust-sep { color: rgba(255,255,255,0.1); font-size: 10px; }
        .trust-green {
          width: 5px; height: 5px; border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 5px rgba(16,185,129,0.7);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .lp-root { grid-template-columns: 60fr 40fr; }
          .lp-left { padding: 48px 56px; }
          .lp-right { padding: 48px 36px; }
          .lp-headline { font-size: clamp(38px, 5vw, 58px); }
        }

        @media (max-width: 768px) {
          .lp-root {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }
          .lp-left {
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 40px 32px 36px;
            min-height: auto;
          }
          .lp-hero { padding: 32px 0 28px; }
          .lp-headline { font-size: clamp(32px, 8vw, 48px); letter-spacing: -1.5px; }
          .lp-sub { font-size: 15px; margin-bottom: 36px; }
          .feature-row { grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 36px; }
          .feat-card { padding: 14px; }
          .feat-icon { width: 28px; height: 28px; font-size: 14px; margin-bottom: 8px; }
          .feat-title { font-size: 11px; }
          .feat-desc { display: none; }
          .stats-bar { padding: 20px 24px; }
          .stat-num { font-size: 22px; }
          .lp-left-footer { display: none; }
          .lp-right { padding: 40px 32px 48px; align-items: center; }
          .form-wrapper { max-width: 440px; width: 100%; }
        }

        @media (max-width: 480px) {
          .lp-left { padding: 28px 20px 28px; }
          .lp-right { padding: 32px 20px 48px; }
          .lp-headline { font-size: 30px; letter-spacing: -1px; }
          .lp-sub { font-size: 14px; }
          .feature-row { grid-template-columns: 1fr; gap: 8px; }
          .feat-desc { display: block; }
          .stats-bar { grid-template-columns: 1fr; padding: 16px 20px; }
          .form-header h2 { font-size: 26px; }
        }
      `}</style>

      <div className="lp-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />

        {/* ── LEFT 70% ── */}
        <div className="lp-left">
          {/* Logo */}
          <div className={`lp-logo ${mounted ? 'show' : ''}`}>
            <span className="logo-text">Taskify</span>
          </div>

          {/* Hero */}
          <div className="lp-hero">
            <div className={`lp-badge ${mounted ? 'show' : ''}`}>
              <div className="badge-dot" />
              <span className="badge-text">Now with drag & drop boards</span>
            </div>

            <h1 className={`lp-headline ${mounted ? 'show' : ''}`}>
              Where great teams<br />
              <em>get things done.</em>
            </h1>

            <p className={`lp-sub ${mounted ? 'show' : ''}`}>
              Manage projects, assign tasks, and ship faster — all in one workspace built for managers and their teams.
            </p>

            {/* Feature cards */}
            <div className="feature-row">
              {[
                { icon: '⚡', title: 'Drag & drop boards', desc: 'Visual kanban that keeps everyone in sync.', delay: '0.35s' },
                { icon: '🎯', title: 'Role-based access', desc: 'Managers, leads, and employees — each with the right access.', delay: '0.45s' },
                { icon: '💬', title: 'Task discussions', desc: 'Comments live on tasks, not buried in email.', delay: '0.55s' },
              ].map(f => (
                <div
                  key={f.title}
                  className={`feat-card ${mounted ? 'show' : ''}`}
                  style={{ transitionDelay: f.delay }}
                >
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className={`stats-bar ${mounted ? 'show' : ''}`}>
              {[
                { num: '12k+', label: 'Active teams' },
                { num: '98%', label: 'On-time delivery' },
                { num: '4.9 ★', label: 'Satisfaction' },
                { num: '<2min', label: 'Avg. setup time' },
              ].map(s => (
                <div key={s.label} className="stat-item">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`lp-left-footer ${mounted ? 'show' : ''}`}>
            <span className="footer-text">© 2026 Taskify. All rights reserved.</span>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>

        {/* ── RIGHT 30% ── */}
        <div className="lp-right">
          <div className={`form-wrapper ${mounted ? 'show' : ''}`}>

            <div className="form-header">
              <h2>Welcome back</h2>
              <p>Sign in to your workspace</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <div>
                  <label className="input-label">Email</label>
                  <div className="input-wrap">
                    <span className={`input-icon ${focused === 'email' ? 'active' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="lp-input"
                      placeholder="you@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Password</label>
                  <div className="input-wrap">
                    <span className={`input-icon ${focused === 'password' ? 'active' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="lp-input"
                      placeholder="••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      required
                      autoComplete="current-password"
                      style={{ paddingRight: '48px' }}
                    />
                    <button
                      type="button"
                      className="input-action"
                      onClick={() => setShowPass(s => !s)}
                      tabIndex={-1}
                    >
                      {showPass ? 'hide' : 'show'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="forgot-row">
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                <div className="btn-inner">
                  {loading ? (
                    <><div className="spinner" />Signing in…</>
                  ) : (
                    <>
                      Sign in to Taskify
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="or-row">
              <div className="or-line" />
              <span className="or-text">New to Taskify?</span>
              <div className="or-line" />
            </div>

            <Link to="/signup" className="signup-link">
              Create a free account →
            </Link>

            <div className="trust-row">
              <div className="trust-item">
                <div className="trust-green" />
                Secure
              </div>
              <span className="trust-sep">·</span>
              <div className="trust-item">256-bit SSL</div>
              <span className="trust-sep">·</span>
              <div className="trust-item">SOC 2 ready</div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;