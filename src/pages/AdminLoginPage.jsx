import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Terminal, ArrowRight, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { mockLogin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Admin Flow State
    const [step, setStep] = useState('credentials');
    const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', '']);

    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // DEVELOPER ACCESS (Temporary Header)
        // Kept for dev team access as requested. Remove in production.
        if (email === 'admin@maldives.com' && password === 'admin123') {
            mockLogin({
                id: 'dev-admin',
                email: 'admin@maldives.com',
                name: 'Developer Admin',
                role: 'admin'
            });
            setIsLoading(false);
            setStep('2fa');
            return;
        }

        try {
            // Call MongoDB backend for ADMIN login
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: 'ADMIN' })
            });

            const data = await response.json();

            if (response.ok) {
                mockLogin({
                    id: data.user._id,
                    email: data.user.email,
                    name: data.user.full_name,
                    role: data.user.role
                });
                setStep('2fa');
            } else {
                alert('Invalid email or password.');
            }
        } catch (err) {
            console.error("Admin Login Error:", err);
            alert('Authentication failed. Network error.');
        } finally {
            setIsLoading(false);
        }
    };

    const handle2FASubmit = (e) => {
        e.preventDefault();

        if (twoFACode.join('').length === 6) {
            navigate('/admin');
        } else {
            alert('Please enter the 6-digit code');
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length > 1) return;
        const newCode = [...twoFACode];
        newCode[index] = value;
        setTwoFACode(newCode);

        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !twoFACode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    if (step === '2fa') {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-[#f1f5f9] flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 p-8 md:p-12 relative">
                    <button
                        onClick={() => setStep('credentials')}
                        className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>

                    <div className="text-center mb-8 mt-4">
                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-teal-100">
                            <ShieldCheck className="w-8 h-8 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Two-Step Verification</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Enter the 6-digit code sent to your secure device.
                        </p>
                    </div>

                    <form onSubmit={handle2FASubmit} className="space-y-8">
                        <div className="flex gap-2 justify-center">
                            {twoFACode.map((digit, idx) => (
                                <div key={idx} className="relative">
                                    <input
                                        id={`code-${idx}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="w-10 h-14 md:w-12 md:h-16 text-center text-xl md:text-2xl font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0b0f1a] text-white py-5 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            Verify Access <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Protected by End-to-End Encryption
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f1f5f9] flex items-center justify-center p-3 md:p-6">
            <div className="w-full max-w-5xl bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row md:min-h-[640px] border border-slate-100">
                {/* Left Panel - Dark */}
                <div className="w-full md:w-[42%] bg-[#0b0f1a] p-6 md:p-16 text-white flex flex-col justify-between relative shrink-0">
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 text-[10px] font-bold uppercase tracking-widest transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#121b2d] rounded-xl flex items-center justify-center mb-4 md:mb-12 border border-slate-800">
                            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-teal-500" />
                        </div>
                        <h1 className="text-2xl md:text-6xl font-black tracking-tighter mb-2 md:mb-4 leading-[0.9]">System <br />Gateway</h1>
                        <p className="text-slate-400 text-xs md:text-xl font-medium opacity-80 mt-2 md:mt-6">
                            Platform governance hub.
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 md:mt-0">
                        <div className="bg-white/5 border border-white/10 p-3 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-md max-w-xs">
                            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-400" />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-teal-400">Identity Locked</span>
                            </div>
                            <p className="text-[9px] md:text-[10px] text-slate-400 leading-relaxed font-bold">
                                Credentials managed by secure encryption.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex-1 p-6 md:p-24 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-1 md:mb-2 tracking-tight">Administrative Access</h2>
                        <p className="text-slate-400 text-xs md:text-sm font-bold mb-6 md:mb-12">Please authenticate to continue.</p>

                        <form onSubmit={handleCredentialsSubmit} className="space-y-4 md:space-y-8">
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-300 tracking-widest ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 md:pl-14 pr-4 md:pr-6 py-3.5 md:py-4.5 bg-[#f8fafc] border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 transition-all font-bold text-slate-800 text-sm md:text-lg"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-300 tracking-widest">Access Key</label>
                                    <button type="button" className="text-[9px] md:text-[10px] font-black uppercase text-teal-600 hover:underline tracking-widest">Forgot?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 md:pl-14 pr-4 md:pr-6 py-3.5 md:py-4.5 bg-[#f8fafc] border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 transition-all font-bold text-slate-800 text-sm md:text-lg"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0b0f1a] text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 mt-4 md:mt-6 disabled:opacity-50"
                            >
                                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</> : <>Authenticate Access <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /></>}
                            </button>
                        </form>
                        <p className="mt-8 text-center text-xs text-slate-400">
                            Use <span className="font-mono font-bold text-slate-800">admin@maldives.com</span> / <span className="font-mono font-bold text-slate-800">admin123</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
