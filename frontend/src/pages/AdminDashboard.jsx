import API_BASE_URL from '../api/config.js';
import { usePopup } from '../context/PopupContext';
import React, { useState, useRef, useEffect } from 'react';
import {
   Users,
   Briefcase,
   AlertCircle,
   CheckCircle2,
   Clock,
   UserPlus,
   Filter,
   ArrowRight,
   ArrowLeft,
   Globe2,
   X,
   MapPin,
   Award,
   ShieldCheck,
   Eye,
   Loader2,
   Plus,
   Calendar,
   FileText,
   Search,
   ChevronDown,
   RefreshCw,
   Lock,
   Trash2,

   Settings,
   Star,
   MoreVertical,
   Building2,
   DollarSign
} from 'lucide-react';

import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';

import { INDUSTRIES, REQUIRED_DOCUMENT_OPTIONS } from '../constants';

const MALDIVES_LOCATIONS = ['All Locations', 'Male', 'Hulhumale', 'Villingili', 'Haa Alif', 'Haa Dhaalu', 'Shaviyani', 'Noonu', 'Raa', 'Baa', 'Lhaviyani', 'Kaafu', 'Alif Alif', 'Alif Dhaalu', 'Vaavu', 'Meemu', 'Faafu', 'Dhaalu', 'Thaa', 'Laamu', 'Gaafu Alif', 'Gaafu Dhaalu', 'Gnaviyani', 'Seenu'];

const MOCK_AGENT_RESUMES = [
   {
      id: 1,
      name: 'Sita Dewi',
      email: 'sita.d@example.com',
      whatsapp: '+62 812 3456 7890',
      nationality: 'Indonesian',
      role: 'Guest Relations Officer',
      agency: 'GLOBAL TALENT',
      status: 'SELECTED',
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      documents: {
         resume: 'Sita_Resume_2024.pdf',
         passport: 'Passport_Sita.pdf',
         education: 'Deg_Hospitality.pdf',
         pcc: 'Police_Clearance.pdf',
         goodStanding: 'Good_Standing.pdf'
      },
      appliedDate: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
   },
   {
      id: 2,
      name: 'Amit Patel',
      email: 'amit@example.com',
      whatsapp: '+91 987 654 3210',
      nationality: 'Indian',
      role: 'Sous Chef',
      agency: 'GLOBAL TALENT',
      status: 'REJECTED',
      statusColor: 'bg-red-50 text-red-600 border-red-100', // Standardized Red Color
      documents: {
         resume: 'Amit_CV.pdf',
         passport: 'Passport_Amit.pdf',
         education: 'Culinary_Arts.pdf',
         pcc: 'PCC_India.pdf',
         goodStanding: 'Ref_Letter.pdf'
      },
      appliedDate: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
   },
   {
      id: 3,
      name: 'Kevin Hart',
      email: 'kevin@example.com',
      whatsapp: '+44 7700 900077',
      nationality: 'British',
      role: 'Diving Instructor',
      agency: 'ISLAND RECRUITERS',
      status: 'ARRIVED',
      statusColor: 'bg-blue-50 text-blue-600 border-blue-100',
      documents: {
         resume: 'Kevin_Dive_CV.pdf',
         passport: 'Passport_UK.pdf',
         education: 'PADI_Master.pdf',
         pcc: 'DBS_Check.pdf',
         goodStanding: 'Ref_DiveShop.pdf'
      },
      appliedDate: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
   },
   {
      id: 4,
      name: 'Jane Doe',
      email: 'jane@example.com',
      whatsapp: '+1 555 0123 4567',
      nationality: 'American',
      role: 'Spa Manager',
      agency: 'ISLAND RECRUITERS',
      status: 'PROCESSING',
      statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
      documents: {
         resume: 'Jane_Spa_CV.pdf',
         passport: 'Passport_USA.pdf',
         education: 'Spa_Management.pdf',
         pcc: 'FBI_Check.pdf',
         goodStanding: 'Health_Cert.pdf'
      },
      appliedDate: new Date(Date.now() - 86400000 * 45).toISOString() // 45 days ago
   },

];

const MOCK_AUDIT_QUEUE = [
   {
      id: 101,
      name: 'Elena Rossi',
      email: 'elena.r@example.com',
      whatsapp: '+39 333 1234567',
      nationality: 'Italian',
      category: 'Hospitality',
      role: 'Sommelier',
      agency: 'Direct',
      region: 'Rome, Italy',
      source: 'Direct',
      status: 'PROCESSING',
      statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
      documents: {
         resume: 'Elena_CV.pdf',
         passport: 'Passport_IT.pdf',
         education: 'WSET_Level3.pdf',
         pcc: 'Police_Clearance_IT.pdf',
         goodStanding: 'Ref_Hotel.pdf'
      },
      appliedDate: new Date(Date.now() - 1800000).toISOString() // 30 mins ago
   },
   {
      id: 102,
      name: 'Rajiv Singh',
      email: 'rajiv.s@example.com',
      whatsapp: '+91 999 888 7777',
      nationality: 'Indian',
      category: 'Education',
      role: 'Math Teacher',
      agency: 'GLOBAL TALENT',
      region: 'Mumbai, India',
      source: 'Agency',
      status: 'PROCESSING',
      statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
      documents: {
         resume: 'Rajiv_Resume.pdf',
         passport: 'Passport_IN.pdf',
         education: 'BEd_Math.pdf',
         pcc: 'PCC_Mumbai.pdf',
         goodStanding: 'Exp_Letter.pdf'
      },
      appliedDate: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
   },
   {
      id: 103,
      name: 'Sarah Connor',
      email: 'sarah.c@example.com',
      whatsapp: '+1 310 555 0199',
      nationality: 'American',
      category: 'Security',
      role: 'Security Chief',
      agency: 'ISLAND RECRUITERS',
      region: 'California, USA',
      source: 'Agency',
      status: 'PROCESSING',
      statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
      documents: {
         resume: 'Sarah_CV.pdf',
         passport: 'Passport_US.pdf',
         education: 'Security_Cert.pdf',
         pcc: 'FBI_Clearance.pdf',
         goodStanding: 'Ref_Mil.pdf'
      },
      appliedDate: new Date(Date.now() - 86400000 * 20).toISOString() // 20 days ago
   }
];

const MOCK_NEW_PARTNER_APPS = [
   {
      id: 1,
      applicant: 'Michael Chen',
      agency: 'PACIFIC TALENT SOURCING',
      region: 'Singapore / SE Asia',
      email: 'm.chen@pacifictalent.com',
      status: 'YET TO BE CHECKED',
      statusColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      submittedDate: '2024-05-24',
      documents: {
         identity: 'Identity_Proof.pdf',
         license: 'Business_License.jpg',
         profile: 'Agency_Profile.pdf'
      }
   },
   {
      id: 2,
      applicant: 'Sarah Abed',
      agency: 'MENA HOSPITALITY',
      region: 'Dubai, UAE',
      email: 'sarah.a@menahospitality.com',
      status: 'YET TO BE CHECKED',
      statusColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      submittedDate: '2024-05-25',
      documents: {
         identity: 'Identity_Doc.pdf',
         license: 'License_UAE.pdf',
         profile: 'Company_Profile_MENA.pdf'
      }
   },
   {
      id: 3,
      applicant: 'David Low',
      agency: 'ASEAN CONNECT',
      region: 'Bangkok, Thailand',
      email: 'david.low@aseanconnect.th',
      status: 'ON HOLD',
      statusColor: 'bg-amber-50 text-amber-600 border-amber-100',
      submittedDate: '2024-05-22',
      documents: {
         identity: 'Thai_ID.pdf',
         license: 'Biz_Reg.pdf',
         profile: 'Portfolio_ASEAN.pdf'
      }
   }
];




