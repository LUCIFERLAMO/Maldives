
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApplicationStatus } from '../types';
import {
    ArrowLeft,
    ArrowRight,
    Search,
    Briefcase,
    Building2,
    X,
    ChevronRight,
    AlertTriangle,
    Upload,
    FileText,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config.js';

const MyApplicationsPage = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApplications() {
            if (!user || !user.email) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/applications/candidate/${encodeURIComponent(user.email)}`);
                const data = await response.json();

                // Transform data to match expected format
                const transformedApps = (data || []).map(app => ({
                    id: app._id || app.id,
                    jobId: app.job_id,
                    candidateName: app.candidate_name || app.name,
                    email: app.email,
                    contactNumber: app.contact_number || app.contact,
                    status: app.status,
                    appliedDate: new Date(app.applied_at || app.applied_date || app.createdAt).toLocaleDateString(),
                    adminFeedback: app.admin_feedback,
                    documentFeedbacks: app.document_feedbacks,
                    jobTitle: app.job?.title || app.jobs?.title || 'Unknown Role',
                    company: app.job?.company || app.jobs?.company || 'Unknown Company',
                    // Visibility request fields from backend
                    visibilityRequestStatus: app.visibility_request_status || 'NOT_REQUESTED',
                    visibilityRequestedAt: app.visibility_requested_at,
                    visibilityReviewedAt: app.visibility_reviewed_at
                }));

                setApplications(transformedApps);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, [user]);

    // Helper function to get display-friendly status
    const getDisplayStatus = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'SELECTED':
            case 'ACCEPTED':
                return { 
                    label: 'Selected', 
                    color: 'bg-emerald-100 text-emerald-700',
                    icon: <CheckCircle2 className="w-5 h-5" />,
                    darkColor: 'text-emerald-700'
                };
            case 'REJECTED':
                return { 
                    label: 'Rejected', 
                    color: 'bg-red-100 text-red-700',
                    icon: <X className="w-5 h-5" />,
                    darkColor: 'text-red-700'
                };
            case 'HOLD':
            case 'REVIEWING':
                return { 
                    label: 'In Review', 
                    color: 'bg-blue-100 text-blue-700',
                    icon: <Clock className="w-5 h-5" />,
                    darkColor: 'text-blue-700'
                };
            case 'PENDING':
                return { 
                    label: 'Applied', 
                    color: 'bg-slate-100 text-slate-600',
                    icon: <FileText className="w-5 h-5" />,
                    darkColor: 'text-slate-700'
                };
            case 'ACTION_REQUIRED':
                return { 
                    label: 'Action Required', 
                    color: 'bg-amber-100 text-amber-700',
                    icon: <AlertTriangle className="w-5 h-5" />,
                    darkColor: 'text-amber-800'
                };
            default:
                return { 
                    label: status || 'Pending', 
                    color: 'bg-slate-100 text-slate-600',
                    icon: <Clock className="w-5 h-5" />,
                    darkColor: 'text-slate-700'
                };
        }
    };

    // Check if status is a final outcome
    const isFinalStatus = (status) => {
        return ['APPROVED', 'SELECTED', 'ACCEPTED', 'REJECTED'].includes(status);
    };

    const handleRequestProgress = async (appId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/applications/${appId}/request-visibility`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                setApplications(prev => prev.map(a =>
                    a.id === appId ? { ...a, visibilityRequestStatus: 'PENDING' } : a
                ));
                if (selectedApp && selectedApp.id === appId) {
                    setSelectedApp({ ...selectedApp, visibilityRequestStatus: 'PENDING' });
                }
                alert('✅ Request sent! The admin will review your request.');
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error('Error requesting visibility:', error);
            alert('Failed to send request. Please try again.');
        }
    };

    const allApplications = applications.filter(app => {
        const sanitizedQuery = searchQuery.replace(/[<>]/g, '').toLowerCase();
        return app.jobTitle?.toLowerCase().includes(sanitizedQuery) ||
            app.company?.toLowerCase().includes(sanitizedQuery);
    });

    const renderAppItem = (app) => {
        const isAction = app.status === 'ACTION_REQUIRED';
        const statusInfo = getDisplayStatus(app.status);

        return (
            <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`group bg-white rounded-2xl border p-5 cursor-pointer mb-4 transition-all duration-300 ${
                    isAction 
                        ? 'border-amber-200 bg-amber-50/50 shadow-sm hover:border-amber-300 hover:shadow-md' 
                        : 'border-slate-100 hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 min-w-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-sm ${
                            isAction ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                        }`}>
                            {isAction ? <AlertTriangle className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 text-lg truncate mb-1 group-hover:text-teal-700 transition-colors">{app.jobTitle}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
                                <span className="text-slate-700 flex items-center gap-1"><Building2 className="w-3.5 h-3.5 opacity-70" /> {app.company}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 opacity-70" /> {app.appliedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hidden md:flex items-center gap-1.5 shadow-sm border ${
                            statusInfo.color.replace('text-', 'border-').split(' ')[0].replace('bg-', 'border-opacity-20 border-')
                        } ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors border border-slate-100 group-hover:border-teal-100">
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 py-12 px-4 font-sans text-slate-800">
            <div className="container mx-auto max-w-4xl">

                {/* HEADER - MALDIVES GRADIENT WITH GLASSMORPHISM */}
                <div className="mb-12 bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 rounded-[2.5rem] p-10 shadow-2xl shadow-teal-900/20 border border-white/10 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none"></div>

                    <Link to="/dashboard" className="inline-flex items-center text-teal-100/80 hover:text-white mb-8 text-xs font-black uppercase tracking-widest transition-all hover:gap-3 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1" /> Back to Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-teal-100 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <FileText className="w-3 h-3" /> Candidate Portal
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">Career History</h1>
                            <p className="text-teal-50/80 font-medium mt-4 max-w-md text-sm md:text-base leading-relaxed">
                                Track your professional journey and manage all your job applications in one place.
                            </p>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                                <Search className="w-4 h-4 text-teal-200" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search roles or companies..."
                                className="pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm font-semibold text-white placeholder:text-teal-200/50 focus:outline-none focus:bg-white/15 focus:ring-4 focus:ring-white/10 focus:border-white/40 w-full md:w-80 transition-all shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* LIST */}
                <div className="space-y-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Journey...</p>
                        </div>
                    ) : allApplications.length > 0 ? (
                        allApplications.map(app => renderAppItem(app))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200/60 shadow-inner">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Briefcase className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No applications found</h3>
                            <p className="text-slate-500 font-medium text-sm mb-8 max-w-xs mx-auto">You haven't applied to any jobs yet. Start your journey today!</p>
                            <Link
                                to="/jobs"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95 group"
                            >
                                Browse New Jobs <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">End of Career History</p>
                </div>
            </div>

            {/* DRAWER details view - PREMIUM DESIGN */}
            {selectedApp && (
                <div className="fixed top-20 right-0 bottom-0 left-0 z-[150] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500" onClick={() => setSelectedApp(null)}></div>
                    <div className="relative w-full max-w-lg md:max-w-xl bg-white h-full shadow-[0_0_100px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                        
                        {/* Drawer Header */}
                        <div className="relative p-10 border-b border-slate-100 flex justify-between items-start bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="min-w-0 pr-6 relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-3 py-1 bg-teal-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-teal-600/30">
                                        Application ID: #{selectedApp.id.slice(-6).toUpperCase()}
                                    </div>
                                    <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
                                        Applied {selectedApp.appliedDate}
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 leading-[1.1] mb-2 tracking-tight">{selectedApp.jobTitle}</h2>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-lg">
                                    <Building2 className="w-5 h-5 text-teal-600" /> {selectedApp.company}
                                </div>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="relative z-10 p-3 rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all active:scale-95">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-12">

                            {/* STATUS BANNER - FIXED CONTRAST */}
                            <div className={`rounded-3xl p-8 border-2 relative overflow-hidden transition-all duration-300 ${
                                isFinalStatus(selectedApp.status) 
                                    ? (selectedApp.status === 'REJECTED' ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100') 
                                    : (selectedApp.status === 'ACTION_REQUIRED') ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50/50 border-slate-100'
                            }`}>
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">Application Status</div>
                                        <div className={`text-3xl font-black flex items-center gap-3 ${getDisplayStatus(selectedApp.status).darkColor}`}>
                                            {getDisplayStatus(selectedApp.status).icon}
                                            {getDisplayStatus(selectedApp.status).label}
                                        </div>
                                    </div>
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center opacity-20 ${getDisplayStatus(selectedApp.status).color}`}>
                                        {React.cloneElement(getDisplayStatus(selectedApp.status).icon, { className: "w-10 h-10" })}
                                    </div>
                                </div>
                                {/* Decorative status circle */}
                                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 ${getDisplayStatus(selectedApp.status).color}`}></div>
                            </div>

                            {/* ACTION REQUIRED CONTENT */}
                            {selectedApp.status === 'ACTION_REQUIRED' && (
                                <div className="space-y-6">
                                    <h4 className="flex items-center gap-3 text-base font-black text-slate-900 uppercase tracking-widest pb-4 border-b border-slate-100">
                                        <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        Corrections Needed
                                    </h4>

                                    <div className="space-y-4">
                                        {selectedApp.documentFeedbacks?.map((fb, idx) => (
                                            <div key={idx} className="bg-white border-l-4 border-rose-500 rounded-2xl p-6 shadow-sm border border-slate-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider">
                                                        <FileText className="w-4 h-4 text-rose-500" />
                                                        {fb.docId}
                                                    </div>
                                                    <button
                                                        onClick={() => window.location.href = '/profile'}
                                                        className="text-[10px] font-black text-white bg-slate-900 px-5 py-2.5 rounded-xl hover:bg-teal-600 transition-all shadow-md active:scale-95"
                                                    >
                                                        RE-UPLOAD
                                                    </button>
                                                </div>
                                                <div className="bg-slate-50 p-5 rounded-2xl text-sm text-slate-700 italic border border-slate-100 leading-relaxed">
                                                    "{fb.message}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* GENERAL INFO (Timeline) */}
                            {selectedApp.status !== 'ACTION_REQUIRED' && (
                                <div className="space-y-8">
                                    {(selectedApp.visibilityRequestStatus === 'APPROVED' || isFinalStatus(selectedApp.status)) ? (
                                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Process Timeline</h4>
                                            
                                            <div className="relative space-y-10 pl-10 border-l-2 border-slate-100 ml-4">
                                                {/* Milestone 1 */}
                                                <div className="relative">
                                                    <div className="absolute -left-[54px] top-1 w-10 h-10 bg-teal-500 rounded-2xl border-4 border-white shadow-lg shadow-teal-500/20 flex items-center justify-center">
                                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="text-base font-black text-slate-900 mb-1">Application Submitted</div>
                                                    <div className="text-xs text-slate-500 tracking-wide font-bold">Successfully received on {selectedApp.appliedDate}</div>
                                                </div>

                                                {/* Milestone 2 */}
                                                <div className="relative">
                                                    <div className={`absolute -left-[54px] top-1 w-10 h-10 ${
                                                        isFinalStatus(selectedApp.status) 
                                                            ? (selectedApp.status === 'REJECTED' ? 'bg-red-500 shadow-red-500/20' : 'bg-emerald-500 shadow-emerald-500/20') 
                                                            : 'bg-blue-500 shadow-blue-500/20'
                                                    } rounded-2xl border-4 border-white shadow-lg flex items-center justify-center`}>
                                                        {isFinalStatus(selectedApp.status) ? (selectedApp.status === 'REJECTED' ? <X className="w-5 h-5 text-white" /> : <CheckCircle2 className="w-5 h-5 text-white" />) : <Clock className="w-5 h-5 text-white" />}
                                                    </div>
                                                    <div className="text-base font-black text-slate-900 mb-1">
                                                        {isFinalStatus(selectedApp.status) ? getDisplayStatus(selectedApp.status).label : 'Processing & Review'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 tracking-wide font-bold">
                                                        {selectedApp.visibilityReviewedAt 
                                                            ? `Update recorded on ${new Date(selectedApp.visibilityReviewedAt).toLocaleDateString()}` 
                                                            : isFinalStatus(selectedApp.status) ? 'Final decision reached' : 'Current stage of your application'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 rounded-[2rem] p-10 text-center border-2 border-dashed border-slate-200 shadow-inner">
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                                <Clock className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Timeline Locked</h4>
                                            <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
                                                {selectedApp.visibilityRequestStatus === 'REJECTED'
                                                    ? 'Your request for visibility was denied. Please contact support for more information.'
                                                    : selectedApp.visibilityRequestStatus === 'PENDING'
                                                        ? 'Your access request is currently being reviewed by our administration team.'
                                                        : 'To protect application integrity, detailed progress is hidden. You can request visibility below.'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Request Access Button */}
                                    {!isFinalStatus(selectedApp.status) && (
                                        <div className="pt-8 text-center">
                                            <button
                                                onClick={() => handleRequestProgress(selectedApp.id)}
                                                disabled={selectedApp.visibilityRequestStatus === 'PENDING' || selectedApp.visibilityRequestStatus === 'APPROVED' || selectedApp.visibilityRequestStatus === 'REJECTED'}
                                                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl border-2 flex items-center justify-center gap-3 active:scale-95 group ${
                                                    selectedApp.visibilityRequestStatus === 'REJECTED' 
                                                        ? 'border-red-200 bg-red-50 text-red-600' 
                                                        : selectedApp.visibilityRequestStatus === 'APPROVED' 
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600' 
                                                            : 'border-slate-900 bg-slate-900 text-white hover:bg-teal-600 hover:border-teal-600 shadow-slate-900/10 hover:shadow-teal-600/30'
                                                }`}
                                            >
                                                {selectedApp.visibilityRequestStatus === 'PENDING' ? <React.Fragment><div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div> REVIEWING REQUEST...</React.Fragment> :
                                                    selectedApp.visibilityRequestStatus === 'APPROVED' ? <React.Fragment><CheckCircle2 className="w-5 h-5" /> ACCESS GRANTED</React.Fragment> :
                                                        selectedApp.visibilityRequestStatus === 'REJECTED' ? <React.Fragment><X className="w-5 h-5" /> ACCESS DENIED</React.Fragment> : 
                                                        <React.Fragment>REQUEST FULL ACCESS <ArrowRight className="w-4 h-4 group-hover:translate-x-1" /></React.Fragment>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;
