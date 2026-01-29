
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../constants';
import { ApplicationStatus } from '../types';
import {
    ArrowLeft,
    Search,
    Briefcase,
    Building2,
    X,
    ChevronRight,
    AlertTriangle,
    Upload,   // this is my branch
    FileText,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
                const response = await fetch(`http://localhost:5000/api/applications/candidate/${encodeURIComponent(user.email)}`);
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
                return { label: 'Selected', color: 'bg-emerald-100 text-emerald-700' };
            case 'REJECTED':
                return { label: 'Rejected', color: 'bg-red-100 text-red-700' };
            case 'HOLD':
            case 'REVIEWING':
                return { label: 'In Review', color: 'bg-blue-100 text-blue-700' };
            case 'PENDING':
                return { label: 'Applied', color: 'bg-slate-100 text-slate-600' };
            default:
                return { label: status, color: 'bg-slate-100 text-slate-600' };
        }
    };

    // Check if status is a final outcome (always visible)
    const isFinalStatus = (status) => {
        return ['APPROVED', 'SELECTED', 'ACCEPTED', 'REJECTED'].includes(status);
    };

    // Handle visibility request - calls backend API
    const handleRequestProgress = async (appId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${appId}/request-visibility`, {
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
        const isAction = app.status === ApplicationStatus.ACTION_REQUIRED;

        return (
            <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`group bg-white rounded-xl border p-5 cursor-pointer mb-3 transition-all ${isAction ? 'border-amber-200 bg-amber-50 shadow-sm hover:border-amber-300' : 'border-slate-100 hover:border-teal-300 hover:shadow-md'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 min-w-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isAction ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600'
                            }`}>
                            {isAction ? <AlertTriangle className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-lg truncate mb-1">{app.jobTitle}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                <span className="text-slate-800">{app.company}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>Applied on {app.appliedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide hidden md:inline-block shadow-sm ${isAction ? 'bg-amber-100 text-amber-700' :
                            app.status === 'Applied' ? 'bg-slate-100 text-slate-600' :
                                app.status === 'Under Review' ? 'bg-blue-50 text-blue-600' :
                                    'bg-slate-100 text-slate-600'
                            }`}>
                            {app.status}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 font-sans text-slate-800">
            <div className="container mx-auto max-w-4xl">

                {/* HEADER - MALDIVES GRADIENT */}
                <div className="mb-10 bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 rounded-3xl p-8 shadow-xl shadow-teal-900/10 border border-teal-600/20 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <Link to="/dashboard" className="inline-flex items-center text-teal-100 hover:text-white mb-6 text-sm font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">My Applications</h1>
                            <p className="text-teal-100 font-medium mt-1">Track and manage your ongoing job applications.</p>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-200" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white placeholder:text-teal-200/70 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/30 focus:border-white/40 w-full md:w-72 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                        </div>
                    ) : allApplications.length > 0 ? (
                        allApplications.map(app => renderAppItem(app))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                            <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium text-sm mb-4">No applications yet.</p>
                            <Link
                                to="/jobs"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors shadow-lg"
                            >
                                Browse Jobs <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>

            </div>

            {/* DRAWER details view */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setSelectedApp(null)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                        <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                            <div className="min-w-0 pr-4">
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{selectedApp.jobTitle}</h2>
                                <div className="flex items-center gap-2 text-slate-600 font-medium">
                                    <Building2 className="w-4 h-4" /> {selectedApp.company}
                                </div>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">

                            {/* STATUS BANNER - Use display-friendly status */}
                            <div className={`rounded-2xl p-6 border ${isFinalStatus(selectedApp.status) ? (selectedApp.status === 'REJECTED' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100') : selectedApp.status === ApplicationStatus.ACTION_REQUIRED ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
                                <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Current Status</div>
                                <div className={`text-xl font-bold flex items-center gap-2 ${getDisplayStatus(selectedApp.status).color.replace('bg-', 'text-').split(' ')[0]}`}>
                                    {selectedApp.status === ApplicationStatus.ACTION_REQUIRED && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                                    {isFinalStatus(selectedApp.status) && selectedApp.status !== 'REJECTED' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                                    {selectedApp.status === 'REJECTED' && <X className="w-6 h-6 text-red-600" />}
                                    {getDisplayStatus(selectedApp.status).label}
                                </div>
                            </div>

                            {/* ACTION REQUIRED CONTENT */}
                            {selectedApp.status === ApplicationStatus.ACTION_REQUIRED && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">Corrections Needed</div>
                                            <div className="text-xs text-slate-500">Please re-upload the following documents</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {selectedApp.documentFeedbacks?.map((fb, idx) => (
                                            <div key={idx} className="bg-white border border-rose-100 rounded-xl p-5 shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                                        <FileText className="w-4 h-4 text-slate-400" />
                                                        {fb.docId.toUpperCase()}
                                                    </div>
                                                    <button
                                                        onClick={() => window.location.href = '/profile'}
                                                        className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                                    >
                                                        Re-upload
                                                    </button>
                                                </div>
                                                <div className="bg-rose-50 p-4 rounded-lg text-sm text-rose-800 italic">
                                                    "{fb.message}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* GENERAL INFO (If no action required) */}
                            {selectedApp.status !== ApplicationStatus.ACTION_REQUIRED && (
                                <div className="space-y-8">
                                    {/* Show timeline only if: visibility approved OR final status (Selected/Rejected) */}
                                    {(selectedApp.visibilityRequestStatus === 'APPROVED' || isFinalStatus(selectedApp.status)) ? (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 mb-4">Application Timeline</h4>
                                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                                <div className="relative">
                                                    <div className="absolute -left-[21px] top-1 w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-sm"></div>
                                                    <div className="text-sm font-bold text-slate-900">Application Received</div>
                                                    <div className="text-xs text-slate-500 mt-1">{selectedApp.appliedDate}</div>
                                                </div>
                                                <div className="relative">
                                                    <div className={`absolute -left-[21px] top-1 w-4 h-4 ${isFinalStatus(selectedApp.status) ? (selectedApp.status === 'REJECTED' ? 'bg-red-500' : 'bg-emerald-500') : 'bg-blue-500'} rounded-full border-4 border-white shadow-sm`}></div>
                                                    <div className="text-sm font-bold text-slate-900">
                                                        {isFinalStatus(selectedApp.status) ? getDisplayStatus(selectedApp.status).label : 'Under Review'}
                                                    </div>
                                                    {selectedApp.visibilityReviewedAt && (
                                                        <div className="text-xs text-slate-500 mt-1">Updated on {new Date(selectedApp.visibilityReviewedAt).toLocaleDateString()}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Timeline hidden - Show request visibility UI */
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                                            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <h4 className="text-base font-bold text-slate-800 mb-2">Progress Details Hidden</h4>
                                            <p className="text-sm text-slate-500 mb-4">
                                                {selectedApp.visibilityRequestStatus === 'REJECTED'
                                                    ? 'Your request for visibility was denied by the admin.'
                                                    : selectedApp.visibilityRequestStatus === 'PENDING'
                                                        ? 'Your visibility request is pending admin approval.'
                                                        : 'Request visibility from the admin to see detailed progress.'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Request Access Button - Only show if not final status */}
                                    {!isFinalStatus(selectedApp.status) && (
                                        <div className="pt-6 border-t border-slate-100">
                                            <p className="text-sm text-slate-500 mb-4 font-medium">Need more detailed updates?</p>
                                            <button
                                                onClick={() => handleRequestProgress(selectedApp.id)}
                                                disabled={selectedApp.visibilityRequestStatus === 'PENDING' || selectedApp.visibilityRequestStatus === 'APPROVED' || selectedApp.visibilityRequestStatus === 'REJECTED'}
                                                className={`w-full py-4 border text-slate-700 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${selectedApp.visibilityRequestStatus === 'REJECTED' ? 'border-red-200 bg-red-50 text-red-600' : selectedApp.visibilityRequestStatus === 'APPROVED' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                {selectedApp.visibilityRequestStatus === 'PENDING' && <Clock className="w-4 h-4" />}
                                                {selectedApp.visibilityRequestStatus === 'APPROVED' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                                {selectedApp.visibilityRequestStatus === 'REJECTED' && <X className="w-4 h-4 text-red-500" />}
                                                {selectedApp.visibilityRequestStatus === 'NOT_REQUESTED' && <Clock className="w-4 h-4" />}

                                                {selectedApp.visibilityRequestStatus === 'PENDING' ? 'Request Pending...' :
                                                    selectedApp.visibilityRequestStatus === 'APPROVED' ? 'Visibility Granted' :
                                                        selectedApp.visibilityRequestStatus === 'REJECTED' ? 'Request Denied' : 'Request Status Visibility'}
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
