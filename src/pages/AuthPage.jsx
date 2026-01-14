import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Globe,
    ShieldCheck,
    Zap,
    Phone,
    ArrowLeft,
    CheckCircle2,
    Terminal,
    MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ initialMode = 'login' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from;
    const isAgentLogin = from === 'agent' || from === 'recruiter';
    const isAdminLogin = from === 'admin';

    const [mode, setMode] = useState(initialMode);
    const [showAgentContact, setShowAgentContact] = useState(false);


    const [signupStep, setSignupStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const [formData, setFormData] = useState({
        name: 'Demo User',
        email: isAgentLogin ? 'agent@globaltalent.com' : isAdminLogin ? 'super.admin@maldivescareer.com' : 'candidate@example.com',
        password: 'password123',
        phone: '9609999999'
    });

    useEffect(() => {
        setMode(initialMode);
        if (isAgentLogin) {
            setFormData(prev => ({ ...prev, email: 'agent@globaltalent.com' }));
        } else if (isAdminLogin) {
            setFormData(prev => ({ ...prev, email: 'super.admin@maldivescareer.com' }));
        }
    }, [initialMode, isAgentLogin, isAdminLogin]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        if (isAgentLogin) {
            login({
                name: 'Global Talent Ltd',
                email: formData.email,
                role: 'employer',
                avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100'
            });
            navigate('/recruiter');
        } else if (isAdminLogin) {
            login({
                name: 'Platform Administrator',
                email: formData.email,
                role: 'employer'
            });
            navigate('/admin');
        } else {
            login({
                name: 'Rahul Sharma',
                email: formData.email,
                role: 'candidate'
            });
            navigate('/');
        }
    };

    const handleSignupStep1 = (e) => {
        e.preventDefault();

        setSignupStep(2);
    };

    const handleSignupVerification = (e) => {
        e.preventDefault();

        if (otp.join('').length === 6) {
            login({
                name: formData.name,
                email: formData.email,
                role: 'candidate'
            });
            navigate('/');
        } else {
            alert('Please enter the 6-digit code sent to your mobile.');
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);


        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const isLogin = mode === 'login';


    if (isAdminLogin && isLogin) {
        return (
            <AdminLoginFlow
                email={formData.email}
                password={formData.password}
                setEmail={(email) => setFormData(prev => ({ ...prev, email }))}
                setPassword={(password) => setFormData(prev => ({ ...prev, password }))}
                onLogin={(e) => {
                    e.preventDefault();
                    login({
                        name: 'Platform Administrator',
                        email: formData.email,
                        role: 'employer'
                    });
                    navigate('/admin');
                }}
                onSwitchToCandidate={() => navigate('/login', { state: { from: 'candidate' } })}
            />
        );
    }


    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#fdfbf7] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100">

                {/* LEFT PANEL - BRANDING */}
                <div className="w-full md:w-5/12 bg-teal-800 text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-full bg-white opacity-5 transform skew-x-12 translate-x-20"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 border border-white/30 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm">
                            <User className="w-6 h-6 text-white" />
                        </div>

                        {isLogin ? (
                            <>
                                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tighter">Island Jobs <br /><span className="text-maldives-300">Simplified.</span></h1>
                                <p className="text-teal-100 font-medium text-lg opacity-90">{isAgentLogin ? 'Broker & Partner Gateway.' : 'Access all verified Maldivian vacancies.'}</p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tighter">Start Your <br /><span className="text-maldives-300">Journey.</span></h1>
                                <p className="text-teal-100 font-medium text-lg opacity-90">Join thousands of professionals finding their dream careers in the Maldives.</p>
                            </>
                        )}
                    </div>

                    <div className="relative z-10">
                        {isLogin ? (
                            isAgentLogin ? (
                                <div className="space-y-3">
                                    {!showAgentContact ? (
                                        <button
                                            onClick={() => setShowAgentContact(true)}
                                            className="flex items-center gap-2 font-black transition-all text-white group uppercase text-[11px] tracking-widest hover:text-maldives-300"
                                        >
                                            New Arrival? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <div className="bg-white/10 border border-white/20 p-5 rounded-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            {/* Agent Contact Info - Keep as is */}
                                            <p className="text-[10px] font-black uppercase text-maldives-300 mb-2 tracking-widest flex items-center gap-2">
                                                <MessageCircle className="w-3.5 h-3.5" /> Next Steps
                                            </p>
                                            <p className="text-sm font-bold text-white leading-tight">Contact the admin for further process:</p>
                                            <a href="mailto:admin@maldivescareer.com" className="text-base font-bold text-teal-50 hover:text-white mt-1 block hover:underline decoration-maldives-400 underline-offset-4 transition-colors">admin@maldivescareer.com</a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">New Arrival?</p>
                                    <button onClick={() => setMode('register')} className="flex items-center gap-2 font-black transition-all text-white group uppercase text-[10px] tracking-widest hover:text-maldives-300">
                                        Create Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            )
                        ) : (
                            <>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">Already a Member?</p>
                                <button onClick={() => setMode('login')} className="flex items-center gap-2 font-black transition-all text-white group uppercase text-[10px] tracking-widest hover:text-maldives-300">
                                    Log In Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL - FORMS */}
                <div className="w-full md:w-7/12 p-8 md:p-20 flex flex-col justify-center bg-white relative">

                    {/* LOGIN FORM */}
                    {isLogin && (
                        <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Login</h2>
                            <p className="text-slate-500 mb-12 font-medium">Please enter your details to continue.</p>
                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                    <input type="email" required placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-slate-700" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                    <input type="password" required placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-slate-700" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 mt-4">
                                    Log In <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* SIGNUP FORM */}
                    {!isLogin && (
                        <div className="max-w-[400px] mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">

                            {/* Progress Indicator */}
                            <div className="flex items-center gap-2 mb-8">
                                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${signupStep >= 1 ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
                                <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${signupStep >= 2 ? 'bg-teal-600' : 'bg-slate-100'}`}></div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                                {signupStep === 1 ? 'Create Account' : 'Verify Mobile'}
                            </h2>
                            <p className="text-slate-500 mb-8 font-medium">
                                {signupStep === 1 ? 'Join the professional Maldivian workforce.' : `Enter the code sent to ${formData.phone}`}
                            </p>

                            {/* STEP 1: DETAILS */}
                            {signupStep === 1 && (
                                <form onSubmit={handleSignupStep1} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Mobile Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                type="tel"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all"
                                                placeholder="7779999"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-teal-600 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 mt-6 flex items-center justify-center gap-3">
                                        Verify Mobile <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: OTP */}
                            {signupStep === 2 && (
                                <form onSubmit={handleSignupVerification} className="space-y-6">
                                    <div className="flex gap-2 justify-center my-8">
                                        {otp.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                id={`otp-${idx}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                className="w-12 h-14 text-center text-xl font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3">
                                        Verify & Create Account <CheckCircle2 className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSignupStep(1)}
                                        className="w-full text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-3 h-3" /> Change Number
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const AdminLoginFlow = ({ email, setEmail, password, setPassword, onLogin, onSwitchToCandidate }) => {
    const [step, setStep] = useState('credentials');
    const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', '']);

    const handleCredentialsSubmit = (e) => {
        e.preventDefault();
        setStep('2fa');
    };

    const handle2FASubmit = (e) => {
        e.preventDefault();

        if (twoFACode.join('').length === 6) {
            onLogin(e);
        } else {
            alert('Please enter a valid 6-digit code');
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
                                className="w-full bg-[#0b0f1a] text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 mt-4 md:mt-6"
                            >
                                Authenticate Access <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
