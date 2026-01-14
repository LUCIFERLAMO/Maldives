
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
    Upload,
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
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        jobs (
                            id,
                            title,
                            company,
                            location
                        )
                    `)
                    .eq('candidate_id', user.id)
                    .order('applied_date', { ascending: false });

                if (error) throw error;

                // Transform data to match expected format
                const transformedApps = (data || []).map(app => ({
                    id: app.id,
                    jobId: app.job_id,
                    candidateName: app.candidate_name,
                    email: app.email,
                    contactNumber: app.contact_number,
                    status: app.status,
                    appliedDate: new Date(app.applied_date).toLocaleDateString(),
                    adminFeedback: app.admin_feedback,
                    documentFeedbacks: app.document_feedbacks,
                    jobTitle: app.jobs?.title,
                    company: app.jobs?.company
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

    const handleRequestProgress = (appId) => {
        setApplications(prev => prev.map(a =>
            a.id === appId ? { ...a, statusRequestStatus: 'pending' } : a
        ));
        if (selectedApp && selectedApp.id === appId) {
            setSelectedApp({ ...selectedApp, statusRequestStatus: 'pending' });
        }
        alert("Request sent to employer.");
    };

    const allApplications = applications.filter(app =>
        app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <p className="text-slate-500 font-medium text-sm">No matching applications found.</p>
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

                            {/* STATUS BANNER */}
                            <div className={`rounded-2xl p-6 border ${selectedApp.status === ApplicationStatus.ACTION_REQUIRED ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
                                <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Current Status</div>
                                <div className="text-xl font-bold flex items-center gap-2">
                                    {selectedApp.status === ApplicationStatus.ACTION_REQUIRED && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                                    {selectedApp.status}
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
                                                    <button className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
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
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 mb-4">Application Timeline</h4>
                                        <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-sm"></div>
                                                <div className="text-sm font-bold text-slate-900">Application Received</div>
                                                <div className="text-xs text-slate-500 mt-1">{selectedApp.appliedDate}</div>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-4 h-4 bg-slate-300 rounded-full border-4 border-white"></div>
                                                <div className="text-sm font-medium text-slate-500">Screening in progress</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request Access Button */}
                                    <div className="pt-6 border-t border-slate-100">
                                        <p className="text-sm text-slate-500 mb-4 font-medium">Need more detailed updates?</p>
                                        <button
                                            onClick={() => handleRequestProgress(selectedApp.id)}
                                            disabled={selectedApp.statusRequestStatus === 'pending' || selectedApp.statusRequestStatus === 'approved'}
                                            className="w-full py-4 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {selectedApp.statusRequestStatus === 'pending' ? <Clock className="w-4 h-4" /> :
                                                selectedApp.statusRequestStatus === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4" />}

                                            {selectedApp.statusRequestStatus === 'pending' ? 'Request Pending' :
                                                selectedApp.statusRequestStatus === 'approved' ? 'Access Granted' : 'Request Status Visibility'}
                                        </button>
                                    </div>
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
