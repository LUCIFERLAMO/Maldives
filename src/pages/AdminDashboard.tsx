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
   Globe2
} from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import Navbar from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { MOCK_JOBS, MOCK_APPLICATIONS, INDUSTRIES } from '../constants';

const AdminDashboard: React.FC = () => {
   const [activeTab, setActiveTab] = useState('overview');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
   const [agentSubTab, setAgentSubTab] = useState('vacancies');

   // Manual Profile State
   const [provisioningType, setProvisioningType] = useState<'candidate' | 'employer'>('candidate');
   const [profileForm, setProfileForm] = useState({
      name: '',
      email: '',
      sector: 'Hospitality',
      location: '',
      company: '',
      website: '',
      phone: ''
   });

   const handleProvisionAccount = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Account for ${provisioningType === 'candidate' ? profileForm.name : profileForm.company} successfully provisioned.`);
      setProfileForm({ name: '', email: '', sector: 'Hospitality', location: '', company: '', website: '', phone: '' });
   };

   // Vacancy Logic
   const getJobsByIndustry = (industry: string) => MOCK_JOBS.filter(j => j.industry === industry);

   const getCandidatesForIndustry = (industry: string) => {
      const jobIds = getJobsByIndustry(industry).map(j => j.id);
      return MOCK_APPLICATIONS.filter(app => jobIds.includes(app.jobId));
   };

   const getPageTitle = () => {
      switch (activeTab) {
         case 'overview': return 'Dashboard Overview';
         case 'audit': return 'Audit Queue';
         case 'vacancies': return selectedIndustry ? selectedIndustry : 'Vacancy Management';
         case 'agents': return 'Agent Ecosystem';
         case 'intelligence': return 'Intelligence';
         case 'security': return 'Security Logs';
         case 'create_profile': return 'Account Provisioning';
         default: return 'Dashboard';
      }
   };

   return (
      <div className="min-h-screen bg-white font-sans flex flex-col overflow-hidden">
         <Navbar />
         <div className="flex flex-1 overflow-hidden">
            {/* SIDEBAR */}
            <DashboardSidebar
               activeTab={activeTab}
               setActiveTab={(tab) => { setActiveTab(tab); setSelectedIndustry(null); }}
               isOpen={isSidebarOpen}
               onClose={() => setIsSidebarOpen(false)}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-slate-50/50">
               <DashboardHeader
                  onMenuClick={() => setIsSidebarOpen(true)}
                  title={getPageTitle()}
               />

               {/* CONTENT SCROLL AREA */}
               <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                  <div className="max-w-6xl mx-auto space-y-8 pb-10">

                     {/* PAGE TITLE REDMOVED */}
                     <div className="flex items-center justify-between">
                        {/* Global Action Button (Example) */}
                        {activeTab === 'overview' && (
                           <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 mb-6">
                              <ArrowUpRight className="w-4 h-4" /> Generate Report
                           </button>
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
                                 { label: "AUDIT QUEUE", value: "2", icon: null },
                                 { label: "DISPATCHED", value: "0", icon: null },
                                 { label: "AGENT FLOW", value: "3", icon: null },
                                 { label: "BLACKLISTED", value: "1", icon: null, textRed: true },
                              ].map((stat, idx) => (
                                 <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-center h-48 relative overflow-hidden group hover:shadow-lg transition-all">
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

                     {/* VACANCIES CONTENT */}
                     {activeTab === 'vacancies' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                           {!selectedIndustry ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {INDUSTRIES.map((industry) => {
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
                           ) : (
                              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Candidate Moderation Stream</h3>
                                    <button className="text-slate-400 hover:text-slate-600">
                                       <Filter className="w-4 h-4" />
                                    </button>
                                 </div>
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                       <thead>
                                          <tr className="bg-slate-50 border-b border-slate-100">
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Applicant Profile</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Application State</th>
                                             <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Source</th>
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
                                                      <span className={`
                                                      px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                      ${app.status === 'Applied' ? 'bg-blue-50 text-blue-600' : ''}
                                                      ${app.status === 'Processing' ? 'bg-purple-50 text-purple-600' : ''}
                                                      ${app.status === 'Selected' ? 'bg-teal-50 text-teal-600' : ''}
                                                      ${app.status === 'Rejected' ? 'bg-slate-100 text-slate-500' : ''}
                                                      ${app.status === 'Blacklisted' ? 'bg-red-50 text-red-600' : ''}
                                                   `}>
                                                         {app.status}
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
                                                   <td className="px-6 py-4 text-right">
                                                      <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center transition-all ml-auto">
                                                         <ArrowUpRight className="w-4 h-4" />
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
                                       {[
                                          {
                                             title: "Island Liaison",
                                             ref: "REF: AV-1",
                                             date: "2024-05-20",
                                             agency: "Global Talent Ltd",
                                             openings: 2,
                                             state: "HIDDEN",
                                             stateColor: "text-slate-300"
                                          },
                                          {
                                             title: "Diving Instructor",
                                             ref: "REF: AV-2",
                                             date: "2024-05-18",
                                             agency: "Island Recruiters",
                                             openings: 1,
                                             state: "LIVE TO PUBLIC",
                                             stateColor: "text-teal-600"
                                          },
                                          {
                                             title: "Resort Medic",
                                             ref: "REF: AV-3",
                                             date: "2024-05-21",
                                             agency: "Asia Health Sourcing",
                                             openings: 3,
                                             state: "STILL IN HOLD",
                                             stateColor: "text-amber-500"
                                          }
                                       ].map((job, idx) => (
                                          <tr key={idx} className="group hover:bg-slate-50 transition-colors">
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
                                                <button className="px-6 py-3 rounded-lg border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50 transition-all">
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
            </main>
         </div>

         {/* Global Styles */}
         <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
      </div>
   );
};

export default AdminDashboard;
