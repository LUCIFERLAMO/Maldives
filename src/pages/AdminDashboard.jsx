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
   ShieldCheck,
   Eye,
   Loader2,
   Plus,
   Calendar,
   FileText,
   Search,
   ChevronDown,
   RefreshCw,
   Trash2
} from 'lucide-react';

import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { MOCK_JOBS, MOCK_APPLICATIONS, INDUSTRIES } from '../constants';

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
      statusColor: 'bg-slate-100 text-slate-500 border-slate-200',
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
      role: 'Maintenance Manager',
      agency: 'GLOBAL TALENT',
      region: 'Mumbai, India',
      source: 'Agency',
      status: 'PROCESSING',
      statusColor: 'bg-purple-50 text-purple-600 border-purple-100',
      documents: {
         resume: 'Rajiv_Resume.pdf',
         passport: 'Passport_IN.pdf',
         education: 'BTech_Mech.pdf',
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




const DocumentCard = ({ label, filename }) => (
   <div className="flex items-center p-4 border border-slate-200 rounded-2xl bg-white hover:border-teal-500 hover:shadow-md transition-all group">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
         <FileText className="w-6 h-6" />
      </div>
      <div className="flex-1">
         <p className="text-slate-900 font-bold text-sm mb-0.5">{filename}</p>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      <button
         onClick={() => window.open('#', '_blank')}
         className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors ml-4"
      >
         <Eye className="w-4 h-4" />
      </button>
   </div>
);

const AdminDashboard = () => {
   const [activeTab, setActiveTab] = useState('overview');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [selectedIndustry, setSelectedIndustry] = useState(null);

   // Hierarchical Vacancy Management View State
   const [vacancyViewMode, setVacancyViewMode] = useState('CATEGORIES'); // 'CATEGORIES', 'JOBS', 'CANDIDATES'
   const [selectedCategory, setSelectedCategory] = useState(null);
   const [selectedJobId, setSelectedJobId] = useState(null);
   const [selectedJobTitle, setSelectedJobTitle] = useState('');
   const [categoryJobs, setCategoryJobs] = useState([]);
   const [jobApplications, setJobApplications] = useState([]);
   const [isLoadingJobs, setIsLoadingJobs] = useState(false);
   const [isLoadingApplications, setIsLoadingApplications] = useState(false);
   const [agentSubTab, setAgentSubTab] = useState('vacancies');
   const [agentResumes, setAgentResumes] = useState(MOCK_AGENT_RESUMES);
   const [auditQueue, setAuditQueue] = useState(MOCK_AUDIT_QUEUE);

   // Agency Approval State
   const [pendingAgencies, setPendingAgencies] = useState([]);
   const [showCredentialsModal, setShowCredentialsModal] = useState(false);
   const [approvedCredentials, setApprovedCredentials] = useState(null);
   const [isRefreshingAgents, setIsRefreshingAgents] = useState(false);

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
         const response = await fetch('http://localhost:5000/api/admin/pending-agents');
         const data = await response.json();
         setPendingAgencies(data);
      } catch (error) {
         console.error('Error fetching pending agents:', error);
      } finally {
         if (showLoading) setIsRefreshingAgents(false);
      }
   };

   // Fetch on mount
   useEffect(() => {
      fetchPendingAgents();
   }, []);

   // Handle Delete Vacancy
   const handleDeleteVacancy = (jobId) => {
      if (window.confirm('Are you sure you want to delete this vacancy?')) {
         // Update local state
         setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId && job._id !== jobId));
         // Update filtering state if active
         setCategoryJobs(prev => prev.filter(job => job.id !== jobId && job._id !== jobId));

         // In a real app, you would also call API to delete
         // fetch(`http://localhost:5000/api/jobs/${jobId}`, { method: 'DELETE' });
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
            const filteredJobs = jobs.filter(j => j.industry === category);
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
         const response = await fetch(`http://localhost:5000/api/applications?job_id=${encodeURIComponent(jobId)}`);
         if (response.ok) {
            const data = await response.json();
            setJobApplications(data);
         } else {
            // Fallback to mock data filtered by jobId
            const filteredApps = MOCK_APPLICATIONS.filter(app => app.jobId === jobId);
            setJobApplications(filteredApps);
         }
      } catch (error) {
         console.error('Error fetching applications by job:', error);
         // Fallback to mock data
         const filteredApps = MOCK_APPLICATIONS.filter(app => app.jobId === jobId);
         setJobApplications(filteredApps);
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
      setSelectedJobId(job.id);
      setSelectedJobTitle(job.title);
      setVacancyViewMode('CANDIDATES');
      fetchApplicationsByJob(job.id);
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

   // Handle application status update (Approve/Reject)
   const handleApplicationAction = async (appId, action) => {
      try {
         const response = await fetch(`http://localhost:5000/api/applications/${appId}/${action}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
         });
         if (response.ok) {
            // Refresh applications list
            fetchApplicationsByJob(selectedJobId);
         } else {
            // Local fallback update
            setJobApplications(prev => prev.map(app => {
               if (app.id === appId || app._id === appId) {
                  return { ...app, status: action === 'approve' ? 'Selected' : 'Rejected' };
               }
               return app;
            }));
         }
      } catch (error) {
         console.error(`Error ${action}ing application:`, error);
         // Fallback local update
         setJobApplications(prev => prev.map(app => {
            if (app.id === appId || app._id === appId) {
               return { ...app, status: action === 'approve' ? 'Selected' : 'Rejected' };
            }
            return app;
         }));
      }
   };
   const [selectedResume, setSelectedResume] = useState(null);
   const [isBlacklistReview, setIsBlacklistReview] = useState(false);
   const [allApplications, setAllApplications] = useState(MOCK_APPLICATIONS);
   const [industries, setIndustries] = useState(INDUSTRIES);
   const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
   const [newCategoryName, setNewCategoryName] = useState('');
   const [categoryError, setCategoryError] = useState('');
   const [jobs, setJobs] = useState(MOCK_JOBS);
   const [isAddVacancyOpen, setIsAddVacancyOpen] = useState(false);
   const [newVacancy, setNewVacancy] = useState({
      title: '',
      industry: '',
      salary: '',
      headcount: '',
      description: '',
      requirements: ''
   });
   const [showSuccessNotification, setShowSuccessNotification] = useState(false);

   // Audit Filter State
   const [isAuditFilterOpen, setIsAuditFilterOpen] = useState(false);
   const [auditFilters, setAuditFilters] = useState({
      status: [],
      source: 'All',
      duration: 'All'
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
      duration: 'All'
   });

   const toggleCandidateStatusFilter = (status) => {
      setCandidateFilters(prev => {
         const isSelected = prev.status.includes(status);
         return {
            ...prev,
            status: isSelected ? prev.status.filter(s => s !== status) : [...prev.status, status]
         };
      });
   };



   const handleResumeStatusChange = (status) => {
      if (!selectedResume) return;

      const updatedApplications = allApplications.map(app => {
         // We match by ID. Assuming selectedResume.id corresponds to app.id
         if (app.id === selectedResume.id) {
            return {
               ...app,
               status: status
            };
         }
         return app;
      });
      setAllApplications(updatedApplications);

      const updatedResumes = agentResumes.map(resume => {
         if (resume.id === selectedResume.id) {
            let statusColor = '';
            let newStatus = status;

            // Map UI status to Agent Resume specific status/colors if needed
            if (status === 'Selected') {
               newStatus = 'SELECTED';
               statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
            }
            if (status === 'Rejected') {
               newStatus = 'REJECTED';
               statusColor = 'bg-slate-100 text-slate-500 border-slate-200';
            }
            if (status === 'On Hold') {
               newStatus = 'PROCESSING'; statusColor = 'bg-purple-50 text-purple-600 border-purple-100';
            }

            return { ...resume, status: newStatus, statusColor };
         }
         return resume;
      });
      setAgentResumes(updatedResumes);

      const updatedAuditQueue = auditQueue.map(candidate => {
         if (candidate.id === selectedResume.id) {
            let statusColor = '';
            if (status === 'LIVE TO PUBLIC' || status === 'Selected') {
               statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
            }
            if (status === 'Rejected') {
               statusColor = 'bg-slate-100 text-slate-500 border-slate-200';
            }
            if (status === 'On Hold') {
               statusColor = 'bg-purple-50 text-purple-600 border-purple-100';
            }

            return { ...candidate, status, statusColor };
         }
         return candidate;
      });
      setAuditQueue(updatedAuditQueue);

      setSelectedResume(null); setIsBlacklistReview(false);
   };

   const [partnerApplications, setPartnerApplications] = useState(() => {
      const storedApps = JSON.parse(localStorage.getItem('maldives_agent_applications') || '[]');
      return [...storedApps, ...MOCK_NEW_PARTNER_APPS];
   });
   const [selectedApplication, setSelectedApplication] = useState(null);
   const [approvalStep, setApprovalStep] = useState('NONE');

   const handleApplicationStatusChange = (status) => {
      if (!selectedApplication) return;

      if (status === 'SELECTED' && approvalStep === 'NONE') {
         setApprovalStep('CONFIRM');
         return;
      }

      const updatedApps = partnerApplications.map(app => {
         if (app.id === selectedApplication.id) {
            let statusColor = '';
            let displayStatus = status;

            if (status === 'SELECTED') {
               statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
            }
            if (status === 'REJECTED') {
               statusColor = 'bg-slate-100 text-slate-500 border-slate-200';
            }
            if (status === 'ON HOLD') {
               statusColor = 'bg-amber-50 text-amber-600 border-amber-100';
               displayStatus = 'ON HOLD';
            }

            return { ...app, status: displayStatus, statusColor };
         }
         return app;
      });

      setPartnerApplications(updatedApps);
      if (status !== 'SELECTED' || approvalStep === 'SUCCESS') {
         setSelectedApplication(null);
         setApprovalStep('NONE');
      }
   };

   const handleAddCategory = () => {
      if (newCategoryName.trim()) {
         const normalizedNew = newCategoryName.trim().toLowerCase();
         const exists = industries.some(ind => ind.toLowerCase() === normalizedNew);

         if (exists) {
            setCategoryError('Category already exists');
            return;
         }

         setIndustries([...industries, newCategoryName.trim()]);
         setNewCategoryName('');
         setCategoryError('');
         setIsAddCategoryOpen(false);
      }
   };


   const handleAddVacancy = (e) => {
      e.preventDefault();
      const vacancy = {
         id: (jobs.length + 1).toString(),
         ...newVacancy,
         postedDate: new Date().toISOString().split('T')[0],
         status: 'Current Opening',
         isReopened: false,
         requirements: newVacancy.requirements.split(',').map(r => r.trim())
      };
      setJobs([...jobs, vacancy]);
      setNewVacancy({ title: '', industry: '', salary: '', headcount: '', description: '', requirements: '' });
      setIsAddVacancyOpen(false);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
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
         const response = await fetch(`http://localhost:5000/api/admin/agents/${agent._id}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
         });
         const data = await response.json();
         if (response.ok) {
            // Show success message (agent already has password from registration)
            alert(`Agent "${agent.full_name}" approved successfully!\nThey can now login with their registered email: ${agent.email}`);
            setPendingAgencies(prev => prev.filter(a => a._id !== agent._id));
         } else {
            alert('Failed to approve agent: ' + data.message);
         }
      } catch (error) {
         console.error('Error approving agent:', error);
         alert('Error approving agent');
      }
   };

   const handleRejectAgency = async (agent) => {
      try {
         const response = await fetch(`http://localhost:5000/api/admin/agents/${agent._id}/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
         });
         if (response.ok) {
            setPendingAgencies(prev => prev.filter(a => a._id !== agent._id));
            alert('Agent rejected and blocked.');
         } else {
            const data = await response.json();
            alert('Failed to reject agent: ' + data.message);
         }
      } catch (error) {
         console.error('Error rejecting agent:', error);
         alert('Error rejecting agent');
      }
   };





   const [agentVacancies, setAgentVacancies] = useState([
      {
         id: 1,
         title: "Island Liaison",
         ref: "REF: AV-1",
         date: "2024-05-20",
         agency: "Global Talent Ltd",
         openings: 2,
         state: "HIDDEN",
         stateColor: "text-slate-300",
         region: "Kerala, India",
         sector: "Hospitality",
         description: "The Island Liaison will act as the primary point of contact between candidates and the resort management. Responsibilities include local vetting and travel arrangement coordination.",
         requirements: ["Fluent in English & Malayalam", "2+ years in hospitality", "Valid driver's license"]
      },
      {
         id: 2,
         title: "Diving Instructor",
         ref: "REF: AV-2",
         date: "2024-05-22",
         agency: "ISLAND RECRUITERS",
         openings: 1,
         state: "HIDDEN",
         stateColor: "text-slate-300",
         region: "Malé, Maldives",
         sector: "Tourism",
         description: "Responsible for leading diving excursions and ensuring safety protocols for all guests. Must be certified and experienced in open water diving.",
         requirements: ["PADI CERTIFICATION", "FIRST AID CERTIFIED", "3 YEARS EXPERIENCE"]
      }
   ]);

   const [selectedVacancy, setSelectedVacancy] = useState(null);

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
      alert(`Account for ${provisioningType === 'candidate' ? profileForm.name : profileForm.company} successfully provisioned.`);
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
   const [candidateSearchInput, setCandidateSearchInput] = useState('');
   const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
   const handleCandidateSearch = () => setCandidateSearchQuery(candidateSearchInput);



   // 6. Blacklist Candidates
   const [blacklistSearchInput, setBlacklistSearchInput] = useState('');
   const [blacklistSearchQuery, setBlacklistSearchQuery] = useState('');
   const handleBlacklistSearch = () => setBlacklistSearchQuery(blacklistSearchInput);

   const [isBlacklistFilterOpen, setIsBlacklistFilterOpen] = useState(false);
   const [isBlacklistSourceOpen, setIsBlacklistSourceOpen] = useState(false);
   const [isBlacklistDurationOpen, setIsBlacklistDurationOpen] = useState(false);
   const [blacklistFilters, setBlacklistFilters] = useState({ source: 'All', duration: 'All' });

   // --- AGENT ECOSYSTEM FILTERS ---

   // 1. VACANCIES FILTER
   const [isVacancyFilterOpen, setIsVacancyFilterOpen] = useState(false);
   const [vacancyFilters, setVacancyFilters] = useState({ status: [], duration: 'All' });

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
   const [resumeFilters, setResumeFilters] = useState({ status: [], duration: 'All' });
   const filteredAgentResumes = agentResumes.filter(resume => {
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
   const [appFilters, setAppFilters] = useState({ status: [], duration: 'All' });


   const filteredPartnerApplications = partnerApplications.filter(app => {
      // Search Filter
      if (appSearchQuery) {
         const q = appSearchQuery.toLowerCase();
         // Match Applicant, Agency, Email, Region
         const matches = app.applicant.toLowerCase().includes(q) || app.agency.toLowerCase().includes(q) || app.email.toLowerCase().includes(q) || app.region.toLowerCase().includes(q);
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
   const getJobsByIndustry = (industry) => jobs.filter(j => j.industry === industry);

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


   // Filtering logic for Blacklisted Candidates
   const filteredBlacklistedCandidates = [...auditQueue, ...agentResumes].filter(candidate => {
      // Must be REJECTED
      if (candidate.status !== 'REJECTED') return false;

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

   const getPageTitle = () => {
      switch (activeTab) {
         case 'overview': return 'Dashboard Overview';
         case 'audit': return 'Audit Queue';
         case 'vacancies': return selectedIndustry ? selectedIndustry : 'Vacancy Management';
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

            {/* CREDENTIALS MODAL */}
            {showCredentialsModal && approvedCredentials && (
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
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                           <p className="text-sm font-bold text-slate-900 font-mono">{approvedCredentials.email}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Temporary Password</p>
                           <p className="text-sm font-bold text-teal-600 font-mono">{approvedCredentials.temporaryPassword}</p>
                        </div>
                     </div>

                     <p className="text-xs text-slate-500 mb-6">
                        Please share these credentials with the agency. They will be prompted to change their password on first login.
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
            )}

            <div className="flex flex-1">
               {/* SIDEBAR */}
               <DashboardSidebar
                  activeTab={activeTab}
                  setActiveTab={(tab) => { setActiveTab(tab); setSelectedIndustry(null); }}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
               />

               {/* MAIN CONTENT */}
               {/* MAIN CONTENT */}
               <main className="flex-1 flex flex-col relative w-full bg-slate-50/50 min-h-screen">
                  <DashboardHeader
                     onMenuClick={() => setIsSidebarOpen(true)}
                     title={getPageTitle()}
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

                           {activeTab === 'vacancies' && selectedIndustry && (
                              <button onClick={() => setSelectedIndustry(null)} className="text-sm font-bold text-slate-500 hover:text-slate-900 mb-6">
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
                                    { label: "AUDIT QUEUE", value: "2", icon: null, action: () => setActiveTab('audit') },
                                    { label: "VACANCIES", value: "0", icon: null, action: () => setActiveTab('vacancies') },
                                    { label: "AGENT FLOW", value: "3", icon: null, action: () => setActiveTab('agents') },
                                    { label: "BLACKLISTED", value: "1", icon: null, textRed: true, action: () => setActiveTab('blacklisted') },
                                 ].map((stat, idx) => (
                                    <div
                                       key={idx}
                                       onClick={stat.action}
                                       className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-center h-48 relative overflow-hidden group hover:shadow-lg hover:border-emerald-500 cursor-pointer transition-all"
                                    >
                                       <div className="absolute right-0 top-0 h-full w-24 bg-slate-50/50 skew-x-12 translate-x-12"></div>
                                       <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${stat.textRed ? 'text-red-500' : 'text-slate-400'}`}>
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

                              {/* PENDING AGENCY APPROVALS */}
                              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                 <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                          <Globe2 className="w-5 h-5" />
                                       </div>
                                       <div>
                                          <h3 className="font-bold text-slate-900 text-sm">Pending Agent Approvals</h3>
                                          <p className="text-xs text-slate-500">{pendingAgencies.length} agents waiting for review</p>
                                       </div>
                                    </div>
                                    <button
                                       onClick={() => fetchPendingAgents(true)}
                                       disabled={isRefreshingAgents}
                                       className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                                    >
                                       <RefreshCw className={`w-4 h-4 ${isRefreshingAgents ? 'animate-spin' : ''}`} />
                                       {isRefreshingAgents ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                 </div>

                                 {pendingAgencies.length === 0 ? (
                                    <div className="p-12 flex flex-col items-center justify-center text-center">
                                       <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                                          <CheckCircle2 className="w-8 h-8" />
                                       </div>
                                       <h4 className="font-bold text-slate-900 text-sm mb-1">All caught up! ✅</h4>
                                       <p className="text-xs text-slate-500">No pending approvals at this time.</p>
                                    </div>
                                 ) : (
                                    <div className="divide-y divide-slate-100">
                                       {pendingAgencies.map((agency) => (
                                          <div key={agency._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                                             <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Agent Name</p>
                                                   <p className="text-sm font-bold text-slate-900">{agency.full_name}</p>
                                                </div>
                                                <div>
                                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                                   <p className="text-sm text-slate-600">{agency.email}</p>
                                                </div>
                                                <div>
                                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Agency</p>
                                                   <p className="text-sm text-slate-600">{agency.agency_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                                                   <p className="text-sm text-slate-600">{agency.contact_number || 'N/A'}</p>
                                                </div>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                <button
                                                   onClick={() => handleApproveAgency(agency)}
                                                   className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                                >
                                                   Approve
                                                </button>
                                                <button
                                                   onClick={() => handleRejectAgency(agency)}
                                                   className="px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                                >
                                                   Reject
                                                </button>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 )}
                              </div>

                           </div>
                        )}


                        {/* AUDIT QUEUE CONTENT */}
                        {activeTab === 'audit' && (
                           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative">
                                 <div className="p-6 border-b border-slate-100 flex justify-between items-center relative rounded-t-xl">
                                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Candidate Audit Stream</h3>
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
                                             className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                                          >
                                             <Search className="w-4 h-4" />
                                          </button>
                                       </div>
                                       <div className="relative">
                                          <button
                                             onClick={() => setIsAuditFilterOpen(!isAuditFilterOpen)}
                                             className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isAuditFilterOpen ? 'bg-teal-50 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                          >
                                             <Filter className="w-4 h-4" />
                                          </button>
                                          {isAuditFilterOpen && (
                                             <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3 space-y-3">

                                                   {/* 1. Status */}
                                                   <div className="space-y-2">
                                                      <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">1. Status</h4>
                                                      <div className="space-y-1.5">
                                                         {['Processing', 'On Hold', 'Rejected', 'Selected'].map(status => (
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
                                                      <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">2. Source</h4>
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
                                                      <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">3. Duration</h4>
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
                                                </div>

                                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                                   <button
                                                      onClick={() => setAuditFilters({ status: [], source: 'All', duration: 'All' })}
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
                                       </div>
                                    </div>
                                 </div>
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                       <thead>
                                          <tr className="bg-slate-50 border-b border-slate-100">
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Candidate Name</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Role</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Source</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Admin Action</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-50">
                                          {filteredAuditQueue.length > 0 ? (
                                             filteredAuditQueue.map((candidate) => (
                                                <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors">
                                                   <td className="px-6 py-4">
                                                      <div>
                                                         <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                                                         <p className="text-xs text-slate-400 font-medium">{candidate.region}</p>
                                                      </div>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                         {candidate.role}
                                                      </span>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${candidate.statusColor}`}>
                                                         {candidate.status}
                                                      </span>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <div className="flex flex-col">
                                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${candidate.source === 'Direct' ? 'bg-blue-400' : 'bg-amber-400'}`}></span>
                                                            {candidate.source === 'Direct' ? 'Direct Application' : 'Agency Ref'}
                                                         </span>
                                                         {candidate.source === 'Agency' && (
                                                            <span className="text-[10px] font-medium text-slate-400 pl-3">
                                                               {candidate.agency}
                                                            </span>
                                                         )}
                                                      </div>
                                                   </td>
                                                   <td className="px-6 py-4 text-right">
                                                      <button
                                                         onClick={() => setSelectedResume(candidate)}
                                                         className="px-4 py-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 text-[10px] font-black uppercase tracking-widest hover:bg-teal-100 hover:border-teal-200 transition-all shadow-sm flex items-center gap-2 ml-auto"
                                                      >
                                                         <Eye className="w-3 h-3" /> View Details
                                                      </button>
                                                   </td>
                                                </tr>
                                             ))
                                          ) : (
                                             <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center">
                                                   <div className="flex flex-col items-center justify-center gap-2">
                                                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
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
                                          onClick={() => setIsAddCategoryOpen(true)}
                                          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center gap-2"
                                       >
                                          <Plus className="w-4 h-4" /> Add Category
                                       </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                       {industries.map((industry) => {
                                          const jobCount = jobs.filter(j => j.industry === industry).length;
                                          return (
                                             <button
                                                key={industry}
                                                onClick={() => handleCategoryClick(industry)}
                                                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all text-left group"
                                             >
                                                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-50 transition-colors">
                                                   <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1">{industry}</h3>
                                                <p className="text-sm text-slate-500 font-medium">{jobCount} Active Jobs</p>
                                                <div className="mt-6 flex items-center text-xs font-bold text-teal-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                   View Jobs <ArrowRight className="w-3 h-3 ml-2" />
                                                </div>
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
                                             <ArrowLeft className="w-4 h-4" /> Back to Categories
                                          </button>
                                          <span className="text-slate-300">|</span>
                                          <h2 className="text-xl font-bold text-slate-900">{selectedCategory} Jobs</h2>
                                       </div>
                                       <button
                                          onClick={() => {
                                             setNewVacancy(prev => ({ ...prev, industry: selectedCategory }));
                                             setIsAddVacancyOpen(true);
                                          }}
                                          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center gap-2"
                                       >
                                          <Plus className="w-4 h-4" /> Add Job Vacancy
                                       </button>
                                    </div>

                                    {/* Jobs Table */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                       {isLoadingJobs ? (
                                          <div className="p-12 flex flex-col items-center justify-center">
                                             <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                                             <p className="text-slate-500 font-medium">Loading jobs...</p>
                                          </div>
                                       ) : categoryJobs.length > 0 ? (
                                          <table className="w-full text-left">
                                             <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Title</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Company</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Location</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Salary</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-50">
                                                {categoryJobs.map((job) => (
                                                   <tr key={job.id || job._id} className="hover:bg-slate-50/50 transition-colors">
                                                      <td className="px-6 py-4">
                                                         <div>
                                                            <p className="text-sm font-bold text-slate-900">{job.title}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{job.type || 'Full-time'}</p>
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-sm text-slate-600">{job.company || 'N/A'}</span>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-sm text-slate-600 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {job.location || 'N/A'}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-sm font-medium text-slate-700">{job.salaryRange || job.salary || 'N/A'}</span>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'OPEN' || job.status === 'Current Opening'
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {job.status || 'OPEN'}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4 text-right flex items-center justify-end">
                                                         <button
                                                            onClick={() => handleJobClick(job)}
                                                            className="px-4 py-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 text-[10px] font-black uppercase tracking-widest hover:bg-teal-100 hover:border-teal-200 transition-all shadow-sm flex items-center gap-2"
                                                         >
                                                            <Users className="w-3 h-3" /> View Candidates
                                                         </button>
                                                      </td>
                                                   </tr>
                                                ))}
                                             </tbody>
                                          </table>
                                       ) : (
                                          <div className="p-12 flex flex-col items-center justify-center">
                                             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                                                <Briefcase className="w-8 h-8 opacity-40" />
                                             </div>
                                             <p className="text-slate-500 font-bold">No jobs found in {selectedCategory}</p>
                                             <p className="text-slate-400 text-sm mt-1">Click "Add Job Vacancy" to create one.</p>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              )}

                              {/* VIEW 3: CANDIDATES LIST */}
                              {vacancyViewMode === 'CANDIDATES' && (
                                 <div className="space-y-6">
                                    {/* Back Button & Header */}
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
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                       {isLoadingApplications ? (
                                          <div className="p-12 flex flex-col items-center justify-center">
                                             <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
                                             <p className="text-slate-500 font-medium">Loading applicants...</p>
                                          </div>
                                       ) : jobApplications.length > 0 ? (
                                          <table className="w-full text-left">
                                             <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Applicant Name</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Agent Name</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Resume</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                                   <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-50">
                                                {jobApplications.map((app) => (
                                                   <tr key={app.id || app._id} className="hover:bg-slate-50/50 transition-colors">
                                                      <td className="px-6 py-4">
                                                         <div>
                                                            <p className="text-sm font-bold text-slate-900">{app.candidateName || app.name || 'Unknown'}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{app.email || 'No email'}</p>
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-sm text-slate-600">
                                                            {app.source === 'Direct' ? (
                                                               <span className="text-blue-600 font-medium">Direct Application</span>
                                                            ) : (
                                                               app.agentName || app.agency || 'N/A'
                                                            )}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         {app.hasResume || app.resumeUrl ? (
                                                            <button
                                                               onClick={() => window.open(app.resumeUrl || '#', '_blank')}
                                                               className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700"
                                                            >
                                                               <FileText className="w-4 h-4" /> View Resume
                                                            </button>
                                                         ) : (
                                                            <span className="text-xs text-slate-400">Not available</span>
                                                         )}
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Applied' ? 'bg-blue-50 text-blue-600' :
                                                            app.status === 'Processing' ? 'bg-purple-50 text-purple-600' :
                                                               app.status === 'Selected' ? 'bg-emerald-50 text-emerald-600' :
                                                                  app.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                                     'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {app.status || 'Applied'}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <div className="flex items-center gap-2 justify-end">
                                                            <button
                                                               onClick={() => handleApplicationAction(app.id || app._id, 'approve')}
                                                               disabled={app.status === 'Selected'}
                                                               className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                               Approve
                                                            </button>
                                                            <button
                                                               onClick={() => handleApplicationAction(app.id || app._id, 'reject')}
                                                               disabled={app.status === 'Rejected'}
                                                               className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                               Reject
                                                            </button>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                ))}
                                             </tbody>
                                          </table>
                                       ) : (
                                          <div className="p-12 flex flex-col items-center justify-center">
                                             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                                                <Users className="w-8 h-8 opacity-40" />
                                             </div>
                                             <p className="text-slate-500 font-bold">No candidates found for this job</p>
                                             <p className="text-slate-400 text-sm mt-1">Applicants will appear here once they apply.</p>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              )}

                           </div>
                        )}

                        {/* ACCOUNT PROVISIONING */}
                        {activeTab === 'create_profile' && (
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
                                       onClick={() => setAgentSubTab('vacancies')}
                                       className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'vacancies'
                                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                          : 'bg-white text-slate-400 hover:text-slate-600'
                                          }`}
                                    >
                                       <Briefcase className="w-4 h-4" /> Agent Vacancies
                                    </button>
                                    <button
                                       onClick={() => setAgentSubTab('resumes')}
                                       className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'resumes'
                                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                          : 'bg-white text-slate-400 hover:text-slate-600'
                                          }`}
                                    >
                                       <Users className="w-4 h-4" /> Agent Resumes
                                    </button>
                                    <button
                                       onClick={() => setAgentSubTab('new_apps')}
                                       className={`flex items-center gap-2 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'new_apps'
                                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                                          : 'bg-white text-slate-400 hover:text-slate-600'
                                          }`}
                                    >
                                       <UserPlus className="w-4 h-4" /> New Applications
                                    </button>
                                 </div>

                                 {/* Content Area */}
                                 <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                                    {agentSubTab === 'vacancies' && (
                                       <div className="space-y-4">
                                          <div className="flex justify-end items-center gap-3">
                                             <div className="relative">
                                                <input
                                                   type="text"
                                                   placeholder="Search vacancies..."
                                                   className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-64"
                                                   value={vacancySearchInput}
                                                   onChange={(e) => setVacancySearchInput(e.target.value)}
                                                   onKeyDown={(e) => e.key === 'Enter' && handleVacancySearch()}
                                                />
                                                <button
                                                   onClick={handleVacancySearch}
                                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                                                >
                                                   <Search className="w-4 h-4" />
                                                </button>
                                             </div>
                                             <div className="relative">
                                                <button
                                                   onClick={() => setIsVacancyFilterOpen(!isVacancyFilterOpen)}
                                                   className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isVacancyFilterOpen ? 'bg-teal-50 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isVacancyFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">1. Status</h4>
                                                            <div className="space-y-2">
                                                               {['HIDDEN', 'LIVE TO PUBLIC', 'STILL IN HOLD'].map(status => (
                                                                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${vacancyFilters.status.includes(status) ? 'bg-teal-600 border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {vacancyFilters.status.includes(status) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                                     </div>
                                                                     <input type="checkbox" className="hidden" checked={vacancyFilters.status.includes(status)} onChange={() => toggleVacancyFilter(status)} />
                                                                     <span className="text-xs font-bold text-slate-700">{status}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">2. Duration</h4>
                                                            <div className="space-y-2">
                                                               {['Since 1 hr', 'Since 1 week', 'Since 1 month', 'Since 3 months', 'All'].map(duration => (
                                                                  <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                                                                     <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${vacancyFilters.duration === duration ? 'border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                                                                        {vacancyFilters.duration === duration && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                                                                     </div>
                                                                     <input type="radio" className="hidden" checked={vacancyFilters.duration === duration} onChange={() => setVacancyFilters({ ...vacancyFilters, duration })} />
                                                                     <span className="text-xs font-bold text-slate-700">{duration}</span>
                                                                  </label>
                                                               ))}
                                                            </div>
                                                         </div>
                                                      </div>
                                                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                                         <button onClick={() => setVacancyFilters({ status: [], duration: 'All' })} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">Clear</button>
                                                         <button onClick={() => setIsVacancyFilterOpen(false)} className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">Apply</button>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                          <table className="w-full text-left border-collapse">
                                             <thead>
                                                <tr>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Vacancy Details</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Spoke Agency</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-center">Openings</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-center">View Vacancy</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-right">Public State</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-50">
                                                {filteredAgentVacancies.length > 0 ? (
                                                   filteredAgentVacancies.map((job) => (
                                                      <tr key={job.id} className="group hover:bg-slate-50 transition-colors">
                                                         <td className="px-6 py-8 align-middle">
                                                            <div>
                                                               <h4 className="font-bold text-slate-900 text-base mb-1">{job.title}</h4>
                                                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                  {job.ref} <span className="mx-1">•</span> {job.date}
                                                               </p>
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 align-middle">
                                                            <div className="flex items-center gap-4">
                                                               <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                                                  <Globe2 className="w-5 h-5" />
                                                               </div>
                                                               <span className="font-bold text-slate-700 text-sm">{job.agency}</span>
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-center bg-transparent align-middle">
                                                            <span className="font-black text-slate-900 text-xl">{job.openings}</span>
                                                         </td>
                                                         <td className="px-6 py-8 text-center align-middle">
                                                            <button
                                                               onClick={() => setSelectedVacancy(job)}
                                                               className="px-6 py-3 rounded-lg border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50 transition-all"
                                                            >
                                                               View Details
                                                            </button>
                                                         </td>
                                                         <td className="px-6 py-8 text-right align-middle">
                                                            <div className={`inline-flex items-center gap-2 ${job.stateColor} text-[10px] font-black uppercase tracking-widest`}>
                                                               {job.state === 'HIDDEN' && <AlertCircle className="w-4 h-4" />}
                                                               {job.state === 'LIVE TO PUBLIC' && <Globe2 className="w-4 h-4" />}
                                                               {job.state === 'STILL IN HOLD' && <Clock className="w-4 h-4" />}
                                                               {job.state}
                                                            </div>
                                                         </td>
                                                      </tr>
                                                   ))
                                                ) : (
                                                   <tr>
                                                      <td colSpan="5" className="px-6 py-12 text-center">
                                                         <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
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
                                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                                                >
                                                   <Search className="w-4 h-4" />
                                                </button>
                                             </div>
                                             <div className="relative">
                                                <button
                                                   onClick={() => setIsResumeFilterOpen(!isResumeFilterOpen)}
                                                   className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isResumeFilterOpen ? 'bg-teal-50 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isResumeFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">1. Status</h4>
                                                            <div className="space-y-2">
                                                               {['SELECTED', 'REJECTED', 'PROCESSING'].map(status => (
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
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">2. Duration</h4>
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
                                                      </div>
                                                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                                         <button onClick={() => setResumeFilters({ status: [], duration: 'All' })} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">Clear</button>
                                                         <button onClick={() => setIsResumeFilterOpen(false)} className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">Apply</button>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                          <table className="w-full text-left border-collapse">
                                             <thead>
                                                <tr>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Agent Candidate</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Job Role</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Spoke Agency</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-center">Status</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-right">Admin Action</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-50">
                                                {filteredAgentResumes.length > 0 ? (
                                                   filteredAgentResumes.map((resume) => (
                                                      <tr key={resume.id} className="group hover:bg-slate-50 transition-colors">
                                                         <td className="px-6 py-8 align-middle">
                                                            <div>
                                                               <h4 className="font-bold text-slate-900 text-base mb-1">{resume.name}</h4>
                                                               <p className="text-sm font-medium text-slate-400">
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
                                                               <span className="font-bold text-slate-700 text-xs tracking-wider uppercase">{resume.agency}</span>
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-center align-middle">
                                                            <div className={`inline-flex px-4 py-2 rounded-full border ${resume.statusColor} text-[10px] font-black uppercase tracking-widest`}>
                                                               {resume.status}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-right align-middle">
                                                            <button
                                                               onClick={() => setSelectedResume(resume)}
                                                               className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all inline-flex ml-auto"
                                                            >
                                                               <Eye className="w-4 h-4" />
                                                            </button>
                                                         </td>
                                                      </tr>
                                                   ))
                                                ) : (
                                                   <tr>
                                                      <td colSpan="5" className="px-6 py-12 text-center">
                                                         <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
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
                                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                                                >
                                                   <Search className="w-4 h-4" />
                                                </button>
                                             </div>
                                             <div className="relative">
                                                <button
                                                   onClick={() => setIsAppFilterOpen(!isAppFilterOpen)}
                                                   className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isAppFilterOpen ? 'bg-teal-50 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isAppFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">1. Status</h4>
                                                            <div className="space-y-2">
                                                               {['YET TO BE CHECKED', 'ON HOLD', 'SELECTED', 'REJECTED'].map(status => (
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
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">2. Duration</h4>
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
                                                      </div>
                                                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                                                         <button onClick={() => setAppFilters({ status: [], duration: 'All' })} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors">Clear</button>
                                                         <button onClick={() => setIsAppFilterOpen(false)} className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">Apply</button>
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                          <table className="w-full text-left border-collapse">
                                             <thead>
                                                <tr>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Applicant / Agency</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Target Region</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-center">Application Status</th>
                                                   <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] text-right">Action</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-slate-50">
                                                {filteredPartnerApplications.length > 0 ? (
                                                   filteredPartnerApplications.map((app) => (
                                                      <tr key={app.id} className="group hover:bg-slate-50 transition-colors">
                                                         <td className="px-6 py-8 align-middle">
                                                            <div>
                                                               <h4 className="font-bold text-slate-900 text-base mb-1">{app.applicant}</h4>
                                                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{app.agency}</p>
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 align-middle">
                                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                                               <MapPin className="w-4 h-4 text-slate-300" />
                                                               {app.region}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-center align-middle">
                                                            <div className={`inline-flex px-4 py-2 rounded-full border ${app.statusColor} text-[10px] font-black uppercase tracking-widest`}>
                                                               {app.status}
                                                            </div>
                                                         </td>
                                                         <td className="px-6 py-8 text-right align-middle">
                                                            <button
                                                               onClick={() => setSelectedApplication(app)}
                                                               className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-all inline-flex ml-auto"
                                                            >
                                                               <Eye className="w-4 h-4" />
                                                            </button>
                                                         </td>
                                                      </tr>
                                                   ))
                                                ) : (
                                                   <tr>
                                                      <td colSpan="4" className="px-6 py-12 text-center">
                                                         <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
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
                                       <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest text-red-500 flex items-center gap-2 whitespace-nowrap">
                                          <ShieldCheck className="w-4 h-4" /> Rejected Candidates
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
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
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
                                                   className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isBlacklistFilterOpen ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                                >
                                                   <Filter className="w-4 h-4" />
                                                </button>
                                                {isBlacklistFilterOpen && (
                                                   <div className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                      <div className="p-6 space-y-6">
                                                         <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Quick Filters</h4>
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
                                          <thead>
                                             <tr className="bg-red-50/50 border-b border-red-100">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-red-400 tracking-widest">Candidate Name</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-red-400 tracking-widest">Job Role</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-red-400 tracking-widest">Source</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-red-400 tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase text-red-400 tracking-widest text-right">Review</th>
                                             </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-50">
                                             {filteredBlacklistedCandidates.length > 0 ? (
                                                filteredBlacklistedCandidates.map((candidate, idx) => (
                                                   <tr key={`${candidate.id}-${idx}`} className="hover:bg-red-50/30 transition-colors">
                                                      <td className="px-6 py-4">
                                                         <div>
                                                            <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{candidate.email}</p>
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
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
                                                               <span className="text-[10px] font-medium text-slate-400 pl-3">
                                                                  {candidate.agency}
                                                               </span>
                                                            )}
                                                         </div>
                                                      </td>
                                                      <td className="px-6 py-4">
                                                         <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${candidate.statusColor}`}>
                                                            {candidate.status}
                                                         </span>
                                                      </td>
                                                      <td className="px-6 py-4 text-right">
                                                         <button
                                                            onClick={() => { setSelectedResume(candidate); setIsBlacklistReview(true); }}
                                                            className="w-10 h-10 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all ml-auto shadow-sm"
                                                         >
                                                            <Eye className="w-4 h-4" />
                                                         </button>
                                                      </td>
                                                   </tr>
                                                ))
                                             ) : (
                                                <tr>
                                                   <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                                      No blacklisted candidates found.
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
                     </div >
                  </div >
               </main >
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
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                       {selectedVacancy.ref}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <button
                              onClick={() => setSelectedVacancy(null)}
                              className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
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
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Region</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                       <MapPin className="w-4 h-4 text-slate-400" /> {selectedVacancy.region}
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Sector</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                       <Briefcase className="w-4 h-4 text-slate-400" /> {selectedVacancy.sector}
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Headcount</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                       <Users className="w-4 h-4 text-slate-400" /> {selectedVacancy.openings} Positions
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Date Posted</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700 flex items-center gap-2">
                                       <Calendar className="w-4 h-4 text-slate-400" /> {selectedVacancy.date}
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
                              className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                           >
                              <X className="w-5 h-5" />
                           </button>
                        </div>

                        <form onSubmit={handleAddVacancy} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Title</label>
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
                                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Field / Industry</label>
                                 <input
                                    required
                                    type="text"
                                    value={newVacancy.industry}
                                    onChange={(e) => setNewVacancy({ ...newVacancy, industry: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                    placeholder="Hospitality"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Salary Range</label>
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
                                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Headcount Required</label>
                                 <input
                                    required
                                    type="text"
                                    value={newVacancy.headcount}
                                    onChange={(e) => setNewVacancy({ ...newVacancy, headcount: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                                    placeholder="e.g. 5"
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Description</label>
                              <textarea
                                 required
                                 value={newVacancy.description}
                                 onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all min-h-[100px]"
                                 placeholder="Describe the role responsibilities..."
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Requirements</label>
                              <textarea
                                 required
                                 value={newVacancy.requirements}
                                 onChange={(e) => setNewVacancy({ ...newVacancy, requirements: e.target.value })}
                                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all min-h-[100px]"
                                 placeholder="List key requirements (one per line)..."
                              />
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
                              className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
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
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Candidate Full Name *</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700">{selectedResume.name}</div>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Email Address *</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700">{selectedResume.email}</div>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">WhatsApp Number *</label>
                                    <div className="p-4 bg-slate-50 rounded-xl font-bold text-slate-700">{selectedResume.whatsapp}</div>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Nationality *</label>
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
                                 <DocumentCard label="Resume / CV *" filename={selectedResume.documents.resume} />
                                 <DocumentCard label="Passport / ID Copy *" filename={selectedResume.documents.passport} />
                                 <DocumentCard label="Educational Certificates *" filename={selectedResume.documents.education} />
                              </div>
                           </section>

                           {/* 3. Compliance & Governance */}
                           <section>
                              <h3 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                 <ShieldCheck className="w-4 h-4" /> 3. Compliance & Governance
                              </h3>
                              <div className="grid grid-cols-2 gap-6">
                                 <DocumentCard label="Police Clearance (PCC)" filename={selectedResume.documents.pcc} />
                                 <DocumentCard label="Good Standing Certificate" filename={selectedResume.documents.goodStanding} />
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
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedApplication.agency}</h2>
                                    <div className="flex items-center gap-3">
                                       <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                          Contact: {selectedApplication.applicant}
                                       </span>
                                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                          Submitted: {selectedApplication.submittedDate}
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
                              className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                           >
                              <X className="w-5 h-5" />
                           </button>
                        </div>

                        {/* Step 1: CONFIRMATION */}
                        {approvalStep === 'CONFIRM' && (
                           <div className="p-16 flex flex-col items-center justify-center text-center">
                              <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-300">
                                 <ShieldCheck className="w-10 h-10 text-teal-600" />
                              </div>
                              <h2 className="text-3xl font-black text-slate-900 mb-4">Application Verified</h2>
                              <p className="text-slate-500 font-medium mb-10 max-w-md">
                                 Proceed to generate secure portal credentials for this partner?
                              </p>
                              <div className="flex items-center gap-4">
                                 <button
                                    onClick={() => setApprovalStep('NONE')}
                                    className="px-8 py-4 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                                 >
                                    Cancel
                                 </button>
                                 <button
                                    onClick={handleGenerateCredentials}
                                    className="px-8 py-4 rounded-xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
                                 >
                                    Generate Username & Password
                                 </button>
                              </div>
                           </div>
                        )}

                        {/* Step 2: GENERATING */}
                        {approvalStep === 'GENERATING' && (
                           <div className="p-20 flex flex-col items-center justify-center text-center">
                              <Loader2 className="w-16 h-16 text-teal-600 animate-spin mb-8" />
                              <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-widest">Encrypting Access...</h2>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Provisioning Secure Node</p>
                           </div>
                        )}

                        {/* Step 3: SUCCESS */}
                        {approvalStep === 'SUCCESS' && (
                           <div className="p-16 flex flex-col items-center justify-center text-center">
                              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-300">
                                 <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                              </div>
                              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-widest">Created</h2>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">
                                 The username and password is sent to the agent
                              </p>
                              <button
                                 onClick={() => {
                                    setSelectedApplication(null);
                                    setApprovalStep('NONE');
                                 }}
                                 className="px-10 py-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                              >
                                 Close Record
                              </button>
                           </div>
                        )}

                        {approvalStep === 'NONE' && (
                           <>
                              <div className="p-8 space-y-10">
                                 {/* Info Cards */}
                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                                          <MapPin className="w-3 h-3" /> Targeted Region
                                       </p>
                                       <p className="text-lg font-bold text-slate-900">{selectedApplication.region}</p>
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
                                       <DocumentCard label="Identity Proof" filename={selectedApplication.documents.identity} />
                                       <DocumentCard label="Business License" filename={selectedApplication.documents.license} />
                                       <DocumentCard label="Agency Profile" filename={selectedApplication.documents.profile} />
                                    </div>
                                 </section>
                              </div>

                              {/* Actions Footer */}
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
                           </>
                        )}
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
         </div >
      </>
   );
};

export default AdminDashboard;
