import API_BASE_URL from '../api/config.js';
import { usePopup } from '../context/PopupContext';
import React, { useState, useMemo, useEffect } from 'react';
import { ApplicationStatus, JobStatus } from '../types';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../constants';
import {
    Search, LayoutDashboard, Users, Briefcase,
    X, Shield, LogOut, Briefcase as BriefcaseIcon,
    Ban, PlusCircle, CheckCircle, CheckCircle2, RefreshCw, ArrowLeft,
    AlertTriangle, AlertCircle, Globe, ArrowRight, UserPlus,
    MapPin, Award, User,
    AlignLeft, ChevronDown, ShieldCheck,
    FilePlus, Clock, Settings, Key, Eye, EyeOff,
    Camera, Pencil, Phone, Save, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';

const RecruiterDashboard = () => {
    const popup = usePopup();
    const navigate = useNavigate();
    const { user, login, logout, updateUser, mockLogin } = useAuth();

    const [activeTab, setActiveTab] = useState('overview');
    const [applications, setApplications] = useState(MOCK_APPLICATIONS || []);
    // Delete Account State
    const [showDeleteAccountModal, setShowDeleteAccountModal] = React.useState(false);
    const [deleteConfirmInput, setDeleteConfirmInput] = React.useState('');
    const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);

    const handleDeleteOwnAccount = async () => {
        if (!user?.id || deleteConfirmInput !== user?.email) return;
        setIsDeletingAccount(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/profile/${user.id}/delete-account`, { 
                method: 'DELETE',
                headers: {
                    ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
                    'x-requested-with': 'XMLHttpRequest'
                }
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.message || 'Failed to delete account');
            }
            logout();
            navigate('/agent-login');
        } catch (err) {
            console.error('Delete account failed:', err);
            popup.error(err.message || 'Failed to delete account. Please try again.');
            setIsDeletingAccount(false);
        }
    };

    const [submissionData, setSubmissionData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        nationality: ''
    });

    // --- REAL DATA FETCHER ---
    const [pipelineData, setPipelineData] = useState([]);
    const [isRefreshingPipeline, setIsRefreshingPipeline] = useState(false);

    // Named function so it can be reused by Refresh button
    const fetchPipeline = async () => {
        if (!user?.id) return;
        setIsRefreshingPipeline(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/applications/agent/${user.id}/all`, {
                headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPipelineData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching pipeline:", error);
            setPipelineData([]);
        } finally {
            setIsRefreshingPipeline(false);
        }
    };

    // Fetch on mount and when user changes
    useEffect(() => {
        fetchPipeline();
    }, [user?.id]);
    // -------------------------
    const [jobs, setJobs] = useState([]);

    // FETCH REAL JOBS
    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/jobs`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const openJobs = (Array.isArray(data) ? data : []).filter(j => j?.status === 'OPEN');
            setJobs(openJobs);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setJobs([]);
        }
    };

    useEffect(() => {
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

    const [jobRequests, setJobRequests] = useState([]);

    // FETCH REAL JOB REQUESTS
    useEffect(() => {
        if (!user?.id) return;
        const fetchRequests = async () => {
            try {
                // CHANGED: Use the path parameter endpoint as requested
                const response = await fetch(`${API_BASE_URL}/api/job-requests/agent/${user.id}`, {
                    headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data) setJobRequests(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching job requests:", error);
                setJobRequests([]);
            }
        };
        fetchRequests();
    }, [user?.id]);

    const [showJobRequestForm, setShowJobRequestForm] = useState(false);
    const [jobRequestSearchTerm, setJobRequestSearchTerm] = useState('');
    const [expandedJobRequestId, setExpandedJobRequestId] = useState(null);

    // Agent Profile Photo State
    const [agentAvatarPreview, setAgentAvatarPreview] = useState(user?.avatar || null);
    const [isUploadingAgentAvatar, setIsUploadingAgentAvatar] = useState(false);
    const agentAvatarInputRef = React.useRef(null);

    // Phone Edit State
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [editPhoneValue, setEditPhoneValue] = useState(user?.contact_number || user?.phone || '');
    const [isSavingPhone, setIsSavingPhone] = useState(false);

    // Sync agentAvatarPreview and editPhoneValue when user loads
    React.useEffect(() => {
        setAgentAvatarPreview(user?.avatar || null);
        setEditPhoneValue(user?.contact_number || user?.phone || '');
    }, [user?.avatar, user?.contact_number]);

    const handleAgentAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.id) return;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) { popup.warning('Please select a JPG, PNG, or WEBP image.'); return; }
        if (file.size > 5 * 1024 * 1024) { popup.warning('Image must be smaller than 5MB.'); return; }
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            setIsUploadingAgentAvatar(true);
            const res = await fetch(`${API_BASE_URL}/api/profile/${user.id}/avatar`, { 
                method: 'POST', 
                headers: {
                    ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
                    'x-requested-with': 'XMLHttpRequest'
                },
                body: formData 
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');
            setAgentAvatarPreview(data.avatar);
            if (updateUser) updateUser({ avatar: data.avatar });
        } catch (err) {
            console.error('Avatar upload error:', err);
            popup.error(`Failed to update photo: ${err.message}`);
        } finally {
            setIsUploadingAgentAvatar(false);
            if (agentAvatarInputRef.current) agentAvatarInputRef.current.value = '';
        }
    };

    const handlePhoneSave = async () => {
        if (!user?.id) return;
        setIsSavingPhone(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/profile/${user.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
                    'x-requested-with': 'XMLHttpRequest'
                },
                body: JSON.stringify({ contact_number: editPhoneValue })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save');
            if (updateUser) updateUser({ contact_number: editPhoneValue, phone: editPhoneValue });
            setIsEditingPhone(false);
        } catch (err) {
            console.error('Phone save error:', err);
            popup.error(`Failed to save phone: ${err.message}`);
        } finally {
            setIsSavingPhone(false);
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

        // Validate new password to match backend requirements exactly
        const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
        const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
        const hasNumber = /[0-9]/.test(passwordData.newPassword);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/.test(passwordData.newPassword);
        if (
            passwordData.newPassword.length < 6 ||
            !hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol
        ) {
            setPasswordError('Password must be at least 6 characters and include an uppercase letter, a lowercase letter, a number, and a special character (e.g. !, @, #)');
            return;
        }

        setIsResettingPassword(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user?.email || '',
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
            setPasswordError(err.message || 'An error occurred');
        } finally {
            setIsResettingPassword(false);
        }
    };

    const filteredJobs = useMemo(() => {
        return (Array.isArray(jobs) ? jobs : []).filter(j =>
            j &&
            (j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                j.company?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [jobs, searchTerm]);

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
        if (!selectedJobForSubmission) {
            popup.warning("No job selected for submission.");
            return;
        }

        if (!submissionFiles.resume || !submissionFiles.identity || !submissionFiles.certs) {
            popup.warning("Please upload all mandatory documents (Resume, ID/Passport, Certificates).");
            return;
        }

        if (!submissionData.name || !submissionData.email || !submissionData.whatsapp || !submissionData.nationality) {
            popup.warning("Please fill in all identity details (Name, Email, Phone, Nationality).");
            return;
        }

        if (/[^A-Za-z\s]/.test(submissionData.name)) {
            popup.warning("Candidate Name must contain only letters and spaces.");
            return;
        }

        const phoneDigits = submissionData.whatsapp.replace(/[^\d+]/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            popup.warning("WhatsApp Number must be exactly 10 or 11 digits.");
            return;
        }

        if (!['Indian', 'Maldivian', 'Maldives'].includes(submissionData.nationality)) {
            popup.warning("Please select a valid Nationality from the drop down.");
            return;
        }

        if (!user?.id) {
            popup.error("User not authenticated. Please log in again.");
            return;
        }

        try {
            // Create FormData for file upload
            const formDataPayload = new FormData();
            formDataPayload.append('agent_id', user.id);
            formDataPayload.append('job_id', selectedJobForSubmission.id || selectedJobForSubmission._id || '');
            formDataPayload.append('name', submissionData.name);
            formDataPayload.append('email', submissionData.email);
            formDataPayload.append('contact', submissionData.whatsapp);
            formDataPayload.append('nationality', submissionData.nationality);
            formDataPayload.append('resume', submissionFiles.resume);
            if (submissionFiles.identity) formDataPayload.append('identity', submissionFiles.identity);
            if (submissionFiles.certs) formDataPayload.append('certs', submissionFiles.certs);
            if (submissionFiles.pcc) formDataPayload.append('pcc', submissionFiles.pcc);
            if (submissionFiles.goodStanding) formDataPayload.append('goodStanding', submissionFiles.goodStanding);

            const response = await fetch(`${API_BASE_URL}/api/applications`, {
                method: 'POST',
                headers: {
                    ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
                    'x-requested-with': 'XMLHttpRequest'
                },
                body: formDataPayload,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Submission failed');
            }

            popup.success("Success! Candidate Submitted to Database.");
            setSelectedJobForSubmission(null);

            // Refresh Pipeline using the top-level fetchPipeline
            fetchPipeline();

        } catch (err) {
            console.error("Submission Error:", err);
            popup.error("Error: " + (err.message || 'An error occurred during submission'));
        }
    };

    // --- AGENT PROFILE FETCHER ---
    const [agentProfile, setAgentProfile] = useState(null);
    useEffect(() => {
        if (!user?.id) return;

        const fetchAgentProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/agents/${user.id}`);
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

    // FIXED: Added null checks for user object
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-lg text-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-3">Authentication Error</h1>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        You are not logged in. Please sign in to access the dashboard.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

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
                                {agentProfile?.company_name || user?.agency_name || "GlobalTalent"}
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
                        onClick={() => setActiveTab('blocked')}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all ${activeTab === 'blocked'
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
                                {showJobRequestForm ? (
                                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
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

                                        <div className="bg-white rounded-2xl border border-slate-300 shadow-md ring-1 ring-slate-200 p-8">
                                            <form className="space-y-8" onSubmit={async (e) => {
                                                e.preventDefault();
                                                if (!user?.id) {
                                                    popup.error("Session expired. Please log in again.");
                                                    return;
                                                }
                                                try {
                                                    const formData = new FormData(e.target);
                                                    const payload = {
                                                        agent_id: user.id,
                                                        agent_name: user.full_name || user.name || '', // Required by model
                                                        agent_email: user.email || '', // Required by model
                                                        agency_name: user.agency_name || '',
                                                        title: formData.get('title') || '',
                                                        company: formData.get('company') || '',
                                                        location: formData.get('location') || '',
                                                        category: formData.get('category') || '',
                                                        salary_range: formData.get('salary_range') || '',
                                                        description: formData.get('description') || '',
                                                        requirements: (formData.get('requirements') || '').split('\n').filter(r => r.trim()),
                                                        vacancies: Number(formData.get('vacancies')) || 1,
                                                        education: formData.get('education') || '',
                                                        experience: formData.get('experience') || ''
                                                    };

                                                    const response = await fetch(`${API_BASE_URL}/api/job-requests`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
                                                            'x-requested-with': 'XMLHttpRequest'
                                                        },
                                                        body: JSON.stringify(payload)
                                                    });

                                                    const resData = await response.json();

                                                    if (!response.ok) throw new Error(resData.message || 'Failed to submit request');

                                                    popup.success("Job Request Submitted to Admin! Status: Waiting approval.");
                                                    setShowJobRequestForm(false);

                                                    // Refresh list
                                                    const refreshResponse = await fetch(`${API_BASE_URL}/api/job-requests/agent/${user.id}`, {
                                                        headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
                                                    });
                                                    const data = await refreshResponse.json();
                                                    if (data) setJobRequests(Array.isArray(data) ? data : []);

                                                } catch (err) {
                                                    console.error("Submission Error:", err);
                                                    popup.error("Error submitting request: " + (err.message || 'An error occurred'));
                                                }
                                            }}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title <span className="text-red-500">*</span></label>
                                                        <input name="title" required type="text" placeholder="e.g. Senior Sous Chef" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                                                        <input name="company" required type="text" placeholder="e.g. Maldives Resorts Ltd" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <select
                                                                name="category"
                                                                required
                                                                defaultValue=""
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none invalid:text-slate-400"
                                                            >
                                                                <option value="" disabled className="text-slate-400">-- Select Category --</option>
                                                                {['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'].map(cat => (
                                                                    <option key={cat} value={cat} className="text-slate-700">{cat}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location <span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <select
                                                                name="location"
                                                                required
                                                                defaultValue=""
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none invalid:text-slate-400"
                                                            >
                                                                <option value="" disabled className="text-slate-400">-- Select Location --</option>
                                                                {['Malé', 'Hulhumalé', 'Villingili', 'Haa Alif', 'Haa Dhaalu', 'Shaviyani', 'Noonu', 'Raa', 'Baa', 'Lhaviyani', 'Kaafu', 'Alif Alif', 'Alif Dhaalu', 'Vaavu', 'Meemu', 'Faafu', 'Dhaalu', 'Thaa', 'Laamu', 'Gaafu Alif', 'Gaafu Dhaalu', 'Gnaviyani', 'Seenu'].map(loc => (
                                                                    <option key={loc} value={loc} className="text-slate-700">{loc}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary Range</label>
                                                        <input name="salary_range" type="text" placeholder="e.g. $2000 - $3000/month" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vacancies</label>
                                                        <input name="vacancies" type="number" min="1" placeholder="e.g. 1" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Education</label>
                                                        <div className="relative">
                                                            <select
                                                                name="education"
                                                                required
                                                                defaultValue=""
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none invalid:text-slate-400"
                                                            >
                                                                <option value="" disabled className="text-slate-400">-- Select Education --</option>
                                                                {['O-Level / Secondary School', 'A-Level / Higher Secondary', 'Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor’s Degree', 'Master’s Degree', 'Doctorate / PhD'].map(edu => (
                                                                    <option key={edu} value={edu} className="text-slate-700">{edu}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</label>
                                                        <div className="relative">
                                                            <select
                                                                name="experience"
                                                                required
                                                                defaultValue=""
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none invalid:text-slate-400"
                                                            >
                                                                <option value="" disabled className="text-slate-400">-- Select Experience --</option>
                                                                {['Any Experience', 'No Experience', '1 – 2 Years', '3 – 5 Years', '6 – 10 Years', '10+ Years'].map(exp => (
                                                                    <option key={exp} value={exp} className="text-slate-700">{exp}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description <span className="text-red-500">*</span></label>
                                                    <textarea name="description" required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none" placeholder="Describe the role responsibilities..."></textarea>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements</label>
                                                    <textarea name="requirements" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none" placeholder="List key requirements (one per line)..."></textarea>
                                                </div>

                                                <div className="pt-4 border-t border-slate-100 flex gap-4">
                                                    <button type="button" onClick={() => setShowJobRequestForm(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-slate-50 transition-all">Cancel</button>
                                                    <button type="submit" className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all">Submit Request</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
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
                                                    onClick={() => setShowJobRequestForm(true)}
                                                    className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm"
                                                >
                                                    <PlusCircle className="w-4 h-4" /> New Request
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {jobRequests.length === 0 ? (
                                                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                                                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                                                        <FilePlus className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-slate-900 font-bold text-sm mb-1">No Requests Found</h3>
                                                    <p className="text-slate-500 text-xs max-w-xs mx-auto">Try adjusting your search terms or submit a new request.</p>
                                                </div>
                                            ) : (
                                                jobRequests
                                                    .filter(req => req?.title?.toLowerCase().includes(jobRequestSearchTerm.toLowerCase()))
                                                    .map((req) => (
                                                        <div
                                                            key={req.id || req._id}
                                                            onClick={() => {
                                                                const isExpanding = expandedJobRequestId !== (req.id || req._id);
                                                                setExpandedJobRequestId(isExpanding ? (req.id || req._id) : null);
                                                                if (isExpanding) {
                                                                    setTimeout(() => {
                                                                        document.getElementById(`status-block-${req.id || req._id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                                                    }, 350);
                                                                }
                                                            }}
                                                            className={`bg-white rounded-xl border transition-all cursor-pointer group overflow-hidden ${expandedJobRequestId === req.id
                                                                ? 'border-teal-200 shadow-md ring-1 ring-teal-500/10'
                                                                : 'border-slate-200 shadow-sm hover:shadow-md hover:border-teal-100'
                                                                }`}
                                                        >
                                                            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{req.category || 'Uncategorized'}</span>
                                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.status === 'APPROVED' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                                            req.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                                'bg-amber-50 text-amber-700 border-amber-100'
                                                                            }`}>
                                                                            {req.status === 'PENDING' ? 'WAITING APPROVAL' : req.status || 'UNKNOWN'}
                                                                        </span>
                                                                    </div>
                                                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">{req.title || 'Untitled Request'}</h3>
                                                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                                                        <span>{req.company || 'No company specified'}</span>
                                                                        <span>•</span>
                                                                        <span>{req.vacancies || 0} Vacancies</span>
                                                                        <span>•</span>
                                                                        <span>{req.salary_range || 'Not specified'}</span>
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
                                                                                <ul className="text-sm text-slate-600 leading-relaxed font-medium list-disc pl-4 space-y-1">
                                                                                    {req.requirements && Array.isArray(req.requirements) && req.requirements.length > 0 ? (
                                                                                        req.requirements.map((r, i) => <li key={i}>{r}</li>)
                                                                                    ) : (
                                                                                        <li>No specific requirements listed.</li>
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {req.status === 'REJECTED' && req.review_notes && (
                                                                            <div id={`status-block-${req.id || req._id}`} className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                                                                                <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                                    <AlertCircle className="w-4 h-4 text-red-600" /> Rejection Reason
                                                                                </h4>
                                                                                <p className="text-sm text-red-700 font-medium whitespace-pre-wrap">{req.review_notes}</p>
                                                                            </div>
                                                                        )}

                                                                        {req.status === 'APPROVED' && (
                                                                            <div id={`status-block-${req.id || req._id}`} className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                                                                                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Request Approved
                                                                                </h4>
                                                                                <p className="text-sm text-emerald-700 font-medium">This job request has been approved and is now live. Candidates can now apply to it.</p>
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
                                )}
                            </div>
                        ) : activeTab === 'vacancies' ? (
                            /* TAB CONTENT: ACTIVE VACANCIES - CATEGORIZED VIEW */
                            (() => {
                                const allCats = ['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other'];
                                const jobsByCategory = {};
                                allCats.forEach(cat => {
                                    jobsByCategory[cat] = (Array.isArray(jobs) ? jobs : []).filter(j =>
                                        (j.industry || j.category || 'Other') === cat
                                    );
                                });
                                const catSearch = searchTerm?.startsWith('__cat__') ? searchTerm.replace('__cat__', '') : null;
                                const isCatView = !searchTerm;
                                const isSearchView = searchTerm && !catSearch;
                                return (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                {catSearch ? (
                                                    <><button onClick={() => setSearchTerm('')} className="text-xs font-bold text-teal-600 hover:text-teal-800 mb-1 flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> All Categories</button>
                                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{catSearch}</h2>
                                                        <p className="text-slate-500 font-medium text-sm mt-1">{jobsByCategory[catSearch]?.length || 0} open positions</p></>
                                                ) : (
                                                    <><h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Vacancies</h2>
                                                        <p className="text-slate-500 font-medium text-sm mt-1">Browse open positions by industry</p></>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const res = await fetch(`${API_BASE_URL}/api/jobs`);
                                                            const data = await res.json();
                                                            const openJobs = (Array.isArray(data) ? data : []).filter(j => j?.status === 'OPEN');
                                                            setJobs(openJobs);
                                                            popup.success(`Refreshed! ${openJobs.length} open positions available.`);
                                                        } catch (err) { popup.error('Failed to refresh jobs.'); }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
                                                >
                                                    <RefreshCw className="w-4 h-4" /> Refresh
                                                </button>
                                                {!catSearch && (
                                                    <div className="relative group">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                                        <input type="text" placeholder="Search vacancies..." className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-full md:w-[240px] font-medium shadow-sm" value={isSearchView ? searchTerm : ''} onChange={(e) => setSearchTerm(e.target.value)} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {catSearch ? (
                                            /* CATEGORY DRILL DOWN - list all jobs in this category */
                                            jobsByCategory[catSearch]?.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                    <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                                                    <h3 className="text-slate-900 font-bold text-lg">No {catSearch} Jobs Available</h3>
                                                    <p className="text-slate-500 text-sm mt-1">Check back later or refresh for updates.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                    {(jobsByCategory[catSearch] || []).map((job) => (
                                                        <div key={job.id || job._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-200 transition-all group flex flex-col relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                                                            <div className="flex justify-between items-start mb-4 pl-2">
                                                                <div>
                                                                    <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-teal-700 transition-colors">{job.title || 'Untitled'}</h3>
                                                                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mt-1">{job.company || 'Unknown Company'}</p>
                                                                </div>                                                            </div>
                                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 pl-2">
                                                                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs font-medium text-slate-600">{job.location || 'Maldives'}</span></div>
                                                                <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs font-medium text-slate-600">{job.experience || 'N/A'} Exp</span></div>
                                                            </div>
                                                            <div className="mt-auto pl-2">
                                                                <button onClick={() => handleOpenSubmission(job)} className="w-full bg-slate-900 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-teal-700 transition-all">
                                                                    <UserPlus className="w-4 h-4" /> Submit Candidate
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        ) : isSearchView ? (
                                            /* KEYWORD SEARCH MODE */
                                            filteredJobs.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                    <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                                                    <h3 className="text-slate-900 font-bold text-lg">No results for "{searchTerm}"</h3>
                                                    <button onClick={() => setSearchTerm('')} className="mt-4 text-sm text-teal-600 hover:text-teal-800 font-semibold">Clear search</button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                    {filteredJobs.map((job) => (
                                                        <div key={job.id || job._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-200 transition-all group flex flex-col relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                                                            <div className="flex justify-between items-start mb-4 pl-2">
                                                                <div>
                                                                    <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-teal-700 transition-colors">{job.title || 'Untitled'}</h3>
                                                                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mt-1">{job.company || 'Unknown Company'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 pl-2">
                                                                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs font-medium text-slate-600">{job.location || 'Maldives'}</span></div>
                                                                <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs font-medium text-slate-600">{job.experience || 'N/A'} Exp</span></div>
                                                            </div>
                                                            <div className="mt-auto pl-2">
                                                                <button onClick={() => handleOpenSubmission(job)} className="w-full bg-slate-900 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-teal-700 transition-all">
                                                                    <UserPlus className="w-4 h-4" /> Submit Candidate
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        ) : (
                                            /* CATEGORY TILE VIEW - main view */
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {allCats.map(cat => {
                                                    const catJobs = jobsByCategory[cat] || [];
                                                    return (
                                                        <div key={cat} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all overflow-hidden group cursor-pointer" onClick={() => setSearchTerm(`__cat__${cat}`)}>
                                                            <div className="p-6 flex items-start justify-between">
                                                                <div>                                                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">{cat}</h3>
                                                                    <p className={`text-sm font-semibold mt-1 ${catJobs.length > 0 ? 'text-teal-600' : 'text-slate-400'}`}>{catJobs.length} Active Job{catJobs.length !== 1 ? 's' : ''}</p>
                                                                </div>
                                                                <div className={`p-3 rounded-xl transition-colors ${catJobs.length > 0 ? 'bg-teal-50 text-teal-600 group-hover:bg-teal-100' : 'bg-slate-50 text-slate-300'}`}>
                                                                    <Briefcase className="w-6 h-6" />
                                                                </div>
                                                            </div>
                                                            {catJobs.length > 0 && (
                                                                <div className="border-t border-slate-100 divide-y divide-slate-50">
                                                                    {catJobs.slice(0, 2).map(job => (
                                                                        <div key={job.id || job._id} className="px-6 py-3 flex items-center justify-between hover:bg-teal-50/50 transition-colors" onClick={(e) => { e.stopPropagation(); handleOpenSubmission(job); }}>
                                                                            <div className="min-w-0 pr-2">
                                                                                <p className="text-sm font-semibold text-slate-800 truncate">{job.title}</p>
                                                                                <p className="text-xs text-slate-400 truncate">{job.company} • {job.location}</p>
                                                                            </div>
                                                                            <button className="flex-shrink-0 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-teal-600 transition-colors">Submit</button>
                                                                        </div>
                                                                    ))}
                                                                    {catJobs.length > 2 && (
                                                                        <div className="px-6 py-3 text-xs font-bold text-teal-600">+{catJobs.length - 2} more</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
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
                                                    {pipelineData.filter(app => ['SELECTED', 'APPROVED', 'ACCEPTED'].includes(app.status)).length}
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
                                                    {pipelineData.filter(app => ['PENDING', 'REVIEWING', 'HOLD'].includes(app.status)).length}
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
                                                    {pipelineData.filter(app => app.status === 'REJECTED').length}
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
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            {/* Profile Photo Section */}
                                            <div className="flex flex-col items-center gap-3 flex-shrink-0">
                                                <div className="relative group">
                                                    <div
                                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-teal-500 to-slate-700 flex items-center justify-center cursor-pointer"
                                                        onClick={() => agentAvatarInputRef.current?.click()}
                                                    >
                                                        {agentAvatarPreview
                                                            ? <img src={agentAvatarPreview} alt="Agent" className="w-full h-full object-cover" />
                                                            : <span className="text-2xl font-black text-white">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
                                                        }
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => agentAvatarInputRef.current?.click()}
                                                        disabled={isUploadingAgentAvatar}
                                                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center shadow-md transition-all border-2 border-white disabled:opacity-50"
                                                        title="Change photo"
                                                    >
                                                        {isUploadingAgentAvatar
                                                            ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            : <Camera className="w-3.5 h-3.5" />
                                                        }
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-400 font-medium">Click to change</p>
                                                <input
                                                    ref={agentAvatarInputRef}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="hidden"
                                                    onChange={handleAgentAvatarUpload}
                                                />
                                            </div>

                                            {/* Details Grid */}
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                                    <p className="text-base font-semibold text-slate-900">{user?.name || 'Not Set'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                                    <p className="text-base font-semibold text-slate-900">{user?.email || 'Not Set'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                        Phone Number
                                                        {!isEditingPhone && (
                                                            <button type="button" onClick={() => { setIsEditingPhone(true); setEditPhoneValue(user?.contact_number || user?.phone || ''); }} className="text-teal-600 hover:text-teal-800 transition-colors" title="Edit phone">
                                                                <Pencil className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </label>
                                                    {isEditingPhone ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="tel"
                                                                value={editPhoneValue}
                                                                onChange={e => setEditPhoneValue(e.target.value)}
                                                                className="w-full border border-teal-400 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20"
                                                                autoFocus
                                                                placeholder="Enter phone number"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handlePhoneSave}
                                                                disabled={isSavingPhone}
                                                                className="w-8 h-8 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-colors"
                                                                title="Save"
                                                            >
                                                                {isSavingPhone ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsEditingPhone(false)}
                                                                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                                                                title="Cancel"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-base font-semibold text-slate-900">{user?.contact_number || user?.phone || 'Not Set'}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agency Name</label>
                                                    <p className="text-base font-semibold text-teal-700">{user?.agency_name || 'Not Set'}</p>
                                                </div>
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
                                                {pipelineData.slice(0, 5).map((app, index) => {
                                                    return (
                                                        <tr key={app.id || index} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-8 py-5 font-medium text-slate-900">{app.candidate_name || app.candidateName || 'Unknown'}</td>
                                                            <td className="px-8 py-5 text-slate-600">{app.jobs?.title || 'Unknown Role'}</td>
                                                            <td className="px-8 py-5 text-right">
                                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${app.status === 'APPROVED' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                                                        app.status === 'SELECTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                                            app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                                                app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                                    app.status === 'HOLD' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                                                        app.status === 'REVIEWING' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                                                            'bg-blue-50 text-blue-700 border border-blue-100'
                                                                    }`}>
                                                                    {app.status === 'APPROVED' ? 'Abroad' :
                                                                        app.status === 'SELECTED' ? 'Selected' :
                                                                            app.status === 'ACCEPTED' ? 'Accepted' :
                                                                                app.status === 'HOLD' ? 'On Hold' :
                                                                                    app.status === 'REJECTED' ? 'Rejected' :
                                                                                        app.status === 'REVIEWING' ? 'Reviewing' :
                                                                                            'Pending'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {pipelineData.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="px-8 py-12 text-center text-slate-400">No recent activity</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
                                                            placeholder="Min 8 chars, uppercase, lowercase, number & symbol"
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

                                {/* DANGER ZONE */}
                                <div className="max-w-xl">
                                    <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm overflow-hidden">
                                        <div className="px-8 py-5 border-b border-red-100 bg-gradient-to-r from-red-50 to-rose-50">
                                            <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
                                                <Trash2 className="w-4 h-4" /> Danger Zone
                                            </h3>
                                            <p className="text-red-400 text-xs mt-0.5">Irreversible and destructive actions</p>
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-900 text-sm mb-1">Delete this account</p>
                                                    <p className="text-slate-500 text-xs leading-relaxed">
                                                        Once you delete your account, all your data, applications, and profile will be <span className="font-bold text-red-600">permanently removed</span>. You must register again and get admin approval to regain access.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setShowDeleteAccountModal(true)}
                                                    className="shrink-0 px-5 py-2.5 bg-white border-2 border-red-500 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 transition-colors whitespace-nowrap"
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'blocked' ? (
                            /* PIPELINE TRACKING (REFINED) */
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pipeline & Status Tracking</h2>
                                        <p className="text-slate-500 font-medium text-sm mt-1">Real-time updates on your submitted candidates</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={fetchPipeline}
                                            disabled={isRefreshingPipeline}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-60"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isRefreshingPipeline ? 'animate-spin' : ''}`} /> 
                                            {isRefreshingPipeline ? 'Refreshing...' : 'Refresh'}
                                        </button>
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
                                                    .map((app, index) => {
                                                        return (
                                                            <tr key={app.id || index} className="hover:bg-slate-50/80 transition-colors group">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold border border-teal-100 uppercase">
                                                                            {(app.candidate_name || app.candidateName || '?').charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-slate-900 text-sm">{app.candidate_name || app.candidateName || 'Unknown'}</div>
                                                                            <div className="text-xs text-slate-500">{app.email || 'No email'}</div>
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
                                                      ${app.status === 'APPROVED' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                                                            app.status === 'SELECTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                                                app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                                                    app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                                        app.status === 'HOLD' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                                                            app.status === 'REVIEWING' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                                                                'bg-blue-50 text-blue-700 border border-blue-100'
                                                                        }`}>
                                                                        {app.status === 'APPROVED' ? 'Abroad' :
                                                                            app.status === 'SELECTED' ? 'Selected' :
                                                                                app.status === 'ACCEPTED' ? 'Accepted' :
                                                                                    app.status === 'HOLD' ? 'On Hold' :
                                                                                        app.status === 'REJECTED' ? 'Rejected' :
                                                                                            app.status === 'REVIEWING' ? 'Reviewing' :
                                                                                                'Pending'}
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
                                                                {pipelineSearchTerm ? `No candidates found matching "${pipelineSearchTerm}"` : 'No candidates found'}
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
                                                maxLength="50"
                                                placeholder="As per passport (Letters only)"
                                                value={submissionData.name}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                                    setSubmissionData({ ...submissionData, name: val });
                                                }}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                                            <input
                                                type="email"
                                                placeholder="email@candidate.com"
                                                value={submissionData.email}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/[<>/]/g, '');
                                                    setSubmissionData({ ...submissionData, email: val });
                                                }}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700">WhatsApp Number *</label>
                                            <input
                                                type="tel"
                                                maxLength="11"
                                                placeholder="10 or 11 digits"
                                                value={submissionData.whatsapp}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/[^\d+]/g, '');
                                                    setSubmissionData({ ...submissionData, whatsapp: val });
                                                }}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-700">Nationality *</label>
                                            <select
                                                required
                                                value={submissionData.nationality}
                                                onChange={e => setSubmissionData({ ...submissionData, nationality: e.target.value })}
                                                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                                            >
                                                <option value="" disabled>Select Nationality</option>
                                                <option value="Indian">Indian</option>
                                                <option value="Maldivian">Maldives</option>
                                            </select>
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
          width:      `}</style>

            {/* DELETE ACCOUNT CONFIRMATION MODAL */}
            {showDeleteAccountModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-red-600 px-8 py-6 text-white text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Trash2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-widest">Delete Account</h2>
                            <p className="text-red-100 text-xs mt-1">This action cannot be undone</p>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="font-bold text-red-700 text-sm mb-2">⚠ What will be deleted</p>
                                <ul className="text-xs space-y-1 text-red-600 list-disc list-inside">
                                    <li>Your profile data and documents</li>
                                    <li>All submitted job requests</li>
                                    <li>Your pipeline and candidate history</li>
                                    <li>Your login credentials</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                                    Type your email to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmInput}
                                    onChange={(e) => setDeleteConfirmInput(e.target.value)}
                                    placeholder={user?.email || 'your@email.com'}
                                    className="w-full border-2 border-slate-200 focus:border-red-400 rounded-xl py-3 px-4 text-sm font-medium text-slate-700 outline-none transition-all"
                                />
                                <p className="text-xs text-slate-400">Enter <span className="font-bold text-slate-600">{user?.email}</span> to enable deletion</p>
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex gap-3">
                            <button
                                onClick={() => { setShowDeleteAccountModal(false); setDeleteConfirmInput(''); }}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Cancel — Keep Account
                            </button>
                            <button
                                onClick={handleDeleteOwnAccount}
                                disabled={deleteConfirmInput !== user?.email || isDeletingAccount}
                                className="flex-1 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeletingAccount ? (
                                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</>
                                ) : (
                                    <><Trash2 className="w-3.5 h-3.5" />Delete Forever</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};




export default RecruiterDashboard;
