import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API_BASE_URL from '../api/config.js';
import { Lock, CheckCircle2, XCircle, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('validating'); // validating | valid | invalid | submitting | success | error
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            setStatus('invalid');
            setMessage('No reset token found. Please request a new password reset link.');
            return;
        }
        const validate = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/validate-reset-token/${token}`);
                const data = await res.json();
                if (res.ok && data.valid) {
                    setUserEmail(data.email);
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                    setMessage(data.message || 'This reset link is invalid or has expired.');
                }
            } catch {
                setStatus('invalid');
                setMessage('Unable to verify reset link. Please check your connection.');
            }
        };
        validate();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        setStatus('submitting');
        setMessage('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('valid');
                setMessage(data.message || 'Failed to reset password.');
            }
        } catch {
            setStatus('valid');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Top accent */}
                    <div className="h-2 bg-gradient-to-r from-teal-400 to-teal-600" />

                    <div className="p-8">
                        <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-teal-600 text-sm font-semibold mb-6 transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>

                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-5">
                            <Lock className="w-7 h-7 text-teal-600" />
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Set New Password</h1>
                        <p className="text-slate-500 text-sm mb-6">
                            {status === 'valid' || status === 'submitting'
                                ? `Resetting password for ${userEmail}`
                                : 'GlobalAKJobs Password Reset'}
                        </p>

                        {/* VALIDATING */}
                        {status === 'validating' && (
                            <div className="flex items-center gap-3 text-slate-500 py-8 justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                                <span>Verifying reset link…</span>
                            </div>
                        )}

                        {/* INVALID TOKEN */}
                        {status === 'invalid' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <p className="text-red-600 font-semibold mb-2">Link Invalid or Expired</p>
                                <p className="text-slate-500 text-sm mb-6">{message}</p>
                                <Link
                                    to="/login"
                                    className="inline-block bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors"
                                >
                                    Request New Reset Link
                                </Link>
                            </div>
                        )}

                        {/* SUCCESS */}
                        {status === 'success' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-teal-500" />
                                </div>
                                <p className="text-teal-700 font-bold text-lg mb-2">Password Updated!</p>
                                <p className="text-slate-500 text-sm mb-6">Your password has been changed successfully.</p>
                                <Link
                                    to="/login"
                                    className="inline-block bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors"
                                >
                                    Log In Now →
                                </Link>
                            </div>
                        )}

                        {/* FORM — valid or submitting */}
                        {(status === 'valid' || status === 'submitting') && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {message && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold p-3 rounded-xl">
                                        {message}
                                    </div>
                                )}
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            placeholder="Min 6 characters"
                                            className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            disabled={status === 'submitting'}
                                        />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors">
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            placeholder="Re-enter password"
                                            className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            disabled={status === 'submitting'}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors">
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    {status === 'submitting'
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</>
                                        : 'Reset Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">GlobalAKJobs · Maldives Career Platform</p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
