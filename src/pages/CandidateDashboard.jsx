import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { INDUSTRIES } from '../constants';
import {
    Briefcase,
    ArrowRight,
    Clock,
    Bell,
    ChevronRight,
    ChevronLeft,
    Building2,
    Hammer,
    Heart,
    Monitor,
    GraduationCap,
    ShoppingBag,
    Factory,
    Palmtree,
    Fish,
    Wheat,
    MoreHorizontal,
    Sparkles,
    TrendingUp,
    User,
    FileSearch,
    X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SuggestedJobs from '../components/SuggestedJobs';

// Industry icon mapping
const industryIcons = {
    'Hospitality': Building2,
    'Construction': Hammer,
    'Healthcare': Heart,
    'IT': Monitor,
    'Education': GraduationCap,
    'Retail': ShoppingBag,
    'Manufacturing': Factory,
    'Tourism': Palmtree,
    'Fishing': Fish,
    'Agriculture': Wheat,
    'Other': MoreHorizontal
};



const CandidateDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const scrollContainerRef = useRef(null);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user || !user.email) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/applications/candidate/${encodeURIComponent(user.email)}`);
                const data = await response.json();

                const transformedApps = (data || []).map(app => ({
                    id: app._id || app.id,
                    jobId: app.job_id,
                    status: app.status,
                    appliedDate: new Date(app.applied_at || app.applied_date || app.createdAt).toLocaleDateString(),
                    adminFeedback: app.admin_feedback,
                    title: app.job?.title || app.jobs?.title || 'Unknown Role',
                    company: app.job?.company || app.jobs?.company || 'Unknown Company',
                    category: app.job?.category || app.jobs?.category || 'Other'
                }));

                setApplications(transformedApps);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [user]);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifs, setShowNotifs] = useState(false);

    // Fetch Notifications
    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:5000/api/notifications/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unreadCount || 0);
                })
                .catch(err => console.error("Error fetching notifications:", err));
        }
    }, [user]);

    const activeAppsCount = applications.length;
    const pendingCount = applications.filter(a => a.status === 'PENDING' || a.status === 'Pending').length;
    const approvedCount = applications.filter(a => a.status === 'APPROVED' || a.status === 'Approved').length;

    // Scroll handlers for category carousel
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -176, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 176, behavior: 'smooth' });
        }
    };

    // Navigate to jobs page with category filter
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        navigate(`/jobs?category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans text-slate-800">

            {/* HERO SECTION - Split Layout with Quick Actions */}
            <div className="relative overflow-hidden">
                {/* TOP NOTIFICATION BAR REMOVED */}
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 py-12 md:py-16 px-6">
                    <div className="container mx-auto max-w-7xl">
                        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                            {/* Left Side - Greeting & Steps */}
                            <div className="flex-1 text-center lg:text-left">
                                {/* Main Greeting */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                                    {getGreeting()} <span className="text-teal-300">{user?.name || 'Candidate'}</span>
                                </h1>

                                {/* Welcome Line */}
                                <p className="text-lg md:text-xl text-white/90 font-medium mb-2">
                                    Welcome to GlobalAKjobs
                                </p>

                                {/* Tagline */}
                                <p className="text-sm md:text-base text-teal-200 font-light mb-6">
                                    Build your career with us!
                                </p>

                                {/* How to Apply - 3 Steps */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                        <div className="w-6 h-6 rounded-full bg-teal-300 text-teal-900 font-bold text-xs flex items-center justify-center">1</div>
                                        <span className="text-white font-medium text-xs">Browse Industries</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-teal-300 hidden sm:block" />
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                        <div className="w-6 h-6 rounded-full bg-teal-300 text-teal-900 font-bold text-xs flex items-center justify-center">2</div>
                                        <span className="text-white font-medium text-xs">Find Your Job</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-teal-300 hidden sm:block" />
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                        <div className="w-6 h-6 rounded-full bg-teal-300 text-teal-900 font-bold text-xs flex items-center justify-center">3</div>
                                        <span className="text-white font-medium text-xs">Apply Now</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Quick Actions Card */}
                            <div className="w-full lg:w-auto relative">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg relative z-30">
                                    <div className="flex items-center gap-3 mb-5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowNotifs(!showNotifs)}>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-teal-300/20 flex items-center justify-center border border-teal-300/30">
                                                <Bell className="w-5 h-5 text-teal-100" />
                                            </div>
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-teal-900 animate-pulse"></span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white leading-tight">Quick Actions</h3>
                                            <p className="text-teal-100/70 text-xs">Manage your career & alerts</p>
                                        </div>
                                    </div>


                                    {/* NOTIFICATION MODAL */}
                                    {showNotifs && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                        <Bell className="w-5 h-5 text-teal-600" /> Notifications
                                                    </h3>
                                                    <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                {unreadCount > 0 && (
                                                    <div className="px-6 py-2 bg-teal-50 border-b border-teal-100">
                                                        <p className="text-xs font-bold text-teal-700">{unreadCount} New Notification{unreadCount > 1 ? 's' : ''}</p>
                                                    </div>
                                                )}
                                                <div className="max-h-[400px] overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-12 text-center text-slate-400">
                                                            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                            <p className="text-sm font-bold">No notifications</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((n) => (
                                                            <div key={n._id} className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group relative ${!n.isRead ? 'bg-teal-50/30' : ''}`}>
                                                                {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>}
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">{n.title}</p>
                                                                        <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                                                                    </div>
                                                                    {n.type === 'JOB_ALERT' && <Briefcase className="w-4 h-4 text-teal-400 shrink-0 mt-1" />}
                                                                </div>
                                                                <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                                                    <button className="text-xs font-bold text-slate-500 hover:text-teal-600 uppercase tracking-wider">Mark all as read</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-3 min-w-[280px]">
                                        <Link
                                            to="/jobs"
                                            className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-teal-50 transition-all group shadow-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="w-5 h-5 text-teal-700" />
                                                <span className="font-bold text-slate-800">Browse All Jobs</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-teal-50 transition-all group shadow-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <User className="w-5 h-5 text-teal-700" />
                                                <span className="font-bold text-slate-800">Update Profile</span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>



            {/* INDUSTRY CATEGORIES SECTION */}
            <div className="relative -mt-8 z-20 px-4 mb-10">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-8">
                        {/* Section Header - Centered */}
                        <div className="text-center mb-6">
                            <h3 className="font-bold text-slate-900 text-xl mb-1">Explore by Industry</h3>
                            <p className="text-slate-500 text-sm">Click on a category to browse jobs</p>
                        </div>

                        {/* Navigation Arrows - Outside the scroll area */}
                        <div className="relative">
                            <button
                                onClick={scrollLeft}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors hidden md:flex"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={scrollRight}
                                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-300 transition-colors hidden md:flex"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Scrollable Categories */}
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {INDUSTRIES.map((industry) => {
                                    const IconComponent = industryIcons[industry] || MoreHorizontal;
                                    const isSelected = selectedCategory === industry;

                                    return (
                                        <button
                                            key={industry}
                                            onClick={() => handleCategoryClick(industry)}
                                            className={`flex-shrink-0 snap-start group flex flex-col items-center p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer w-[160px] ${isSelected ? 'border-teal-500 bg-teal-50' : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'} hover:shadow-md hover:-translate-y-1`}
                                        >
                                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl shadow-sm flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 ${isSelected ? 'bg-teal-500' : 'bg-teal-50 group-hover:bg-teal-100'}`}>
                                                <IconComponent className={`w-6 h-6 md:w-7 md:h-7 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
                                            </div>
                                            <span className={`text-xs md:text-sm font-semibold text-center whitespace-nowrap ${isSelected ? 'text-teal-700' : 'text-slate-700'}`}>
                                                {industry}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container mx-auto max-w-7xl px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - Stats & Quick Actions */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* SUGGESTED JOBS (Moved Here) */}
                        {/* SUGGESTED JOBS (Moved Here) */}
                        <SuggestedJobs skills={user?.skills} />
                    </div>

                    {/* RIGHT COLUMN - Activity Stats & Recent Applications */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* YOUR ACTIVITY STATS (Moved Here) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Total Applications */}
                            <div className="flex flex-col justify-center p-6 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm">
                                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">Total</p>
                                <p className="text-4xl font-black text-blue-900">{activeAppsCount}</p>
                            </div>

                            {/* Pending */}
                            {/* Pending */}
                            <div className="flex flex-col justify-center p-6 rounded-3xl bg-yellow-50 border border-yellow-100 shadow-sm">
                                <p className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-1">Pending</p>
                                <p className="text-4xl font-black text-yellow-900">{pendingCount}</p>
                            </div>

                            {/* Approved */}
                            {/* Approved */}
                            <div className="flex flex-col justify-center p-6 rounded-3xl bg-green-50 border border-green-100 shadow-sm">
                                <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-1">Approved</p>
                                <p className="text-4xl font-black text-green-900">{approvedCount}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border-2 border-teal-500 shadow-sm">
                            {/* Section Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <FileSearch className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Recent Applications</h3>
                                        <p className="text-slate-500 text-sm">Track your job applications</p>
                                    </div>
                                </div>
                            </div>

                            {/* Applications List */}
                            <div className="p-4">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-slate-500">Loading applications...</p>
                                    </div>
                                ) : applications.length > 0 ? (
                                    <div className="space-y-3">
                                        {applications.slice(0, 5).map((app) => {
                                            const IconComponent = industryIcons[app.category] || Briefcase;

                                            return (
                                                <Link
                                                    to={`/job/${app.jobId}`}
                                                    state={{ from: 'dashboard' }}
                                                    key={app.id}
                                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50/50 transition-all group cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                                                            <IconComponent className="w-5 h-5 text-teal-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">{app.title}</h4>
                                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                                <span>{app.company}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                <span>{app.appliedDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${app.status === 'APPROVED' || app.status === 'Approved'
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : app.status === 'REJECTED' || app.status === 'Rejected'
                                                                ? 'bg-red-100 text-red-700 border border-red-200'
                                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                            }`}>
                                                            {app.status}
                                                        </span>
                                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h4 className="font-semibold text-slate-900 mb-2">No Applications Yet</h4>
                                        <p className="text-slate-500 mb-6">Start exploring opportunities and apply for your dream job!</p>
                                        <Link
                                            to="/jobs"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors"
                                        >
                                            Browse Jobs <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default CandidateDashboard;
