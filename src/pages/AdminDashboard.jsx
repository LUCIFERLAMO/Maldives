import React, { useState } from 'react';// react testimgnnghhv - test commit
import {
   Users,
   Briefcase,
   AlertCircle,
   CheckCircle2,
   Clock,
   UserPlus,
   ArrowUpRight,
   Filter,
   ArrowRight,
   Globe2,
   X,
   MapPin,
   ShieldCheck,
   Coins,
   Eye,
   Loader2,
   AlertTriangle,
   Plus,
   Calendar,
   FileText
} from 'lucide-react';

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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatCard } from '../components/StatCard';
import { MOCK_JOBS, MOCK_APPLICATIONS, INDUSTRIES } from '../constants';

import { FileText } from 'lucide-react';

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
   const [agentSubTab, setAgentSubTab] = useState('vacancies');
   const [agentResumes, setAgentResumes] = useState(MOCK_AGENT_RESUMES);
   const [auditQueue, setAuditQueue] = useState(MOCK_AUDIT_QUEUE);
   const [selectedResume, setSelectedResume] = useState(null);
   const [isBlacklistReview, setIsBlacklistReview] = useState(false);
   const [allApplications, setAllApplications] = useState(MOCK_APPLICATIONS);
   const [industries, setIndustries] = useState(INDUSTRIES);
   const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
   const [newCategoryName, setNewCategoryName] = useState('');
   const [categoryError, setCategoryError] = useState('');
   const [isAddVacancyOpen, setIsAddVacancyOpen] = useState(false);
   const [vacancyForm, setVacancyForm] = useState({
      title: '',
      industry: '',
      salary: '',
      headcount: '',
      description: '',
      requirements: ''
   });

   // Resume Status Logic
   const handleResumeStatusChange = (status) => {
      if (!selectedResume) return;

      // Update Vacancy Applications (allApplications)
      // Note: MOCK_APPLICATIONS items (and thus allApplications items) have 'id' and 'jobId'
      const updatedApplications = allApplications.map(app => {
         // We match by ID. Assuming selectedResume.id corresponds to app.id
         if (app.id === selectedResume.id) {
            return {
               ...app,
               status: status // 'Rejected', 'On Hold', 'Selected'
            };
         }
         return app;
      });
      setAllApplications(updatedApplications);

      // Update Agent Resumes
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
               newStatus = 'PROCESSING'; // Map 'On Hold' to PROCESSING for agent view or keep as is?
               // The user requirement says "Keep on hold ... update to On hold".
               // I'll stick to the requested string "On Hold" if possible, or mapping it.
               // For agentResumes, the status field string usually follows a set enum 'PROCESSING', 'ARRIVED', etc.
               // But for this task, the main focus is Vacancy Management.
               statusColor = 'bg-purple-50 text-purple-600 border-purple-100';
            }

            return { ...resume, status: newStatus, statusColor };
         }
         return resume;
      });
      setAgentResumes(updatedResumes);

      // Update Audit Queue
      const updatedAuditQueue = auditQueue.map(candidate => {
         if (candidate.id === selectedResume.id) {
            let statusColor = '';
            // "if the admin approves ... show status as live to public"
            if (status === 'LIVE TO PUBLIC' || status === 'Selected') {
               statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
            }
            // "if rejected ... show status that it is rejected"
            if (status === 'Rejected') {
               statusColor = 'bg-slate-100 text-slate-500 border-slate-200';
            }
            // "if place in hold ... show processing"
            if (status === 'On Hold') {
               statusColor = 'bg-purple-50 text-purple-600 border-purple-100';
            }

            return { ...candidate, status, statusColor };
         }
         return candidate;
      });
      setAuditQueue(updatedAuditQueue);

      setSelectedResume(null); // Close modal
      setIsBlacklistReview(false);
   };

   const [partnerApplications, setPartnerApplications] = useState(MOCK_NEW_PARTNER_APPS);
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
      // Only close if not in approval flow or if success finished
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

   const handleSubmitVacancy = (e) => {
      e.preventDefault();
      // In a real app, you would submit data here
      alert('Job vacancy submitted');
      setIsAddVacancyOpen(false);
      setVacancyForm({
         title: '',
         industry: '',
         salary: '',
         headcount: '',
         description: '',
         requirements: ''
      });
   };

   const handleGenerateCredentials = () => {
      setApprovalStep('GENERATING');
      setTimeout(() => {
         setApprovalStep('SUCCESS');
         // Actually update status in background
         handleApplicationStatusChange('SELECTED');
      }, 2000);
   };



   // Agent Vacancy State


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

   // Vacancy Logic
   const getJobsByIndustry = (industry) => MOCK_JOBS.filter(j => j.industry === industry);

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
      <div className="min-h-screen bg-white font-sans flex flex-col">
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
                                 { label: "DISPATCHED", value: "0", icon: null, action: () => setActiveTab('vacancies') },
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


                        </div>
                     )}

                     {/* AUDIT QUEUE CONTENT */}
                     {activeTab === 'audit' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                 <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Candidate Audit Stream</h3>
                                 <button className="text-slate-400 hover:text-slate-600">
                                    <Filter className="w-4 h-4" />
                                 </button>
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
                                       {auditQueue.map((candidate) => (
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
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* VACANCIES CONTENT */}
                     {activeTab === 'vacancies' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                           {!selectedIndustry ? (
                              <>
                                 <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Vacancy Categories</h2>
                                    <button
                                       onClick={() => setIsAddCategoryOpen(true)}
                                       className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center gap-2"
                                    >
                                       <Plus className="w-4 h-4" /> Add Category
                                    </button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {industries.map((industry) => {
                                       const jobCount = getJobsByIndustry(industry).length;
                                       return (
                                          <button
                                             key={industry}
                                             onClick={() => setSelectedIndustry(industry)}
                                             className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all text-left group"
                                          >
                                             <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-50 transition-colors">
                                                <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                                             </div>
                                             <h3 className="text-lg font-bold text-slate-900 mb-1">{industry}</h3>
                                             <p className="text-sm text-slate-500 font-medium">{jobCount} Active Jobs</p>
                                             <div className="mt-6 flex items-center text-xs font-bold text-teal-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                View Candidates <ArrowRight className="w-3 h-3 ml-2" />
                                             </div>
                                          </button>
                                       );
                                    })}
                                 </div>
                              </>
                           ) : (
                              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Candidate Moderation Stream</h3>
                                    <div className="flex items-center gap-3">
                                       <button
                                          onClick={() => {
                                             setVacancyForm(prev => ({ ...prev, industry: selectedIndustry }));
                                             setIsAddVacancyOpen(true);
                                          }}
                                          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center gap-2"
                                       >
                                          <Plus className="w-4 h-4" /> Add Job Vacancy
                                       </button>
                                       <button className="text-slate-400 hover:text-slate-600">
                                          <Filter className="w-4 h-4" />
                                       </button>
                                    </div>
                                 </div>
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                       <thead>
                                          <tr className="bg-slate-50 border-b border-slate-100">
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Applicant Profile</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Role</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Source</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Application State</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Review</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-50">
                                          {getCandidatesForIndustry(selectedIndustry).length > 0 ? (
                                             getCandidatesForIndustry(selectedIndustry).map((app) => (
                                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                   <td className="px-6 py-4">
                                                      <div>
                                                         <p className="text-sm font-bold text-slate-900">{app.candidateName}</p>
                                                         <p className="text-xs text-slate-400 font-medium">{app.email}</p>
                                                      </div>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                         {app.jobTitle}
                                                      </span>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <div className="flex flex-col">
                                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${app.source === 'Direct' ? 'bg-blue-400' : 'bg-amber-400'}`}></span>
                                                            {app.source === 'Direct' ? 'Direct' : 'Broker'}
                                                         </span>
                                                         <span className="text-[10px] font-medium text-slate-400 pl-3">
                                                            {app.source === 'Direct' ? 'Portal Application' : 'Global Talent Ltd'}
                                                         </span>
                                                      </div>
                                                   </td>
                                                   <td className="px-6 py-4">
                                                      <span className={`
                                                      px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                      ${app.status === 'Applied' ? 'bg-blue-50 text-blue-600' : ''}
                                                      ${app.status === 'Processing' ? 'bg-purple-50 text-purple-600' : ''}
                                                      ${app.status === 'On Hold' ? 'bg-amber-50 text-amber-600' : ''}
                                                      ${app.status === 'Selected' ? 'bg-teal-50 text-teal-600' : ''}
                                                      ${app.status === 'Rejected' ? 'bg-red-50 text-red-600' : ''}
                                                      ${app.status === 'Blacklisted' ? 'bg-red-50 text-red-600' : ''}
                                                   `}>
                                                         {app.status}
                                                      </span>
                                                   </td>
                                                   <td className="px-6 py-4 text-right">
                                                      <button
                                                         onClick={() => setSelectedResume({
                                                            ...app,
                                                            name: app.candidateName,
                                                            role: app.jobTitle,
                                                            // Mock data for resume view compatibility since MOCK_APPLICATIONS structure differs slightly
                                                            whatsapp: app.contactNumber,
                                                            nationality: 'Maldivian', // Mock
                                                            agency: app.source === 'Direct' ? 'Direct Application' : 'Agency',
                                                            statusColor: '',
                                                            documents: {
                                                               resume: 'Resume.pdf',
                                                               passport: 'Passport.pdf',
                                                               education: 'Certificates.pdf',
                                                               pcc: 'PCC.pdf',
                                                               goodStanding: 'GoodStanding.pdf'
                                                            }
                                                         })}
                                                         className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition-all ml-auto"
                                                      >
                                                         <Eye className="w-4 h-4" />
                                                      </button>
                                                   </td>
                                                </tr>
                                             ))
                                          ) : (
                                             <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                                   No candidates found for this category.
                                                </td>
                                             </tr>
                                          )}
                                       </tbody>
                                    </table>
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
                     )}

                     {/* AGENT ECOSYSTEM */}
                     {activeTab === 'agents' && (
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
                           <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-8">
                              {agentSubTab === 'vacancies' && (
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
                                       {agentVacancies.map((job) => (
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
                                       ))}
                                    </tbody>
                                 </table>
                              )}

                              {agentSubTab === 'resumes' && (
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
                                       {agentResumes.map((resume) => (
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
                                       ))}
                                    </tbody>
                                 </table>
                              )}

                              {agentSubTab === 'new_apps' && (
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
                                       {partnerApplications.map((app) => (
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
                                       ))}
                                    </tbody>
                                 </table>
                              )}


                           </div>
                        </div>
                     )}


                     {/* BLACKLISTED CONTENT */}
                     {activeTab === 'blacklisted' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                 <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest text-red-500 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Rejected Candidates
                                 </h3>
                                 <button className="text-slate-400 hover:text-slate-600">
                                    <Filter className="w-4 h-4" />
                                 </button>
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
                                       {[...auditQueue, ...agentResumes].filter(c => c.status === 'REJECTED').map((candidate, idx) => (
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
                                       ))}
                                       {[...auditQueue, ...agentResumes].filter(c => c.status === 'REJECTED').length === 0 && (
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
                     )}

                     {/* RESUME MODAL */}
                     {selectedResume && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                           <div
                              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                              onClick={() => { setSelectedResume(null); setIsBlacklistReview(false); }}
                           />
                           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                              {/* Modal Header */}
                              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-700">
                                       {selectedResume.name.charAt(0)}
                                    </div>
                                    <div>
                                       <h2 className="text-xl font-bold text-slate-900">{selectedResume.name}</h2>
                                       <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                          {selectedResume.role} <span className="w-1 h-1 rounded-full bg-slate-300"></span> {selectedResume.nationality}
                                       </p>
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => { setSelectedResume(null); setIsBlacklistReview(false); }}
                                    className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition-colors"
                                 >
                                    <X className="w-5 h-5" />
                                 </button>
                              </div>

                              {/* Modal Content - Two Columns */}
                              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                                 {/* LEFT: Documents List */}
                                 <div className="w-full lg:w-1/3 bg-slate-50 p-6 border-r border-slate-100 overflow-y-auto">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Submitted Documents</h3>
                                    <div className="space-y-3">
                                       {Object.entries(selectedResume.documents).map(([key, filename]) => (
                                          <DocumentCard key={key} label={key} filename={filename} />
                                       ))}
                                    </div>

                                    <div className="mt-8">
                                       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>
                                       <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                                          <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                                                <Globe2 className="w-4 h-4" />
                                             </div>
                                             <div className="overflow-hidden">
                                                <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                                                <p className="text-sm font-semibold text-slate-900 truncate">{selectedResume.email}</p>
                                             </div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                                                <Globe2 className="w-4 h-4" />
                                             </div>
                                             <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">WhatsApp</p>
                                                <p className="text-sm font-semibold text-slate-900">{selectedResume.whatsapp}</p>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 {/* RIGHT: Document Preview (Placeholder) */}
                                 <div className="flex-1 bg-slate-100 p-6 lg:p-8 flex items-center justify-center relative">
                                    <div className="bg-white shadow-xl rounded-xl w-full h-full max-w-2xl flex flex-col overflow-hidden border border-slate-200">
                                       <div className="bg-slate-800 text-white px-4 py-2 text-xs font-medium flex justify-between items-center">
                                          <span>resume_preview.pdf</span>
                                          <span>Page 1 of 2</span>
                                       </div>
                                       <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-2">
                                             <FileText className="w-8 h-8" />
                                          </div>
                                          <p className="text-slate-500 font-medium">Document viewer placeholder</p>
                                          <button className="text-teal-600 font-bold text-sm hover:underline">Download Original</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              {/* Modal Footer - Actions */}
                              <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex justify-end gap-3 z-10">
                                 {isBlacklistReview || (selectedResume && selectedResume.status === 'REJECTED') ? (
                                    <>
                                       <button
                                          onClick={() => { setSelectedResume(null); setIsBlacklistReview(false); }}
                                          className="px-6 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm uppercase tracking-wider hover:bg-blue-100 transition-colors"
                                       >
                                          Cancel
                                       </button>
                                       <button
                                          onClick={() => handleResumeStatusChange('PROCESSING')}
                                          className="px-6 py-3 rounded-xl bg-amber-50 text-amber-600 font-bold text-sm uppercase tracking-wider hover:bg-amber-100 transition-colors"
                                       >
                                          On Hold
                                       </button>
                                       <button
                                          onClick={() => handleResumeStatusChange('LIVE TO PUBLIC')}
                                          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                                       >
                                          <CheckCircle2 className="w-5 h-5" /> Accept & Approve
                                       </button>
                                    </>
                                 ) : (
                                    <>
                                       <button
                                          onClick={() => handleResumeStatusChange('REJECTED')}
                                          className="px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm uppercase tracking-wider hover:bg-red-100 transition-colors"
                                       >
                                          Reject
                                       </button>
                                       <button
                                          onClick={() => handleResumeStatusChange('PROCESSING')}
                                          className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm uppercase tracking-wider hover:bg-slate-200 transition-colors"
                                       >
                                          Keep in Hold
                                       </button>
                                       <button
                                          onClick={() => handleResumeStatusChange('LIVE TO PUBLIC')}
                                          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
                                       >
                                          <CheckCircle2 className="w-5 h-5" /> Approve Candidate
                                       </button>
                                    </>
                                 )}
                              </div>
                           </div>
                        </div>
                     )}

                     {/* PLACEHOLDER FOR OTHER TABS */}
                     {['network'].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border-2 border-dashed border-slate-200 text-center">
                           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                              <Briefcase className="w-8 h-8 text-slate-300" />
                           </div>
                           <h3 className="text-lg font-bold text-slate-900 mb-2">Section Under Development</h3>
                           <p className="text-slate-500 max-w-md mx-auto">This module is currently being optimized for better performance and usability. Check back soon.</p>
                        </div>
                     )}

                  </div>
               </div>
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
         {isAddVacancyOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8">Add Job Vacancy</h2>
                  <form onSubmit={handleSubmitVacancy} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                           <input
                              required
                              type="text"
                              value={vacancyForm.title}
                              onChange={e => setVacancyForm({ ...vacancyForm, title: e.target.value })}
                              placeholder="e.g. Senior Sous Chef"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field / Industry</label>
                           <input
                              required
                              type="text"
                              value={vacancyForm.industry}
                              onChange={e => setVacancyForm({ ...vacancyForm, industry: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary Range</label>
                           <input
                              required
                              type="text"
                              value={vacancyForm.salary}
                              onChange={e => setVacancyForm({ ...vacancyForm, salary: e.target.value })}
                              placeholder="e.g. $1200 - $1500 USD"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Headcount Required</label>
                           <input
                              required
                              type="text"
                              value={vacancyForm.headcount}
                              onChange={e => setVacancyForm({ ...vacancyForm, headcount: e.target.value })}
                              placeholder="e.g. 5"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
                        <textarea
                           required
                           rows={4}
                           value={vacancyForm.description}
                           onChange={e => setVacancyForm({ ...vacancyForm, description: e.target.value })}
                           placeholder="Describe the role responsibilities..."
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements</label>
                        <textarea
                           required
                           rows={4}
                           value={vacancyForm.requirements}
                           onChange={e => setVacancyForm({ ...vacancyForm, requirements: e.target.value })}
                           placeholder="List key requirements (one per line)..."
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
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
                           className="flex-1 px-8 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all"
                        >
                           Submit Request
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

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
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

                     {/* Header */}
                     <div className="sticky top-0 z-[110] bg-white border-b border-slate-100 p-8 flex items-start justify-between">
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
                           onClick={() => setSelectedResume(null)}
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
                     </div>
                  </div>
               </div>
            )
         }

         {/* APPLICATION DETAILS MODAL */}
         {
            selectedApplication && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

                     {/* Header */}
                     <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-8 flex items-start justify-between">
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
   );
};

export default AdminDashboard;
