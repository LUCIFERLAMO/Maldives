import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AgentLoginPage = () => {
    const navigate = useNavigate();
    const { mockLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // HARDCODED AGENT AUTH
        if (formData.email === 'agent@maldives.com' && formData.password === 'agent123') {
            // Simulate API call for agent
            setTimeout(() => {
                mockLogin({
                    id: 'mock-agent-123',
                    name: 'Rahul Sharma',
                    email: formData.email,
                    role: 'recruiter',
                    avatar: null
                });
                navigate('/recruiter');
            }, 800);
        } else {
            alert('Invalid Agent Credentials. Try agent@maldives.com / agent123');
        }
    };

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

                        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tighter">Island Jobs <br /><span className="text-maldives-300">Simplified.</span></h1>
                        <p className="text-teal-100 font-medium text-lg opacity-90">Broker & Partner Gateway.</p>
                    </div>

                    <div className="relative z-10">
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/agent-registration')}
                                className="flex items-center gap-2 font-black transition-all text-white group uppercase text-[11px] tracking-widest hover:text-maldives-300"
                            >
                                New Arrival? Register Here <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - FORMS */}
                <div className="w-full md:w-7/12 p-8 md:p-20 flex flex-col justify-center bg-white relative">
                    <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Agent Login</h2>
                        <p className="text-slate-500 mb-12 font-medium">Restricted access for recruitment partners.</p>
                        <form onSubmit={handleLoginSubmit} className="space-y-5">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                <input type="email" required placeholder="Agent Email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-slate-700" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                <input type="password" required placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-slate-700" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 mt-4">
                                Enter Portal <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="mt-8 text-center text-xs text-slate-400">
                            Use <span className="font-mono font-bold text-slate-600">agent@maldives.com</span> / <span className="font-mono font-bold text-slate-600">agent123</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentLoginPage;
