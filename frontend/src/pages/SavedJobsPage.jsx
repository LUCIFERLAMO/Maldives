import React, { useState, useEffect } from 'react';
import { usePopup } from '../context/PopupContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    RefreshCcw, 
    Bookmark, 
    AlertCircle, 
    ChevronRight, 
    Briefcase,
    Building2,
    MapPin,
    DollarSign,

    CheckCircle2,
    XCircle,
    Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchSavedJobs, toggleSavedJob } from '../api/api';

const SavedJobsPage = () => {
    const popup = usePopup();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setLoading(false);
            setError('Please log in as a candidate to view saved jobs.');
        }
    }, []);

    const loadSavedJobs = async () => {
        if (!user || user.role?.toLowerCase() !== 'candidate') return;
        
        try {
            setLoading(true);
            const jobs = await fetchSavedJobs(user.id);
            // Sort by status putting Open first, then by posted date
            jobs.sort((a, b) => {
                if (a.status === 'OPEN' && b.status !== 'OPEN') return -1;
                if (a.status !== 'OPEN' && b.status === 'OPEN') return 1;
                return new Date(b.posted_date || b.postedDate) - new Date(a.posted_date || a.postedDate);
            });
            setSavedJobs(jobs);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load saved jobs. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user && user.role?.toLowerCase() === 'candidate') {
            loadSavedJobs();
        }
    }, [user]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadSavedJobs();
    };

    const handleUnsave = async (jobId) => {
        try {
            await toggleSavedJob(user.id, jobId);
            // Remove locally to update UI instantly
            setSavedJobs(savedJobs.filter(job => job.id !== jobId && job._id !== jobId));
            
            // Note: In a real app we might also want to update the local storage "user" object's savedJobs array 
            // if we are keeping it in sync there, but we are fetching directly via API here.
        } catch (err) {
            console.error('Failed to unsave job:', err);
            popup.success('Failed to remove job from saved list. Please try again.');
        }
    };

    const formatPostedDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    if (!user || user.role?.toLowerCase() !== 'candidate') {
        return (
            <div className="bg-slate-50 flex flex-col font-jakarta pb-20">
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
                        <p className="text-slate-600 mb-6">
                            This feature is only available for candidate accounts. Please log in as a candidate to save jobs.
                        </p>
                        <a href="/login" className="inline-block bg-[#0B1A33] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            Go to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 flex flex-col font-jakarta pb-20">
            
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
                            <a href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</a>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-slate-800">Saved Jobs</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                            <Bookmark className="w-8 h-8 text-teal-600 fill-teal-50" />
                            My Saved Jobs
                        </h1>
                        <p className="text-slate-600 mt-2">Manage and track jobs you're interested in.</p>
                    </div>

                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing || loading}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin text-teal-600' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Status'}
                    </button>
                </div>

                {/* Content Section */}
                {loading && !refreshing ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-slate-100 flex gap-6">
                                <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                    <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                                    <div className="flex gap-4">
                                        <div className="h-4 bg-slate-200 rounded w-20"></div>
                                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Bookmark className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Saved Jobs Yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            You haven't saved any jobs yet. When you find a job you like, click the bookmark icon to save it for later.
                        </p>
                        <a 
                            href="/jobs"
                            className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                        >
                            Browse Jobs
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {savedJobs.map((job) => {
                                const isOpen = job.status === 'OPEN';
                                
                                return (
                                    <motion.div
                                        key={job.id || job._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                        className={`bg-white rounded-2xl p-5 border transition-all ${isOpen ? 'border-slate-200 hover:border-teal-300 hover:shadow-md' : 'border-slate-100 opacity-75'}`}
                                    >
                                        <div className="flex flex-col md:flex-row gap-5">
                                            {/* Company Logo/Initial */}
                                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 border ${isOpen ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                {job.logo ? (
                                                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    job.company.charAt(0)
                                                )}
                                            </div>

                                            {/* Job Setup */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                                    <h3 className={`text-lg md:text-xl font-black ${isOpen ? 'text-slate-800' : 'text-slate-600'}`}>
                                                        {job.title}
                                                    </h3>
                                                    
                                                    {/* Real-time Status Badge */}
                                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                                        {isOpen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                        {isOpen ? 'Currently Open' : 'Closed / Unavailable'}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium mb-4">
                                                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                                                        <Building2 className="w-4 h-4 text-slate-400" />
                                                        {job.company}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4" />
                                                        {job.location}
                                                    </div>
                                                    {job.salaryRange || job.salary_range ? (
                                                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                                                            <DollarSign className="w-3.5 h-3.5" />
                                                            {job.salaryRange || job.salary_range}
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Posted {formatPostedDate(job.posted_date || job.postedDate)}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={isOpen ? () => window.location.href = `/job/${job.id || job._id}` : undefined}
                                                            disabled={!isOpen}
                                                            className={`px-6 py-2 rounded-xl text-sm font-bold border transition-all ${isOpen ? 'bg-[#0B1A33] border-[#0B1A33] text-white hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'}`}
                                                        >
                                                            {isOpen ? 'Apply Now' : 'Closed'}
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => handleUnsave(job.id || job._id)}
                                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                                                            title="Remove from saved jobs"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedJobsPage;
