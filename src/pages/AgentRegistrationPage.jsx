import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Building2,
    Globe,
    CheckCircle2,
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';

const AgentRegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        workEmail: '',
        password: '',
        companyName: '',
        experienceRegion: '',
        agreedToTerms: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.workEmail,
                    password: formData.password,
                    name: formData.fullName,
                    role: 'AGENT',
                    agencyName: formData.companyName
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert("Registration Failed: " + data.message);
            }
        } catch (err) {
            console.error('Submission Error:', err);
            alert("Registration Failed: Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-4 font-sans relative">

            {/* Success Modal */}
            {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transform transition-all scale-100 animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Registration Successful!</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">
                            Your agent account has been created. You can now log in with your email and password.
                        </p>
                        <button
                            onClick={() => navigate('/login/agent', { replace: true })}
                            className="px-6 py-4 bg-teal-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                        >
                            Go to Agent Login
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-slate-100">

                {/* LEFT PANEL - Branding */}
                <div className="w-full md:w-5/12 bg-teal-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-full bg-white opacity-5 transform skew-x-12 translate-x-20"></div>

                    <div className="relative z-10">
                        <Link to="/login/agent" className="inline-flex items-center text-teal-200 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
                        </Link>

                        <div className="w-14 h-14 border border-white/30 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm bg-white/10">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 tracking-tighter">
                            Partner <br />
                            <span className="text-teal-300">Residency.</span>
                        </h1>
                        <p className="text-teal-100 font-medium text-lg opacity-90 leading-relaxed">
                            Join our elite network of brokers and partners connecting global talent with Maldivian luxury.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center shrink-0 border border-teal-700">
                                    <span className="font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Submit Application</h3>
                                    <p className="text-xs text-teal-200 leading-relaxed">Fill out your professional details.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center shrink-0 border border-teal-700">
                                    <span className="font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Verification</h3>
                                    <p className="text-xs text-teal-200 leading-relaxed">Our admin team reviews your credentials within 24-48 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center shrink-0 border border-teal-700">
                                    <span className="font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Access Portal</h3>
                                    <p className="text-xs text-teal-200 leading-relaxed">Receive your secure credentials and start managing candidates.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white relative overflow-y-auto">
                    <div className="max-w-xl mx-auto w-full">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agent Application</h2>
                            <p className="text-slate-500 font-medium mt-2">Complete the form below to register your agency.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input
                                            type="tel"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300"
                                            placeholder="+960 777-9999"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300"
                                        placeholder="agent@company.com"
                                        value={formData.workEmail}
                                        onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300"
                                        placeholder="Create a password (min 6 characters)"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Company Name</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300"
                                            placeholder="Global Recruiters Ltd"
                                            value={formData.companyName}
                                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Target Region</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300"
                                            placeholder="e.g. South Asia, Europe"
                                            value={formData.experienceRegion}
                                            onChange={e => setFormData({ ...formData, experienceRegion: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-start gap-3 group cursor-pointer">
                                    <div className="relative flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            required
                                            className="peer sr-only"
                                            checked={formData.agreedToTerms}
                                            onChange={e => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                        />
                                        <div className="w-5 h-5 border-2 border-slate-300 rounded md:rounded-[4px] peer-checked:bg-teal-600 peer-checked:border-teal-600 transition-all flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                        </div>
                                    </div>
                                    <span className="text-xs md:text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                                        I confirm that the information provided is accurate and I agree to the <a href="#" className="text-teal-600 font-bold hover:underline">Terms of Partnership</a>.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 text-white py-5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Application <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentRegistrationPage;