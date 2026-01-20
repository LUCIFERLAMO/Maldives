import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AgentLoginPage = () => {
    const navigate = useNavigate();
    const { login, mockLogin } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: 'AGENT'
                })
            });

            const data = await response.json();

            if (response.ok) {
                const userData = {
                    id: data.user._id,
                    name: data.user.full_name,
                    email: data.user.email,
                    role: data.user.role,
                    status: 'APPROVED'
                };
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.href = '/recruiter';
            } else {
                alert("Invalid email or password.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred during login.");
        }
    };

    // Temporary Logic for Developer Access
    const handleTempAccess = () => {
        mockLogin({
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            name: 'Developer Agent',
            email: 'dev@agent.com',
            role: 'agent',
            status: 'APPROVED'
        });
        navigate('/recruiter');
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

                        {/* Temporary Developer Access Link */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleTempAccess}
                                className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-teal-600 transition-colors border-b border-transparent hover:border-teal-600 pb-0.5"
                            >
                                Temporary Developer Access
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentLoginPage;
