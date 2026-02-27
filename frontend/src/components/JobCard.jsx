import API_BASE_URL from '../api/config.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Heart, Briefcase, ChevronRight, Share2, Check, Bell, Bookmark } from 'lucide-react';
import { JobStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';
import { toggleSavedJob, fetchSavedJobs } from '../api/api';

const JobCard = ({ job }) => {
    const { user } = useAuth();
    const popup = usePopup();
    const [isLiked, setIsLiked] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [saveToast, setSaveToast] = useState(null);
    const isClosed = job.status === 'CLOSED' || job.status === JobStatus.CLOSED;

    // Generate a random "closing in" date for the high-end UI look
    const closingIn = Math.floor(Math.random() * 20) + 1;

    React.useEffect(() => {
        if (isClosed && user?.id) {
            fetch(`${API_BASE_URL}/api/subscription/check?userId=${user.id}&jobId=${job.id || job._id}`)
                .then(res => res.json())
                .then(data => setIsSubscribed(data.subscribed))
                .catch(err => console.error("Error checking subscription:", err));
        }
        // Also load initial saved state if user is a candidate
        if (user?.role?.toLowerCase() === 'candidate' && user?.id) {
            fetchSavedJobs(user.id)
                .then(savedList => {
                    const isJobSaved = savedList.some(j => (j.id || j._id) === (job.id || job._id));
                    setIsSaved(isJobSaved);
                })
                .catch(() => {});
        }
    }, [isClosed, user, job]);

    const handleNotifyMe = async (e) => {
        e.preventDefault();
        if (!user) { popup.alert("Please login to subscribe"); return; }

        const newStatus = !isSubscribed;
        setIsSubscribed(newStatus); // Optimistic UI

        try {
            await fetch(`${API_BASE_URL}/api/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, jobId: job.id || job._id })
            });
        } catch (error) {
            setIsSubscribed(!newStatus); // Revert
            console.error("Subscription failed:", error);
        }
    };

    const handleShare = (e) => {
        e.preventDefault();
        const url = `${window.location.origin}/#/job/${job.id}`;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleToggleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user || user.role?.toLowerCase() !== 'candidate') {
            popup.alert('Please log in as a candidate to save jobs.');
            return;
        }
        const jobId = job.id || job._id;
        try {
            await toggleSavedJob(user.id, jobId);
            const nowSaved = !isSaved;
            setIsSaved(nowSaved);
            setSaveToast(nowSaved ? 'Job saved!' : 'Job removed!');
            setTimeout(() => setSaveToast(null), 2500);
        } catch (error) {
            console.error('Failed to toggle saved job:', error);
        }
    };

    return (
        <div className={`group relative bg-white border border-slate-100 rounded-[3rem] p-8 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:border-teal-500/20 flex flex-col md:flex-row items-center gap-8 ${isClosed ? 'opacity-90' : ''}`}>

            {/* Save Toast */}
            {saveToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl pointer-events-none animate-bounce">
                    <Bookmark className="w-3 h-3" fill="white" />
                    {saveToast}
                </div>
            )}

            {/* Premium Gradient Border Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* 1. LOGO SECTION */}
            <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                    {job.logo ? (
                        <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-[#121826] flex items-center justify-center text-white font-black text-2xl">
                            {job.company.charAt(0)}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. CONTENT SECTION */}
            <div className="flex-grow min-w-0">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center flex-wrap gap-3">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors truncate tracking-tight leading-tight">
                            {job.title}
                        </h3>
                        <div className="flex gap-2">
                            <span className="px-4 py-1.5 bg-teal-50 text-teal-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-teal-100/30">
                                {job.type?.toUpperCase() || 'FULL TIME'}
                            </span>
                            {job.isReopened && (
                                <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-orange-100/30">
                                    URGENT
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_#14b8a6]"></div>
                            <span className="text-slate-800 font-black uppercase tracking-widest text-[9px]">{job.company}</span>
                        </div>
                        <span className="text-slate-200">|</span>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-300" />
                            <span className="uppercase tracking-widest text-[9px] font-black">{job.category || job.industry || 'General'}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 mt-2">
                        <div className="flex items-center gap-2 text-teal-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <DollarSign className="w-4 h-4 text-slate-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{job.salaryRange}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. ACTION SECTION */}
            <div className="flex flex-col items-end gap-4 min-w-[200px] md:border-l md:border-slate-50 md:pl-10">
                <div className="flex items-center gap-3 w-full justify-end">
                    {!isClosed && (
                        <div className="flex items-center gap-2 text-slate-400 px-4 py-2 rounded-full border border-slate-100 bg-slate-50/50">
                            <Clock className="w-3.5 h-3.5 text-teal-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">DEADLINE: {closingIn}D</span>
                        </div>
                    )}
                    <button
                        onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
                        className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center border ${isLiked ? 'bg-red-50 border-red-100 text-red-500 shadow-xl shadow-red-100' : 'bg-slate-50 border-slate-100 text-slate-300 hover:text-red-400 hover:bg-white hover:border-red-200'}`}
                    >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                </div>

                <div className="w-full flex flex-col gap-2">
                    {job.isApplied ? (
                        <Link
                            to={`/job/${job.id}`}
                            className="w-full bg-teal-50 border border-teal-200 text-teal-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-teal-100"
                        >
                            <Check className="w-4 h-4" /> Applied
                        </Link>
                    ) : isClosed ? (
                        <button
                            onClick={handleNotifyMe}
                            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group-hover:gap-4 ${isSubscribed
                                ? 'bg-teal-100 text-teal-700 border border-teal-200'
                                : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                        >
                            <Bell className={`w-4 h-4 ${isSubscribed ? 'fill-current' : ''}`} />
                            {isSubscribed ? 'Alert Active' : 'Notify Me'}
                        </button>
                    ) : (
                        <Link
                            to={`/job/${job.id}`}
                            className="w-full bg-[#0b1a33] hover:bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group-hover:gap-4"
                        >
                            Details <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                    <button
                        onClick={handleShare}
                        className="w-full bg-white border border-slate-100 text-slate-400 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 flex items-center justify-center gap-2"
                    >
                        {isCopied ? (
                            <><Check className="w-4 h-4 text-teal-600" /> Copied!</>
                        ) : (
                            <><Share2 className="w-4 h-4" /> Share Link</>
                        )}
                    </button>
                    {user?.role?.toLowerCase() === 'candidate' && (
                        <button
                            onClick={handleToggleSave}
                            className={`w-full py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 border ${
                                isSaved
                                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                    : 'bg-white border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
                            }`}
                            title={isSaved ? 'Remove from saved jobs' : 'Save job'}
                        >
                            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                            {isSaved ? 'Saved' : 'Save Job'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobCard;
