
import React, { useState, useMemo, useEffect } from 'react';
import { ApplicationStatus, JobStatus } from '../types';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../constants';
import {
    Search, LayoutDashboard, Users, Briefcase,
    X, Shield, LogOut, Briefcase as BriefcaseIcon,
    Ban, PlusCircle, CheckCircle,
    AlertTriangle, Globe, ArrowRight, UserPlus,
    MapPin, Award, User,
    AlignLeft, ChevronDown, ShieldCheck,
    FilePlus, Clock, Settings, Key, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');


    const [applications, setApplications] = useState(MOCK_APPLICATIONS);

    // FIXED: Form State for Candidate Submission
    const [submissionData, setSubmissionData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        nationality: ''
    });

    // --- REAL DATA FETCHER ---
    const [pipelineData, setPipelineData] = useState([]);
    // This gets the list of candidates from the database
    useEffect(() => {
        if (!user?.id) return;

        const fetchPipeline = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/applications/agent/${user.id}/all`);
                const data = await response.json();
                if (data) {
                    setPipelineData(data);
                }
            } catch (error) {
                console.error("Error fetching pipeline:", error);
            }
        };
        fetchPipeline();
    }, [user?.id]);
    // -------------------------
    const [jobs, setJobs] = useState([]);

    // FETCH REAL JOBS
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/jobs');
                const data = await response.json();

                // Filter for open jobs
                const openJobs = (data || []).filter(j => j.status === 'OPEN');
                setJobs(openJobs);
                if (openJobs.length === 0) console.warn("Fetch successful but 0 jobs found with status 'OPEN'");
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const [selectedJobForSubmission, setSelectedJobForSubmission] = useState(null);
    const [submissionFiles, setSubmissionFiles] = useState({
        resume: null,
        identity: null,
        certs: null,
        pcc: null,
        goodStanding: null
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [pipelineSearchTerm, setPipelineSearchTerm] = useState('');

    // Vacancy Navigation State (Categories → Jobs → Job Detail)
    const [vacancyView, setVacancyView] = useState('categories'); // 'categories' | 'jobs' | 'jobDetail'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedVacancyJob, setSelectedVacancyJob] = useState(null);
    const [agentJobApplications, setAgentJobApplications] = useState([]);
    const [isLoadingAgentApps, setIsLoadingAgentApps] = useState(false);

    // Job Categories List
    const JOB_CATEGORIES = ['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'];


    const [jobRequests, setJobRequests] = useState([]);

    // FETCH REAL JOB REQUESTS
    useEffect(() => {
        if (!user?.id) return;
        const fetchRequests = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/job-requests/agent/${user.id}`);
                const data = await response.json();
                if (data) setJobRequests(data);
            } catch (error) {
                console.error("Error fetching job requests:", error);
            }
        };
        fetchRequests();
    }, [user?.id]);
    const [showJobRequestForm, setShowJobRequestForm] = useState(false);
    const [jobRequestSearchTerm, setJobRequestSearchTerm] = useState('');
    const [expandedJobRequestId, setExpandedJobRequestId] = useState(null);
    const [isRefreshingJobRequests, setIsRefreshingJobRequests] = useState(false);

    // Function to refresh job requests
    const refreshJobRequests = async () => {
        if (!user?.id) return;
        setIsRefreshingJobRequests(true);
        try {
            const response = await fetch(`http://localhost:5000/api/job-requests/agent/${user.id}`);
            const data = await response.json();
            if (data) setJobRequests(data);
        } catch (error) {
            console.error("Error refreshing job requests:", error);
        } finally {
            setIsRefreshingJobRequests(false);
        }
    };

    // Password Reset State
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    // Handle Password Reset
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        // Validation
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        setIsResettingPassword(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user?.email,
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setPasswordSuccess('Password updated successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setIsResettingPassword(false);
        }
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(j =>
        (j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.company.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [jobs, searchTerm]);

    // Filter jobs by selected category
    const filteredJobsByCategory = useMemo(() => {
        if (!selectedCategory) return [];
        return jobs.filter(j => j.category === selectedCategory);
    }, [jobs, selectedCategory]);

    // Fetch agent's applications for a specific job
    const fetchAgentJobApplications = async (jobId) => {
        if (!user?.id || !jobId) return;
        setIsLoadingAgentApps(true);
        try {
            const response = await fetch(`http://localhost:5000/api/applications/agent/${user.id}/job/${jobId}`);
            const data = await response.json();
            setAgentJobApplications(data || []);
        } catch (error) {
            console.error('Error fetching agent applications:', error);
            setAgentJobApplications([]);
        } finally {
            setIsLoadingAgentApps(false);
        }
    };

    // Handle category selection
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setVacancyView('jobs');
    };

    // Handle job selection from category view
    const handleSelectVacancyJob = async (job) => {
        setSelectedVacancyJob(job);
        setVacancyView('jobDetail');
        await fetchAgentJobApplications(job.id || job._id);
    };

    // Handle back navigation in vacancy view
    const handleVacancyBack = () => {
        if (vacancyView === 'jobDetail') {
            setSelectedVacancyJob(null);
            setAgentJobApplications([]);
            setVacancyView('jobs');
        } else if (vacancyView === 'jobs') {
            setSelectedCategory(null);
            setVacancyView('categories');
        }
    };


    const handleOpenSubmission = (job) => {
        setSelectedJobForSubmission(job);
        // Reset form
        setSubmissionData({ name: '', email: '', whatsapp: '', nationality: '' });
        setSubmissionFiles({
            resume: null,
            identity: null,
            certs: null,
            pcc: null,
            goodStanding: null
        });
    };

    const handleConfirmSubmission = async () => {
        if (!submissionFiles.resume || !submissionFiles.identity || !submissionFiles.certs) {
            alert("Please upload all mandatory documents (Resume, ID/Passport, Certificates).");
            return;
        }
        if (!submissionData.name || !submissionData.email || !submissionData.whatsapp || !submissionData.nationality) {
            alert("Please fill in all identity details (Name, Email, Phone, Nationality).");
            return;
        }

        try {
            // Create FormData for file upload
            const formDataPayload = new FormData();
            formDataPayload.append('agent_id', user.id);
            formDataPayload.append('job_id', selectedJobForSubmission.id || selectedJobForSubmission._id);
            formDataPayload.append('name', submissionData.name);
            formDataPayload.append('email', submissionData.email);
            formDataPayload.append('contact', submissionData.whatsapp);
            formDataPayload.append('nationality', submissionData.nationality);
            formDataPayload.append('resume', submissionFiles.resume);

            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                body: formDataPayload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Submission failed');
            }

            alert("Success! Candidate Submitted to Database.");

            // If we're on job detail view, refresh the agent's applications for this job
            if (vacancyView === 'jobDetail' && selectedVacancyJob) {
                await fetchAgentJobApplications(selectedVacancyJob.id || selectedVacancyJob._id);
            }

            setSelectedJobForSubmission(null);

            // Refresh Pipeline Data (fetch all applications for this agent)
            try {
                const pipelineResponse = await fetch(`http://localhost:5000/api/applications/agent/${user.id}/all`);
                if (pipelineResponse.ok) {
                    const pipelineNewData = await pipelineResponse.json();
                    if (pipelineNewData) setPipelineData(pipelineNewData);
                }
            } catch (pipelineErr) {
                console.log("Pipeline refresh skipped - endpoint may not exist");
            }

        } catch (err) {
            console.error("Submission Error:", err);
            alert("Error: " + err.message);
        }
    };



    // --- AGENT PROFILE FETCHER ---
    const [agentProfile, setAgentProfile] = useState(null);
    useEffect(() => {
        if (!user?.id) return;

        const fetchAgentProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/agents/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAgentProfile(data);
                }
            } catch (error) {
                console.error("Error fetching agent profile:", error);
            }
        };
        fetchAgentProfile();
    }, [user?.id]);

    // If agent status is PENDING, show waiting screen
    if (user?.status === 'PENDING') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-lg text-center">
                    <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-3">Application Under Review</h1>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        Thank you for registering! Your application is currently pending admin approval.
                        You'll receive full access to the partner portal once your account is verified.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 mb-8">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Estimated Review Time</p>
                        <p className="text-sm font-bold text-slate-700">24-48 hours</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans flex overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-72 bg-slate-900 text-slate-400 flex flex-col flex-shrink-0 border-r border-slate-800 z-20">
                <div className="h-20 flex flex-col justify-center px-6 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-400 border border-teal-500/20">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="font-bold text-white text-sm tracking-tight block leading-none truncate w-48">
                                {agentProfile?.company_name || "GlobalTalent"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1 block truncate w-48">
                                {agentProfile?.full_name || user?.name || "Partner Portal"}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'overview'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                            : 'hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('vacancies')}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'vacancies'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                            : 'hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <Briefcase className="w-5 h-5" /> Active Vacancies
                    </button>
                    <button
                        onClick={() => setActiveTab('pipeline')}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'pipeline'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                            : 'hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <Users className="w-5 h-5" /> Pipeline
                    </button>
                    <button
                        onClick={() => setActiveTab('jobRequests')}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'jobRequests'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                            : 'hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <FilePlus className="w-5 h-5" /> Job Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'settings'
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                            : 'hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <Settings className="w-5 h-5" /> Settings
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-500">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">



                {/* DASHBOARD CONTENT SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-12 bg-[#f8fafc]">
                    <div className="max-w-[1400px] mx-auto space-y-12">

                        {/* TAB CONTENT: AGENT HIRING */}
                        {activeTab === 'jobRequests' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {!showJobRequestForm ? (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">My Job Requests</h2>
                                                <p className="text-slate-500 text-sm mt-1">Manage and track your sourcing opportunities.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search requests..."
                                                        className="bg-white border border-slate-300 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all w-64 shadow-sm"
                                                        value={jobRequestSearchTerm}
                                                        onChange={(e) => setJobRequestSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={refreshJobRequests}
                                                    disabled={isRefreshingJobRequests}
                                                    className="bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                                                >
                                                    <RefreshCw className={`w-4 h-4 ${isRefreshingJobRequests ? 'animate-spin' : ''}`} />
                                                    {isRefreshingJobRequests ? 'Refreshing...' : 'Refresh'}
                                                </button>
                                                <button
                                                    onClick={() => setShowJobRequestForm(true)}
                                                    className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm"
                                                >
                                                    <PlusCircle className="w-4 h-4" /> New Request
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {jobRequests.filter(req => req.title.toLowerCase().includes(jobRequestSearchTerm.toLowerCase())).length === 0 ? (
                                                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                                                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                                                        <FilePlus className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-slate-900 font-bold text-sm mb-1">No Requests Found</h3>
                                                    <p className="text-slate-500 text-xs max-w-xs mx-auto">Try adjusting your search terms or submit a new request.</p>
                                                </div>
                                            ) : (
                                                jobRequests
                                                    .filter(req => req.title.toLowerCase().includes(jobRequestSearchTerm.toLowerCase()))
                                                    .map((req) => (
                                                        <div
                                                            key={req.id}
                                                            onClick={() => setExpandedJobRequestId(expandedJobRequestId === req.id ? null : req.id)}
                                                            className={`bg-white rounded-xl border transition-all cursor-pointer group overflow-hidden ${expandedJobRequestId === req.id
                                                                ? 'border-teal-200 shadow-md ring-1 ring-teal-500/10'
                                                                : 'border-slate-200 shadow-sm hover:shadow-md hover:border-teal-100'
                                                                }`}
                                                        >
                                                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{req.category || 'Other'}</span>
                                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.status === 'APPROVED' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                                            req.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                                req.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                                    'bg-slate-50 text-slate-700 border-slate-100'
                                                                            }`}>
                                                                            {req.status === 'PENDING' ? 'PENDING' : req.status}
                                                                        </span>
                                                                    </div>
                                                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">{req.title}</h3>
                                                                    <p className="text-sm text-slate-500 mb-2">{req.company} • {req.location}</p>
                                                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                                                        <span>{req.vacancies || 1} {(req.vacancies || 1) === 1 ? 'Opening' : 'Openings'}</span>
                                                                        <span>•</span>
                                                                        <span>{req.salary_range || 'Salary TBD'}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedJobRequestId === req.id ? 'rotate-180 text-teal-600' : ''}`} />
                                                                </div>
                                                            </div>

                                                            {/* EXPANDED DETAILS */}
                                                            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expandedJobRequestId === req.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                                                <div className="overflow-hidden">
                                                                    <div className="px-6 pb-6 pt-0 border-t border-slate-100 mt-2 bg-slate-50/50">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                                                            <div>
                                                                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                                    <AlignLeft className="w-3 h-3 text-slate-400" /> Description
                                                                                </h4>
                                                                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                                                    {req.description || 'No description provided.'}
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                                    <CheckCircle className="w-3 h-3 text-slate-400" /> Requirements
                                                                                </h4>
                                                                                {Array.isArray(req.requirements) && req.requirements.length > 0 ? (
                                                                                    <ul className="text-sm text-slate-600 leading-relaxed font-medium space-y-1">
                                                                                        {req.requirements.map((r, i) => (
                                                                                            <li key={i} className="flex items-start gap-2">
                                                                                                <span className="text-teal-500 mt-1">•</span>
                                                                                                <span>{r}</span>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                ) : (
                                                                                    <p className="text-sm text-slate-400 italic">No specific requirements listed.</p>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Rejection Reason - Only shown for rejected requests */}
                                                                        {req.status === 'REJECTED' && req.review_notes && (
                                                                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                                                                <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                                    <AlertTriangle className="w-3 h-3" /> Rejection Reason
                                                                                </h4>
                                                                                <p className="text-sm text-red-600 font-medium leading-relaxed">
                                                                                    {req.review_notes}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="max-w-3xl mx-auto">
                                        <div className="mb-8 flex items-center gap-4">
                                            <button
                                                onClick={() => setShowJobRequestForm(false)}
                                                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm"
                                            >
                                                <ArrowRight className="w-5 h-5 rotate-180" />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Job Request</h2>
                                                <p className="text-slate-500 font-medium text-sm">Details will be sent for Admin approval</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                                            <form className="space-y-8" onSubmit={async (e) => {
                                                e.preventDefault();
                                                if (!user?.id) {
                                                    alert("Session expired. Please log in again.");
                                                    return;
                                                }

                                                // ========== SECURITY: Input Sanitization Function ==========
                                                const sanitizeInput = (str) => {
                                                    if (!str) return '';
                                                    return str
                                                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                                                        .replace(/javascript:/gi, '') // Remove javascript: protocol
                                                        .replace(/on\w+=/gi, '') // Remove event handlers (onclick=, onerror=, etc.)
                                                        .replace(/[<>]/g, '') // Remove < and > characters
                                                        .trim();
                                                };

                                                // ========== SECURITY: Validate Salary Format ==========
                                                const validateSalaryFormat = (salary) => {
                                                    if (!salary) return true; // Optional field
                                                    // Only allow: numbers, $, €, £, /, -, spaces, commas, periods, and common words
                                                    const salaryPattern = /^[\d\s$€£,.\-\/a-zA-Z]+$/;
                                                    // Must contain at least one number if not empty
                                                    const hasNumber = /\d/.test(salary);
                                                    // Check for suspicious patterns
                                                    const hasSuspiciousContent = /<|>|script|javascript|onclick|onerror/i.test(salary);
                                                    return salaryPattern.test(salary) && hasNumber && !hasSuspiciousContent;
                                                };

                                                // ========== SECURITY: Validate Text Fields ==========
                                                const validateTextField = (text, fieldName, minLen = 2, maxLen = 200) => {
                                                    if (!text || text.length < minLen) {
                                                        return `${fieldName} must be at least ${minLen} characters`;
                                                    }
                                                    if (text.length > maxLen) {
                                                        return `${fieldName} must be less than ${maxLen} characters`;
                                                    }
                                                    // Check for script injection attempts
                                                    if (/<script|javascript:|onclick|onerror|onload/i.test(text)) {
                                                        return `${fieldName} contains invalid characters`;
                                                    }
                                                    return null;
                                                };

                                                try {
                                                    // Get and sanitize all form values
                                                    const title = sanitizeInput(e.target.title.value);
                                                    const company = sanitizeInput(e.target.company.value);
                                                    const location = sanitizeInput(e.target.location.value);
                                                    const category = e.target.category.value;
                                                    const salary_range = sanitizeInput(e.target.salary_range.value);
                                                    const description = sanitizeInput(e.target.description.value);
                                                    const vacancies = parseInt(e.target.vacancies.value) || 1;

                                                    // Parse and sanitize requirements
                                                    const requirementsArray = e.target.requirements.value
                                                        .split('\n')
                                                        .map(r => sanitizeInput(r))
                                                        .filter(r => r.length > 0 && r.length <= 200);

                                                    // ========== VALIDATION CHECKS ==========
                                                    const errors = [];

                                                    // Validate Job Title (2-100 chars, letters/numbers/spaces only)
                                                    const titleError = validateTextField(title, 'Job Title', 2, 100);
                                                    if (titleError) errors.push(titleError);

                                                    // Validate Company Name (2-100 chars)
                                                    const companyError = validateTextField(company, 'Company Name', 2, 100);
                                                    if (companyError) errors.push(companyError);

                                                    // Validate Location (2-100 chars)
                                                    const locationError = validateTextField(location, 'Location', 2, 100);
                                                    if (locationError) errors.push(locationError);

                                                    // Validate Category (must be from allowed list)
                                                    const allowedCategories = ['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'];
                                                    if (!allowedCategories.includes(category)) {
                                                        errors.push('Please select a valid category');
                                                    }

                                                    // Validate Salary Range format
                                                    if (salary_range && !validateSalaryFormat(salary_range)) {
                                                        errors.push('Salary Range must contain numbers and valid currency symbols (e.g., $2000 - $3000/month)');
                                                    }
                                                    if (salary_range && salary_range.length > 50) {
                                                        errors.push('Salary Range must be less than 50 characters');
                                                    }

                                                    // Validate Description (10-2000 chars)
                                                    const descError = validateTextField(description, 'Job Description', 10, 2000);
                                                    if (descError) errors.push(descError);

                                                    // Validate Vacancies (1-1000)
                                                    if (vacancies < 1 || vacancies > 1000) {
                                                        errors.push('Number of vacancies must be between 1 and 1000');
                                                    }

                                                    // If there are validation errors, show them and stop
                                                    if (errors.length > 0) {
                                                        alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
                                                        return;
                                                    }

                                                    // ========== SUBMIT THE REQUEST ==========
                                                    const response = await fetch('http://localhost:5000/api/job-requests', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            agent_id: user.id,
                                                            agent_name: sanitizeInput(user.name || user.full_name || ''),
                                                            agent_email: user.email || '',
                                                            agency_name: sanitizeInput(user.agency_name || ''),
                                                            title,
                                                            company,
                                                            location,
                                                            category,
                                                            salary_range,
                                                            description,
                                                            requirements: requirementsArray,
                                                            vacancies
                                                        })
                                                    });

                                                    if (!response.ok) {
                                                        const errorData = await response.json();
                                                        throw new Error(errorData.message || 'Failed to submit request');
                                                    }

                                                    alert("Job Request Submitted Successfully! Awaiting admin approval.");
                                                    setShowJobRequestForm(false);

                                                    // Refresh list
                                                    const refreshResponse = await fetch(`http://localhost:5000/api/job-requests/agent/${user.id}`);
                                                    const data = await refreshResponse.json();
                                                    if (data) setJobRequests(data);

                                                } catch (err) {
                                                    console.error("Submission Error:", err);
                                                    alert("Error submitting request: " + err.message);
                                                }
                                            }}>
                                                {/* Row 1: Job Title & Company */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title * <span className="text-slate-400 font-normal">(2-100 chars)</span></label>
                                                        <input
                                                            name="title"
                                                            required
                                                            type="text"
                                                            placeholder="e.g. Senior Sous Chef"
                                                            minLength={2}
                                                            maxLength={100}
                                                            pattern="^[a-zA-Z0-9\s\-\.,&'()]+$"
                                                            title="Only letters, numbers, spaces, and basic punctuation allowed"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name * <span className="text-slate-400 font-normal">(2-100 chars)</span></label>
                                                        <input
                                                            name="company"
                                                            required
                                                            type="text"
                                                            placeholder="e.g. Grand Resort Maldives"
                                                            minLength={2}
                                                            maxLength={100}
                                                            pattern="^[a-zA-Z0-9\s\-\.,&'()]+$"
                                                            title="Only letters, numbers, spaces, and basic punctuation allowed"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Row 2: Location & Category */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location * <span className="text-slate-400 font-normal">(2-100 chars)</span></label>
                                                        <input
                                                            name="location"
                                                            required
                                                            type="text"
                                                            placeholder="e.g. Male, Maldives"
                                                            minLength={2}
                                                            maxLength={100}
                                                            pattern="^[a-zA-Z0-9\s\-\.,&'()]+$"
                                                            title="Only letters, numbers, spaces, and basic punctuation allowed"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category *</label>
                                                        <select name="category" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none">
                                                            <option value="">Select Category</option>
                                                            <option value="Hospitality">Hospitality</option>
                                                            <option value="Construction">Construction</option>
                                                            <option value="Healthcare">Healthcare</option>
                                                            <option value="IT">IT</option>
                                                            <option value="Education">Education</option>
                                                            <option value="Retail">Retail</option>
                                                            <option value="Manufacturing">Manufacturing</option>
                                                            <option value="Tourism">Tourism</option>
                                                            <option value="Fishing">Fishing</option>
                                                            <option value="Agriculture">Agriculture</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Row 3: Salary Range & Vacancies */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary Range <span className="text-slate-400 font-normal">(e.g. $2000-$3000)</span></label>
                                                        <input
                                                            name="salary_range"
                                                            type="text"
                                                            placeholder="e.g. $2000 - $3000/month"
                                                            maxLength={50}
                                                            pattern="^[\d\s$€£,.\-\/a-zA-Z]*$"
                                                            title="Only numbers, currency symbols ($€£), and basic text allowed"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of Vacancies * <span className="text-slate-400 font-normal">(1-1000)</span></label>
                                                        <input
                                                            name="vacancies"
                                                            required
                                                            type="number"
                                                            min="1"
                                                            max="1000"
                                                            defaultValue="1"
                                                            placeholder="e.g. 5"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description * <span className="text-slate-400 font-normal">(10-2000 chars)</span></label>
                                                    <textarea
                                                        name="description"
                                                        required
                                                        rows={4}
                                                        minLength={10}
                                                        maxLength={2000}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none"
                                                        placeholder="Describe the role responsibilities, duties, and expectations..."
                                                    ></textarea>
                                                </div>

                                                {/* Requirements */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements (one per line) <span className="text-slate-400 font-normal">(max 200 chars each)</span></label>
                                                    <textarea
                                                        name="requirements"
                                                        rows={3}
                                                        maxLength={1000}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none"
                                                        placeholder="e.g.&#10;3+ years experience&#10;Valid food safety certificate&#10;Fluent in English"
                                                    ></textarea>
                                                </div>

                                                {/* Submit Buttons */}
                                                <div className="pt-4 border-t border-slate-100 flex gap-4">
                                                    <button type="button" onClick={() => setShowJobRequestForm(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-slate-50 transition-all">Cancel</button>
                                                    <button type="submit" className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">Submit Request</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'vacancies' ? (
                            /* TAB CONTENT: ACTIVE VACANCIES - HIERARCHICAL NAVIGATION */
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* LEVEL 1: CATEGORIES VIEW */}
                                {vacancyView === 'categories' && (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse by Category</h2>
                                                <p className="text-slate-500 font-medium text-sm mt-1">Select a category to view available vacancies</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {JOB_CATEGORIES.map((category) => {
                                                const jobCount = jobs.filter(j => j.category === category).length;
                                                return (
                                                    <button
                                                        key={category}
                                                        onClick={() => handleSelectCategory(category)}
                                                        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-300 transition-all group text-left"
                                                    >
                                                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                                                            <Briefcase className="w-6 h-6 text-teal-600" />
                                                        </div>
                                                        <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">{category}</h3>
                                                        <p className="text-xs font-medium text-slate-500 mt-1">{jobCount} {jobCount === 1 ? 'vacancy' : 'vacancies'}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* LEVEL 2: JOBS BY CATEGORY VIEW */}
                                {vacancyView === 'jobs' && (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={handleVacancyBack}
                                                    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm"
                                                >
                                                    <ArrowRight className="w-5 h-5 rotate-180" />
                                                </button>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedCategory} Jobs</h2>
                                                    <p className="text-slate-500 font-medium text-sm mt-1">{filteredJobsByCategory.length} vacancies available</p>
                                                </div>
                                            </div>
                                        </div>

                                        {filteredJobsByCategory.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                                                <h3 className="text-slate-900 font-bold text-lg">No Jobs in {selectedCategory}</h3>
                                                <p className="text-slate-500 text-sm mt-1">Check back later for new opportunities.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {filteredJobsByCategory.map((job) => (
                                                    <div
                                                        key={job._id || job.id}
                                                        onClick={() => handleSelectVacancyJob(job)}
                                                        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-200 transition-all group flex flex-col relative overflow-hidden cursor-pointer"
                                                    >
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                                                        <div className="flex justify-between items-start mb-4 pl-2">
                                                            <div>
                                                                <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-teal-700 transition-colors">{job.title}</h3>
                                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{job.company}</p>
                                                            </div>
                                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
                                                                <BriefcaseIcon className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 pl-2">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="text-xs font-medium text-slate-600">{job.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Award className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="text-xs font-medium text-slate-600">{job.salary_range || 'Competitive'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto pl-2">
                                                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">View Details →</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* LEVEL 3: JOB DETAIL VIEW */}
                                {vacancyView === 'jobDetail' && selectedVacancyJob && (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={handleVacancyBack}
                                                    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm"
                                                >
                                                    <ArrowRight className="w-5 h-5 rotate-180" />
                                                </button>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedVacancyJob.title}</h2>
                                                    <p className="text-slate-500 font-medium text-sm mt-1">{selectedVacancyJob.company} • {selectedVacancyJob.location}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleOpenSubmission(selectedVacancyJob)}
                                                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg hover:bg-teal-700 transition-all flex items-center gap-2"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                                Submit Candidate
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Job Info Card */}
                                            <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Job Details</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Category</p>
                                                        <p className="text-sm font-semibold text-slate-900">{selectedVacancyJob.category}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Salary Range</p>
                                                        <p className="text-sm font-semibold text-teal-600">{selectedVacancyJob.salary_range || 'Competitive'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Description</p>
                                                        <p className="text-sm text-slate-600 leading-relaxed mt-1">{selectedVacancyJob.description || 'No description available.'}</p>
                                                    </div>
                                                    {selectedVacancyJob.requirements && selectedVacancyJob.requirements.length > 0 && (
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Requirements</p>
                                                            <ul className="text-sm text-slate-600 space-y-1">
                                                                {selectedVacancyJob.requirements.map((req, i) => (
                                                                    <li key={i} className="flex items-start gap-2">
                                                                        <span className="text-teal-500 mt-1">•</span>
                                                                        <span>{req}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* My Submitted Candidates Card */}
                                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-teal-600" />
                                                        My Submitted Candidates ({agentJobApplications.length})
                                                    </h3>
                                                </div>

                                                {isLoadingAgentApps ? (
                                                    <div className="p-12 flex items-center justify-center">
                                                        <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                                                    </div>
                                                ) : agentJobApplications.length === 0 ? (
                                                    <div className="p-12 text-center">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Users className="w-8 h-8 text-slate-300" />
                                                        </div>
                                                        <h4 className="text-slate-900 font-bold text-sm mb-1">No Candidates Submitted Yet</h4>
                                                        <p className="text-slate-500 text-xs">Click "Submit Candidate" to add your first candidate for this job.</p>
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left">
                                                            <thead className="bg-slate-50">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                                                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {agentJobApplications.map((app) => (
                                                                    <tr key={app._id || app.id} className="hover:bg-slate-50/50 transition-colors">
                                                                        <td className="px-6 py-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold border border-teal-100 uppercase">
                                                                                    {(app.candidate_name || '?').charAt(0)}
                                                                                </div>
                                                                                <span className="font-semibold text-slate-900 text-sm">{app.candidate_name}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="text-sm text-slate-600">{app.email}</div>
                                                                            <div className="text-xs text-slate-400">{app.contact_number}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <span className="text-sm text-slate-600">{new Date(app.applied_at).toLocaleDateString()}</span>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-center">
                                                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                                                ${app.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                                                                                ${app.status === 'APPROVED' || app.status === 'SELECTED' ? 'bg-teal-50 text-teal-700 border border-teal-100' : ''}
                                                                                ${app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-100' : ''}
                                                                            `}>
                                                                                {app.status}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                        ) : activeTab === 'overview' ? (
                            /* PARTNER OVERVIEW (EXISTING) */
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {/* Welcome Header */}
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Partner'}.</h2>
                                        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your candidates today.</p>
                                    </div>
                                    <div className="text-right">
                                        {/* Date removed as requested */}
                                    </div>
                                </div>

                                {/* Metrics Grid (Larger & Cleaner) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Candidates</p>
                                                <h3 className="text-4xl font-black text-slate-900 mt-3">{pipelineData.length}</h3>
                                            </div>
                                            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                                                <Users className="w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Selected</p>
                                                <h3 className="text-4xl font-black text-slate-900 mt-3">
                                                    {pipelineData.filter(app => app.status === ApplicationStatus.SELECTED).length}
                                                </h3>
                                            </div>
                                            <div className="p-4 bg-teal-50 rounded-2xl text-teal-600">
                                                <CheckCircle className="w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">In Waiting</p>
                                                <h3 className="text-4xl font-black text-slate-900 mt-3">
                                                    {pipelineData.filter(app => [ApplicationStatus.APPLIED, ApplicationStatus.PROCESSING, ApplicationStatus.INTERVIEW].includes(app.status)).length}
                                                </h3>
                                            </div>
                                            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
                                                <Clock className="w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Blacklisted</p>
                                                <h3 className="text-4xl font-black text-slate-900 mt-3">
                                                    {pipelineData.filter(app => app.status === ApplicationStatus.BLACKLISTED).length}
                                                </h3>
                                            </div>
                                            <div className="p-4 bg-red-50 rounded-2xl text-red-600">
                                                <Ban className="w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Profile Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-slate-50/50">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <User className="w-5 h-5 text-teal-600" /> My Account Details
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">Your registered agent information</p>
                                    </div>
                                    <div className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                                <p className="text-base font-semibold text-slate-900">{user?.name || 'Not Set'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                                <p className="text-base font-semibold text-slate-900">{user?.email || 'Not Set'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                                <p className="text-base font-semibold text-slate-900">{user?.contact_number || 'Not Set'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agency Name</label>
                                                <p className="text-base font-semibold text-teal-700">{user?.agency_name || 'Not Set'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recently Added Candidates (Space Filler) */}
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-900">Recently Added Candidates</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                                                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role Applied</th>
                                                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Current Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {pipelineData.slice(0, 5).map((app) => {
                                                    return (
                                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-8 py-5 font-medium text-slate-900">{app.candidate_name || app.candidateName}</td>
                                                            <td className="px-8 py-5 text-slate-600">{app.jobs?.title || 'Unknown Role'}</td>
                                                            <td className="px-8 py-5 text-right">
                                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                   ${app.status === ApplicationStatus.SELECTED ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                                                        app.status === ApplicationStatus.REJECTED ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                            app.status === ApplicationStatus.BLACKLISTED ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                                                                                'bg-amber-50 text-amber-700 border border-amber-100'
                                                                    }`}>
                                                                    {app.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {applications.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="px-8 py-12 text-center text-slate-400">No recent activity</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Recent Activity Feed */}
                            </div>
                        ) : activeTab === 'settings' ? (
                            /* SETTINGS TAB - PASSWORD RESET */
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
                                        <p className="text-slate-500 font-medium text-sm mt-1">Manage your account security and preferences</p>
                                    </div>
                                </div>

                                {/* Password Reset Card */}
                                <div className="max-w-xl">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-slate-50/50">
                                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                <Key className="w-5 h-5 text-teal-600" /> Change Password
                                            </h3>
                                            <p className="text-slate-500 text-sm mt-1">Update your account password for security</p>
                                        </div>
                                        <div className="p-8">
                                            <form onSubmit={handlePasswordReset} className="space-y-6">
                                                {/* Error Message */}
                                                {passwordError && (
                                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        {passwordError}
                                                    </div>
                                                )}

                                                {/* Success Message */}
                                                {passwordSuccess && (
                                                    <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        {passwordSuccess}
                                                    </div>
                                                )}

                                                {/* Current Password */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showOldPassword ? 'text' : 'password'}
                                                            value={passwordData.oldPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                                            placeholder="Enter your current password"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pr-12 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                        >
                                                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* New Password */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showNewPassword ? 'text' : 'password'}
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            placeholder="Enter new password (min 6 characters)"
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pr-12 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Confirm New Password */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        placeholder="Confirm your new password"
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                                                    />
                                                </div>

                                                {/* Submit Button */}
                                                <div className="pt-4 border-t border-slate-100">
                                                    <button
                                                        type="submit"
                                                        disabled={isResettingPassword}
                                                        className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {isResettingPassword ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                Updating Password...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Key className="w-4 h-4" />
                                                                Update Password
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'pipeline' ? (
                            /* PIPELINE TRACKING */
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pipeline & Status Tracking</h2>
                                        <p className="text-slate-500 font-medium text-sm mt-1">Real-time updates on your submitted candidates</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Search candidate or email..."
                                                className="bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-64 font-medium shadow-sm"
                                                value={pipelineSearchTerm}
                                                onChange={(e) => setPipelineSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active:</span>
                                            <span className="bg-teal-100 text-teal-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                {pipelineData.filter(app =>
                                                    (app.candidate_name || app.candidateName || '').toLowerCase().includes(pipelineSearchTerm.toLowerCase()) ||
                                                    (app.email || '').toLowerCase().includes(pipelineSearchTerm.toLowerCase())
                                                ).length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Company</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submission Date</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {pipelineData
                                                    .filter(app =>
                                                        (app.candidate_name || app.candidateName || '').toLowerCase().includes(pipelineSearchTerm.toLowerCase()) ||
                                                        (app.email || '').toLowerCase().includes(pipelineSearchTerm.toLowerCase())
                                                    )
                                                    .map((app) => {
                                                        return (
                                                            <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold border border-teal-100 uppercase">
                                                                            {(app.candidate_name || app.candidateName || '?').charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-slate-900 text-sm">{app.candidate_name || app.candidateName}</div>
                                                                            <div className="text-xs text-slate-500">{app.email}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="font-medium text-slate-900 text-sm">{app.jobs?.title || 'Unknown Role'}</div>
                                                                    <div className="text-xs text-slate-500">{app.jobs?.company || 'Unknown Company'}</div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-slate-600 font-medium">{new Date().toLocaleDateString()}</div>
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                                      ${app.status === ApplicationStatus.APPLIED ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}
                                                      ${app.status === ApplicationStatus.PROCESSING ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                                                      ${app.status === ApplicationStatus.INTERVIEW ? 'bg-purple-50 text-purple-700 border border-purple-100' : ''}
                                                      ${app.status === ApplicationStatus.SELECTED ? 'bg-teal-50 text-teal-700 border border-teal-100' : ''}
                                                      ${app.status === ApplicationStatus.REJECTED ? 'bg-red-50 text-red-700 border border-red-100' : ''}
                                                      ${app.status === ApplicationStatus.BLACKLISTED ? 'bg-slate-100 text-slate-500 border border-slate-200' : ''}
                                                   `}>
                                                                        {app.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                    )}
                                                {pipelineData.filter(app =>
                                                    (app.candidate_name || app.candidateName || '').toLowerCase().includes(pipelineSearchTerm.toLowerCase()) ||
                                                    (app.email || '').toLowerCase().includes(pipelineSearchTerm.toLowerCase())
                                                ).length === 0 && (
                                                        <tr>
                                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                                                                No candidates found matching "{pipelineSearchTerm}"
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : null
                        }
                    </div >
                </div >
            </main >

            {/* PARTNER SUBMISSION MODAL (Refined) */}
            {
                selectedJobForSubmission && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-md">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">New Candidate Submission</h2>
                                        <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mt-0.5">
                                            {selectedJobForSubmission.title} • <span className="text-slate-500">{selectedJobForSubmission.company}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedJobForSubmission(null)}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">

                                {/* Section 1: Identity */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                        <User className="w-4 h-4 text-teal-600" />
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Identity Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700">Candidate Full Name *</label>
                                            <input
                                                type="text"
                                                placeholder="As per passport"
                                                value={submissionData.name}
                                                onChange={e => setSubmissionData({ ...submissionData, name: e.target.value })}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                                            <input
                                                type="email"
                                                placeholder="email@candidate.com"
                                                value={submissionData.email}
                                                onChange={e => setSubmissionData({ ...submissionData, email: e.target.value })}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700">WhatsApp Number *</label>
                                            <input
                                                type="tel"
                                                placeholder="+CountrCode Number"
                                                value={submissionData.whatsapp}
                                                onChange={e => setSubmissionData({ ...submissionData, whatsapp: e.target.value })}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700">Nationality *</label>
                                            <input
                                                type="text"
                                                placeholder="Nationality"
                                                value={submissionData.nationality}
                                                onChange={e => setSubmissionData({ ...submissionData, nationality: e.target.value })}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Mandatory Documents */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                        <Shield className="w-4 h-4 text-teal-600" />
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Mandatory Document Bundle</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                        <FileUpload
                                            id="doc-resume"
                                            label="Resume / CV"
                                            required
                                            currentFile={submissionFiles.resume}
                                            onChange={(f) => setSubmissionFiles(prev => ({ ...prev, resume: f }))}
                                        />
                                        <FileUpload
                                            id="doc-passport"
                                            label="Passport / ID Copy"
                                            required
                                            currentFile={submissionFiles.identity}
                                            onChange={(f) => setSubmissionFiles(prev => ({ ...prev, identity: f }))}
                                        />
                                        <FileUpload
                                            id="doc-certs"
                                            label="Educational Certificates"
                                            required
                                            currentFile={submissionFiles.certs}
                                            onChange={(f) => setSubmissionFiles(prev => ({ ...prev, certs: f }))}
                                        />
                                    </div>
                                </div>

                                {/* Section 3: Compliance Documents */}
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Compliance & Governance</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                        <FileUpload
                                            id="doc-pcc"
                                            label="Police Clearance (PCC)"
                                            currentFile={submissionFiles.pcc}
                                            onChange={(f) => setSubmissionFiles(prev => ({ ...prev, pcc: f }))}
                                        />
                                        <FileUpload
                                            id="doc-goodstanding"
                                            label="Good Standing Certificate"
                                            currentFile={submissionFiles.goodStanding}
                                            onChange={(f) => setSubmissionFiles(prev => ({ ...prev, goodStanding: f }))}
                                        />
                                    </div>
                                </div>

                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-start gap-4">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs font-medium text-amber-800 leading-relaxed">
                                        <strong>Agency Compliance Declaration:</strong> By submitting this candidate, you certify that all uploaded documents have been verified against original copies and the candidate has been briefed on the Maldives employment terms.
                                    </p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-slate-200 bg-white flex items-center justify-end gap-4 z-10">
                                <button onClick={() => setSelectedJobForSubmission(null)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-slate-50 transition-all">Cancel</button>
                                <button onClick={handleConfirmSubmission} className="px-8 py-2.5 bg-teal-600 text-white font-bold uppercase text-xs tracking-wider rounded-lg shadow-lg hover:bg-teal-700 transition-all">Submit Candidate</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Internal Custom Scrollbar Style */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
      `}</style>
        </div >
    );
};

export default RecruiterDashboard;
