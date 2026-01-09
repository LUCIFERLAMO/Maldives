
import React, { useState, useMemo } from 'react';
import { ApplicationStatus, JobStatus, Job, CandidateApplication } from '../types';
import { MOCK_APPLICATIONS, MOCK_JOBS, INDUSTRIES } from '../constants';
import {
   Search, LayoutDashboard, Users, Briefcase, ChevronRight,
   X, Shield, LogOut, Briefcase as BriefcaseIcon,
   Ban, PlusCircle, Filter, FileText, CheckCircle, RefreshCw,
   FolderOpen, AlertCircle, Trash2, UserX, Download, Check,
   MinusCircle, Eye, MessageSquare, AlertTriangle, ExternalLink, Globe,
   ArrowRight,
   UserPlus,
   MapPin,
   Award,
   Activity,
   User,
   Mail,
   Phone,
   Upload,
   UploadCloud,
   Sparkles,
   ListFilter,
   FileUp,
   Target,
   Settings,
   Hash,
   Layers,
   AlignLeft,
   ChevronDown,
   ShieldCheck,
   Plus,
   FilePlus,
   TrendingUp,
   Calendar,
   Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';

const RecruiterDashboard: React.FC = () => {
   const navigate = useNavigate();
   const { user, login } = useAuth();
   const { logout } = useAuth();
   const [activeTab, setActiveTab] = useState<'overview' | 'vacancies' | 'blocked' | 'jobRequests'>('jobRequests');


   // Data State
   const [applications, setApplications] = useState<CandidateApplication[]>(MOCK_APPLICATIONS);
   const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
   const [selectedJobForSubmission, setSelectedJobForSubmission] = useState<Job | null>(null);
   const [submissionFiles, setSubmissionFiles] = useState<{ [key: string]: File | null }>({
      resume: null,
      identity: null,
      certs: null,
      pcc: null,
      goodStanding: null
   });
   const [searchTerm, setSearchTerm] = useState('');
   const [pipelineSearchTerm, setPipelineSearchTerm] = useState('');

   const [jobRequests, setJobRequests] = useState<any[]>([
      { id: '1', title: 'Head Nurse', field: 'Healthcare', status: 'PENDING', salary: '$2000 - $3000', headcount: 5, description: 'Leading the nursing team...', requirements: 'BSc Nursing, 5 years exp' },
      { id: '2', title: 'Sous Chef', field: 'Hospitality', status: 'APPROVED', salary: '$1500 - $2000', headcount: 2, description: 'Assist executive chef...', requirements: 'Culinary Degree, HACCP' }
   ]);
   const [showJobRequestForm, setShowJobRequestForm] = useState(false);
   const [jobRequestSearchTerm, setJobRequestSearchTerm] = useState('');
   const [expandedJobRequestId, setExpandedJobRequestId] = useState<string | null>(null);

   // Filter jobs based on search
   const filteredJobs = useMemo(() => {
      return jobs.filter(j =>
         j.status === JobStatus.OPEN &&
         (j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
   }, [jobs, searchTerm]);



   // Open submission modal
   const handleOpenSubmission = (job: Job) => {
      setSelectedJobForSubmission(job);
      setSubmissionFiles({
         resume: null,
         identity: null,
         certs: null,
         pcc: null,
         goodStanding: null
      });
   };

   const handleConfirmSubmission = () => {
      // Validation
      if (!submissionFiles.resume || !submissionFiles.identity || !submissionFiles.certs) {
         alert("Please upload all mandatory documents (Resume, ID/Passport, Certificates).");
         return;
      }
      alert("Candidate submission successful! The profile has been entered into the vetting queue.");
      setSelectedJobForSubmission(null);
   };

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
                     <span className="font-bold text-white text-sm tracking-tight block leading-none">GlobalTalent</span>
                     <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1 block">Partner Portal</span>
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
            </nav>

            <div className="p-6 border-t border-slate-800">
               <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-semibold tracking-wide hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-500">
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
                                                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{req.field}</span>
                                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.status === 'APPROVED' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                         req.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            'bg-amber-50 text-amber-700 border-amber-100'
                                                         }`}>
                                                         {req.status}
                                                      </span>
                                                   </div>
                                                   <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">{req.title}</h3>
                                                   <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                                      <span>{req.headcount} Openings</span>
                                                      <span>•</span>
                                                      <span>{req.salary}</span>
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
                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                                                               {req.requirements || 'No specific requirements listed.'}
                                                            </p>
                                                         </div>
                                                      </div>
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
                                 <form className="space-y-8" onSubmit={(e) => {
                                    e.preventDefault();
                                    // Mock submission logic
                                    const newRequest = {
                                       id: Math.random().toString(),
                                       title: (e.target as any).title.value,
                                       field: (e.target as any).field.value,
                                       description: (e.target as any).description.value,
                                       salary: (e.target as any).salary.value,
                                       headcount: (e.target as any).headcount.value,
                                       requirements: (e.target as any).requirements.value,
                                       status: 'PENDING'
                                    };
                                    setJobRequests([newRequest, ...jobRequests]);
                                    setShowJobRequestForm(false);
                                 }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                                          <input name="title" required type="text" placeholder="e.g. Senior Sous Chef" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field / Industry</label>
                                          <select name="field" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none">
                                             <option>Hospitality</option>
                                             <option>Healthcare</option>
                                             <option>Construction</option>
                                             <option>Corporate</option>
                                          </select>
                                       </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary Range</label>
                                          <input name="salary" required type="text" placeholder="e.g. $1200 - $1500 USD" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Headcount Required</label>
                                          <input name="headcount" required type="number" min="1" placeholder="e.g. 5" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
                                       </div>
                                    </div>

                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
                                       <textarea name="description" required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none" placeholder="Describe the role responsibilities..."></textarea>
                                    </div>

                                    <div className="space-y-2">
                                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements</label>
                                       <textarea name="requirements" required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none" placeholder="List key requirements (one per line)..."></textarea>
                                    </div>

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
                     /* TAB CONTENT: ACTIVE VACANCIES (EXISTING) */
                     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div>
                              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Open Vacancies</h2>
                              <p className="text-slate-500 font-medium text-sm mt-1">Accepting submissions from verified partners</p>
                           </div>

                           <div className="relative group">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                              <input
                                 type="text"
                                 placeholder="Filter by role or company..."
                                 className="bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-full md:w-[320px] font-medium shadow-sm"
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                           {filteredJobs.map((job) => (
                              <div
                                 key={job.id}
                                 className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-200 transition-all group flex flex-col relative overflow-hidden"
                              >
                                 {/* Status Stripe */}
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

                                 <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pl-2">
                                    <div className="flex items-center gap-2">
                                       <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                       <span className="text-xs font-medium text-slate-600">{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Award className="w-3.5 h-3.5 text-slate-400" />
                                       <span className="text-xs font-medium text-slate-600">{job.experience} Exp</span>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2">
                                       <Users className="w-3.5 h-3.5 text-slate-400" />
                                       <span className="text-xs font-medium text-slate-600">Immediate Requirement</span>
                                    </div>
                                 </div>

                                 <div className="mt-auto pl-2">
                                    <button
                                       onClick={() => handleOpenSubmission(job)}
                                       className="w-full bg-slate-900 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-900/10 transition-all"
                                    >
                                       <UserPlus className="w-4 h-4" /> Submit Candidate
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                  ) : activeTab === 'overview' ? (
                     /* PARTNER OVERVIEW (EXISTING) */
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Welcome Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                           <div>
                              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Global Talent.</h2>
                              <p className="text-slate-500 text-sm mt-1">Here's what's happening with your candidates today.</p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                           </div>
                        </div>

                        {/* Metrics Grid (Larger & Cleaner) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-center">
                                 <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Candidates</p>
                                    <h3 className="text-4xl font-black text-slate-900 mt-3">{applications.length}</h3>
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
                                       {applications.filter(app => app.status === ApplicationStatus.SELECTED).length}
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
                                       {applications.filter(app => [ApplicationStatus.APPLIED, ApplicationStatus.PROCESSING, ApplicationStatus.INTERVIEW].includes(app.status)).length}
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
                                       {applications.filter(app => app.status === ApplicationStatus.BLACKLISTED).length}
                                    </h3>
                                 </div>
                                 <div className="p-4 bg-red-50 rounded-2xl text-red-600">
                                    <Ban className="w-8 h-8" />
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
                                    {applications.slice(0, 5).map((app) => {
                                       const job = jobs.find(j => j.id === app.jobId);
                                       return (
                                          <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                             <td className="px-8 py-5 font-medium text-slate-900">{app.candidateName}</td>
                                             <td className="px-8 py-5 text-slate-600">{job?.title || 'Unknown Role'}</td>
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
                  ) : (
                     /* PIPELINE TRACKING (EXISTING) */
                     /* PIPELINE TRACKING (REFINED) */
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
                                    {applications.filter(app =>
                                       app.candidateName.toLowerCase().includes(pipelineSearchTerm.toLowerCase()) ||
                                       app.email.toLowerCase().includes(pipelineSearchTerm.toLowerCase())
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
                                    {applications
                                       .filter(app =>
                                          app.candidateName.toLowerCase().includes(pipelineSearchTerm.toLowerCase()) ||
                                          app.email.toLowerCase().includes(pipelineSearchTerm.toLowerCase())
                                       )
                                       .map((app) => {
                                          const job = jobs.find(j => j.id === app.jobId);
                                          return (
                                             <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-4">
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold border border-teal-100 uppercase">
                                                         {app.candidateName.charAt(0)}
                                                      </div>
                                                      <div>
                                                         <div className="font-bold text-slate-900 text-sm">{app.candidateName}</div>
                                                         <div className="text-xs text-slate-500">{app.email}</div>
                                                      </div>
                                                   </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                   <div className="font-medium text-slate-900 text-sm">{job?.title || 'Unknown Role'}</div>
                                                   <div className="text-xs text-slate-500">{job?.company || 'Unknown Company'}</div>
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
                                    {applications.filter(app =>
                                       app.candidateName.toLowerCase().includes(pipelineSearchTerm.toLowerCase()) ||
                                       app.email.toLowerCase().includes(pipelineSearchTerm.toLowerCase())
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
                  )
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
                                 <input type="text" placeholder="As per passport" className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                                 <input type="email" placeholder="email@candidate.com" className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-semibold text-slate-700">WhatsApp Number *</label>
                                 <input type="tel" placeholder="+CountrCode Number" className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-semibold text-slate-700">Nationality *</label>
                                 <input type="text" placeholder="Nationality" className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
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