const DocumentCard = ({ label, filename, fileObj }) => {
   const handleViewDocument = () => {
      if (fileObj && fileObj.data) {
         try {
            const byteCharacters = atob(fileObj.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
               byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: fileObj.contentType || 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
         } catch (e) {
            console.error('Failed to decode document', e);
         }
      } else if (filename && filename !== '#') {
         window.open(filename, '_blank');
      }
   };

   return (
      <div className="flex items-center p-4 border border-slate-200 rounded-2xl bg-white hover:border-teal-500 hover:shadow-md transition-all group">
         <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
            <FileText className="w-6 h-6" />
         </div>
         <div className="flex-1 overflow-hidden">
            <p className="text-slate-900 font-bold text-sm mb-0.5 truncate pr-2">{filename || 'Document'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
         </div>
         <button
            onClick={handleViewDocument}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors ml-4 shrink-0"
         >
            <Eye className="w-4 h-4" />
         </button>
      </div>
   );
};

// Helper: preserve salary string formatting
const formatSalary = (salary) => {
   if (!salary) return 'N/A';
   return salary;
};

// Helper: get badge color for application status
const getStatusColor = (status) => {
   switch ((status || '').toUpperCase()) {
      case 'APPROVED': return 'bg-teal-50 text-teal-700 border border-teal-100';
      case 'REJECTED': return 'bg-red-50 text-red-700 border border-red-100';
      case 'HOLD': return 'bg-amber-50 text-amber-700 border border-amber-100';
      default: return 'bg-slate-50 text-slate-500 border border-slate-200';
   }
};

const AdminDashboard = () => {
   const popup = usePopup();
   const [activeTab, setActiveTab] = useState('overview');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   // Hierarchical Vacancy Management View State
   const [vacancyViewMode, setVacancyViewMode] = useState('CATEGORIES'); // 'CATEGORIES', 'JOBS', 'CANDIDATES'
   const [jobs, setJobs] = useState([]);
   const [categories, setCategories] = useState(INDUSTRIES);
   const [selectedCategory, setSelectedCategory] = useState(null);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [selectedJobTitle, setSelectedJobTitle] = useState('');
   const [categoryJobs, setCategoryJobs] = useState([]);
   const [agentVacancies, setAgentVacancies] = useState([]);

   // Removed duplicate jobApplications declaration
   const [isLoadingJobs, setIsLoadingJobs] = useState(false);
   const [isLoadingApplications, setIsLoadingApplications] = useState(false);
   const [agentSubTab, setAgentSubTab] = useState('resumes');

   // --- Viewed Application Tracking (localStorage) ---
   const [viewedApplicationIds, setViewedApplicationIds] = useState(() => {
      try {
         const stored = localStorage.getItem('admin_viewed_applications');
         return stored ? JSON.parse(stored) : [];
      } catch { return []; }
   });

   const markApplicationsViewed = (appIds) => {
      setViewedApplicationIds(prev => {
         const updated = [...new Set([...prev, ...appIds])];
         localStorage.setItem('admin_viewed_applications', JSON.stringify(updated));
         return updated;
      });
   };

   const isAppUnviewed = (app) => {
      const appId = app._id || app.id;
      return !viewedApplicationIds.includes(appId);
   };

   // Helper for Standardized Status Colors
   const getStatusColor = (status) => {
      const s = (status || '').toUpperCase();
      if (['SELECTED', 'APPROVED', 'HIRED', 'ACCEPTED'].includes(s)) return 'bg-emerald-50 text-emerald-600 border-emerald-100'; // Green
      if (['ON HOLD', 'HOLD', 'On Hold'].includes(s)) return 'bg-amber-50 text-amber-600 border-amber-100'; // Yellow (Amber)
      if (['PROCESSING', 'APPLIED', 'Applied', 'Processing', 'YET TO BE CHECKED', 'PENDING'].includes(s)) return 'bg-purple-50 text-purple-600 border-purple-100'; // Purple
      if (['REJECTED', 'Rejected'].includes(s)) return 'bg-red-50 text-red-600 border-red-100'; // Red
      return 'bg-slate-50 text-slate-600 border-slate-100'; // Default
   };

   // --- DATA MERGING LOGIC ---
   // 1. Merge MOCK_APPLICATIONS into Audit Queue
   const getMergedAuditQueue = () => {
      const merged = [...MOCK_AUDIT_QUEUE].map(item => ({
         ...item,
         statusColor: getStatusColor(item.status)
      }));

      MOCK_APPLICATIONS.forEach(app => {
         // Avoid duplicates if already exists (naive check by name/email if needed, but IDs are different)
         // Map Application to Audit Item
         const job = MOCK_JOBS.find(j => j.id === app.jobId);
         merged.push({
            id: `merged-app-${app.id}`,
            name: app.candidateName,
            email: app.email,
            whatsapp: app.contactNumber,
            nationality: 'Unknown', // Not in App data
            category: job ? (job.industry || job.category) : 'Other',
            role: job ? job.title : 'Applicant',
            agency: app.agentName || 'Direct',
            region: app.address || 'Unknown',
            source: app.source,
            status: (['APPLIED', 'Applied', 'applied'].includes(app.status)) ? 'PROCESSING' : app.status, // Normalize status
            statusColor: getStatusColor((['APPLIED', 'Applied', 'applied'].includes(app.status)) ? 'PROCESSING' : app.status),
            documents: {},
            appliedDate: app.appliedDate
         });
      });
      return merged;
   };

   // 2. Merge MOCK_AUDIT_QUEUE into Job Applications (for Vacancy View)
   const getMergedApplications = () => {
      const merged = [...MOCK_APPLICATIONS].map(item => ({
         ...item,
         statusColor: getStatusColor(item.status)
      }));

      MOCK_AUDIT_QUEUE.forEach(candidate => {
         // Find a suitable job based on Category/Industry
         // This is a "best guess" to ensuring visibility in Vacancy Manager
         const job = MOCK_JOBS.find(j => (j.industry === candidate.category || j.category === candidate.category) && j.status === 'OPEN');

         if (job) {
            merged.push({
               id: `merged-audit-${candidate.id}`,
               jobId: job.id, // Assign to first matching job in category
               candidateName: candidate.name,
               email: candidate.email,
               contactNumber: candidate.whatsapp,
               status: candidate.status === 'PROCESSING' ? 'Applied' : candidate.status,
               statusColor: getStatusColor(candidate.status === 'PROCESSING' ? 'Applied' : candidate.status),
               appliedDate: candidate.appliedDate,
               source: candidate.source,
               agentName: candidate.agency,
               address: candidate.region,
               hasResume: true,
               hasCerts: true,
               hasPassport: true
            });
         }
      });
      return merged;
   };

   const [agentResumes, setAgentResumes] = useState([]);
   const [auditQueue, setAuditQueue] = useState([]);
   const [jobApplications, setJobApplications] = useState([]);

   // Sync Agent Resumes with All Applications
   useEffect(() => {
      const agencyApps = jobApplications.filter(app => {
         return (app.source === 'Agency' || app.agentName) && app.agentName !== 'Direct';
      }).map(app => ({
         id: app.id || app._id,
         name: app.candidateName || app.name || 'Unknown',
         email: app.email,
         role: app.jobTitle || 'Applicant',
         agency: app.agentName || 'Unknown Agency',
         agentId: app.agentId || null,
         status: app.status,
         statusColor: getStatusColor(app.status),
         appliedDate: app.appliedDate || new Date().toISOString(),
         documents: app.documents || {
            resume: app.hasResume ? { filename: 'resume.pdf' } : null,
            passport: app.hasPassport ? { filename: 'passport.jpg' } : null,
            education: app.hasCerts ? { filename: 'certificates.pdf' } : null,
            pcc: app.hasPCC ? { filename: 'police_clearance.pdf' } : null,
            goodStanding: app.hasGoodStanding ? { filename: 'good_standing.pdf' } : null
         },
         whatsapp: app.contactNumber,
         nationality: app.nationality || 'Not Specified'
      }));
      setAgentResumes(agencyApps);
   }, [jobApplications]);

   // Agency Approval State
   const [pendingAgencies, setPendingAgencies] = useState([]);
   const [showCredentialsModal, setShowCredentialsModal] = useState(false);
   const [approvedCredentials, setApprovedCredentials] = useState(null);
   const [isRefreshingAgents, setIsRefreshingAgents] = useState(false);

   // Job Requests State (Approval/Rejection)
   const [pendingJobRequests, setPendingJobRequests] = useState([]);
   const [pendingJobRequestsCount, setPendingJobRequestsCount] = useState(0);
   const [isRefreshingJobRequests, setIsRefreshingJobRequests] = useState(false);
   const [selectedJobRequest, setSelectedJobRequest] = useState(null);
   const [showRejectModal, setShowRejectModal] = useState(false);
   const [rejectReason, setRejectReason] = useState('');
   const [isApprovingJob, setIsApprovingJob] = useState(false);
   const [isRejectingJob, setIsRejectingJob] = useState(false);

   // Category Filter State
   const [isManageJobMenuOpen, setIsManageJobMenuOpen] = useState(false);
   const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
   const [isDeleteJobsModalOpen, setIsDeleteJobsModalOpen] = useState(false);
   const [applicationCounts, setApplicationCounts] = useState({});
   const [selectedJob, setSelectedJob] = useState(null);
   const [isLoadingVisibilityRequests, setIsLoadingVisibilityRequests] = useState(false);
   const [visibilityRequests, setVisibilityRequests] = useState([]);

   const fetchApplicationCounts = async () => {
      try {
         const response = await fetch(`${API_BASE_URL}/api/applications`);
         if (!response.ok) return;
         const data = await response.json();
         const counts = {};
         const formattedApps = [];

         (Array.isArray(data) ? data : []).forEach(app => {
            const jid = app.job_id || app.jobId;
            counts[jid] = (counts[jid] || 0) + 1;

            formattedApps.push({
               id: app._id || app.id,
               jobId: jid,
               candidateName: app.candidate_name || app.name || 'Unknown',
               email: app.email || '',
               contactNumber: app.contact_number || '',
               nationality: app.nationality || '',
               status: app.status || 'PENDING',
               appliedDate: app.applied_at || app.createdAt,
               source: app.agent_id ? 'Agency' : 'Direct',
               agentName: app.agent_id || '',
               hasResume: !!(app.resume && app.resume.data),
               hasCerts: !!(app.certificates && app.certificates.data),
               hasPassport: !!(app.identity && app.identity.data),
               hasPCC: !!(app.pcc && app.pcc.data),
               hasGoodStanding: !!(app.goodStanding && app.goodStanding.data),
               documents: {
                  resume: app.resume || null,
                  identity: app.identity || null,
                  certificates: app.certificates || null,
                  pcc: app.pcc || null,
                  goodStanding: app.goodStanding || null
               }
            });
         });

         setApplicationCounts(counts);
         setJobApplications(formattedApps);
         setAllApplications(formattedApps);
      } catch (error) {
         console.error('Error fetching application counts:', error);
      }
   };

   const handleDeleteJobFromList = async (jobId) => {
      const appCount = applicationCounts[jobId] || 0;
      if (appCount > 0) {
         popup.error(`Cannot delete this job because it has ${appCount} active application(s).`);
         return;
      }
      if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;

      try {
         const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
            method: 'DELETE'
         });

         if (!response.ok) {
            console.warn("Backend delete failed, proceeding with local cleanup");
         }
      } catch (error) {
         console.error("Error deleting job:", error);
      } finally {
         // Always remove from local state to ensure UI reflects user intent
         setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId && job._id !== jobId));
         setCategoryJobs(prev => prev.filter(job => job.id !== jobId && job._id !== jobId));
      }
   };

   const handleTogglePremium = async (jobId) => {
      // Optimistic update
      setJobs(prev => prev.map(job =>
         (job.id === jobId || job._id === jobId) ? { ...job, is_premium: !job.is_premium } : job
      ));
      setCategoryJobs(prev => prev.map(job =>
         (job.id === jobId || job._id === jobId) ? { ...job, is_premium: !job.is_premium } : job
      ));

      try {
         // In a real app, this would hit an API endpoint
         // await fetch(`${API_BASE_URL}/api/jobs/${jobId}/premium`, { method: 'PUT' });
         console.log(`Toggled premium for job ${jobId}`);
      } catch (error) {
         console.error("Error toggling premium:", error);
         // Revert on error
         fetchJobsByCategory(selectedCategory);
      }
   };

   // Job Applications State (Real applications from database)
   const [candidateStatusFilter, setCandidateStatusFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED, HOLD

   // Blacklist Filter State (needed for dropdown close handler)
   const [isBlacklistSourceOpen, setIsBlacklistSourceOpen] = useState(false);
   const [isBlacklistDurationOpen, setIsBlacklistDurationOpen] = useState(false);
   // Refs for flexible dropdowns
   const blacklistSourceRef = useRef(null);
   const blacklistDurationRef = useRef(null);

   // Click outside handler for flexibility
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (blacklistSourceRef.current && !blacklistSourceRef.current.contains(event.target)) {
            setIsBlacklistSourceOpen(false);
         }
         if (blacklistDurationRef.current && !blacklistDurationRef.current.contains(event.target)) {
            setIsBlacklistDurationOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Fetch pending agents function (reusable for refresh)
   const fetchPendingAgents = async (showLoading = false) => {
      if (showLoading) setIsRefreshingAgents(true);
      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/pending-agents`);
         const data = await response.json();
         setPendingAgencies(data);
      } catch (error) {
         console.error('Error fetching pending agents:', error);
      } finally {
         if (showLoading) setIsRefreshingAgents(false);
      }
   };

   // Unified Data Fetching
   const fetchAllData = async (showLoading = false) => {
      if (showLoading) setIsLoadingJobs(true);
      try {
         // 1. Fetch Categories
         const catRes = await fetch(`${API_BASE_URL}/api/jobs/categories`);
         if (catRes.ok) {
            const catData = await catRes.json();
            if (Array.isArray(catData) && catData.length > 0) setCategories(catData);
         }

         // 2. Fetch Jobs — always overwrite, even if empty
          let fetchedJobs = [];
         const jobRes = await fetch(`${API_BASE_URL}/api/jobs`);
         if (jobRes.ok) {
            const jobData = await jobRes.json();
             fetchedJobs = Array.isArray(jobData) ? jobData : [];
             const mappedJobs = fetchedJobs.map(j => ({
               ...j,
               postedDate: j.posted_date || j.postedDate,
               salaryRange: j.salary_range || j.salaryRange,
               industry: j.category || j.industry,
               id: j._id || j.id
            }));
            setJobs(mappedJobs); // Always overwrite — no mock fallback
         }

         // 3. Fetch Applications — always overwrite from DB
         const appRes = await fetch(`${API_BASE_URL}/api/applications`);
         if (appRes.ok) {
            const appData = await appRes.json();
            const mappedApps = (Array.isArray(appData) ? appData : []).map(app => ({
               id: app._id || app.id,
               jobId: app.job_id || app.jobId,
               candidateName: app.candidate_name || 'Unknown',
               email: app.email || '',
               contactNumber: app.contact_number || '',
               nationality: app.nationality || '',
               status: app.status || 'PENDING',
               appliedDate: app.applied_at || app.createdAt,
               source: app.agent_id ? 'Agency' : 'Direct',
               agentName: app.agent_name || app.agent_id || '',
               agentId: app.agent_id || null,
               hasResume: !!(app.resume && app.resume.data),
               hasCerts: !!(app.certificates && app.certificates.data),
               hasPassport: !!(app.identity && app.identity.data),
               hasPCC: !!(app.pcc && app.pcc.data),
               hasGoodStanding: !!(app.goodStanding && app.goodStanding.data),
               documents: {
                  resume: app.resume || null,
                  identity: app.identity || null,
                  certificates: app.certificates || null,
                  pcc: app.pcc || null,
                  goodStanding: app.goodStanding || null
               }
            }));

            setAllApplications(mappedApps);
            setJobApplications(mappedApps);

             // Populate Audit Queue with ALL applications (agent + direct)
             const auditApps = mappedApps.map(app => {
                const matchedJob = fetchedJobs.find(j => (j._id || j.id) === app.jobId);
                return {
                   ...app,
                   name: app.candidateName || 'Unknown',
                   category: matchedJob ? (matchedJob.category || matchedJob.industry || 'Other') : 'Other',
                   role: matchedJob ? matchedJob.title : 'Applicant',
                   source: app.source || 'Direct',
                   region: app.nationality || 'Unknown',
                   agency: app.agentName || 'Direct',
                   statusColor: getStatusColor(app.status)
                };
             });
             setAuditQueue(auditApps);
         }
      } catch (error) {
         console.error('Error fetching all admin data:', error);
      } finally {
         if (showLoading) setIsLoadingJobs(false);
         fetchApplicationCounts();
      }
   };

   // Fetch Pending Job Requests
   const fetchPendingJobRequests = async () => {
      setIsRefreshingJobRequests(true);
      try {
         const res = await fetch(`${API_BASE_URL}/api/admin/job-requests?status=PENDING`);
         if (res.ok) {
            const data = await res.json();
            setPendingJobRequests(data);
            setPendingJobRequestsCount(data.length);
         }
      } catch (error) {
         console.error('Error fetching job requests:', error);
      } finally {
         setIsRefreshingJobRequests(false);
      }
   };

   // Fetch on mount
   useEffect(() => {
      fetchPendingAgents();
      fetchAllData();
      fetchPendingJobRequests();
   }, []);

   // Handle Delete Vacancy
   const handleDeleteVacancy = (jobId) => {
      if (window.confirm('Are you sure you want to delete this vacancy?')) {
         // Update local state
         setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId && job._id !== jobId));
         // Update filtering state if active
         setCategoryJobs(prev => prev.filter(job => job.id !== jobId && job._id !== jobId));

         // In a real app, you would also call API to delete
         // fetch(`${API_BASE_URL}/api/jobs/${jobId}`, { method: 'DELETE' });
      }
   };

   // Fetch jobs by category for hierarchical view
   const fetchJobsByCategory = async (category) => {
      setIsLoadingJobs(true);
      try {
         // Using local state for consistency
         // In a real app with working backend, we would fetch here

         // Simulate network delay
         setTimeout(() => {
            const filteredJobs = jobs.filter(j => j.industry === category || j.category === category);
            setCategoryJobs(filteredJobs);
            setIsLoadingJobs(false);
         }, 500);
      } catch (error) {
         console.error('Error fetching jobs by category:', error);
         const filteredJobs = jobs.filter(j => j.industry === category);
         setCategoryJobs(filteredJobs);
         setIsLoadingJobs(false);
      }
   };

   // Fetch applications by job ID for hierarchical view
   const fetchApplicationsByJob = async (jobId) => {
      setIsLoadingApplications(true);
      try {
         const response = await fetch(`${API_BASE_URL}/api/applications?job_id=${encodeURIComponent(jobId)}`);
         if (response.ok) {
            const data = await response.json();
            // Map DB fields to frontend format
            const mapped = (Array.isArray(data) ? data : []).map(app => ({
               id: app._id ? app._id.toString() : (app.id || ''),
               customId: app.id || '',
               jobId: app.job_id || app.jobId,
               candidateName: app.candidate_name || 'Unknown',
               email: app.email || '',
               contactNumber: app.contact_number || '',
               nationality: app.nationality || '',
               status: app.status || 'PENDING',
               appliedDate: app.applied_at || app.createdAt,
               source: app.agent_id ? 'Agency' : 'Direct',
               agentName: app.agent_name || app.agent_id || '',
               agentId: app.agent_id || null,
               hasResume: !!(app.resume && app.resume.data),
               hasCerts: !!(app.certificates && app.certificates.data),
               hasPassport: !!(app.identity && app.identity.data),
               hasPCC: !!(app.pcc && app.pcc.data),
               hasGoodStanding: !!(app.goodStanding && app.goodStanding.data),
               documents: {
                  resume: app.resume || null,
                  identity: app.identity || null,
                  certificates: app.certificates || null,
                  pcc: app.pcc || null,
                  goodStanding: app.goodStanding || null
               }
            }));
            setJobApplications(mapped);
         } else {
            setJobApplications([]);
         }
      } catch (error) {
         console.error('Error fetching applications by job:', error);
         setJobApplications([]);
      } finally {
         setIsLoadingApplications(false);
      }
   };

   // Handle category click - navigate to JOBS view
   const handleCategoryClick = (category) => {
      setSelectedCategory(category);
      setVacancyViewMode('JOBS');
      fetchJobsByCategory(category);
   };

   // Handle job click - navigate to CANDIDATES view
   const handleJobClick = (job) => {
      setSelectedJobId(job.id || job._id);
      setSelectedJobTitle(job.title);
      setVacancyViewMode('CANDIDATES');
      fetchApplicationsByJob(job.id || job._id);
      // Mark all applications for this job as viewed
      const jobAppIds = allApplications
         .filter(a => a.jobId === (job.id || job._id))
         .map(a => a._id || a.id);
      if (jobAppIds.length > 0) markApplicationsViewed(jobAppIds);
   };

   // Handle back to categories
   const handleBackToCategories = () => {
      setVacancyViewMode('CATEGORIES');
      setSelectedCategory(null);
      setCategoryJobs([]);
   };

   // Handle back to jobs
   const handleBackToJobs = () => {
      setVacancyViewMode('JOBS');
      setSelectedJobId(null);
      setSelectedJobTitle('');
      setJobApplications([]);
   };

   // Handle application status update (Approve/Reject/Hold)
   const handleApplicationAction = async (appId, action, appCustomId) => {
      // Map action string to DB status value
      const statusMap = {
         approve: 'APPROVED',
         reject: 'REJECTED',
         hold: 'HOLD'
      };
      const newStatus = statusMap[action];
      if (!newStatus) return;

      // Use the string version of the ID for the URL
      const idForUrl = (appId || '').toString();

      try {
         // Use the correct admin endpoint for status updates
         const response = await fetch(`${API_BASE_URL}/api/admin/applications/${idForUrl}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, reviewed_by: 'Admin', review_notes: '' })
         });

         if (response.ok) {
            popup.success(`Candidate status updated to ${newStatus}.`);
            // Optimistically update local state
            setJobApplications(prev => prev.map(app =>
               (app.id === idForUrl || app.customId === appCustomId)
                  ? { ...app, status: newStatus, statusColor: getStatusColor(newStatus) }
                  : app
            ));
            // Refresh full application list from DB
            if (selectedJobId) fetchApplicationsByJob(selectedJobId);
         } else {
            const errData = await response.json().catch(() => ({}));
            popup.error(errData.message || `Failed to update status.`);
         }
      } catch (error) {
         console.error(`Error updating application status:`, error);
         popup.error('Network error updating status.');
      }
   };

   // Handle Delete Job
   const handleDeleteJob = async () => {
      if (!selectedJob) return;

      // Check if there are applications
      if (jobApplications.length > 0) {
         popup.error(`Cannot delete this job because it has ${jobApplications.length} active application(s).`);
         return;
      }

      if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this job? This action cannot be undone.')) return;

      try {
         const response = await fetch(`${API_BASE_URL}/api/jobs/${selectedJob.id || selectedJob._id}`, {
            method: 'DELETE'
         });

         if (!response.ok) {
            console.warn("Backend delete failed, proceeding with local cleanup");
         }
      } catch (error) {
         console.error('Error deleting job:', error);
      } finally {
         // Always clean up local state
         const deletedId = selectedJob.id || selectedJob._id;
         setJobs(prev => prev.filter(j => j.id !== deletedId && j._id !== deletedId));
         setCategoryJobs(prev => prev.filter(j => j.id !== deletedId && j._id !== deletedId));
         setSelectedJob(null);
         setJobApplications([]);
         popup.success('Job deleted successfully.');
      }
   };

   // ============ VISIBILITY REQUESTS (Client Status Request) ============

   // Fetch pending visibility requests
   const fetchVisibilityRequests = async () => {
      setIsLoadingVisibilityRequests(true);
      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/visibility-requests`);
         const data = await response.json();
         if (response.ok) {
            setVisibilityRequests(data);
         }
      } catch (error) {
         console.error('Error fetching visibility requests:', error);
      } finally {
         setIsLoadingVisibilityRequests(false);
      }
   };

   // Approve visibility request
   const handleApproveVisibilityRequest = async (requestId) => {
      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/visibility-requests/${requestId}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewed_by: 'Admin' })
         });

         if (response.ok) {
            popup.success('G�� Visibility request approved!');
            fetchVisibilityRequests(); // Refresh the list
         } else {
            const data = await response.json();
            popup.error(`G�� Failed: ${data.message}`);
         }
      } catch (error) {
         console.error('Error approving visibility request:', error);
         popup.error('Error approving request.');
      }
   };

   // Reject visibility request
   const handleRejectVisibilityRequest = async (requestId) => {
      if (!window.confirm('Rejected Applications can be viewed in Blacklisted page.    Do u want to Reject the application?')) return;

      // Optimistic/Local Update
      setAuditQueue(prev => prev.map(req =>
         (req.id === requestId || req._id === requestId) ? { ...req, status: 'REJECTED' } : req
      ));

      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/visibility-requests/${requestId}/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewed_by: 'Admin' })
         });

         if (response.ok) {
            popup.error('Visibility request rejected.');
            fetchVisibilityRequests(); // Refresh the list
         } else {
            const data = await response.json();
            popup.error(`Failed: ${data.message}`);
         }
      } catch (error) {
         console.error('Error rejecting visibility request:', error);
         popup.error('Error rejecting request.');
      }
   };

   // Hold visibility request
   const handleHoldVisibilityRequest = async (requestId) => {
      // Optimistic/Local Update for Mock Data
      setAuditQueue(prev => prev.map(req =>
         (req.id === requestId || req._id === requestId) ? { ...req, status: 'HOLD' } : req
      ));

      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/visibility-requests/${requestId}/hold`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewed_by: 'Admin' })
         });

         if (response.ok) {
            fetchVisibilityRequests(); // Refresh API data
         }
      } catch (error) {
         console.error('Error holding visibility request:', error);
      }
      popup.success('Request placed on hold.');
   };

   // Fetch visibility requests when audit tab is selected
   useEffect(() => {
      if (activeTab === 'audit') {
         fetchVisibilityRequests();
      }
   }, [activeTab]);


   // Handle job selection (fetch applications for the job)
   const handleJobSelect = (job) => {
      setSelectedJob(job);
      fetchApplicationsByJob(job.id || job._id);
   };

   // Approve/Reject job request handler
   const handleJobRequestStatus = async (request, status, reason = '') => {
      const isApproving = status === 'APPROVED';
      if (isApproving) setIsApprovingJob(true);
      else setIsRejectingJob(true);

      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/job-requests/${request._id || request.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               status,
               reviewed_by: 'Admin',
               review_notes: reason || (isApproving ? 'Approved' : 'Rejected by admin')
            })
         });
         const data = await response.json();
         if (response.ok) {
            popup.success(isApproving ? `🎉 Job request "${request.title}" is now live.` : `🚫 Job request "${request.title}" has been rejected.`);
            setPendingJobRequests(prev => prev.filter(r => (r._id || r.id) !== (request._id || request.id)));
            setPendingJobRequestsCount(prev => prev - 1);
            if (isApproving) {
               fetchJobsByCategory(selectedCategory);
            } else {
               setShowRejectModal(false);
               setSelectedJobRequest(null);
               setRejectReason('');
            }
         } else {
            popup.error(`Failed to ${isApproving ? 'approve' : 'reject'}: ` + data.message);
         }
      } catch (error) {
         console.error(`Error ${isApproving ? 'approving' : 'rejecting'} job request:`, error);
         popup.error(`Error ${isApproving ? 'approving' : 'rejecting'} job request`);
      } finally {
         if (isApproving) setIsApprovingJob(false);
         else setIsRejectingJob(false);
      }
   };


   const [selectedResume, setSelectedResume] = useState(null);
   const [isBlacklistReview, setIsBlacklistReview] = useState(false);
   const [allApplications, setAllApplications] = useState([]);
   const [industries, setIndustries] = useState(INDUSTRIES);
   const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
   // jobs moved to top
   const [isAddVacancyOpen, setIsAddVacancyOpen] = useState(false);
   const [newVacancy, setNewVacancy] = useState({
      title: '',
      industry: '',
      salary: '',
      headcount: '',
      description: '',
      requirements: '',
      companyName: '',
      address: '',
      required_documents: []
   });
   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
   const [showEducationDropdown, setShowEducationDropdown] = useState(false);
   const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
   const [showSuccessNotification, setShowSuccessNotification] = useState(false);

   // Audit Filter State
   const [isAuditFilterOpen, setIsAuditFilterOpen] = useState(false);
   const [auditFilters, setAuditFilters] = useState({
      status: [],
      source: 'All',
      duration: 'All',
      location: 'All Locations',
      education: 'Any Education Level',
      experience: 'No Experience'
   });

   const toggleAuditStatusFilter = (status) => {
      setAuditFilters(prev => {
         const isSelected = prev.status.includes(status);
         return {
            ...prev,
            status: isSelected ? prev.status.filter(s => s !== status) : [...prev.status, status]
         };
      });
   };



   // Candidate Filter State (Vacancy Management)
   const [isCandidateFilterOpen, setIsCandidateFilterOpen] = useState(false);
   const [candidateFilters, setCandidateFilters] = useState({
      status: [],
      source: 'All',
      duration: 'All',
      location: 'All Locations'
   });

   const toggleCandidateFilter = (filterType, value) => {
      if (filterType === 'status') {
         setCandidateFilters(prev => {
            const current = prev.status;
            const updated = current.includes(value)
               ? current.filter(item => item !== value)
               : [...current, value];
            return { ...prev, status: updated };
         });
      } else {
         setCandidateFilters(prev => ({ ...prev, [filterType]: value }));
      }
   };

   const [candidateSearchInput, setCandidateSearchInput] = useState('');
   const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
   const handleCandidateSearch = () => setCandidateSearchQuery(candidateSearchInput);



   const handleViewApplication = (app) => {
      const resumeData = {
         id: app.id || app._id,
         name: app.candidateName || app.name || 'Unknown',
         role: selectedJob?.title || app.jobTitle || 'Applicant',
         agency: app.agentName || (app.source === 'Direct' ? 'Direct Application' : 'Agency'),
         email: app.email || 'N/A',
         whatsapp: app.contactNumber || 'N/A',
         nationality: app.nationality || (app.address ? app.address.split(',').pop().trim() : 'Not Specified'),
         status: app.status,
         documents: app.documents || {
            resume: app.hasResume ? { filename: 'resume.pdf' } : null,
            passport: app.hasPassport ? { filename: 'passport.jpg' } : null,
            education: app.hasCerts ? { filename: 'certificates.pdf' } : null,
            pcc: app.hasPCC ? { filename: 'police_clearance.pdf' } : null,
            goodStanding: app.hasGoodStanding ? { filename: 'good_standing.pdf' } : null
         }
      };
      setSelectedResume(resumeData);
   };

   const handleAgentClick = async (agentId) => {
      if (!agentId || agentId === 'Unknown Agency' || agentId === 'Direct') return;
      try {
         const res = await fetch(`${API_BASE_URL}/api/admin/agents/${agentId}`);
         if (res.ok) {
            const agentProfile = await res.json();
            setSelectedApplication(agentProfile);
         } else {
            popup.error('Could not fetch agent details.');
         }
      } catch (err) {
         console.error(err);
         popup.error('Failed to load agent profile.');
      }
   };

   const handleResumeStatusChange = async (status) => {
      if (!selectedResume) return;

      // Map UI status labels to DB enum values
      const statusMap = {
         'Selected': 'SELECTED',
         'SELECTED': 'SELECTED',
         'Rejected': 'REJECTED',
         'REJECTED': 'REJECTED',
         'On Hold': 'HOLD',
         'ON HOLD': 'HOLD',
         'HOLD': 'HOLD'
      };
      const dbStatus = statusMap[status] || status.toUpperCase();
      const appId = selectedResume.id || selectedResume._id;

      // Persist to database first
      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/applications/${appId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: dbStatus, reviewed_by: 'Admin' })
         });
         if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            popup.error(errData.message || 'Failed to update status in database.');
            return;
         }
      } catch (err) {
         console.error('Error persisting status to DB:', err);
         popup.error('Network error: Could not update status.');
         return;
      }

      const updatedApplications = allApplications.map(app => {
         // Fix: Ensure we don't match undefined === undefined
         const matchesId = (app.id && app.id === selectedResume.id) || (app._id && app._id === selectedResume.id);

         if (matchesId) {
            return {
               ...app,
               status: status
            };
         }
         return app;
      });

      setAllApplications(updatedApplications);

      // Update Job Applications (Local View)
      setJobApplications(prev => prev.map(app => {
         const matchesId = (app.id && app.id === selectedResume.id) || (app._id && app._id === selectedResume.id);
         if (matchesId) {
            return { ...app, status: status };
         }
         return app;
      }));

      // FIX: Update Agent Resumes State
      setAgentResumes(prev => {
         if (status === 'Rejected') {
            // Remove from list if rejected (It moves to Audit Queue/Blacklist)
            return prev.filter(resume => {
               const matchesId = (resume.id && resume.id === selectedResume.id) || (resume._id && resume._id === selectedResume.id);
               return !matchesId;
            });
         } else {
            // Update status otherwise
            return prev.map(resume => {
               const matchesId = (resume.id && resume.id === selectedResume.id) || (resume._id && resume._id === selectedResume.id);
               if (matchesId) {
                  return {
                     ...resume,
                     status: status === 'On Hold' ? 'ON HOLD' : status.toUpperCase(),
                     statusColor: getStatusColor(status === 'On Hold' ? 'ON HOLD' : status.toUpperCase())
                  };
               }
               return resume;
            });
         }
      });

      let candidateFoundInAudit = false;
      const updatedAuditQueue = auditQueue.map(candidate => {
         const matchesId = (candidate.id && candidate.id === selectedResume.id) || (candidate._id && candidate._id === selectedResume.id);
         if (matchesId) {
            candidateFoundInAudit = true;
            const finalStatus = status === 'Rejected' ? 'REJECTED' : status.toUpperCase();
            return { ...candidate, status: finalStatus, statusColor: getStatusColor(finalStatus) };
         }
         return candidate;
      });

      // If rejected and NOT in audit queue independently, add them (moves to blacklist view)
      if (!candidateFoundInAudit && (status === 'Rejected' || status === 'REJECTED')) {
         updatedAuditQueue.push({
            id: selectedResume.id,
            name: selectedResume.name,
            email: selectedResume.email,
            role: selectedResume.role,
            agency: selectedResume.agency,
            nationality: selectedResume.nationality || 'Unknown', // Ensure we keep extra details if needed
            status: 'REJECTED',
            statusColor: 'bg-red-50 text-red-600 border-red-100',
            source: selectedResume.source || 'Direct', // Default or derived from resume data if available
            appliedDate: selectedResume.appliedDate || new Date().toISOString(),
            // Ensure other fields are present to avoid rendering errors
            region: selectedResume.region || selectedResume.address || 'Unknown',
            category: selectedResume.category || 'Other'
         });
      }

      setAuditQueue(updatedAuditQueue);

      // ALSO UPDATE jobApplications state if the candidate exists there (for Vacancy Manager view)
      setJobApplications(prev => prev.map(app => {
         const matchesId = (app.id && app.id === selectedResume.id) || (app._id && app._id === selectedResume.id);
         if (matchesId) {
            const finalStatus = status === 'Rejected' ? 'REJECTED' : status === 'On Hold' ? 'ON HOLD' : status.toUpperCase();
            return { ...app, status: finalStatus, statusColor: getStatusColor(finalStatus) };
         }
         return app;
      }));

      setSelectedResume(null);
      setIsBlacklistReview(false);
      popup.success(`Candidate status updated to ${status}`);
   };

   const [partnerApplications, setPartnerApplications] = useState([]);



   // Agent Rejection Filter State
   const [agentBlacklistSearchInput, setAgentBlacklistSearchInput] = useState('');
   const [agentBlacklistSearchQuery, setAgentBlacklistSearchQuery] = useState('');
   const [isAgentBlacklistSourceOpen, setIsAgentBlacklistSourceOpen] = useState(false);
   const [isAgentBlacklistDurationOpen, setIsAgentBlacklistDurationOpen] = useState(false);
   const [isAgentBlacklistFilterOpen, setIsAgentBlacklistFilterOpen] = useState(false);
   const [agentBlacklistFilters, setAgentBlacklistFilters] = useState({
      source: 'All', // 'Agency' or others if applicable
      duration: 'All',
      location: 'All Locations'
   });

   const handleAgentBlacklistSearch = () => setAgentBlacklistSearchQuery(agentBlacklistSearchInput);

   const [selectedApplication, setSelectedApplication] = useState(null);
   const [approvalStep, setApprovalStep] = useState('NONE');

   const handleApplicationStatusChange = async (status) => {
      if (!selectedApplication) return;

      try {
         const id = selectedApplication._id || selectedApplication.id;

         if (status === 'SELECTED') {
            await fetch(`${API_BASE_URL}/api/admin/agents/${id}/approve`, { method: 'PUT' });
            popup.success('Agent approved! They can now log in with their own credentials.');
         } else if (status === 'REJECTED') {
            await fetch(`${API_BASE_URL}/api/admin/agents/${id}/reject`, { method: 'PUT' });
            popup.success('Agent application rejected.');
         } else if (status === 'ON HOLD') {
            await fetch(`${API_BASE_URL}/api/admin/agents/${id}/hold`, { method: 'PUT' });
            popup.info('Agent placed on hold. They will still appear in this list.');
         }

         // Refresh the agents list
         fetchPendingAgents();
         setSelectedApplication(null);
         setApprovalStep('NONE');
      } catch (err) {
         console.error('Error updating status:', err);
         popup.error('Failed to update agent status');
      }
   };

   const handleDeleteAgent = async () => {
      if (!selectedApplication) return;
      try {
         const id = selectedApplication._id || selectedApplication.id;
         await fetch(`${API_BASE_URL}/api/admin/agents/${id}`, { method: 'DELETE' });
         popup.success('Agent permanently deleted from the system.');
         fetchPendingAgents();
         setSelectedApplication(null);
         setApprovalStep('NONE');
      } catch (err) {
         console.error('Error deleting agent:', err);
         popup.error('Failed to delete agent');
      }
   };

   const handleAddVacancy = async (e) => {
      e.preventDefault();
      try {
         const payload = {
            title: newVacancy.title,
            company: newVacancy.companyName,
            location: newVacancy.address,
            category: newVacancy.industry,
            salary_range: newVacancy.salary,
            description: newVacancy.description,
            requirements: newVacancy.requirements.split(',').map(r => r.trim()).filter(Boolean),
            headcount: newVacancy.headcount || 1,
            education: newVacancy.education || '',
            experience: newVacancy.experience || ''
         };

         const response = await fetch(`${API_BASE_URL}/api/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
         });

         if (!response.ok) {
            const errData = await response.json();
            popup.error('Failed to create job: ' + (errData.message || 'Unknown error'));
            return;
         }

         const savedJob = await response.json();
         // Map saved job to frontend format
         const mappedJob = {
            ...savedJob,
            id: savedJob._id || savedJob.id,
            industry: savedJob.category,
            postedDate: savedJob.posted_date,
            salaryRange: savedJob.salary_range
         };

         setJobs(prev => [mappedJob, ...prev]);
         if (typeof setCategoryJobs === 'function' && (!selectedCategory || mappedJob.industry === selectedCategory)) {
            setCategoryJobs(prev => [mappedJob, ...prev]);
         }

         setNewVacancy({ title: '', industry: '', salary: '', headcount: '', description: '', requirements: '', companyName: '', address: '', education: '', experience: '', required_documents: [] });
         setIsAddVacancyOpen(false);
         setShowSuccessNotification(true);
         setTimeout(() => setShowSuccessNotification(false), 3000);
         popup.success(`Job "${mappedJob.title}" created successfully and is now visible to agents!`);
      } catch (err) {
         console.error('Error creating job:', err);
         popup.error('Error creating job: ' + err.message);
      }
   };


   const handleGenerateCredentials = () => {
      setApprovalStep('GENERATING');
      setTimeout(() => {
         setApprovalStep('SUCCESS');
         handleApplicationStatusChange('SELECTED');
      }, 2000);
   };

   // Agent Approval Handlers (using Profile model)
   const handleApproveAgency = async (agent) => {
      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/agents/${agent._id}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
         });
         const data = await response.json();
         if (response.ok) {
            // Show success message (agent already has password from registration)
            popup.success(`Agent "${agent.full_name}" approved successfully!\nThey can now login with their registered email: ${agent.email}`);
            setPendingAgencies(prev => prev.filter(a => a._id !== agent._id));
         } else {
            popup.error('Failed to approve agent: ' + data.message);
         }
      } catch (error) {
         console.error('Error approving agent:', error);
         popup.error('Error approving agent');
      }
   };

   const handleRejectAgency = async (agent) => {
      try {
         const response = await fetch(`${API_BASE_URL}/api/admin/agents/${agent._id}/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
         });
         if (response.ok) {
            setPendingAgencies(prev => prev.filter(a => a._id !== agent._id));
            popup.error('Agent rejected and blocked.');
         } else {
            const data = await response.json();
            popup.error('Failed to reject agent: ' + data.message);
         }
      } catch (error) {
         console.error('Error rejecting agent:', error);
         popup.error('Error rejecting agent');
      }
   };





   // agentVacancies moved to top
   const [selectedVacancy, setSelectedVacancy] = useState(null);
   // --- CATEGORY MANAGEMENT STATE ---
   // categories moved to top
   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
   const [newCategoryName, setNewCategoryName] = useState('');
   const [categoryError, setCategoryError] = useState('');

   const fetchCategories = async () => {
      try {
         const res = await fetch(`${API_BASE_URL}/api/jobs/categories`);
         if (res.ok) {
            const data = await res.json();
            setCategories(data || []);
         }
      } catch (err) {
         console.error("Failed to fetch categories", err);
      }
   };

   useEffect(() => {
      fetchCategories();
   }, []);

   const handleAddCategory = async () => {
      if (!newCategoryName.trim()) return;

      // Duplicate Check (Case-insensitive)
      if (categories.some(c => c.toLowerCase() === newCategoryName.trim().toLowerCase())) {
         setCategoryError('Category already exists');
         return;
      }

      try {
         const res = await fetch(`${API_BASE_URL}/api/jobs/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName })
         });
         if (res.ok) {
            await fetchCategories();
            setNewCategoryName('');
            setCategoryError('');
            setIsCategoryModalOpen(false); // Close modal on success
         } else {
            const err = await res.json();
            setCategoryError(err.message || "Error adding category");
         }
      } catch (e) {
         setCategoryError("Error adding category");
      }
   };

   const handleDeleteCategory = async (catName) => {
      // Check if there are any jobs in this category first
      const jobCount = jobs.filter(j => j.industry === catName || j.category === catName).length;
      if (jobCount > 0) {
         popup.error(`Cannot delete category "${catName}" because it contains ${jobCount} jobs. Delete the jobs first.`);
         return;
      }

      if (!window.confirm(`Are you sure you want to delete the category "${catName}"?`)) return;

      try {
         const res = await fetch(`${API_BASE_URL}/api/jobs/categories/${catName}`, {
            method: 'DELETE'
         });

         if (res.ok) {
            await fetchCategories();
            popup.success("Category deleted successfully.");
         } else {
            const data = await res.json();
            popup.error(data.message || "Failed to delete category");
         }
      } catch (err) {
         console.error("Error deleting category:", err);
         popup.error("Error deleting category");
      }
   };
   const handleVacancyStateChange = (state) => {
      if (!selectedVacancy) return;

      const updatedVacancies = agentVacancies.map(v => {
         if (v.id === selectedVacancy.id) {
            let stateColor = '';
            // Update state color logic based on new requirements
            if (state === 'HIDDEN') stateColor = 'text-slate-300';
            if (state === 'STILL IN HOLD') stateColor = 'text-amber-500';
            if (state === 'LIVE TO PUBLIC') stateColor = 'text-emerald-500';

            return { ...v, state, stateColor };
         }
         return v;
      });

      setAgentVacancies(updatedVacancies);
      setSelectedVacancy(null);
   };


   // Manual Profile State
   const [provisioningType, setProvisioningType] = useState('candidate');
   const [profileForm, setProfileForm] = useState({
      name: '',
      email: '',
      sector: 'Hospitality',
      location: '',
      company: '',
      website: '',
      phone: ''
   });

   const handleProvisionAccount = (e) => {
      e.preventDefault();
      popup.success(`Account for ${provisioningType === 'candidate' ? profileForm.name : profileForm.company} successfully provisioned.`);
      setProfileForm({ name: '', email: '', sector: 'Hospitality', location: '', company: '', website: '', phone: '' });
   };

   // --- SEARCH STATE & HANDLERS ---
   // 1. Vacancies
   const [vacancySearchInput, setVacancySearchInput] = useState('');
   const [vacancySearchQuery, setVacancySearchQuery] = useState('');
   const handleVacancySearch = () => setVacancySearchQuery(vacancySearchInput);

   // 2. Resumes
   const [resumeSearchInput, setResumeSearchInput] = useState('');
   const [resumeSearchQuery, setResumeSearchQuery] = useState('');
   const handleResumeSearch = () => setResumeSearchQuery(resumeSearchInput);

   // 3. Applications
   const [appSearchInput, setAppSearchInput] = useState('');
   const [appSearchQuery, setAppSearchQuery] = useState('');
   const handleAppSearch = () => setAppSearchQuery(appSearchInput);

   // 4. Audit Queue
   const [auditSearchInput, setAuditSearchInput] = useState('');
   const [auditSearchQuery, setAuditSearchQuery] = useState('');
   const handleAuditSearch = () => setAuditSearchQuery(auditSearchInput);

   // 5. Candidate Moderation (Vacancy Mgmt)




   // 6. Blacklist Candidates
   const [blacklistSearchInput, setBlacklistSearchInput] = useState('');
   const [blacklistSearchQuery, setBlacklistSearchQuery] = useState('');
   const handleBlacklistSearch = () => setBlacklistSearchQuery(blacklistSearchInput);

   const [isBlacklistFilterOpen, setIsBlacklistFilterOpen] = useState(false);
   const [blacklistFilters, setBlacklistFilters] = useState({ source: 'All', duration: 'All', location: 'All Locations' });

   // --- AGENT ECOSYSTEM FILTERS ---

   // 1. VACANCIES FILTER
   const [isVacancyFilterOpen, setIsVacancyFilterOpen] = useState(false);
   const [vacancyFilters, setVacancyFilters] = useState({ status: [], duration: 'All', location: 'All Locations', education: 'Any Education Level', experience: 'No Experience' });

   const filteredAgentVacancies = agentVacancies.filter(job => {
      // Search Filter
      if (vacancySearchQuery) {
         const q = vacancySearchQuery.toLowerCase();
         // Match Title, Ref, Agency - with safe checks
         const titleMatch = job.title && job.title.toLowerCase().includes(q);
         const refMatch = job.ref && job.ref.toLowerCase().includes(q);
         const agencyMatch = (job.agency && job.agency.toLowerCase().includes(q)) || (job.company && job.company.toLowerCase().includes(q));

         if (!titleMatch && !refMatch && !agencyMatch) return false;
      }
      // Status Filter
      if (vacancyFilters.status.length > 0 && !vacancyFilters.status.includes(job.state || job.status)) return false;
      return true;
   });

   // 2. RESUMES FILTER
   const [isResumeFilterOpen, setIsResumeFilterOpen] = useState(false);
   const [resumeFilters, setResumeFilters] = useState({ status: [], duration: 'All', location: 'All Locations', education: 'Any Education Level', experience: 'No Experience' });
   const filteredAgentResumes = agentResumes.filter(resume => {
      // Exclude REJECTED (Moved to Blacklist)
      if (resume.status === 'REJECTED' || resume.status === 'Rejected') return false;

      // Search Filter
      if (resumeSearchQuery) {
         const q = resumeSearchQuery.toLowerCase();
         // Match Name, Email, Role, Agency
         const matches = resume.name.toLowerCase().includes(q) || resume.email.toLowerCase().includes(q) || resume.role.toLowerCase().includes(q) || resume.agency.toLowerCase().includes(q);
         if (!matches) return false;
      }
      // Status Filter
      if (resumeFilters.status.length > 0 && !resumeFilters.status.includes(resume.status)) return false;
      return true;
   });

   // 3. APPLICATIONS FILTER
   const [isAppFilterOpen, setIsAppFilterOpen] = useState(false);
   const [appFilters, setAppFilters] = useState({ status: [], duration: 'All', location: 'All Locations', education: 'Any Education Level', experience: 'No Experience' });


   const filteredPartnerApplications = pendingAgencies.filter(app => {
      // Exclude REJECTED or BANNED 
      if (app.status === 'REJECTED' || app.status === 'BANNED') return false;

      // Search Filter
      if (appSearchQuery) {
         const q = appSearchQuery.toLowerCase();
         // Match Applicant, Agency, Email
         const applicant = app.full_name || '';
         const agency = app.agency_name || '';
         const email = app.email || '';
         const matches = applicant.toLowerCase().includes(q) || agency.toLowerCase().includes(q) || email.toLowerCase().includes(q);
         if (!matches) return false;
      }
      // Status Filter
      if (appFilters.status.length > 0) {
         if (!appFilters.status.includes(app.status)) return false;
      }
      return true;
   });


   const toggleVacancyFilter = (val) => setVacancyFilters(prev => ({ ...prev, status: prev.status.includes(val) ? prev.status.filter(s => s !== val) : [...prev.status, val] }));
   const toggleResumeFilter = (val) => setResumeFilters(prev => ({ ...prev, status: prev.status.includes(val) ? prev.status.filter(s => s !== val) : [...prev.status, val] }));
   const toggleAppFilter = (val) => setAppFilters(prev => ({ ...prev, status: prev.status.includes(val) ? prev.status.filter(s => s !== val) : [...prev.status, val] }));


   // Vacancy Logic
   const getJobsByIndustry = (industry) => {
      if (!industry) return [];
      return jobs.filter(j => (j.industry || j.category || '').toLowerCase() === industry.toLowerCase());
   };

   const getCandidatesForIndustry = (industry) => {
      const jobs = getJobsByIndustry(industry);
      const jobIds = jobs.map(j => j.id);
      return allApplications.filter(app => jobIds.includes(app.jobId)).map(app => {
         const job = jobs.find(j => j.id === app.jobId);
         return {
            ...app,
            jobTitle: job ? job.title : 'Unknown Role' // Derived Job Role
         };
      });
   };

   const filteredAuditQueue = auditQueue.filter(candidate => {

      // Search Filter
      if (auditSearchQuery) {
         const q = auditSearchQuery.toLowerCase();
         // Match Name, Role, Region, Source
         const matches = candidate.name.toLowerCase().includes(q) || candidate.role.toLowerCase().includes(q) || (candidate.region && candidate.region.toLowerCase().includes(q));
         if (!matches) return false;
      }
      // Status Filter
      if (auditFilters.status.length > 0 && !auditFilters.status.includes(candidate.status)) return false;

      // Source Filter
      if (auditFilters.source !== 'All') {
         if (auditFilters.source === 'Direct Application' && candidate.source !== 'Direct') return false;
         if (auditFilters.source === 'Agency Ref' && candidate.source !== 'Agency') return false;
      }

      return true;
   });

   // Filtering logic for Candidates
   const getFilteredCandidates = (industry) => {
      const candidates = getCandidatesForIndustry(industry);
      return candidates.filter(candidate => {
         // Search Filter
         if (candidateSearchQuery) {
            const q = candidateSearchQuery.toLowerCase();
            // Match Name, Email, Job Title
            const matches = candidate.candidateName.toLowerCase().includes(q) || candidate.email.toLowerCase().includes(q) || candidate.jobTitle.toLowerCase().includes(q);
            if (!matches) return false;
         }

         // Status Filter
         // Note: Candidate 'status' in data matches 'Processing', 'On Hold', 'Selected', 'Rejected' cases
         if (candidateFilters.status.length > 0 && !candidateFilters.status.map(s => s.toUpperCase()).includes(candidate.status.toUpperCase())) return false;

         // Source Filter
         if (candidateFilters.source !== 'All') {
            if (candidateFilters.source === 'Direct Application' && candidate.source !== 'Direct') return false;
            if (candidateFilters.source === 'Agency Ref' && candidate.source !== 'Agency') return false;
         }

         return true;
      });
   };


   const filteredBlacklistedCandidates = (() => {
      // 1. Combine all sources
      const allCandidates = [...auditQueue, ...agentResumes, ...jobApplications];

      // 2. Filter for REJECTED status
      const rejected = allCandidates.filter(c => c.status === 'REJECTED' || c.status === 'Rejected');

      // 3. Deduplicate by ID
      const uniqueRejectedMap = new Map();
      rejected.forEach(c => {
         const id = c.id || c._id;
         if (id && !uniqueRejectedMap.has(id)) {
            uniqueRejectedMap.set(id, c);
         }
      });

      return Array.from(uniqueRejectedMap.values());
   })().filter(candidate => {
      // Logic already filtered for REJECTED above, but keeping structure for search/other filters relies on 'candidate' checks below.
      // Actually, let's keep the existing filter logic structure but apply it to the unique rejected list.

      // Search Filter

      // Search Filter
      if (blacklistSearchQuery) {
         const q = blacklistSearchQuery.toLowerCase();
         // Match Name, Email, Role, Agency
         const matches = candidate.name.toLowerCase().includes(q) || candidate.email.toLowerCase().includes(q) || candidate.role.toLowerCase().includes(q) || (candidate.agency && candidate.agency.toLowerCase().includes(q));
         if (!matches) return false;
      }

      // Source Filter
      if (blacklistFilters.source !== 'All') {
         const isDirect = ('source' in candidate && candidate.source === 'Direct');
         if (blacklistFilters.source === 'Direct Application' && !isDirect) return false;
         if (blacklistFilters.source === 'Agency Ref' && isDirect) return false;
      }

      // Duration Filter
      if (blacklistFilters.duration !== 'All' && blacklistFilters.duration !== 'All Time') {
         if (!candidate.appliedDate) return false;
         const appliedTime = new Date(candidate.appliedDate).getTime();
         const now = Date.now();
         const diffHrs = (now - appliedTime) / (1000 * 60 * 60);
         const diffDays = diffHrs / 24;

         if (blacklistFilters.duration === 'Last 24 Hours' && diffHrs > 24) return false;
         if (blacklistFilters.duration === 'Last 7 Days' && diffDays > 7) return false;
         if (blacklistFilters.duration === 'Last 30 Days' && diffDays > 30) return false;
         if (blacklistFilters.duration === 'Last 3 Months' && diffDays > 90) return false;
      }

      return true;
   });

   const filteredJobApplications = jobApplications.filter(app => {
      // 1. Blacklist Check (Always Active)
      if (app.status === 'Rejected' || app.status === 'REJECTED') return false;

      // 2. Search Query
      const matchesSearch = (app.candidateName || '').toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
         (app.email || '').toLowerCase().includes(candidateSearchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 3. Status Filter
      if (candidateFilters.status.length > 0) {
         const appStatus = app.status || 'Processing';
         const matchesStatus = candidateFilters.status.some(filterStatus => {
            if (filterStatus === 'Approved' && (appStatus === 'Selected' || appStatus === 'Accepted' || appStatus === 'APPROVED')) return true;
            if (filterStatus === 'Processing' && (appStatus === 'APPLIED' || appStatus === 'Applied' || !appStatus)) return true;
            if (filterStatus === 'On Hold' && (appStatus === 'On Hold' || appStatus === 'HOLD')) return true;
            if (filterStatus === 'Rejected') return false;
            return appStatus === filterStatus;
         });
         if (!matchesStatus) return false;
      }

      // 4. Source Filter
      if (candidateFilters.source !== 'All') {
         const isDirect = app.source === 'Direct';
         if (candidateFilters.source === 'Direct Application' && !isDirect) return false;
         if (candidateFilters.source === 'Agency Ref' && isDirect) return false;
      }

      // 5. Duration Filter
      if (candidateFilters.duration !== 'All') {
         const appliedDate = new Date(app.appliedDate || new Date());
         const now = new Date();
         const diffMs = now - appliedDate;
         const diffHours = diffMs / (1000 * 60 * 60);
         const diffDays = diffHours / 24;

         if (candidateFilters.duration === 'Since 1 hr' && diffHours > 1) return false;
         if (candidateFilters.duration === 'Since 1 week' && diffDays > 7) return false;
         if (candidateFilters.duration === 'Since 1 month' && diffDays > 30) return false;
         if (candidateFilters.duration === 'Since 3 months' && diffDays > 90) return false;
      }

      return true;
   });

   // Filtering logic for Agent Rejections
   const filteredAgentRejections = pendingAgencies
      .filter((app, index, self) =>
         index === self.findIndex(t => (t.id || t._id) === (app.id || app._id))
      )
      .filter(app => {
         // Must be REJECTED or BANNED
         if (app.status !== 'REJECTED' && app.status !== 'BANNED') return false;

         // Search Filter
         if (agentBlacklistSearchQuery) {
            const q = agentBlacklistSearchQuery.toLowerCase();
            // Match Name, Agency, Region
            const applicant = app.full_name || '';
            const agency = app.agency_name || '';
            const email = app.email || '';
            const matches = applicant.toLowerCase().includes(q) || agency.toLowerCase().includes(q) || email.toLowerCase().includes(q);
            if (!matches) return false;
         }

         // Source Filter (Agency is inherent, but we can filter by Agency Name presence or specific logic if needed. 
         // For now replicating generic behavior or filtering by agency name if 'source' selected was specific, 
         // but keeping it simple as per user request to be "same as first table" which had 'Agency Ref' vs 'Direct'. 
         // Since these are ALL Agents, maybe source filter is less relevant or should filter by 'Agency Name' vs 'Individual Agent'? 
         // Let's stick to the requested dropdowns. 
         // Actually, partner apps usually come from Agencies. 
         // If the user wants "same options", we might just show them but they might be all "Agency Ref". 
         // Better: Filter by Agency Name if user selects specific agencies? 
         // Or just keep it simpler: If user selects 'Direct', show nothing? 
         // Let's implement generic logic:
         // If filter is 'Agencies', match all.
         // If 'Direct', match none (since they are agents). 
         // This is technically correct based on "same options".
         if (agentBlacklistFilters.source !== 'All') {
            if (agentBlacklistFilters.source === 'Direct Application') return false; // Agents are not direct
            // If 'Agency Ref', all pass.
         }

         // Duration Filter (Assuming app has a date field, if not, we might need one. 
         // Mock data `MOCK_NEW_PARTNER_APPS` doesn't explicitly show date in previous view. 
         // I'll assume `submittedDate` or similar exists or fallback to passing all if missing for now/safety.)
         if (agentBlacklistFilters.duration !== 'All' && agentBlacklistFilters.duration !== 'All Time') {
            // Fallback date or real date
            const date = app.submittedDate || app.date || new Date().toISOString();
            const appliedTime = new Date(date).getTime();
            const now = Date.now();
            const diffHrs = (now - appliedTime) / (1000 * 60 * 60);
            const diffDays = diffHrs / 24;

            if (agentBlacklistFilters.duration === 'Last 24 Hours' && diffHrs > 24) return false;
            if (agentBlacklistFilters.duration === 'Last 7 Days' && diffDays > 7) return false;
            if (agentBlacklistFilters.duration === 'Last 30 Days' && diffDays > 30) return false;
            if (agentBlacklistFilters.duration === 'Last 3 Months' && diffDays > 90) return false;
         }

         return true;
      });

   const getPageTitle = () => {
      switch (activeTab) {
         case 'overview': return 'Dashboard Overview';
         case 'audit': return 'Audit Queue';
         case 'vacancies': return selectedJob ? selectedJob.title : (selectedCategory ? selectedCategory : 'Vacancy Management');
         case 'agents': return 'Agent Ecosystem';
         case 'create_profile': return 'Account Provisioning';
         case 'blacklisted': return 'Blacklisted Candidates';
         default: return 'Dashboard';
      }
   };

   return (
      <>
         <div className="min-h-screen bg-white font-sans flex flex-col">
            {/* SUCCESS NOTIFICATION */}
            {showSuccessNotification && (
               <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                     <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-black text-sm uppercase tracking-wider">Success</h4>
                     <p className="text-xs font-medium opacity-90">Vacancy Requirements submitted</p>
                  </div>
               </div>
            )}

            {/* CATEGORY MANAGEMENT MODAL */}
            {isCategoryModalOpen && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Manage Categories</h3>
                        <button onClick={() => setIsCategoryModalOpen(false)} className="text-black font-bold hover:text-slate-600">
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="mb-6">
                        <input
                           type="text"
                           value={newCategoryName}
                           onChange={(e) => {
                              setNewCategoryName(e.target.value);
                              if (categoryError) setCategoryError(''); // Clear error on typing
                           }}
                           placeholder="New Category Name"
                           className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 ${categoryError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-teal-500/20'}`}
                        />
                        {categoryError && (
                           <p className="text-xs font-bold text-red-500 mt-2 ml-1">{categoryError}</p>
                        )}
                        <div className="flex gap-2 mt-4 justify-end">
                           <button
                              onClick={() => {
                                 setIsCategoryModalOpen(false);
                                 setNewCategoryName('');
                                 setCategoryError('');
                              }}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                           >
                              Cancel
                           </button>
                           <button
                              onClick={handleAddCategory}
                              disabled={!newCategoryName.trim()}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                           >
                              Add
                           </button>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {categories.map((cat) => (
                           <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                              <span className="font-bold text-sm text-slate-700">{cat}</span>
                              <button
                                 onClick={() => handleDeleteCategory(cat)}
                                 className="p-2 text-black font-bold hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                 title="Delete Category"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
            {/* CREDENTIALS MODAL */}
            {
               showCredentialsModal && approvedCredentials && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] animate-in fade-in duration-200">
                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6" />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-slate-900">Agency Approved!</h3>
                              <p className="text-sm text-slate-500">Agent credentials generated</p>
                           </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-5 space-y-4 mb-6">
                           <div>
                              <p className="text-[10px] font-bold text-black font-bold uppercase tracking-wider mb-1">Email</p>
                              <p className="text-sm font-bold text-slate-900 font-mono">{approvedCredentials.email}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-black font-bold uppercase tracking-wider mb-1">Temporary Password</p>
                              <p className="text-sm font-bold text-teal-600 font-mono">
                                 {approvedCredentials.temporaryPassword || 'Not exposed via API for security'}
                              </p>
                           </div>
                        </div>

                        <p className="text-xs text-slate-500 mb-6">
                           Credentials are no longer returned in API responses. Ask the agency to use secure onboarding/reset flow.
                        </p>

                        <button
                           onClick={() => {
                              setShowCredentialsModal(false);
                              setApprovedCredentials(null);
                           }}
                           className="w-full py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors"
                        >
                           Close
                        </button>
                     </div>
                  </div>
               )
            }

            {/* PREMIUM JOBS MODAL */}
            {
               isPremiumModalOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] animate-in fade-in duration-200">
                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                 <Star className="w-6 h-6 fill-current" />
                              </div>
                              <div>
                                 <h3 className="text-lg font-bold text-slate-900">Premium Management</h3>
                                 <p className="text-sm text-slate-500">Highlight top roles for {selectedCategory}</p>
                              </div>
                           </div>
                           <button onClick={() => setIsPremiumModalOpen(false)} className="text-black font-bold hover:text-slate-600">
                              <X className="w-5 h-5" />
                           </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-6">
                           {getJobsByIndustry(selectedCategory).length > 0 ? (
                              getJobsByIndustry(selectedCategory).map((job) => (
                                 <div key={job.id || job._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                    <div>
                                       <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                                       <p className="text-xs text-slate-500">{job.company}</p>
                                    </div>
                                    <button
                                       onClick={() => handleTogglePremium(job.id || job._id)}
                                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${job.is_premium ? 'bg-amber-500' : 'bg-slate-200'}`}
                                    >
                                       <span
                                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.is_premium ? 'translate-x-6' : 'translate-x-1'}`}
                                       />
                                       {job.is_premium && <Star className="absolute left-1.5 w-3 h-3 text-amber-600 fill-current" />}
                                    </button>
                                 </div>
                              ))
                           ) : (
                              <p className="text-center text-black font-bold text-sm py-4">No jobs found in this category.</p>
                           )}
                        </div>

                        <div className="flex justify-end">
                           <button
                              onClick={() => setIsPremiumModalOpen(false)}
                              className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                           >
                              Done
                           </button>
                        </div>
                     </div>
                  </div>
               )
            }

            {/* DELETE JOBS MODAL */}
            {
               isDeleteJobsModalOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] animate-in fade-in duration-200">
                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                 <Trash2 className="w-6 h-6" />
                              </div>
                              <div>
                                 <h3 className="text-lg font-bold text-slate-900">Delete Jobs</h3>
                                 <p className="text-sm text-slate-500">Remove unused roles from {selectedCategory}</p>
                              </div>
                           </div>
                           <button onClick={() => setIsDeleteJobsModalOpen(false)} className="text-black font-bold hover:text-slate-600">
                              <X className="w-5 h-5" />
                           </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-6">
                           {categoryJobs.length > 0 ? (
                              categoryJobs.map((job) => {
                                 const appCount = applicationCounts[job.id] || applicationCounts[job._id] || 0;
                                 const canDelete = appCount === 0;

                                 return (
                                    <div key={job.id || job._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                       <div>
                                          <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                                          <div className="flex items-center gap-2 mt-1">
                                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${canDelete ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                                                {appCount} Application{appCount !== 1 ? 's' : ''}
                                             </span>
                                          </div>
                                       </div>
                                       <button
                                          onClick={() => canDelete && handleDeleteJobFromList(job.id || job._id)}
                                          disabled={!canDelete}
                                          className={`p-2 rounded-lg transition-colors ${canDelete ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                                          title={canDelete ? "Delete Job" : "Cannot delete job with active applications"}
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>
                                 );
                              })
                           ) : (
                              <p className="text-center text-black font-bold text-sm py-4">No jobs found in this category.</p>
                           )}
                        </div>

                        <div className="flex justify-end">
                           <button
                              onClick={() => setIsDeleteJobsModalOpen(false)}
                              className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                           >
                              Close
                           </button>
                        </div>
                     </div>
                  </div>
               )
            }

            <div className="flex flex-1">
               {/* SIDEBAR */}
               <DashboardSidebar
                  activeTab={activeTab}
                  setActiveTab={(tab) => {
                     setActiveTab(tab);
                     setSelectedCategory(null);
                     // Mark items as viewed when navigating to a tab
                     if (tab === 'audit') {
                        const auditIds = auditQueue.filter(i => i.status === 'PROCESSING' || i.status === 'Processing').map(i => i._id || i.id);
                        if (auditIds.length > 0) markApplicationsViewed(auditIds);
                     } else if (tab === 'agents') {
                        const agentIds = [
                           ...agentVacancies.map(v => v._id || v.id),
                           ...agentResumes.map(r => r._id || r.id),
                           ...pendingAgencies.map(p => p._id || p.id),
                           ...pendingAgencies.filter(a => a.status === 'PENDING').map(a => a._id || a.id)
                        ];
                        if (agentIds.length > 0) markApplicationsViewed(agentIds);
                     }
                  }}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  notificationCounts={{
                     audit: auditQueue.filter(i => (i.status === 'PROCESSING' || i.status === 'Processing') && isAppUnviewed(i)).length,
                     vacancies: allApplications.filter(a => (a.status === 'APPLIED' || a.status === 'Applied') && isAppUnviewed(a)).length,
                     agents: agentVacancies.filter(v => isAppUnviewed(v)).length + agentResumes.filter(r => isAppUnviewed(r)).length + pendingAgencies.filter(p => p.status === 'PENDING' && isAppUnviewed(p)).length
                  }}
               />

               {/* MAIN CONTENT */}
               {/* MAIN CONTENT */}
               <main className="flex-1 flex flex-col relative w-full bg-slate-50/50 min-h-screen">
                  <DashboardHeader
                     onMenuClick={() => setIsSidebarOpen(true)}
                     title={getPageTitle()}
                     onRefresh={() => { fetchAllData(true); fetchPendingAgents(true); fetchApplicationCounts(); }}
                     isRefreshing={isLoadingJobs || isRefreshingAgents}
                  />
                  {/* CONTENT SCROLL AREA */}
                  <div className="flex-1 p-4 md:p-8 overflow-visible">
                     <div className="max-w-6xl mx-auto space-y-8">

                        {/* PAGE TITLE REDMOVED */}
                        <div className="flex items-center justify-between">
                           {/* Global Action Button (Example) */}
                           {activeTab === 'overview' && (
                              <div className="mb-6"></div>
                           )}

                           {activeTab === 'vacancies' && selectedCategory && (
                              <button onClick={() => setSelectedCategory(null)} className="text-sm font-bold text-slate-500 hover:text-slate-900 mb-6">
                                 Back to Categories
                              </button>
                           )}
                        </div>

                        {/* OVERVIEW CONTENT */}
                        {activeTab === 'overview' && (
                           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                              {/* Custom Stats Grid - GOVERNANCE HUB */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {[
                                    { label: "AUDIT QUEUE", value: auditQueue.length.toString(), icon: null, action: () => setActiveTab('audit') },
                                    { label: "VACANCIES", value: jobs.length.toString(), icon: null, action: () => setActiveTab('vacancies') },
                                    { label: "AGENT FLOW", value: pendingAgencies.length.toString(), icon: null, action: () => setActiveTab('agents') },
                                    { label: "BLACKLISTED", value: allApplications.filter(a => a.status === 'Blacklisted').length.toString(), icon: null, textRed: true, action: () => setActiveTab('blacklisted') },
                                 ].map((stat, idx) => (
                                    <div
                                       key={idx}
                                       onClick={stat.action}
                                       className={`bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-center h-48 relative overflow-hidden group hover:shadow-lg ${stat.textRed ? 'hover:border-red-500' : 'hover:border-emerald-500'} cursor-pointer transition-all`}
                                    >
                                       <div className="absolute right-0 top-0 h-full w-24 bg-slate-50/50 skew-x-12 translate-x-12"></div>
                                       <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${stat.textRed ? 'text-red-500' : 'text-black font-bold'}`}>
                                          {stat.label}
                                       </p>
                                       <h2 className={`text-6xl font-black tracking-tight z-10 ${stat.textRed ? 'text-red-500' : 'text-slate-900'} ${idx === 1 ? 'text-teal-600' : ''} ${idx === 2 ? 'text-amber-500' : ''}`}>
                                          {stat.value}
                                       </h2>
                                       <div className="absolute right-6 bottom-6 opacity-5">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                       </div>
                                    </div>
                                 ))}
                              </div>


                           </div>
                        )}


                        {/* AUDIT QUEUE CONTENT */}
                        {activeTab === 'audit' && (
                           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative">
                                 <div className="p-6 border-b border-slate-100 flex justify-between items-center relative rounded-t-xl">
                                    <h3 className="font-bold text-slate-900 text-2xl">Audit Queue</h3>
                                    <div className="flex items-center gap-3">
                                       <div className="relative">
                                          <input
                                             type="text"
                                             placeholder="Search audit queue..."
                                             className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-64"
                                             value={auditSearchInput}
                                             onChange={(e) => setAuditSearchInput(e.target.value)}
                                             onKeyDown={(e) => e.key === 'Enter' && handleAuditSearch()}
                                          />
                                          <button
                                             onClick={handleAuditSearch}
                                             className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-bold hover:text-teal-600 transition-colors"
                                          >
                                             <Search className="w-4 h-4" />
                                          </button>
                                       </div>
                                       <div className="relative">
                                          <button
                                             onClick={() => setIsAuditFilterOpen(!isAuditFilterOpen)}
                                             className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isAuditFilterOpen ? 'bg-teal-50 text-teal-600' : 'text-black font-bold hover:text-slate-600 hover:bg-slate-50'}`}
                                          >
                                             <Filter className="w-4 h-4" />
                                          </button>
                                          {isAuditFilterOpen && (
                                             <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3 space-y-3">

                                                   {/* 1. Status */}
                                                   <div className="space-y-2">
                                                      <h4 className="text-[9px] font-black uppercase text-black font-bold tracking-widest">1. Status</h4>
                                                      <div className="space-y-1.5">
                                                         {['Processing', 'On Hold', 'Selected'].map(status => (
                                                            <label key={status} className="flex items-center gap-2 cursor-pointer group">
                                                               <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${auditFilters.status.includes(status.toUpperCase()) ? 'bg-teal-600 border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                  {auditFilters.status.includes(status.toUpperCase()) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                                               </div>
                                                               <input
                                                                  type="checkbox"
                                                                  className="hidden"
                                                                  checked={auditFilters.status.includes(status.toUpperCase())}
                                                                  onChange={() => toggleAuditStatusFilter(status.toUpperCase())}
                                                               />
                                                               <span className="text-xs font-bold text-slate-700">{status}</span>
                                                            </label>
                                                         ))}
                                                      </div>
                                                   </div>

                                                   {/* 2. Source */}
                                                   <div className="space-y-2">
                                                      <h4 className="text-[9px] font-black uppercase text-black font-bold tracking-widest">2. Source</h4>
                                                      <div className="space-y-1.5">
                                                         {['Direct Application', 'Agency Ref'].map(source => (
                                                            <label key={source} className="flex items-center gap-2 cursor-pointer group">
                                                               <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${auditFilters.source === source ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                  {auditFilters.source === source && <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                                                               </div>
                                                               <input
                                                                  type="radio"
                                                                  className="hidden"
                                                                  checked={auditFilters.source === source}
                                                                  onChange={() => setAuditFilters({ ...auditFilters, source })}
                                                               />
                                                               <span className="text-xs font-bold text-slate-700">{source}</span>
                                                            </label>
                                                         ))}
                                                      </div>
                                                   </div>

                                                   {/* 3. Duration */}
                                                   <div className="space-y-2">
                                                      <h4 className="text-[9px] font-black uppercase text-black font-bold tracking-widest">3. Duration</h4>
                                                      <div className="space-y-1.5">
                                                         {['Since 1 hr', 'Since 1 week', 'Since 1 month', 'Since 3 months', 'All'].map(duration => (
                                                            <label key={duration} className="flex items-center gap-2 cursor-pointer group">
                                                               <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${auditFilters.duration === duration ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                  {auditFilters.duration === duration && <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                                                               </div>
                                                               <input
                                                                  type="radio"
                                                                  className="hidden"
                                                                  checked={auditFilters.duration === duration}
                                                                  onChange={() => setAuditFilters({ ...auditFilters, duration })}
                                                               />
                                                               <span className="text-xs font-bold text-slate-700">{duration}</span>
                                                            </label>
                                                         ))}
                                                      </div>
                                                   </div>
                                                   {/* 4. Education */}
                                                   <div className="space-y-2 mt-4">
                                                      <h4 className="text-[9px] font-black uppercase text-black font-bold tracking-widest">4. Education</h4>
                                                      <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                                                         {['Any Education Level', 'O-Level / Secondary School', 'A-Level / Higher Secondary', 'Certificate', 'Diploma', 'Advanced Diploma', "Bachelor's Degree", "Master's Degree", 'Doctorate / PhD'].map(edu => (
                                                            <label key={edu} className="flex items-center gap-2 cursor-pointer group">
                                                               <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${auditFilters.education === edu ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                  {auditFilters.education === edu && <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                                                               </div>
                                                               <input
                                                                  type="radio"
                                                                  className="hidden"
                                                                  checked={auditFilters.education === edu}
                                                                  onChange={() => setAuditFilters({ ...auditFilters, education: edu })}
                                                               />
                                                               <span className="text-xs font-bold text-slate-700">{edu}</span>
                                                            </label>
                                                         ))}
                                                      </div>
                                                   </div>
                                                   {/* 5. Experience */}
                                                   <div className="space-y-2 mt-4">
                                                      <h4 className="text-[9px] font-black uppercase text-black font-bold tracking-widest">5. Experience</h4>
                                                      <div className="space-y-1.5">
                                                         {['No Experience', '1 \u2013 2 Years', '3 \u2013 5 Years', '6 \u2013 10 Years', '10+ Years'].map(exp => (
                                                            <label key={exp} className="flex items-center gap-2 cursor-pointer group">
                                                               <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${auditFilters.experience === exp ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                  {auditFilters.experience === exp && <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                                                               </div>
                                                               <input type="radio" className="hidden" checked={auditFilters.experience === exp} onChange={() => setAuditFilters({ ...auditFilters, experience: exp })} />
                                                               <span className="text-xs font-bold text-slate-700">{exp}</span>
                                                            </label>
                                                         ))}
                                                      </div>
                                                   </div>
                                                   <div className="space-y-3">
                                                      <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">6. Location</h4>
                                                      <select
                                                         value={auditFilters.location}
                                                         onChange={(e) => setAuditFilters({ ...auditFilters, location: e.target.value })}
                                                         className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors"
                                                      >
                                                         {MALDIVES_LOCATIONS.map(loc => (
                                                            <option key={loc} value={loc}>{loc}</option>
                                                         ))}
                                                      </select>
                                                   </div>
                                                </div>

                                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                                   <button
                                                      onClick={() => setAuditFilters({ status: [], source: 'All', duration: 'All', location: 'All Locations' })}
                                                      className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                                                   >
                                                      Clear
                                                   </button>
                                                   <button
                                                      onClick={() => setIsAuditFilterOpen(false)}
                                                      className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                                                   >
                                                      Apply
                                                   </button>
                                                </div>
                                             </div>
                                          )}
                                       </div >
                                    </div > {/* This closes the flex items-center gap-3 div */}
                                 </div> {/* This closes the p-6 border-b div */}
                                 <div className="overflow-x-auto">
                                    {isLoadingVisibilityRequests ? (
                                       <div className="py-12 text-center text-black font-bold">
                                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                          <p className="text-sm">Loading requests...</p>
                                       </div>
                                    ) : filteredAuditQueue.length > 0 ? (
                                       <table className="w-full text-left">
                                          <thead className="text-black font-bold">
                                             <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Candidate Name</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Category</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Source</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Application Status</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-right text-black font-bold">Action</th>
                                             </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-50">
                                             {filteredAuditQueue.map((request) => (
                                                <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                                                   <td className="px-6 py-4">
                                                      <div>
                                                         <p className="text-sm font-bold text-slate-900">{request.name}</p>
                                                         <p className="text-xs text-black font-bold font-medium">{request.region || 'Unknown Location'}</p>
                                                      </div>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <div>
                                                         <p className="text-sm font-bold text-slate-900">{request.category || 'N/A'}</p>
                                                         <p className="text-xs text-slate-500 font-medium">{request.role || 'General'}</p>
                                                      </div>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <span className="text-sm font-medium text-slate-600">{request.source || 'Direct'}</span>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                                                         {request.status}
                                                      </span>
                                                   </td>
                                                   <td className="px-6 py-4 text-right">
                                                      <div className="flex items-center justify-end gap-2">
                                                         <button
                                                            onClick={() => setSelectedResume(request)}
                                                            className="px-4 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                                                         >
                                                            <Eye className="w-3 h-3" /> View Details
                                                         </button>
                                                      </div>
                                                   </td>
                                                </tr>
                                             ))}
                                          </tbody>
                                       </table>
                                    ) : (
                                       <div className="py-12 text-center text-black font-bold">
                                          <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                          <p className="text-sm">No record exist !!</p>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* VACANCIES CONTENT - HIERARCHICAL VIEW */}
                        {activeTab === 'vacancies' && (
                           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                              {/* VIEW 1: CATEGORIES (Default) */}
                              {vacancyViewMode === 'CATEGORIES' && (
                                 <>
                                    <div className="flex justify-between items-center mb-6">
                                       <h2 className="text-2xl font-bold text-slate-900">Vacancy Management</h2>
                                       <button
                                          onClick={() => setIsCategoryModalOpen(true)}
                                          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2"
                                       >
                                          <Settings className="w-4 h-4" /> Manage Category
                                       </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                       {categories.map((industry) => {
                                          // Fix: Use direct filtering instead of missing function
                                          const jobCount = jobs.filter(j => j.industry === industry).length;
                                          const industryJobs = jobs.filter(j => j.industry === industry);
                                          const newAppCount = allApplications.filter(a =>
                                             (a.status === 'APPLIED' || a.status === 'Applied') &&
                                             industryJobs.some(j => (j._id || j.id) === a.jobId) &&
                                             isAppUnviewed(a)
                                          ).length;
                                          return (
                                             <button
                                                key={industry}
                                                onClick={() => handleCategoryClick(industry)}
                                                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all text-left flex flex-col items-start h-full group relative"
                                             >
                                                {newAppCount > 0 && (
                                                   <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                                      {newAppCount > 99 ? '99+' : newAppCount}
                                                   </span>
                                                )}
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-black font-bold group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                                   <Briefcase className="w-7 h-7" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">{industry}</h3>
                                                <p className="text-sm text-slate-500 font-medium">{jobCount} Active Jobs</p>
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </>
                              )}

                              {/* VIEW 2: JOBS LIST */}
                              {vacancyViewMode === 'JOBS' && (
                                 <div className="space-y-6">
                                    {/* Back Button & Header */}
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-4">
                                          <button
                                             onClick={handleBackToCategories}
                                             className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                                          >
                                             <ArrowLeft className="w-5 h-5" />
                                          </button>
                                          <div>
                                             <h2 className="text-2xl font-bold text-slate-900">{selectedCategory} Jobs</h2>
                                             <p className="text-sm text-slate-500 mt-1">{categoryJobs.length} Active Jobs</p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-2 relative">
                                          <button
                                             onClick={() => setIsManageJobMenuOpen(!isManageJobMenuOpen)}
                                             className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2"
                                          >
                                             <Settings className="w-4 h-4" /> Manage Jobs
                                          </button>

                                          {isManageJobMenuOpen && (
                                             <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                                <div className="p-1">
                                                   <button
                                                      onClick={() => {
                                                         setNewVacancy({
                                                            title: '',
                                                            industry: selectedCategory,
                                                            salary: '',
                                                            headcount: '',
                                                            description: '',
                                                            companyName: '',
                                                            address: '',
                                                            required_documents: []
                                                         });
                                                         setIsAddVacancyOpen(true);
                                                         setIsManageJobMenuOpen(false);
                                                      }}
                                                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                                                   >
                                                      <Plus className="w-4 h-4 text-emerald-500" /> Add New Job
                                                   </button>
                                                   <button
                                                      onClick={() => {
                                                         setIsPremiumModalOpen(true);
                                                         setIsManageJobMenuOpen(false);
                                                      }}
                                                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors flex items-center gap-2"
                                                   >
                                                      <Star className="w-4 h-4 text-amber-500" /> Premium Jobs
                                                   </button>
                                                   <div className="h-px bg-slate-100 my-1"></div>
                                                   <button
                                                      onClick={() => {
                                                         fetchApplicationCounts();
                                                         setIsDeleteJobsModalOpen(true);
                                                         setIsManageJobMenuOpen(false);
                                                      }}
                                                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                                                   >
                                                      <Trash2 className="w-4 h-4 text-red-500" /> Delete Jobs
                                                   </button>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    </div>

                                    {/* Jobs Content */}
                                    {isLoadingJobs ? (
                                       <div className="p-12 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200">
                                          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                                          <p className="text-slate-500 font-medium">Loading jobs...</p>
                                       </div>
                                    ) : categoryJobs.length > 0 ? (
                                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                          {categoryJobs.map((job) => {
                                             const jobNewApps = allApplications.filter(a =>
                                                (a.status === 'APPLIED' || a.status === 'Applied') &&
                                                (a.jobId === (job._id || job.id)) &&
                                                isAppUnviewed(a)
                                             ).length;
                                             return (
                                                <div
                                                   key={job._id || job.id}
                                                   className={`p-6 rounded-2xl border transition-all group flex flex-col h-full relative ${job.is_premium ? 'bg-white border-amber-200 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200'}`}
                                                >
                                                   {jobNewApps > 0 && (
                                                      <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                                         {jobNewApps > 99 ? '99+' : jobNewApps} New
                                                      </span>
                                                   )}
                                                   <div className="flex justify-between items-start mb-4">
                                                      <div>
                                                         <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-lg text-slate-900 line-clamp-1" title={job.title}>{job.title}</h3>
                                                            {job.is_premium && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                                         </div>
                                                         <p className="text-xs font-bold text-black font-bold uppercase tracking-wider">{job.industry}</p>
                                                      </div>
                                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                         {job.status || 'OPEN'}
                                                      </span>
                                                   </div>

                                                   <div className="space-y-3 mb-6 flex-1">
                                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                                         <Building2 className="w-4 h-4 text-black font-bold" />
                                                         <span className="truncate">{job.company || 'N/A'}</span>
                                                      </div>
                                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                                         <MapPin className="w-4 h-4 text-black font-bold" />
                                                         <span className="truncate">{job.location || 'N/A'}</span>
                                                      </div>
                                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                                         <DollarSign className="w-4 h-4 text-black font-bold" />
                                                         <span className="font-bold text-teal-600">{formatSalary(job.salary_range)}</span>
                                                      </div>
                                                   </div>

                                                   <button
                                                      onClick={() => handleJobClick(job)}
                                                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                                   >
                                                      <Users className="w-3 h-3" /> View Applicants
                                                   </button>
                                                </div>
                                             );
                                          })}
                                       </div>
                                    ) : (
                                       <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                             <Briefcase className="w-8 h-8 text-slate-300" />
                                          </div>
                                          <p className="text-slate-500 font-medium">No jobs found in this category</p>
                                       </div>
                                    )}
                                 </div>
                              )}
                              {/* VIEW 3: CANDIDATES LIST */}
                              {vacancyViewMode === 'CANDIDATES' && (
                                 <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-4">
                                          <button
                                             onClick={handleBackToJobs}
                                             className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                                          >
                                             <ArrowLeft className="w-4 h-4" /> Back to Jobs
                                          </button>
                                          <span className="text-slate-300">|</span>
                                          <h2 className="text-xl font-bold text-slate-900">Candidates for: {selectedJobTitle}</h2>
                                       </div>
                                    </div>

                                    {/* Candidates Table */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

                                       {/* Search and Filter Header */}
                                       <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                                          <div className="relative flex-1 max-w-md">
                                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black font-bold" />
                                             <input
                                                type="text"
                                                placeholder="Search candidates..."
                                                value={candidateSearchQuery}
                                                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                             />
                                          </div>
                                          <div className="relative">
                                             <button
                                                onClick={() => setIsCandidateFilterOpen(!isCandidateFilterOpen)}
                                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold transition-colors ${isCandidateFilterOpen ? 'bg-teal-50 border-teal-200 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                             >
                                                <Filter className="w-4 h-4" /> Filter
                                             </button>

                                             {isCandidateFilterOpen && (
                                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                   <div className="max-h-[35vh] overflow-y-auto custom-scrollbar p-4 space-y-5">
                                                      {/* 1. STATUS */}
                                                      <div className="space-y-2">
                                                         <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">1. Status</h4>
                                                         <div className="space-y-2">
                                                            {['Processing', 'On Hold', 'Approved'].map(status => (
                                                               <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${candidateFilters.status.includes(status) ? 'bg-teal-600 border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                     {candidateFilters.status.includes(status) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                                  </div>
                                                                  <input
                                                                     type="checkbox"
                                                                     className="hidden"
                                                                     checked={candidateFilters.status.includes(status)}
                                                                     onChange={() => toggleCandidateFilter('status', status)}
                                                                  />
                                                                  <span className="text-xs font-bold text-slate-700">{status}</span>
                                                               </label>
                                                            ))}
                                                         </div>
                                                      </div>

                                                      {/* 2. SOURCE */}
                                                      <div className="space-y-2">
                                                         <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">2. Source</h4>
                                                         <div className="space-y-2">
                                                            {['Direct Application', 'Agency Ref'].map(source => (
                                                               <label key={source} className="flex items-center gap-3 cursor-pointer group">
                                                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${candidateFilters.source === source ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                     {candidateFilters.source === source && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                  </div>
                                                                  <input
                                                                     type="radio"
                                                                     className="hidden"
                                                                     checked={candidateFilters.source === source}
                                                                     onChange={() => toggleCandidateFilter('source', source)}
                                                                  />
                                                                  <span className="text-xs font-bold text-slate-700">{source}</span>
                                                               </label>
                                                            ))}
                                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                               <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${candidateFilters.source === 'All' ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                  {candidateFilters.source === 'All' && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                               </div>
                                                               <input
                                                                  type="radio"
                                                                  className="hidden"
                                                                  checked={candidateFilters.source === 'All'}
                                                                  onChange={() => toggleCandidateFilter('source', 'All')}
                                                               />
                                                               <span className="text-xs font-bold text-slate-700">All</span>
                                                            </label>
                                                         </div>
                                                      </div>

                                                      {/* 3. DURATION */}
                                                      <div className="space-y-2">
                                                         <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">3. Duration</h4>
                                                         <div className="space-y-2">
                                                            {['Since 1 hr', 'Since 1 week', 'Since 1 month', 'Since 3 months', 'All'].map(duration => (
                                                               <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                                                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${candidateFilters.duration === duration ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                     {candidateFilters.duration === duration && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                  </div>
                                                                  <input
                                                                     type="radio"
                                                                     className="hidden"
                                                                     checked={candidateFilters.duration === duration}
                                                                     onChange={() => toggleCandidateFilter('duration', duration)}
                                                                  />
                                                                  <span className="text-xs font-bold text-slate-700">{duration}</span>
                                                               </label>
                                                            ))}
                                                         </div>
                                                      </div>
                                                      {/* 4. Education */}
                                                      <div className="space-y-2 mt-4">
                                                         <h4 className="text-[9px] font-black uppercase text-black font-bold tracking-widest">4. Education</h4>
                                                         <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                                                            {['Any Education Level', 'O-Level / Secondary School', 'A-Level / Higher Secondary', 'Certificate', 'Diploma', 'Advanced Diploma', "Bachelor's Degree", "Master's Degree", 'Doctorate / PhD'].map(edu => (
                                                               <label key={edu} className="flex items-center gap-2 cursor-pointer group">
                                                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${auditFilters.education === edu ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                     {auditFilters.education === edu && <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                                                                  </div>
                                                                  <input
                                                                     type="radio"
                                                                     className="hidden"
                                                                     checked={auditFilters.education === edu}
                                                                     onChange={() => setAuditFilters({ ...auditFilters, education: edu })}
                                                                  />
                                                                  <span className="text-xs font-bold text-slate-700">{edu}</span>
                                                               </label>
                                                            ))}
                                                         </div>
                                                      </div>
                                                      {/* 5. Experience */}
                                                      <div className="space-y-2 mt-4">
                                                         <h4 className="text-[9px] font-black uppercase text-black font-bold tracking-widest">5. Experience</h4>
                                                         <div className="space-y-1.5">
                                                            {['No Experience', '1 \u2013 2 Years', '3 \u2013 5 Years', '6 \u2013 10 Years', '10+ Years'].map(exp => (
                                                               <label key={exp} className="flex items-center gap-2 cursor-pointer group">
                                                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${auditFilters.experience === exp ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                     {auditFilters.experience === exp && <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                                                                  </div>
                                                                  <input type="radio" className="hidden" checked={auditFilters.experience === exp} onChange={() => setAuditFilters({ ...auditFilters, experience: exp })} />
                                                                  <span className="text-xs font-bold text-slate-700">{exp}</span>
                                                               </label>
                                                            ))}
                                                         </div>
                                                      </div>
                                                      <div className="space-y-3">
                                                         <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">6. Location</h4>
                                                         <select
                                                            value={candidateFilters.location}
                                                            onChange={(e) => setCandidateFilters({ ...candidateFilters, location: e.target.value })}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors"
                                                         >
                                                            {MALDIVES_LOCATIONS.map(loc => (
                                                               <option key={loc} value={loc}>{loc}</option>
                                                            ))}
                                                         </select>
                                                      </div>
                                                   </div>

                                                   <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 relative z-10">
                                                      <button
                                                         onClick={() => {
                                                            setCandidateFilters({ status: [], source: 'All', duration: 'All', location: 'All Locations' });
                                                            setIsCandidateFilterOpen(false);
                                                         }}
                                                         className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                                                      >
                                                         Clear
                                                      </button>
                                                      <button
                                                         onClick={() => setIsCandidateFilterOpen(false)}
                                                         className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                                                      >
                                                         Apply
                                                      </button>
                                                   </div>
                                                </div>
                                             )}
                                          </div>
                                       </div>

                                       {isLoadingApplications ? (
                                          <div className="p-12 flex flex-col items-center justify-center">
                                             <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                                             <p className="text-slate-500 font-medium">Loading applicants...</p>
                                          </div>
                                       ) : (
                                          filteredJobApplications.length > 0 ? (
                                             <table className="w-full text-left">
                                                <thead className="text-black font-bold">
                                                   <tr className="bg-slate-50 border-b border-slate-100">
                                                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Candidate Name</th>
                                                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Source</th>
                                                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Status</th>
                                                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-right text-black font-bold">Actions</th>
                                                   </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                   {filteredJobApplications.map((app) => (
                                                      <tr key={app.id || app._id} className="hover:bg-slate-50/50 transition-colors">
                                                         <td className="px-6 py-4">
                                                            <div>
                                                               <p className="text-sm font-bold text-slate-900">{app.candidateName || app.name || 'Unknown'}</p>
                                                               <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                                                                  <MapPin className="w-3 h-3" />
                                                                  <span>{app.address || 'N/A'}</span>
                                                               </div>
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-4">
                                                            <div>
                                                               <p className="text-sm font-bold text-slate-900">{app.source === 'Direct' ? 'Direct' : 'Agency'}</p>
                                                               {app.source !== 'Direct' && app.agentName && (
                                                                  <p className="text-xs text-slate-500 font-medium mt-0.5">{app.agentName}</p>
                                                               )}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-4">
                                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${getStatusColor(app.status)}`}>
                                                               {app.status === 'APPROVED' ? 'Abroad' :
                                                                  app.status === 'HOLD' ? 'On Hold' :
                                                                     app.status === 'REJECTED' ? 'Rejected' : 'Processing'}
                                                            </span>
                                                         </td>
                                                         <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                               {/* Quick action buttons */}
                                                               {app.status !== 'APPROVED' && (
                                                                  <button
                                                                     onClick={() => handleApplicationAction(app.id, 'approve', app.customId)}
                                                                     title="Mark as Abroad (Approved)"
                                                                     className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-sm"
                                                                  >
                                                                     ✓ Abroad
                                                                  </button>
                                                               )}
                                                               {app.status !== 'HOLD' && (
                                                                  <button
                                                                     onClick={() => handleApplicationAction(app.id, 'hold', app.customId)}
                                                                     title="Put On Hold"
                                                                     className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm"
                                                                  >
                                                                     ⏸ Hold
                                                                  </button>
                                                               )}
                                                               {app.status !== 'REJECTED' && (
                                                                  <button
                                                                     onClick={() => handleApplicationAction(app.id, 'reject', app.customId)}
                                                                     title="Reject Candidate"
                                                                     className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-sm"
                                                                  >
                                                                     ✕ Reject
                                                                  </button>
                                                               )}
                                                               <button
                                                                  onClick={() => handleViewApplication(app)}
                                                                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center gap-1"
                                                               >
                                                                  <Eye className="w-3 h-3" /> View
                                                               </button>
                                                            </div>
                                                         </td>
                                                      </tr>
                                                   ))}
                                                </tbody>
                                             </table>
                                          ) : (
                                             <div className="py-12 text-center text-black font-bold">
                                                <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                <p className="text-sm">No record exist !!</p>
                                             </div>
                                          )
                                       )}
                                    </div>
                                 </div>
                              )
                              }
                           </div>
                        )}

                        {/* ACCOUNT PROVISIONING */}
                        {
                           activeTab === 'create_profile' && (
                              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                 <div className="max-w-3xl bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                                    <div className="flex bg-slate-100 p-1 rounded-lg mb-8 w-fit">
                                       <button
                                          onClick={() => setProvisioningType('candidate')}
                                          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${provisioningType === 'candidate' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                       >
                                          Candidate
                                       </button>
                                       <button
                                          onClick={() => setProvisioningType('employer')}
                                          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${provisioningType === 'employer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                       >
                                          Agency Partner
                                       </button>
                                    </div>

                                    <form onSubmit={handleProvisionAccount} className="space-y-6">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                             <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                {provisioningType === 'candidate' ? 'Full Legal Name' : 'Company Name'}
                                             </label>
                                             <input
                                                required
                                                type="text"
                                                value={provisioningType === 'candidate' ? profileForm.name : profileForm.company}
                                                onChange={(e) => setProfileForm({ ...profileForm, [provisioningType === 'candidate' ? 'name' : 'company']: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                placeholder={provisioningType === 'candidate' ? "e.g. John Doe" : "e.g. Acme Recruitment"}
                                             />
                                          </div>
                                          <div className="space-y-2">
                                             <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                                             <input
                                                required
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                placeholder="name@example.com"
                                             />
                                          </div>
                                       </div>

                                       <div className="pt-4">
                                          <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                                             <UserPlus className="w-4 h-4" /> Create Account
                                          </button>
                                       </div>
                                    </form>
                                 </div>
                              </div>
                           )
                        }

                        {/* AGENT ECOSYSTEM */}
                        {
                           activeTab === 'agents' && (
                              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                 {/* Sub-tabs */}
                                 <div className="flex items-center gap-4 mb-8">

                                    <button
                                       onClick={() => setAgentSubTab('resumes')}
                                       className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'resumes'
                                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                          : 'bg-white text-black font-bold hover:text-slate-600'
                                          }`}
                                    >
                                       <Users className="w-4 h-4" /> Agent Resumes
                                       {agentResumes.length > 0 && (
                                          <span className="ml-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                             {agentResumes.length > 99 ? '99+' : agentResumes.length}
                                          </span>
                                       )}
                                    </button>
                                    <button
                                       onClick={() => setAgentSubTab('new_apps')}
                                       className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'new_apps'
                                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                          : 'bg-white text-black font-bold hover:text-slate-600'
                                          }`}
                                    >
                                       <UserPlus className="w-4 h-4" /> New Agents Applications
                                       {pendingAgencies.filter(a => a.status === 'PENDING').length > 0 && (
                                          <span className="ml-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                             {pendingAgencies.filter(a => a.status === 'PENDING').length > 99 ? '99+' : pendingAgencies.filter(a => a.status === 'PENDING').length}
                                          </span>
                                       )}
                                    </button>
                                    <button
                                       onClick={() => setAgentSubTab('job_requests')}
                                       className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'job_requests'
                                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                          : 'bg-white text-black font-bold hover:text-slate-600'
                                          }`}
                                    >
                                       <Briefcase className="w-4 h-4" /> Job Requests
                                       {pendingJobRequestsCount > 0 && (
                                          <span className="ml-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                                             {pendingJobRequestsCount > 99 ? '99+' : pendingJobRequestsCount}
                                          </span>
                                       )}
                                    </button>
                                 </div>

                                 {/* Content Area */}
                                 <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">


                                    {agentSubTab === 'job_requests' && (
                                       <div className="space-y-4">
                                          <div className="flex justify-between items-center mb-6">
                                             <h3 className="text-lg font-bold text-slate-800">Pending Job Requests</h3>
                                             <button
                                                onClick={fetchPendingJobRequests}
                                                disabled={isRefreshingJobRequests}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                                             >
                                                <RefreshCw className={`w-4 h-4 ${isRefreshingJobRequests ? 'animate-spin' : ''}`} />
                                                Refresh
                                             </button>
                                          </div>

                                          {pendingJobRequests.length > 0 ? (
                                             <div className="space-y-4">
                                                {pendingJobRequests.map(request => {
                                                   const isRejecting = showRejectModal && selectedJobRequest?._id === (request._id || request.id);

                                                   return (
                                                      <div key={request._id || request.id} className="bg-slate-50 border border-slate-100 rounded-xl p-6 transition-all hover:bg-slate-100 hover:border-slate-200">
                                                         <div className="flex flex-col md:flex-row justify-between gap-4">
                                                            <div className="flex-1">
                                                               <div className="flex items-center gap-3">
                                                                  <h4 className="font-bold text-slate-900 text-lg mb-1">{request.title} <span className="text-slate-500 text-sm font-normal">at</span> {request.company}</h4>
                                                                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded border border-amber-200">
                                                                     {request.status}
                                                                  </span>
                                                               </div>
                                                               <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600 mt-2">
                                                                  <span className="flex items-center gap-1 font-bold"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {request.category}</span>
                                                                  <span className="flex items-center gap-1 font-bold"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {request.location}</span>
                                                                  <span className="flex items-center gap-1 font-bold"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> {formatSalary(request.salary_range) || 'Not specified'}</span>
                                                                  <span className="flex items-center gap-1 font-bold"><Users className="w-3.5 h-3.5 text-slate-400" /> {request.vacancies || 1} Openings</span>
                                                                  <span className="flex items-center gap-1 font-bold"><Award className="w-3.5 h-3.5 text-slate-400" /> {request.experience || 'Any Experience'}</span>
                                                               </div>

                                                               <div className="mt-4 text-sm text-slate-700">
                                                                  <p className="font-semibold mb-1">Description:</p>
                                                                  <p className="mb-3 whitespace-pre-wrap">{request.description || 'No description provided.'}</p>

                                                                  <p className="font-semibold mb-1">Requirements:</p>
                                                                  {Array.isArray(request.requirements) && request.requirements.length > 0 ? (
                                                                     <ul className="list-disc pl-5 mb-3">
                                                                        {request.requirements.map((reqItem, idx) => (
                                                                           <li key={idx}>{reqItem}</li>
                                                                        ))}
                                                                     </ul>
                                                                  ) : (
                                                                     <p className="mb-3">None specified.</p>
                                                                  )}
                                                               </div>

                                                               <div className="mt-4 p-4 bg-white rounded-lg border border-slate-100 flex flex-wrap gap-x-8 gap-y-4 items-center">
                                                                  <div className="flex flex-col gap-1">
                                                                     <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Submitted By</div>
                                                                     <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                                        <Building2 className="w-4 h-4 text-emerald-600" /> {request.agent_name || request.agency_name}
                                                                     </div>
                                                                  </div>
                                                                  <div className="flex flex-col gap-1">
                                                                     <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Date</div>
                                                                     <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                                        <Calendar className="w-4 h-4 text-slate-400" /> {new Date(request.createdAt).toLocaleDateString()}
                                                                     </div>
                                                                  </div>
                                                               </div>
                                                            </div>

                                                            <div className="flex shrink-0 flex-col gap-3 mt-4 md:mt-0 items-end min-w-[120px]">
                                                               {!isRejecting && (
                                                                  <>
                                                                     <button
                                                                        onClick={() => handleJobRequestStatus(request, 'APPROVED')}
                                                                        disabled={isApprovingJob}
                                                                        className="w-full px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                                                                     >
                                                                        Approve
                                                                     </button>
                                                                     <button
                                                                        onClick={() => {
                                                                           setSelectedJobRequest(request);
                                                                           setShowRejectModal(true);
                                                                        }}
                                                                        className="w-full px-4 py-2 bg-white text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                                                                     >
                                                                        Reject
                                                                     </button>
                                                                  </>
                                                               )}
                                                            </div>
                                                         </div>

                                                         {isRejecting && (
                                                            <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg animate-in fade-in duration-200">
                                                               <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-red-800">Rejection Reason</label>
                                                               <textarea
                                                                  className="w-full p-3 border border-red-200 rounded-md text-sm mb-3 focus:outline-none focus:border-red-400"
                                                                  rows={3}
                                                                  placeholder="Explain why this request is rejected..."
                                                                  value={rejectReason}
                                                                  onChange={(e) => setRejectReason(e.target.value)}
                                                               />
                                                               <div className="flex justify-end gap-3">
                                                                  <button
                                                                     onClick={() => { setShowRejectModal(false); setRejectReason(''); setSelectedJobRequest(null); }}
                                                                     className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md text-[10px] uppercase font-black tracking-widest hover:bg-slate-100"
                                                                  >
                                                                     Cancel
                                                                  </button>
                                                                  <button
                                                                     onClick={() => handleJobRequestStatus(request, 'REJECTED', rejectReason)}
                                                                     disabled={isRejectingJob || !rejectReason.trim()}
                                                                     className="px-4 py-2 bg-red-600 text-white rounded-md text-[10px] uppercase font-black tracking-widest hover:bg-red-700 shadow-sm disabled:opacity-50"
                                                                  >
                                                                     Confirm Reject
                                                                  </button>
                                                               </div>
                                                            </div>
                                                         )}
                                                      </div>
                                                   );
                                                })}
                                             </div>
                                          ) : (
                                             <div className="py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                                   <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                                </div>
                                                <h4 className="text-slate-900 font-bold mb-1">No Pending Requests</h4>
                                                <p className="text-slate-500 text-sm">All job requests from agents have been reviewed.</p>
                                             </div>
                                          )}
                                       </div>
                                    )}

                                    {agentSubTab === 'resumes' && (
                                       <div className="space-y-4">
                                          <div className="flex justify-end items-center gap-3">
                                             <div className="relative">
                                                <input
                                                   type="text"
                                                   placeholder="Search candidate or email..."
                                                   className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-64"
                                                   value={resumeSearchInput}
                                                   onChange={(e) => setResumeSearchInput(e.target.value)}
                                                   onKeyDown={(e) => e.key === 'Enter' && handleResumeSearch()}
                                                />
                                                <button
                                                   onClick={handleResumeSearch}
                                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-bold hover:text-teal-600 transition-colors"
                                                >
                                                   <Search className="w-4 h-4" />
                                                </button>
                                             </div>
                                             <div className="relative">
                                                <button
                                                   onClick={() => setIsResumeFilterOpen(!isResumeFilterOpen)}
                                                   className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isResumeFilterOpen ? 'bg-teal-50 text-teal-600' : 'text-black font-bold hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isResumeFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">1. Status</h4>
                                                            <div className="space-y-2">
                                                               {['SELECTED', 'ON HOLD', 'PROCESSING'].map(status => (
                                                                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${resumeFilters.status.includes(status) ? 'bg-teal-600 border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {resumeFilters.status.includes(status) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                                     </div>
                                                                     <input type="checkbox" className="hidden" checked={resumeFilters.status.includes(status)} onChange={() => toggleResumeFilter(status)} />
                                                                     <span className="text-xs font-bold text-slate-700">{status}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">2. Duration</h4>
                                                            <div className="space-y-2">
                                                               {['Since 1 hr', 'Since 1 week', 'Since 1 month', 'Since 3 months', 'All'].map(duration => (
                                                                  <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${resumeFilters.duration === duration ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {resumeFilters.duration === duration && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                     </div>
                                                                     <input type="radio" className="hidden" checked={resumeFilters.duration === duration} onChange={() => setResumeFilters({ ...resumeFilters, duration })} />
                                                                     <span className="text-xs font-bold text-slate-700">{duration}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">3. Education</h4>
                                                            <div className="space-y-2">
                                                               {['Any Education Level', 'O-Level / Secondary School', 'A-Level / Higher Secondary', 'Certificate', 'Diploma', 'Advanced Diploma', "Bachelor's Degree", "Master's Degree", 'Doctorate / PhD'].map(educationLevel => (
                                                                  <label key={educationLevel} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${resumeFilters.education === educationLevel ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {resumeFilters.education === educationLevel && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                     </div>
                                                                     <input type="radio" className="hidden" checked={resumeFilters.education === educationLevel} onChange={() => setResumeFilters({ ...resumeFilters, education: educationLevel })} />
                                                                     <span className="text-xs font-bold text-slate-700">{educationLevel}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">4. Experience</h4>
                                                            <div className="space-y-2">
                                                               {['No Experience', '1 \u2013 2 Years', '3 \u2013 5 Years', '6 \u2013 10 Years', '10+ Years'].map(exp => (
                                                                  <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${resumeFilters.experience === exp ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {resumeFilters.experience === exp && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                     </div>
                                                                     <input type="radio" className="hidden" checked={resumeFilters.experience === exp} onChange={() => setResumeFilters({ ...resumeFilters, experience: exp })} />
                                                                     <span className="text-xs font-bold text-slate-700">{exp}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">5. Location</h4>
                                                            <select
                                                               value={resumeFilters.location}
                                                               onChange={(e) => setResumeFilters({ ...resumeFilters, location: e.target.value })}
                                                               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors"
                                                            >
                                                               {MALDIVES_LOCATIONS.map(loc => (
                                                                  <option key={loc} value={loc}>{loc}</option>
                                                               ))}
                                                            </select>
                                                         </div>
                                                      </div>
                                                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                                         <button onClick={() => setResumeFilters({ status: [], duration: 'All', location: 'All Locations', education: 'Any Education Level', experience: 'No Experience' })} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">Clear</button>
                                                         <button onClick={() => setIsResumeFilterOpen(false)} className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">Apply</button>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                          <table className="w-full text-left border-collapse">
                                             <thead className="text-black font-bold">
                                                <tr>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-black font-bold">Agent Candidate</th>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-black font-bold">Job Role</th>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-black font-bold">Spoke Agency</th>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-center text-black font-bold">Status</th>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-right text-black font-bold">Admin Action</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-50">
                                                {filteredAgentResumes.length > 0 ? (
                                                   filteredAgentResumes.map((resume) => (
                                                      <tr key={resume.id} className="group hover:bg-slate-50 transition-colors">
                                                         <td className="px-6 py-8 align-middle">
                                                            <div>
                                                               <h4 className="font-bold text-slate-900 text-base mb-1">{resume.name}</h4>
                                                               <p className="text-sm font-medium text-black font-bold">
                                                                  {resume.email}
                                                               </p>
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 align-middle">
                                                            <span className="font-bold text-slate-700 text-sm">{resume.role}</span>
                                                         </td>
                                                         <td className="px-6 py-8 align-middle">
                                                            <div className="flex items-center gap-3">
                                                               <span className={`w-2 h-2 rounded-full ${resume.agency === 'GLOBAL TALENT' ? 'bg-amber-400' : 'bg-indigo-400'}`}></span>
                                                               {resume.agentId ? (
                                                                  <button
                                                                     onClick={() => handleAgentClick(resume.agentId)}
                                                                     className="font-bold text-teal-600 hover:text-teal-700 hover:underline underline-offset-4 text-xs tracking-wider uppercase transition-colors"
                                                                  >
                                                                     {resume.agency}
                                                                  </button>
                                                               ) : (
                                                                  <span className="font-bold text-slate-700 text-xs tracking-wider uppercase">{resume.agency}</span>
                                                               )}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-center align-middle">
                                                            <div className={`inline-flex px-4 py-2 rounded-full border ${resume.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' : resume.statusColor} text-[10px] font-black uppercase tracking-widest`}>
                                                               {resume.status}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-right align-middle">
                                                            <button
                                                               onClick={() => setSelectedResume(resume)}
                                                               className="px-4 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 flex items-center gap-2 ml-auto"
                                                            >
                                                               <Eye className="w-3 h-3" /> VIEW DETAILS
                                                            </button>
                                                         </td>
                                                      </tr>
                                                   ))
                                                ) : (
                                                   <tr>
                                                      <td colSpan="5" className="px-6 py-12 text-center">
                                                         <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-black font-bold">
                                                               <Search className="w-6 h-6 opacity-40" />
                                                            </div>
                                                            <p className="text-slate-500 font-bold">No record exist !!</p>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                )}
                                             </tbody>
                                          </table>
                                       </div>
                                    )}

                                    {agentSubTab === 'new_apps' && (
                                       <div className="space-y-4">
                                          <div className="flex justify-end items-center gap-3">
                                             <div className="relative">
                                                <input
                                                   type="text"
                                                   placeholder="Search applications..."
                                                   className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-64"
                                                   value={appSearchInput}
                                                   onChange={(e) => setAppSearchInput(e.target.value)}
                                                   onKeyDown={(e) => e.key === 'Enter' && handleAppSearch()}
                                                />
                                                <button
                                                   onClick={handleAppSearch}
                                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-bold hover:text-teal-600 transition-colors"
                                                >
                                                   <Search className="w-4 h-4" />
                                                </button>
                                             </div>
                                             <div className="relative">
                                                <button
                                                   onClick={() => setIsAppFilterOpen(!isAppFilterOpen)}
                                                   className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isAppFilterOpen ? 'bg-teal-50 text-teal-600' : 'text-black font-bold hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isAppFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">1. Status</h4>
                                                            <div className="space-y-2">
                                                               {['YET TO BE CHECKED', 'ON HOLD', 'SELECTED'].map(status => (
                                                                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${appFilters.status.includes(status) ? 'bg-teal-600 border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {appFilters.status.includes(status) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                                     </div>
                                                                     <input type="checkbox" className="hidden" checked={appFilters.status.includes(status)} onChange={() => toggleAppFilter(status)} />
                                                                     <span className="text-xs font-bold text-slate-700">{status}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">2. Duration</h4>
                                                            <div className="space-y-2">
                                                               {['Since 1 hr', 'Since 1 week', 'Since 1 month', 'Since 3 months', 'All'].map(duration => (
                                                                  <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${appFilters.duration === duration ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {appFilters.duration === duration && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                     </div>
                                                                     <input type="radio" className="hidden" checked={appFilters.duration === duration} onChange={() => setAppFilters({ ...appFilters, duration })} />
                                                                     <span className="text-xs font-bold text-slate-700">{duration}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">3. Education</h4>
                                                            <div className="space-y-2">
                                                               {['Any Education Level', 'O-Level / Secondary School', 'A-Level / Higher Secondary', 'Certificate', 'Diploma', 'Advanced Diploma', "Bachelor's Degree", "Master's Degree", 'Doctorate / PhD'].map(educationLevel => (
                                                                  <label key={educationLevel} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${appFilters.education === educationLevel ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {appFilters.education === educationLevel && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                     </div>
                                                                     <input type="radio" className="hidden" checked={appFilters.education === educationLevel} onChange={() => setAppFilters({ ...appFilters, education: educationLevel })} />
                                                                     <span className="text-xs font-bold text-slate-700">{educationLevel}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">4. Experience</h4>
                                                            <div className="space-y-2">
                                                               {['No Experience', '1 \u2013 2 Years', '3 \u2013 5 Years', '6 \u2013 10 Years', '10+ Years'].map(exp => (
                                                                  <label key={exp} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${appFilters.experience === exp ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {appFilters.experience === exp && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                     </div>
                                                                     <input type="radio" className="hidden" checked={appFilters.experience === exp} onChange={() => setAppFilters({ ...appFilters, experience: exp })} />
                                                                     <span className="text-xs font-bold text-slate-700">{exp}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest">5. Location</h4>
                                                            <select
                                                               value={appFilters.location}
                                                               onChange={(e) => setAppFilters({ ...appFilters, location: e.target.value })}
                                                               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors"
                                                            >
                                                               {MALDIVES_LOCATIONS.map(loc => (
                                                                  <option key={loc} value={loc}>{loc}</option>
                                                               ))}
                                                            </select>
                                                         </div>
                                                      </div>
                                                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                                         <button onClick={() => setAppFilters({ status: [], duration: 'All', location: 'All Locations', education: 'Any Education Level', experience: 'No Experience' })} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">Clear</button>
                                                         <button onClick={() => setIsAppFilterOpen(false)} className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">Apply</button>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                          <table className="w-full text-left border-collapse">
                                             <thead className="text-black font-bold">
                                                <tr>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-black font-bold">Applicant / Agency</th>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-black font-bold">Target Region</th>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-center text-black font-bold">Application Status</th>
                                                   <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-right text-black font-bold">Action</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-50">
                                                {filteredPartnerApplications.length > 0 ? (
                                                   filteredPartnerApplications.map((app) => (
                                                      <tr key={app._id || app.id} className="group hover:bg-slate-50 transition-colors">
                                                         <td className="px-6 py-8 align-middle">
                                                            <div>
                                                               <h4 className="font-bold text-slate-900 text-base mb-1">{app.full_name || app.applicant}</h4>
                                                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{app.agency_name || app.agency}</p>
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 align-middle">
                                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                                               <MapPin className="w-4 h-4 text-slate-300" />
                                                               {app.location || app.region || 'Not Specified'}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-center align-middle">
                                                            <div className={`inline-flex px-4 py-2 rounded-full border ${app.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-200'} text-[10px] font-black uppercase tracking-widest`}>
                                                               {app.status}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-right align-middle">
                                                            <button
                                                               onClick={() => setSelectedApplication(app)}
                                                               className="px-4 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 flex items-center gap-2 ml-auto"
                                                            >
                                                               <Eye className="w-3 h-3" /> VIEW DETAILS
                                                            </button>
                                                         </td>
                                                      </tr>
                                                   ))
                                                ) : (
                                                   <tr>
                                                      <td colSpan="4" className="px-6 py-12 text-center">
                                                         <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-black font-bold">
                                                               <Search className="w-6 h-6 opacity-40" />
                                                            </div>
                                                            <p className="text-slate-500 font-bold">No record exist !!</p>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                )}
                                             </tbody>
                                          </table>
                                       </div>
                                    )}


                                 </div>
                              </div>
                           )
                        }


                        {/* BLACKLISTED CONTENT */}
                        {
                           activeTab === 'blacklisted' && (
                              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center gap-4">
                                       <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                                          <ShieldCheck className="w-4 h-4 text-red-500" /> Rejected Candidates
                                       </h3>

                                       <div className="flex items-center gap-3 w-full justify-end">
                                          <div className="relative flex-1 max-w-md">
                                             <input
                                                type="text"
                                                placeholder="Search blacklisted candidates..."
                                                className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                                value={blacklistSearchInput}
                                                onChange={(e) => setBlacklistSearchInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleBlacklistSearch()}
                                             />
                                             <button
                                                onClick={handleBlacklistSearch}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-bold hover:text-red-500 transition-colors"
                                             >
                                                <Search className="w-4 h-4" />
                                             </button>
                                          </div>

                                          <div className="flex items-center gap-2">
                                             {/* Source Dropdown */}
                                             <div className="relative" ref={blacklistSourceRef}>
                                                <div className="flex items-center gap-0">
                                                   <button
                                                      onClick={() => {
                                                         setIsBlacklistSourceOpen(!isBlacklistSourceOpen);
                                                         setIsBlacklistDurationOpen(false);
                                                         setIsBlacklistFilterOpen(false);
                                                      }}
                                                      className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${blacklistFilters.source !== 'All' ? 'bg-red-50 text-red-600 border-red-200 rounded-r-none border-r-0' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                   >
                                                      {blacklistFilters.source === 'All' ? 'Source' : blacklistFilters.source}
                                                      <ChevronDown className={`w-3 h-3 transition-transform ${isBlacklistSourceOpen ? 'rotate-180' : ''}`} />
                                                   </button>
                                                   {blacklistFilters.source !== 'All' && (
                                                      <button
                                                         onClick={() => setBlacklistFilters(prev => ({ ...prev, source: 'All' }))}
                                                         className="h-[34px] px-2 border border-red-200 bg-red-50 text-red-600 rounded-r-lg hover:bg-red-100 transition-colors flex items-center justify-center border-l-0"
                                                      >
                                                         <X className="w-3 h-3" />
                                                      </button>
                                                   )}
                                                </div>
                                                {isBlacklistSourceOpen && (
                                                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      {['Direct Application', 'Agency Ref', 'All'].map(source => (
                                                         <button
                                                            key={source}
                                                            onClick={() => {
                                                               setBlacklistFilters(prev => ({ ...prev, source }));
                                                               setIsBlacklistSourceOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${blacklistFilters.source === source ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                                         >
                                                            {source}
                                                         </button>
                                                      ))}
                                                   </div>
                                                )}
                                             </div>

                                             {/* Duration Dropdown */}
                                             <div className="relative" ref={blacklistDurationRef}>
                                                <div className="flex items-center gap-0">
                                                   <button
                                                      onClick={() => {
                                                         setIsBlacklistDurationOpen(!isBlacklistDurationOpen);
                                                         setIsBlacklistSourceOpen(false);
                                                         setIsBlacklistFilterOpen(false);
                                                      }}
                                                      className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${blacklistFilters.duration !== 'All' ? 'bg-red-50 text-red-600 border-red-200 rounded-r-none border-r-0' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                   >
                                                      {blacklistFilters.duration === 'All' ? 'Duration' : (blacklistFilters.duration === 'All Time' ? 'All Time' : blacklistFilters.duration)}
                                                      <ChevronDown className={`w-3 h-3 transition-transform ${isBlacklistDurationOpen ? 'rotate-180' : ''}`} />
                                                   </button>
                                                   {blacklistFilters.duration !== 'All' && blacklistFilters.duration !== 'All Time' && (
                                                      <button
                                                         onClick={() => setBlacklistFilters(prev => ({ ...prev, duration: 'All' }))}
                                                         className="h-[34px] px-2 border border-red-200 bg-red-50 text-red-600 rounded-r-lg hover:bg-red-100 transition-colors flex items-center justify-center border-l-0"
                                                      >
                                                         <X className="w-3 h-3" />
                                                      </button>
                                                   )}
                                                </div>
                                                {isBlacklistDurationOpen && (
                                                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'].map(duration => (
                                                         <button
                                                            key={duration}
                                                            onClick={() => {
                                                               setBlacklistFilters(prev => ({ ...prev, duration }));
                                                               setIsBlacklistDurationOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${blacklistFilters.duration === duration ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                                         >
                                                            {duration}
                                                         </button>
                                                      ))}
                                                   </div>
                                                )}
                                             </div>

                                             {/* Advanced Filter Icon (Optional/Extra) */}
                                             <div className="relative">
                                                <button
                                                   onClick={() => {
                                                      setIsBlacklistFilterOpen(!isBlacklistFilterOpen);
                                                      setIsBlacklistSourceOpen(false);
                                                      setIsBlacklistDurationOpen(false);
                                                   }}
                                                   className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isBlacklistFilterOpen ? 'bg-red-50 text-red-600' : 'text-black font-bold hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isBlacklistFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest text-center">Quick Filters</h4>
                                                            <button
                                                               onClick={() => {
                                                                  setBlacklistFilters({ source: 'All', duration: 'All' });
                                                                  setIsBlacklistFilterOpen(false);
                                                               }}
                                                               className="w-full py-2 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                                                            >
                                                               Reset All
                                                            </button>
                                                         </div>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                       <table className="w-full text-left">
                                          <thead className="text-black font-bold">
                                             <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Candidate Name</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Job Role</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Source</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Status</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-right text-black font-bold">Review</th>
                                             </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-50">
                                             {filteredBlacklistedCandidates.length > 0 ? (
                                                filteredBlacklistedCandidates.map((candidate, idx) => (
                                                   <tr key={`${candidate.id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                                                      <td className="px-6 py-4">
                                                         <div>
                                                            <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                                                            <p className="text-xs text-black font-bold font-medium">{candidate.email}</p>
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-sm font-bold text-slate-700">
                                                            {candidate.role}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
                                                               <span className={`w-1.5 h-1.5 rounded-full ${'source' in candidate && candidate.source === 'Direct' ? 'bg-blue-400' : 'bg-amber-400'}`}></span>
                                                               {'source' in candidate && candidate.source === 'Direct' ? 'Direct' : 'Agency'}
                                                            </span>
                                                            {'agency' in candidate && (
                                                               <span className="text-[10px] font-medium text-black font-bold pl-3">
                                                                  {candidate.agency}
                                                               </span>
                                                            )}
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${(candidate.status?.toUpperCase() === 'REJECTED' || candidate.status === 'Rejected') ? 'bg-red-50 text-red-600 border-red-100' : candidate.statusColor}`}>
                                                            {candidate.status}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4 text-right">
                                                         <button
                                                            onClick={() => { setSelectedResume(candidate); setIsBlacklistReview(true); }}
                                                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2 ml-auto"
                                                         >
                                                            <Eye className="w-3 h-3" /> VIEW DETAILS
                                                         </button>
                                                      </td>
                                                   </tr>
                                                ))
                                             ) : (
                                                <tr>
                                                   <td colSpan={5} className="px-6 py-12 text-center text-black font-bold text-sm font-medium">
                                                      No blacklisted candidates found.
                                                   </td>
                                                </tr>
                                             )}
                                          </tbody>
                                       </table>
                                    </div>
                                 </div>


                                 {/* NEW: Application Rejections (Agents) Table */}
                                 <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center gap-4">
                                       <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                                          <Users className="w-4 h-4 text-red-500" /> Application Rejections (Agents)
                                       </h3>

                                       <div className="flex items-center gap-3 w-full justify-end">
                                          <div className="relative flex-1 max-w-md">
                                             <input
                                                type="text"
                                                placeholder="Search rejected agent apps..."
                                                className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                                value={agentBlacklistSearchInput}
                                                onChange={(e) => setAgentBlacklistSearchInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAgentBlacklistSearch()}
                                             />
                                             <button
                                                onClick={handleAgentBlacklistSearch}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-bold hover:text-red-500 transition-colors"
                                             >
                                                <Search className="w-4 h-4" />
                                             </button>
                                          </div>

                                          <div className="flex items-center gap-2">


                                             {/* Duration Dropdown */}
                                             <div className="relative">
                                                <div className="flex items-center gap-0">
                                                   <button
                                                      onClick={() => {
                                                         setIsAgentBlacklistDurationOpen(!isAgentBlacklistDurationOpen);
                                                         setIsAgentBlacklistSourceOpen(false);
                                                         setIsAgentBlacklistFilterOpen(false);
                                                      }}
                                                      className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${agentBlacklistFilters.duration !== 'All' ? 'bg-red-50 text-red-600 border-red-200 rounded-r-none border-r-0' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                   >
                                                      {agentBlacklistFilters.duration === 'All' ? 'Duration' : (agentBlacklistFilters.duration === 'All Time' ? 'All Time' : agentBlacklistFilters.duration)}
                                                      <ChevronDown className={`w-3 h-3 transition-transform ${isAgentBlacklistDurationOpen ? 'rotate-180' : ''}`} />
                                                   </button>
                                                   {agentBlacklistFilters.duration !== 'All' && agentBlacklistFilters.duration !== 'All Time' && (
                                                      <button
                                                         onClick={() => setAgentBlacklistFilters(prev => ({ ...prev, duration: 'All' }))}
                                                         className="h-[34px] px-2 border border-red-200 bg-red-50 text-red-600 rounded-r-lg hover:bg-red-100 transition-colors flex items-center justify-center border-l-0"
                                                      >
                                                         <X className="w-3 h-3" />
                                                      </button>
                                                   )}
                                                </div>
                                                {isAgentBlacklistDurationOpen && (
                                                   <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      {['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'].map(duration => (
                                                         <button
                                                            key={duration}
                                                            onClick={() => {
                                                               setAgentBlacklistFilters(prev => ({ ...prev, duration }));
                                                               setIsAgentBlacklistDurationOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${agentBlacklistFilters.duration === duration ? 'bg-red-50 text-red-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                                         >
                                                            {duration}
                                                         </button>
                                                      ))}
                                                   </div>
                                                )}
                                             </div>

                                             {/* Advanced Filter Icon */}
                                             <div className="relative">
                                                <button
                                                   onClick={() => {
                                                      setIsAgentBlacklistFilterOpen(!isAgentBlacklistFilterOpen);
                                                      setIsAgentBlacklistSourceOpen(false);
                                                      setIsAgentBlacklistDurationOpen(false);
                                                   }}
                                                   className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isAgentBlacklistFilterOpen ? 'bg-red-50 text-red-600' : 'text-black font-bold hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isAgentBlacklistFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-black font-bold tracking-widest text-center">Quick Filters</h4>
                                                            <button
                                                               onClick={() => {
                                                                  setAgentBlacklistFilters({ source: 'All', duration: 'All' });
                                                                  setIsAgentBlacklistFilterOpen(false);
                                                               }}
                                                               className="w-full py-2 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                                                            >
                                                               Reset All
                                                            </button>
                                                         </div>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                       </div>

                                    </div>
                                    <div className="overflow-x-auto">
                                       <table className="w-full text-left">
                                          <thead className="text-black font-bold">
                                             <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Agent Name</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Agency</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Region</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-black font-bold">Status</th>
                                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-right text-black font-bold">Review</th>
                                             </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-50">
                                             {filteredAgentRejections.length > 0 ? (
                                                filteredAgentRejections.map((app) => (
                                                   <tr key={app.id || app._id} className="hover:bg-slate-50/50 transition-colors">
                                                      <td className="px-6 py-4">
                                                         <div>
                                                            <p className="text-sm font-bold text-slate-900">{app.full_name}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{app.email}</p>
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-sm font-bold text-slate-700">
                                                            {app.agency_name}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                                            <MapPin className="w-4 h-4 text-slate-300" />
                                                            {app.location || 'Not Specified'}
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-red-50 text-red-600 border-red-100">
                                                            {app.status}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4 text-right">
                                                         <button
                                                            onClick={() => setSelectedApplication(app)}
                                                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2 ml-auto"
                                                         >
                                                            <Eye className="w-3 h-3" /> VIEW DETAILS
                                                         </button>
                                                      </td>
                                                   </tr>
                                                ))
                                             ) : (
                                                <tr>
                                                   <td colSpan={5} className="px-6 py-12 text-center text-black font-bold text-sm font-medium">
                                                      No rejected agent applications found.
                                                   </td>
                                                </tr>
                                             )}
                                          </tbody>
                                       </table>
                                    </div>
                                 </div>
                              </div>
                           )
                        }


                        {/* PLACEHOLDER FOR OTHER TABS */}
                        {
                           activeTab === 'network' && (
                              <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border-2 border-dashed border-slate-200 text-center">
                                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Briefcase className="w-8 h-8 text-slate-300" />
                                 </div>
                                 <h3 className="text-lg font-bold text-slate-900 mb-2">Section Under Development</h3>
                                 <p className="text-slate-500 max-w-md mx-auto">This module is currently being optimized for better performance and usability. Check back soon.</p>
                              </div>
                           )
                        }
                     </div>
                  </div>
               </main>
            </div >
         </div >


         {/* MODAL */}
         {/* VACANCY MODAL */}
         {
            selectedVacancy && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

                     {/* Header */}
                     <div className="sticky top-0 z-[110] bg-white border-b border-slate-100 p-8 flex items-start justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-3xl">
                              <Briefcase className="w-8 h-8" />
                           </div>
                           <div>
                              <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedVacancy.title}</h2>
                              <div className="flex items-center gap-3">
                                 <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    Spoke: {selectedVacancy.agency}
                                 </span>
                                 <span className="text-[10px] font-bold text-black font-bold uppercase tracking-widest">
                                    {selectedVacancy.ref}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <button
                           onClick={() => setSelectedVacancy(null)}
                           className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-black font-bold hover:text-slate-600 transition-colors"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="p-8 space-y-10">
                        {/* 1. Vacancy Details */}
                        <section>
                           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" /> 1. Vacancy Details
                           </h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">Region</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-black font-bold" /> {selectedVacancy.region}
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">Sector</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-black font-bold" /> {selectedVacancy.sector}
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">Headcount</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-black font-bold" /> {selectedVacancy.openings} Positions
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">Date Posted</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-black font-bold" /> {selectedVacancy.date}
                                 </div>
                              </div>
                           </div>
                        </section>

                        {/* 2. Role Scope */}
                        <section>
                           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> 2. Role Scope & Description
                           </h3>
                           <div className="p-6 border border-slate-100 rounded-2xl text-slate-600 text-sm font-medium leading-relaxed bg-slate-50/50">
                              {selectedVacancy.description}
                           </div>
                        </section>

                        {/* 3. Mandatory Requirements */}
                        <section>
                           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" /> 3. Mandatory Requirements
                           </h3>
                           <div className="flex flex-wrap gap-3">
                              {selectedVacancy.requirements.map((req, i) => (
                                 <span key={i} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
                                    {req}
                                 </span>
                              ))}
                           </div>
                        </section>
                     </div>

                     {/* Footer Actions */}
                     <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
                        <button
                           onClick={() => handleVacancyStateChange('HIDDEN')}
                           className="px-8 py-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                        >
                           Decline Post
                        </button>
                        <button
                           onClick={() => handleVacancyStateChange('STILL IN HOLD')}
                           className="px-8 py-4 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
                        >
                           Keep on Hold
                        </button>
                        <button
                           onClick={() => handleVacancyStateChange('LIVE TO PUBLIC')}
                           className="px-8 py-4 rounded-xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20 flex items-center gap-2"
                        >
                           Approve & List Live <Globe2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </div>
            )
         }



         {/* ADD VACANCY MODAL */}
         {
            isAddVacancyOpen && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black text-slate-900">Job Requirements</h3>
                        <button
                           onClick={() => setIsAddVacancyOpen(false)}
                           className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-black font-bold hover:text-slate-600 transition-colors"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <form onSubmit={handleAddVacancy} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Job Title</label>
                              <input
                                 required
                                 type="text"
                                 value={newVacancy.title}
                                 onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                 placeholder="e.g. Senior Sous Chef"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Field / Industry</label>
                              <input
                                 type="text"
                                 value={newVacancy.industry}
                                 readOnly
                                 className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 cursor-not-allowed outline-none"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Salary Range</label>
                              <input
                                 required
                                 type="text"
                                 value={newVacancy.salary}
                                 onChange={(e) => setNewVacancy({ ...newVacancy, salary: e.target.value })}
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                 placeholder="e.g. $1200 - $1500 USD"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Headcount Required</label>
                              <input
                                 required
                                 type="text"
                                 value={newVacancy.headcount}
                                 onChange={(e) => setNewVacancy({ ...newVacancy, headcount: e.target.value })}
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                 placeholder="e.g. 5"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Company Name</label>
                              <input
                                 required
                                 type="text"
                                 value={newVacancy.companyName}
                                 onChange={(e) => setNewVacancy({ ...newVacancy, companyName: e.target.value })}
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                 placeholder="e.g. Grand Maldives Resort"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Location</label>
                              <div className="relative">
                                 <div
                                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all cursor-pointer flex items-center justify-between"
                                 >
                                    <span className={newVacancy.address ? 'text-slate-900' : 'text-black font-bold'}>{newVacancy.address || 'Select Location'}</span>
                                    <ChevronDown className={`w-4 h-4 text-black font-bold transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                                 </div>
                                 {showLocationDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                       {['Male', 'Hulhumale', 'Villingili', 'Haa Alif', 'Haa Dhaalu', 'Shaviyani', 'Noonu', 'Raa', 'Baa', 'Lhaviyani', 'Kaafu', 'Alif Alif', 'Alif Dhaalu', 'Vaavu', 'Meemu', 'Faafu', 'Dhaalu', 'Thaa', 'Laamu', 'Gaafu Alif', 'Gaafu Dhaalu', 'Gnaviyani', 'Seenu'].map((loc) => (
                                          <div
                                             key={loc}
                                             onClick={() => { setNewVacancy({ ...newVacancy, address: loc }); setShowLocationDropdown(false); }}
                                             className="px-4 py-2.5 text-sm font-semibold text-slate-700 cursor-pointer transition-all hover:bg-emerald-50 hover:text-emerald-700"
                                             style={{ transition: 'background 0.15s, color 0.15s' }}
                                          >
                                             {loc}
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Education</label>
                              <div className="relative">
                                 <div
                                    onClick={() => setShowEducationDropdown(!showEducationDropdown)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all cursor-pointer flex items-center justify-between"
                                 >
                                    <span className={newVacancy.education ? 'text-slate-900' : 'text-black font-bold'}>{newVacancy.education || 'Select Education'}</span>
                                    <ChevronDown className={`w-4 h-4 text-black font-bold transition-transform ${showEducationDropdown ? 'rotate-180' : ''}`} />
                                 </div>
                                 {showEducationDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                       {['Any Education Level', 'O-Level / Secondary School', 'A-Level / Higher Secondary', 'Certificate', 'Diploma', 'Advanced Diploma', "Bachelor's Degree", "Master's Degree", 'Doctorate / PhD'].map((edu) => (
                                          <div
                                             key={edu}
                                             onClick={() => { setNewVacancy({ ...newVacancy, education: edu }); setShowEducationDropdown(false); }}
                                             className="px-4 py-2.5 text-sm font-semibold text-slate-700 cursor-pointer transition-all hover:bg-emerald-50 hover:text-emerald-700"
                                             style={{ transition: 'background 0.15s, color 0.15s' }}
                                          >
                                             {edu}
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Experience</label>
                              <div className="relative">
                                 <div
                                    onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all cursor-pointer flex items-center justify-between"
                                 >
                                    <span className={newVacancy.experience ? 'text-slate-900' : 'text-black font-bold'}>{newVacancy.experience || 'Select Experience'}</span>
                                    <ChevronDown className={`w-4 h-4 text-black font-bold transition-transform ${showExperienceDropdown ? 'rotate-180' : ''}`} />
                                 </div>
                                 {showExperienceDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                       {['Any Experience', 'No Experience', '1 - 2 Years', '3 - 5 Years', '6 - 10 Years', '10+ Years'].map((exp) => (
                                          <div
                                             key={exp}
                                             onClick={() => { setNewVacancy({ ...newVacancy, experience: exp }); setShowExperienceDropdown(false); }}
                                             className="px-4 py-2.5 text-sm font-semibold text-slate-700 cursor-pointer transition-all hover:bg-emerald-50 hover:text-emerald-700"
                                             style={{ transition: 'background 0.15s, color 0.15s' }}
                                          >
                                             {exp}
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Job Description</label>
                           <textarea
                              required
                              value={newVacancy.description}
                              onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all min-h-[100px]"
                              placeholder="Describe the role responsibilities..."
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Requirements</label>
                           <textarea
                              required
                              value={newVacancy.requirements}
                              onChange={(e) => setNewVacancy({ ...newVacancy, requirements: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all min-h-[100px]"
                              placeholder="List key requirements (one per line)..."
                           />
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-black font-bold tracking-widest">Required Documents</label>
                           <div className="grid grid-cols-2 gap-3">
                              {REQUIRED_DOCUMENT_OPTIONS.map((doc) => (
                                 <label key={doc} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-teal-200 transition-all">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${newVacancy.required_documents?.includes(doc) ? 'bg-teal-600 border-teal-600' : 'bg-white border-slate-300'}`}>
                                       {newVacancy.required_documents?.includes(doc) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input
                                       type="checkbox"
                                       className="hidden"
                                       checked={newVacancy.required_documents?.includes(doc) || false}
                                       onChange={() => {
                                          const currentDocs = newVacancy.required_documents || [];
                                          const updatedDocs = currentDocs.includes(doc)
                                             ? currentDocs.filter(d => d !== doc)
                                             : [...currentDocs, doc];
                                          setNewVacancy({ ...newVacancy, required_documents: updatedDocs });
                                       }}
                                    />
                                    <span className="text-sm font-bold text-slate-700">{doc}</span>
                                 </label>
                              ))}
                           </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-100">
                           <button
                              type="button"
                              onClick={() => setIsAddVacancyOpen(false)}
                              className="px-8 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-50 hover:text-slate-900 transition-colors"
                           >
                              Cancel
                           </button>
                           <button
                              type="submit"
                              className="flex-1 px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
                           >
                              Submit
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )
         }

         {/* ADD CATEGORY MODAL */}
         {
            isAddCategoryOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6">
                     <h3 className="text-lg font-bold text-slate-900 mb-4">Add Category</h3>
                     <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Name</label>
                        <input
                           type="text"
                           value={newCategoryName}
                           onChange={(e) => {
                              setNewCategoryName(e.target.value);
                              if (categoryError) setCategoryError('');
                           }}
                           placeholder="e.g. Retail"
                           className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 transition-all ${categoryError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-500'}`}
                           autoFocus
                           onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                 handleAddCategory();
                              }
                           }}
                        />
                        {categoryError && (
                           <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {categoryError}
                           </p>
                        )}
                     </div>
                     <div className="flex gap-3">
                        <button
                           onClick={() => setIsAddCategoryOpen(false)}
                           className="flex-1 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleAddCategory}
                           className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all"
                        >
                           Add
                        </button>
                     </div>
                  </div>
               </div>
            )
         }



         {/* RESUME DETAILS MODAL */}
         {
            selectedResume && (
               <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

                     {/* Header */}
                     <div className="sticky top-0 z-[160] bg-white border-b border-slate-100 p-8 flex items-start justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 font-bold text-3xl">
                              {selectedResume.name.charAt(0)}
                           </div>
                           <div>
                              <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedResume.name}</h2>
                              <div className="flex items-center gap-3">
                                 <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    {selectedResume.role}
                                 </span>
                                 <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                 <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    {selectedResume.agency}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <button
                           onClick={() => { setSelectedResume(null); setIsBlacklistReview(false); }}
                           className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-black font-bold hover:text-slate-600 transition-colors"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="p-8 space-y-10">
                        {/* 1. Identity Details */}
                        <section>
                           <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <Users className="w-4 h-4" /> 1. Identity Details
                           </h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">Candidate Full Name *</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700">{selectedResume.name}</div>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">Email Address *</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700">{selectedResume.email}</div>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">WhatsApp Number *</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700">{selectedResume.whatsapp}</div>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black uppercase text-black font-bold tracking-widest mb-2">Nationality *</label>
                                 <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700">{selectedResume.nationality}</div>
                              </div>
                           </div>
                        </section>

                        {/* 2. Mandatory Document Bundle */}
                        <section>
                           <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" /> 2. Mandatory Document Bundle
                           </h3>
                           <div className="grid grid-cols-2 gap-6">
                              {selectedResume.documents?.resume ? (
                                 <DocumentCard label="Resume / CV *" filename={selectedResume.documents.resume.filename || (typeof selectedResume.documents.resume === 'string' ? selectedResume.documents.resume : 'resume.pdf')} fileObj={selectedResume.documents.resume} />
                              ) : (
                                 <div className="p-4 bg-slate-50 rounded-xl text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center border border-dashed border-slate-200">Resume Not Provided</div>
                              )}
                              
                              {(selectedResume.documents?.identity || selectedResume.documents?.passport) ? (
                                 <DocumentCard label="Passport / ID Copy *" filename={(selectedResume.documents?.identity || selectedResume.documents?.passport).filename || (typeof (selectedResume.documents?.identity || selectedResume.documents?.passport) === 'string' ? (selectedResume.documents?.identity || selectedResume.documents?.passport) : 'passport.pdf')} fileObj={selectedResume.documents?.identity || selectedResume.documents?.passport} />
                              ) : (
                                 <div className="p-4 bg-slate-50 rounded-xl text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center border border-dashed border-slate-200">Passport Not Provided</div>
                              )}
                              
                              {(selectedResume.documents?.certificates || selectedResume.documents?.education) ? (
                                 <DocumentCard label="Educational Certificates *" filename={(selectedResume.documents?.certificates || selectedResume.documents?.education).filename || (typeof (selectedResume.documents?.certificates || selectedResume.documents?.education) === 'string' ? (selectedResume.documents?.certificates || selectedResume.documents?.education) : 'certificates.pdf')} fileObj={selectedResume.documents?.certificates || selectedResume.documents?.education} />
                              ) : (
                                 <div className="p-4 bg-slate-50 rounded-xl text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center border border-dashed border-slate-200">Certificates Not Provided</div>
                              )}
                           </div>
                        </section>

                        {/* 3. Compliance & Governance */}
                        <section>
                           <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" /> 3. Compliance & Governance
                           </h3>
                           <div className="grid grid-cols-2 gap-6">
                              {selectedResume.documents?.pcc ? (
                                 <DocumentCard label="Police Clearance (PCC)" filename={selectedResume.documents.pcc.filename || (typeof selectedResume.documents.pcc === 'string' ? selectedResume.documents.pcc : 'pcc.pdf')} fileObj={selectedResume.documents.pcc} />
                              ) : (
                                 <div className="p-4 bg-slate-50 rounded-xl text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center border border-dashed border-slate-200">PCC Not Submitted</div>
                              )}
                              
                              {selectedResume.documents?.goodStanding ? (
                                 <DocumentCard label="Good Standing Certificate" filename={selectedResume.documents.goodStanding.filename || (typeof selectedResume.documents.goodStanding === 'string' ? selectedResume.documents.goodStanding : 'good_standing.pdf')} fileObj={selectedResume.documents.goodStanding} />
                              ) : (
                                 <div className="p-4 bg-slate-50 rounded-xl text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center border border-dashed border-slate-200">Good Standing Not Submitted</div>
                              )}
                           </div>
                        </section>
                     </div>

                     {/* Actions Footer */}
                     <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
                        {isBlacklistReview || (selectedResume && selectedResume.status === 'REJECTED') ? (
                           <>
                              <button
                                 onClick={() => { setSelectedResume(null); setIsBlacklistReview(false); }}
                                 className="px-8 py-4 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                              >
                                 Cancel
                              </button>
                              <button
                                 onClick={() => handleResumeStatusChange('On Hold')}
                                 className="px-8 py-4 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
                              >
                                 Keep on Hold
                              </button>
                              <button
                                 onClick={() => handleResumeStatusChange('Selected')}
                                 className="px-8 py-4 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-colors flex items-center gap-2"
                              >
                                 <CheckCircle2 className="w-5 h-5" /> Accept & Approve
                              </button>
                           </>
                        ) : (
                           <>
                              <button
                                 onClick={() => handleResumeStatusChange('Rejected')}
                                 className="px-8 py-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                              >
                                 Reject
                              </button>

                              <button
                                 onClick={() => handleResumeStatusChange('On Hold')}
                                 className="px-8 py-4 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
                              >
                                 Keep on Hold
                              </button>

                              <button
                                 onClick={() => handleResumeStatusChange('Selected')}
                                 className="px-8 py-4 rounded-xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
                              >
                                 Approve
                              </button>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            )
         }

         {/* APPLICATION DETAILS MODAL */}
         {
            selectedApplication && (
               <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

                     {/* Header */}
                     <div className="sticky top-0 z-[160] bg-white border-b border-slate-100 p-8 flex items-start justify-between">
                        {approvalStep === 'NONE' ? (
                           <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-3xl">
                                 <UserPlus className="w-10 h-10" />
                              </div>
                              <div>
                                 <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedApplication.agency_name}</h2>
                                 <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                       Contact: {selectedApplication.full_name}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                       Submitted: {new Date(selectedApplication.createdAt).toLocaleDateString()}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="w-full"></div> // Spacer to keep close button aligned right if needed
                        )}
                        <button
                           onClick={() => {
                              setSelectedApplication(null);
                              setApprovalStep('NONE');
                           }}
                           className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-black font-bold hover:text-slate-600 transition-colors"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     {/* Agent Details View */}
                     <>
                        <div className="p-8 space-y-10">
                           {/* Info Cards */}
                           <div className="grid grid-cols-2 gap-6">
                              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Targeted Region
                                 </p>
                                 <p className="text-lg font-bold text-slate-900">{selectedApplication.location || 'Not Specified'}</p>
                              </div>
                              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                                    <Globe2 className="w-3 h-3" /> Communication Node
                                 </p>
                                 <p className="text-lg font-bold text-slate-900">{selectedApplication.email}</p>
                              </div>
                           </div>

                           {/* Documents */}
                           <section>
                              <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                 <ShieldCheck className="w-4 h-4" /> Submitted Documents
                              </h3>
                              <div className="grid grid-cols-2 gap-6">
                                 <DocumentCard label="Identity Proof" filename={selectedApplication.documents?.identity?.filename || 'Not Uploaded'} fileObj={selectedApplication.documents?.identity} />
                                 <DocumentCard label="Business License" filename={selectedApplication.documents?.license?.filename || 'Not Uploaded'} fileObj={selectedApplication.documents?.license} />
                                 <DocumentCard label="Agency Profile" filename={selectedApplication.documents?.profile?.filename || 'Not Uploaded'} fileObj={selectedApplication.documents?.profile} />
                              </div>
                           </section>
                        </div>

                        {/* Actions Footer — varies by status */}
                        {selectedApplication.status === 'ON_HOLD' ? (
                           /* ON HOLD agents: Delete or Approve only */
                           <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-xs font-bold uppercase tracking-widest">
                                 ⏸ Agent is on hold
                              </div>
                              <div className="flex items-center gap-4">
                                 <button
                                    onClick={handleDeleteAgent}
                                    className="px-8 py-4 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2"
                                 >
                                    Delete Permanently
                                 </button>
                                 <button
                                    onClick={() => handleApplicationStatusChange('SELECTED')}
                                    className="px-8 py-4 rounded-xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-600/20"
                                 >
                                    Approve Partner <ShieldCheck className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        ) : (
                           /* PENDING agents: Reject, Place on Hold, Approve */
                           <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                              <button
                                 onClick={() => handleApplicationStatusChange('REJECTED')}
                                 className="px-8 py-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                              >
                                 Reject Application
                              </button>

                              <div className="flex items-center gap-4">
                                 <button
                                    onClick={() => handleApplicationStatusChange('ON HOLD')}
                                    className="px-8 py-4 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
                                 >
                                    Place on Hold
                                 </button>
                                 <button
                                    onClick={() => handleApplicationStatusChange('SELECTED')}
                                    className="px-8 py-4 rounded-xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-600/20"
                                 >
                                    Approve Partner <ShieldCheck className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        )}
                     </>

                  </div>
               </div>
            )
         }
         <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
         {/* REJECT JOB REQUEST MODAL */}
         {
            showRejectModal && selectedJobRequest && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                           <X className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-slate-900">Reject Job Request</h3>
                           <p className="text-sm text-slate-500">{selectedJobRequest.title}</p>
                        </div>
                     </div>

                     <div className="mb-6">
                        <label className="text-[10px] font-bold text-black font-bold uppercase tracking-wider mb-2 block">
                           Rejection Reason
                        </label>
                        <textarea
                           value={rejectReason}
                           onChange={(e) => setRejectReason(e.target.value)}
                           placeholder="Please provide a reason for rejection..."
                           className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                           rows={4}
                        />
                     </div>

                     <div className="flex gap-3">
                        <button
                           onClick={() => {
                              setShowRejectModal(false);
                              setSelectedJobRequest(null);
                              setRejectReason('');
                           }}
                           className="flex-1 py-3 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={() => handleJobRequestStatus(selectedJobRequest, 'REJECTED', rejectReason)}
                           disabled={isRejectingJob}
                           className="flex-1 py-3 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                           {isRejectingJob ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                           ) : null}
                           Reject
                        </button>
                     </div>
                  </div>
               </div>
            )
         }
      </>
   );
};

export default AdminDashboard;


