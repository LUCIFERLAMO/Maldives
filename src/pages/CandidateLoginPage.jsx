import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const CandidateLoginPage = ({ initialMode = 'login' }) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [mode, setMode] = useState(initialMode);

    const [signupStep, setSignupStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });

    useEffect(() => {
        setMode(initialMode);
        // Reset steps when mode changes
        if (initialMode === 'login') {
            setSignupStep(1);
            setOtp(['', '', '', '', '', '']);
        }
    }, [initialMode]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // REAL SUPABASE LOGIN FOR CANDIDATES (CLIENT)
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        // REAL SUPABASE LOGIN FOR CANDIDATES (CLIENT)
        const { error } = await login(formData.email, formData.password);

        if (error) {
            // SECURITY: Generic error message
            alert('Invalid email or password.');
        } else {
            navigate('/dashboard');
        }
    };

    const handleSignupStep1 = async (e) => {
        e.preventDefault();

        // Validate phone number
        if (!formData.phone || formData.phone.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }

        try {
            // Initiate OTP Login (Passwordless Signup)
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    // This optional data will be used if a new user is created
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                        role: 'candidate' // Verified: Hardcoded role assignment
                    }
                }
            });

            if (error) throw error;

            // Move to OTP step
            setSignupStep(2);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert(`Failed to send verification code: ${error.message}`);
        }
    };

    const handleSignupVerification = async (e) => {
        e.preventDefault();

        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            alert('Please enter the 6-digit code sent to your email.');
            return;
        }

        try {
            // Verify OTP
            const { data: { session, user }, error: verifyError } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: otpCode,
                type: 'email'
            });

            if (verifyError) throw verifyError;

            if (user) {
                // Ensure profile is created matching our schema
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert([
                        {
                            id: user.id,
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            role: 'candidate'
                        }
                    ]);

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }

                if (session) {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Signup error:', err);
            alert(`Verification failed: ${err.message}. Please try again.`);
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

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#fdfbf7] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100">

                {/* LEFT PANEL - BRANDING */}
                <div className="w-full md:w-5/12 bg-teal-800 text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-full bg-white opacity-5 transform skew-x-12 translate-x-20"></div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center text-teal-200 hover:text-white mb-6 text-xs font-bold uppercase tracking-widest transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>

                        <div className="w-12 h-12 border border-white/30 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm">
                            <User className="w-6 h-6 text-white" />
                        </div>

                        {isLogin ? (
                            <>
                                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tighter">Island Jobs <br /><span className="text-maldives-300">Simplified.</span></h1>
                                <p className="text-teal-100 font-medium text-lg opacity-90">Access all verified Maldivian vacancies.</p>
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
                            <>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">New Arrival?</p>
                                <button onClick={() => setMode('register')} className="flex items-center gap-2 font-black transition-all text-white group uppercase text-[10px] tracking-widest hover:text-maldives-300">
                                    Create Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
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

export default CandidateLoginPage;
