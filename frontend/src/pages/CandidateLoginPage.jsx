import API_BASE_URL from '../api/config.js';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Phone,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/passwordValidation';

const CandidateLoginPage = ({ initialMode = 'login' }) => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();

    const [mode, setMode] = useState(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const googleLoginRef = useRef(null);
    const googleSignupRef = useRef(null);

    // Forgot password state
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState(null); // { type: 'success'|'error', text }

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        countryCode: '+960'
    });
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const [notification, setNotification] = useState(null);

    // Handle credential returned by Google's Identity Services popup
    const handleGoogleLogin = useCallback(async (credentialResponse) => {
        setGoogleLoading(true);
        setNotification(null);
        try {
            const { error } = await loginWithGoogle(credentialResponse.credential, 'CANDIDATE');
            if (!error) {
                navigate('/dashboard');
            } else {
                setNotification({ type: 'error', text: error });
            }
        } catch (err) {
            setNotification({ type: 'error', text: 'Google login failed. Please try again.' });
        } finally {
            setGoogleLoading(false);
        }
    }, [loginWithGoogle, navigate]);

    // Initialize Google Identity Services and render buttons into ref containers
    useEffect(() => {
        const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
        if (!GOOGLE_CLIENT_ID) return;

        const renderGoogleButtons = () => {
            if (!window.google?.accounts?.id) return;
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin,
            });
            if (googleLoginRef.current) {
                googleLoginRef.current.innerHTML = '';
                window.google.accounts.id.renderButton(googleLoginRef.current, {
                    theme: 'outline', size: 'large', text: 'signin_with',
                    width: googleLoginRef.current.offsetWidth || 400
                });
            }
            if (googleSignupRef.current) {
                googleSignupRef.current.innerHTML = '';
                window.google.accounts.id.renderButton(googleSignupRef.current, {
                    theme: 'outline', size: 'large', text: 'signup_with',
                    width: googleSignupRef.current.offsetWidth || 400
                });
            }
        };

        if (window.google?.accounts?.id) {
            renderGoogleButtons();
        } else {
            const timer = setTimeout(renderGoogleButtons, 1000);
            return () => clearTimeout(timer);
        }
    }, [handleGoogleLogin, mode]);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotMessage(null);

        // Abort if backend takes more than 15 seconds (prevents infinite spinner)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
                signal: controller.signal,
            });
            clearTimeout(timeout);
            const data = await res.json();
            if (res.ok) {
                setForgotMessage({ type: 'success', text: data.message });
            } else {
                setForgotMessage({ type: 'error', text: data.message || 'Failed to send reset email.' });
            }
        } catch (err) {
            clearTimeout(timeout);
            if (err.name === 'AbortError') {
                setForgotMessage({ type: 'error', text: 'Request timed out. Please check your connection and try again.' });
            } else {
                setForgotMessage({ type: 'error', text: 'Network error. Please try again.' });
            }
        } finally {
            setForgotLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification(null);

        if (formData.password.length < 6) {
            setNotification({ type: 'error', text: 'Password must be at least 6 characters long.' });
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await login(formData.email, formData.password);
            if (!error) {
                navigate('/dashboard');
            } else {
                setNotification({ type: 'error', text: error || 'Invalid email or password.' });
            }
        } catch (err) {
            console.error('Login error:', err);
            setNotification({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification(null);

        if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            setNotification({ type: 'error', text: 'Name can only contain alphabets and spaces.' });
            setIsLoading(false);
            return;
        }

        if (/[<>\/]/.test(formData.email)) {
            setNotification({ type: 'error', text: 'Email contains invalid characters (<, >, /).' });
            setIsLoading(false);
            return;
        }

        const phoneDigits = formData.phone.replace(/\D/g, '');
        
        let isValidPhone = false;
        if (formData.countryCode === '+960' && phoneDigits.length === 7) isValidPhone = true;
        else if (formData.countryCode === '+91' && phoneDigits.length === 10) isValidPhone = true;
        else if (phoneDigits.length >= 7 && phoneDigits.length <= 15) isValidPhone = true;

        if (!formData.phone || !/^\d+$/.test(formData.phone) || !isValidPhone) {
            setNotification({ type: 'error', text: formData.countryCode === '+91' ? 'Please enter a valid 10-digit phone number' : formData.countryCode === '+960' ? 'Please enter a valid 7-digit phone number' : 'Please enter a valid phone number' });
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setNotification({ type: 'error', text: 'Password must be at least 6 characters long.' });
            setIsLoading(false);
            return;
        }

        const pwCheck = validatePassword(formData.password);
        if (!pwCheck.isValid) {
            setNotification({ type: 'error', text: 'Password must meet all security requirements (8+ chars, uppercase, lowercase, number, special character).' });
            setIsLoading(false);
            return;
        }


        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    phone: `${formData.countryCode}${formData.phone}`,
                    role: 'CANDIDATE',
                    skills: []
                })
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ type: 'success', text: 'Account created!' });
                setMode('login');
                setFormData({ ...formData, password: '' });
            } else {
                setNotification({ type: 'error', text: 'Registration Failed: ' + data.message });
            }
        } catch (err) {
            console.error('Signup error:', err);
            setNotification({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const isLogin = mode === 'login';

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#fdfbf7] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100">

                {/* LEFT PANEL */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
                        <img
                            src="https://images.unsplash.com/photo-1540206395-688085723adb?q=80&w=2576&auto=format&fit=crop"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-full bg-white/5 opacity-10 transform skew-x-12 translate-x-20 blur-3xl"></div>
                    <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-teal-500/20 rounded-full blur-[80px]"></div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center text-teal-200 hover:text-white mb-8 text-[10px] font-black uppercase tracking-widest transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>
                        <div className="w-14 h-14 border border-white/20 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md shadow-2xl">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        {isLogin ? (
                            <>
                                <h1 className="text-4xl md:text-5xl font-black leading-[0.95] mb-6 tracking-tighter">
                                    Island Jobs <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400">Simplified.</span>
                                </h1>
                                <p className="text-teal-100/80 font-medium text-lg leading-relaxed">Access the most exclusive opportunities across the Maldives archipelago.</p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-4xl md:text-5xl font-black leading-[0.95] mb-6 tracking-tighter">
                                    Start Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-400">Journey.</span>
                                </h1>
                                <p className="text-teal-100/80 font-medium text-lg leading-relaxed">Join a elite community of professionals finding their dream careers in paradise.</p>
                            </>
                        )}
                    </div>

                    <div className="relative z-10 mt-12">
                        {isLogin ? (
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-teal-200 mb-2">New Arrival?</p>
                                <button onClick={() => { setMode('register'); setNotification(null); }} className="flex items-center gap-2 text-white font-bold group hover:text-teal-300 transition-colors">
                                    Create Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-teal-200 mb-2">Already a Member?</p>
                                <button onClick={() => { setMode('login'); setNotification(null); }} className="flex items-center gap-2 text-white font-bold group hover:text-teal-300 transition-colors">
                                    Log In Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-7/12 p-8 md:p-20 flex flex-col justify-center bg-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>

                    {/* LOGIN FORM */}
                    {isLogin && (
                        <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-700 relative z-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
                            <p className="text-slate-500 mb-8 font-medium">Please enter your details to continue.</p>

                            {notification && (
                                <div className={`p-4 mb-6 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2 ${notification.type === 'success'
                                    ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                    : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                                    {notification.text}
                                </div>
                            )}

                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                    <input type="email" required placeholder="Email Address" className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400" value={formData.email} onChange={e => {
                                        if (!/[<>\/]/.test(e.target.value)) {
                                            setFormData({ ...formData, email: e.target.value });
                                        }
                                    }} />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                    <input type={showLoginPassword ? "text" : "password"} required placeholder="Password" className="w-full pl-14 pr-14 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors">
                                        {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="text-right">
                                    <button type="button" onClick={() => { setForgotMode(true); setForgotMessage(null); setForgotEmail(''); }} className="text-teal-600 hover:text-teal-800 text-xs font-bold transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-[#0B1A33] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</> : <>Log In <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>

                            <div className="flex items-center gap-4 my-5">
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <span className="text-slate-400 text-sm font-semibold">OR</span>
                                <div className="flex-1 h-px bg-slate-200"></div>
                            </div>

                            {/* Google Sign-In — rendered by Google SDK */}
                            <div ref={googleLoginRef} className="w-full flex justify-center" style={{ minHeight: '44px' }} />

                            {/* Forgot Password Inline Panel */}
                            {forgotMode && (
                                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 animate-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-black text-slate-700">Reset your password</p>
                                        <button type="button" onClick={() => { setForgotMode(false); setForgotMessage(null); }} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕ Close</button>
                                    </div>
                                    {forgotMessage ? (
                                        <div className={`text-sm font-semibold p-3 rounded-xl ${forgotMessage.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            {forgotMessage.text}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleForgotPassword} className="flex gap-2">
                                            <input
                                                type="email"
                                                required
                                                placeholder="Your email address"
                                                className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder:text-slate-400"
                                                value={forgotEmail}
                                                onChange={e => {
                                                    if (!/[<>\/]/.test(e.target.value)) {
                                                        setForgotEmail(e.target.value);
                                                    }
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                disabled={forgotLoading}
                                                className="bg-teal-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SIGNUP FORM */}
                    {!isLogin && (
                        <div className="max-w-[400px] mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-700 relative z-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
                            <p className="text-slate-500 mb-8 font-medium">Join the professional Maldivian workforce.</p>

                            {notification && (
                                <div className={`p-4 mb-6 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2 ${notification.type === 'success'
                                    ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                    : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                                    {notification.text}
                                </div>
                            )}

                            <form onSubmit={handleSignupSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input type="text" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400" value={formData.name} onChange={e => {
                                            if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                                setFormData({ ...formData, name: e.target.value });
                                            }
                                        }} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input type="email" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400" value={formData.email} onChange={e => {
                                            if (!/[<>\/]/.test(e.target.value)) {
                                                setFormData({ ...formData, email: e.target.value });
                                            }
                                        }} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Mobile Number</label>
                                    <div className="relative flex items-center group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors z-10" />
                                        <select
                                            className="absolute left-[44px] h-full bg-transparent border-none text-slate-700 font-bold text-sm focus:ring-0 outline-none cursor-pointer z-10 w-[78px]"
                                            value={formData.countryCode}
                                            onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                                        >
                                            <option value="+960">+960 (MV)</option>
                                            <option value="+91">+91 (IN)</option>
                                        </select>
                                        <div className="absolute left-[122px] w-px h-6 bg-slate-200 z-10"></div>
                                        <input type="tel" required className="w-full pl-[135px] pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400" placeholder={formData.countryCode === '+91' ? "9876543210" : "7779999"} value={formData.phone} onChange={e => {
                                            if (/^\d*$/.test(e.target.value)) {
                                                setFormData({ ...formData, phone: e.target.value });
                                            }
                                        }} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input type={showSignupPassword ? "text" : "password"} required className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-400" placeholder="Create a strong password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                        <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors">
                                            {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {/* Security Checklist */}
                                    {formData.password && (
                                        <div className="mt-3 grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="col-span-2 text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Security Checklist</p>
                                            {[
                                                { label: '8+ Characters', met: validatePassword(formData.password).criteria.length },
                                                { label: 'Uppercase', met: validatePassword(formData.password).criteria.upper },
                                                { label: 'Lowercase', met: validatePassword(formData.password).criteria.lower },
                                                { label: 'Number', met: validatePassword(formData.password).criteria.number },
                                                { label: 'Special Char', met: validatePassword(formData.password).criteria.symbol },
                                            ].map((item, i) => (
                                                <div key={i} className={`flex items-center gap-1.5 transition-all duration-200 ${item.met ? 'text-teal-600' : 'text-slate-400'}`}>
                                                    {item.met
                                                        ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                                        : <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />}
                                                    <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:shadow-2xl hover:shadow-teal-600/30 hover:-translate-y-0.5 mt-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>

                            <div className="flex items-center gap-4 my-5">
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <span className="text-slate-400 text-sm font-semibold">OR</span>
                                <div className="flex-1 h-px bg-slate-200"></div>
                            </div>

                            {/* Google Sign-Up — rendered by Google SDK */}
                            <div ref={googleSignupRef} className="w-full flex justify-center" style={{ minHeight: '44px' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateLoginPage;
