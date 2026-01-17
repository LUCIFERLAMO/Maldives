import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Building2,
    Globe,
    UploadCloud,
    CheckCircle2,
    ArrowRight,
    FileText,
    Check,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const AgentRegistrationPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        workEmail: '',
        password: '',
        companyName: '',
        experienceRegion: '',
        documents: null,
        agreedToTerms: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // OTP State
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [verifiedUserId, setVerifiedUserId] = useState(null);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, documents: e.target.files[0] });
        }
    };

    // Restore state from sessionStorage on mount
    useEffect(() => {
        const savedState = sessionStorage.getItem('agent_reg_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                // Only restore if it's recent (optional expiration could be added here)
                setFormData(prev => ({ ...prev, ...parsed.formData }));
                setOtpSent(parsed.otpSent || false);
                setIsEmailVerified(parsed.isEmailVerified || false);
                if (parsed.verifiedUserId) setVerifiedUserId(parsed.verifiedUserId);
            } catch (e) {
                console.error("Failed to parse saved registration state", e);
                sessionStorage.removeItem('agent_reg_state');
            }
        }
    }, []);

    // Helper to clear session state
    const clearSessionState = () => {
        sessionStorage.removeItem('agent_reg_state');
        setOtpSent(false);
        setIsEmailVerified(false);
        setVerifiedUserId(null);
        setOtp('');
    };

    const handleChangeEmail = () => {
        if (window.confirm("Are you sure? This will require verifying the new email address.")) {
            clearSessionState();
            setFormData(prev => ({ ...prev, workEmail: '' }));
        }
    };

    const saveSessionState = (updates = {}) => {
        const currentState = {
            formData: { ...formData, ...updates.formData },
            otpSent: updates.otpSent !== undefined ? updates.otpSent : otpSent,
            isEmailVerified: updates.isEmailVerified !== undefined ? updates.isEmailVerified : isEmailVerified,
            verifiedUserId: updates.verifiedUserId !== undefined ? updates.verifiedUserId : verifiedUserId
        };
        sessionStorage.setItem('agent_reg_state', JSON.stringify(currentState));
    };

    const handleSendOtp = async () => {
        if (!formData.workEmail) {
            alert("Please enter an email address first.");
            return;
        }
        if (!formData.password) {
            alert("Please enter a password first.");
            return;
        }
        const email = formData.workEmail.trim();

        setIsSendingOtp(true);

        try {
            console.log("Sending OTP to:", email);
            // Attempt to sign up the user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        status: 'PENDING'
                    }
                }
            });

            if (signUpError) {
                console.warn("SignUp Error:", signUpError);
                // Check if the user already exists
                if (signUpError.message && (
                    signUpError.message.toLowerCase().includes("registered") ||
                    signUpError.message.toLowerCase().includes("exists") ||
                    signUpError.message.toLowerCase().includes("already")
                )) {
                    // Try to resend OTP
                    const { error: resendError } = await supabase.auth.resend({
                        type: 'signup',
                        email: email
                    });

                    if (resendError) {
                        if (resendError.message.toLowerCase().includes("already") &&
                            resendError.message.toLowerCase().includes("verified")) {
                            throw new Error("This email is already verified. Please go to Login page.");
                        }
                        throw resendError;
                    }
                    setTimeout(() => alert("Verification code resent to your email!"), 0);
                } else {
                    throw signUpError;
                }
            } else {
                setTimeout(() => alert("Verification code sent to your email! Please check your inbox (and spam folder)."), 0);
            }

            setOtpSent(true);
            saveSessionState({ otpSent: true }); // Save state

        } catch (err) {
            console.error("OTP Error:", err);
            setTimeout(() => alert(err.message || "Error sending verification code. Please try again."), 0);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        // Prevent any form submission side-effects
        if (e && e.preventDefault) e.preventDefault();

        // Prevent double-clicks
        if (isVerifyingOtp) return;

        if (!otp || otp.length !== 6) {
            alert("Please enter a valid 6-digit code.");
            return;
        }

        setIsVerifyingOtp(true);
        const email = formData.workEmail.trim();
        const token = otp.trim();

        try {
            console.log("Verifying OTP for:", email);

            // Simple, direct verification
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup'
            });

            if (error) throw error;

            // Verification Successful Logic
            const userId = data.user?.id || data.session?.user?.id;

            if (userId) {
                console.log("Verification Successful, User ID:", userId);
                setVerifiedUserId(userId);
                setIsEmailVerified(true);
                setOtpSent(false);
                saveSessionState({ isEmailVerified: true, otpSent: false, verifiedUserId: userId }); // Save Verified State
                alert("Email Verified Successfully!");
            } else {
                // Poll user session as fallback if ID is missing (rare)
                const { data: sessionData } = await supabase.auth.getSession();
                if (sessionData?.session?.user) {
                    setVerifiedUserId(sessionData.session.user.id);
                    setIsEmailVerified(true);
                    setOtpSent(false);
                    saveSessionState({ isEmailVerified: true, otpSent: false, verifiedUserId: sessionData.session.user.id });
                    alert("Email Verified Successfully!");
                } else {
                    throw new Error("Verification successful, but user retrieval failed. Please try logging in.");
                }
            }

        } catch (err) {
            console.error("Verification Catch Error:", err);

            const msg = (err.message || "").toLowerCase();

            if (msg.includes("signal is aborted") || msg.includes("aborted")) {
                console.warn("Transient abort error ignored.");
                // Do not alert user for this specific error
            } else if (msg.includes("expired") || msg.includes("invalid") || msg.includes("bad")) {
                alert("Code Expired or Invalid. Please click 'Request New Code' to try again.");
                setOtp(''); // Clear invalid code to prompt re-entry
            } else {
                alert("Verification Failed: " + (err.message || "Unknown error"));
            }
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEmailVerified) {
            alert("Please verify your email address using the Verify button first.");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Starting Submission...");

            // Flag to track if we timed out to prevent "zombie" execution side effects
            let isTimedOut = false;

            // Timeout for overall submission
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => {
                    isTimedOut = true;
                    reject(new Error("Submission timed out. Please check your network."));
                }, 25000)
            );

            const submissionLogic = (async () => {
                // Use verifiedUserId from state, fallback to getUser if somehow missing (unlikely if verified)
                let userId = verifiedUserId;

                if (!userId) {
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    if (userError || !user) {
                        console.error("User retrieval error:", userError);
                        throw new Error("Could not retrieve verified user. Please refresh page and try again.");
                    }
                    userId = user.id;
                }

                if (isTimedOut) return; // Guard: Stop if timed out

                // 1. Upload Document if provided
                let documentPath = null;
                if (formData.documents) {
                    const fileExt = formData.documents.name.split('.').pop();
                    const fileName = `${userId}/license.${fileExt}`;

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('agency-docs')
                        .upload(fileName, formData.documents, { upsert: true });

                    if (uploadError) {
                        console.error('Upload error:', uploadError);
                        // Continue anyway
                    } else {
                        documentPath = fileName;
                    }
                }

                if (isTimedOut) return; // Guard: Stop if timed out

                // 2. Create or Update Profile Entry
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert([{
                        id: userId,
                        email: formData.workEmail,
                        full_name: formData.fullName,
                        role: 'agent',
                        phone: formData.phone
                    }], {
                        onConflict: 'id'
                    });

                if (profileError) {
                    throw new Error("Failed to save profile: " + profileError.message);
                }

                if (isTimedOut) return; // Guard: Stop if timed out

                // 3. Create Agency Entry
                const { error: agencyError } = await supabase
                    .from('agencies')
                    .insert([{
                        name: formData.companyName,
                        region: formData.experienceRegion,
                        contact_email: formData.workEmail,
                        document_url: documentPath,
                        owner_id: userId,
                        status: 'pending'
                    }]);

                if (agencyError) {
                    throw new Error("Failed to save agency details: " + agencyError.message);
                }

                if (isTimedOut) return; // Guard: Stop if timed out (Critical: Prevent SignOut)

                // Sign out
                await supabase.auth.signOut();
                return true;
            })();

            await Promise.race([submissionLogic, timeoutPromise]);

            // Clear session state on successful submission
            sessionStorage.removeItem('agent_reg_state');
            setIsSubmitted(true);
        } catch (err) {
            console.error('Submission Error:', err);
            setTimeout(() => alert("Registration Failed: " + err.message), 50);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = () => {
        setIsSubmitted(false);
        setIsPreviewMode(true);
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
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Application Successfully Submitted</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">
                            Your application has been received and is currently under review by our Administration Team. We will notify you of the status update shortly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={handlePreview}
                                className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors"
                            >
                                Preview Application
                            </button>
                            <button
                                onClick={() => navigate('/', { replace: true })}
                                className="flex-1 px-6 py-4 bg-teal-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-slate-100 transition-all duration-500 ${isPreviewMode ? 'ring-4 ring-teal-500/20 scale-[0.98]' : ''}`}>

                {/* LEFT PANEL - Branding */}
                <div className="w-full md:w-5/12 bg-teal-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-full bg-white opacity-5 transform skew-x-12 translate-x-20"></div>

                    <div className="relative z-10">
                        <Link to={isPreviewMode ? "/" : "/login/agent"} className="inline-flex items-center text-teal-200 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> {isPreviewMode ? "Return Home" : "Back to Login"}
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
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${isPreviewMode ? 'bg-teal-600 border-teal-500' : 'bg-teal-800 border-teal-700'}`}>
                                    {isPreviewMode ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span className="font-bold text-sm">1</span>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Submit Application</h3>
                                    <p className="text-xs text-teal-200 leading-relaxed">Fill out your professional details and upload verification documents.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${isPreviewMode ? 'bg-white text-teal-900 border-white' : 'bg-teal-800 border-teal-700'}`}>
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
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agent Application</h2>
                                {isPreviewMode && <span className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-teal-100">Read Only</span>}
                            </div>
                            <p className="text-slate-500 font-medium">Complete the form below to register your agency.</p>
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
                                            disabled={isPreviewMode || !isEmailVerified}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={e => {
                                                const newVal = e.target.value;
                                                setFormData({ ...formData, fullName: newVal });
                                                saveSessionState({ formData: { ...formData, fullName: newVal } });
                                            }}
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
                                            disabled={isPreviewMode || !isEmailVerified}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="+960 777-9999"
                                            value={formData.phone}
                                            onChange={e => {
                                                const newVal = e.target.value;
                                                setFormData({ ...formData, phone: newVal });
                                                saveSessionState({ formData: { ...formData, phone: newVal } });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Work Email</label>
                                <div className="flex gap-2">
                                    <div className="relative group flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            disabled={isPreviewMode || isEmailVerified || otpSent}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                            placeholder="agent@company.com"
                                            value={formData.workEmail}
                                            onChange={e => {
                                                const newVal = e.target.value;
                                                setFormData({ ...formData, workEmail: newVal });
                                                // Don't strongly enforce saving email on every keystroke to avoid clutter, but we can on blur or just let sendOtp save it.
                                            }}
                                        />
                                        {isEmailVerified && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />}
                                    </div>
                                    {!isEmailVerified && !otpSent && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={isSendingOtp || !formData.workEmail || !formData.password}
                                            className="px-6 py-4 bg-teal-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {isSendingOtp ? "Sending..." : "Verify"}
                                        </button>
                                    )}
                                </div>
                                {otpSent && !isEmailVerified && (
                                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit Code"
                                                className="flex-1 py-3 px-4 bg-white border border-slate-200 rounded-lg font-mono text-center tracking-widest text-lg focus:border-teal-500 outline-none"
                                                value={otp}
                                                maxLength={6}
                                                onChange={e => setOtp(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={isVerifyingOtp || otp.length < 6}
                                                className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isVerifyingOtp ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    "Confirm"
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-[10px] text-slate-400 ml-1">
                                                Code sent to {formData.workEmail}
                                            </p>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={handleChangeEmail}
                                                    className="text-[10px] text-slate-500 font-bold hover:text-slate-700"
                                                >
                                                    Change Email
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOtpSent(false);
                                                        setOtp('');
                                                    }}
                                                    className="text-[10px] text-teal-600 font-bold hover:underline"
                                                >
                                                    Request New Code
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isPreviewMode || otpSent || isEmailVerified}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    // Password usually not saved to storage for security
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
                                            disabled={isPreviewMode || !isEmailVerified}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            disabled={isPreviewMode || !isEmailVerified}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-teal-600 outline-none font-bold text-slate-700 transition-all placeholder:font-medium placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="e.g. South Asia, Europe"
                                            value={formData.experienceRegion}
                                            onChange={e => setFormData({ ...formData, experienceRegion: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Company Documents</label>
                                <div className={`border-2 border-dashed border-slate-200 rounded-xl p-8 transition-all text-center relative group ${isPreviewMode || !isEmailVerified ? 'bg-slate-50 opacity-50 cursor-not-allowed' : 'hover:border-teal-500 hover:bg-teal-50/30 cursor-pointer'}`}>

                                    {!isPreviewMode && <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        disabled={!isEmailVerified}
                                        onChange={handleFileChange}
                                        required={!formData.documents}
                                    />}

                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {formData.documents ? (
                                                <FileText className="w-6 h-6 text-teal-600" />
                                            ) : (
                                                <UploadCloud className="w-6 h-6 text-teal-600" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-700">
                                                {formData.documents ? formData.documents.name : 'Click to upload or drag and drop'}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">PDF, JPG or PNG (Max 5MB)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className={`flex items-start gap-3 group ${isPreviewMode || !isEmailVerified ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <div className="relative flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            required
                                            disabled={isPreviewMode || !isEmailVerified}
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

                            {!isPreviewMode && <button
                                type="submit"
                                disabled={isLoading || !isEmailVerified}
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
                            </button>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentRegistrationPage;