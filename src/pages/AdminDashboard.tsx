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
   ArrowRight
} from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatCard } from '../components/StatCard';
import { MOCK_JOBS, MOCK_APPLICATIONS, INDUSTRIES } from '../constants';

const AdminDashboard: React.FC = () => {
   const [activeTab, setActiveTab] = useState('overview');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

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

   return (
      <div className="min-h-screen bg-slate-50 font-sans flex overflow-hidden">
         {/* SIDEBAR */}
         <DashboardSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => { setActiveTab(tab); setSelectedIndustry(null); }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
         />

         {/* MAIN CONTENT */}
         <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
            <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

            {/* CONTENT SCROLL AREA */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
               <div className="max-w-6xl mx-auto space-y-8 pb-10">

                  {/* PAGE TITLE */}
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                           {activeTab === 'overview' && 'Dashboard Overview'}
                           {activeTab === 'vacancies' && (selectedIndustry ? `${selectedIndustry} Candidates` : 'Vacancy Management')}
                           {activeTab === 'network' && 'Agency Partners'}
                           {activeTab === 'create_profile' && 'Account Provisioning'}
                           {activeTab === 'create_profile' && 'Account Provisioning'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                           {activeTab === 'overview' && 'Welcome back, here is what’s happening today.'}
                           {activeTab === 'vacancies' && !selectedIndustry && 'Manage job postings by category.'}
                           {activeTab === 'vacancies' && selectedIndustry && `Viewing applicants for ${selectedIndustry} roles.`}
                           {activeTab === 'create_profile' && 'Manually create and verify new accounts.'}
                        </p>
                     </div>

                     {/* Global Action Button (Example) */}
                     {activeTab === 'overview' && (
                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                           <ArrowUpRight className="w-4 h-4" /> Generate Report
                        </button>
                     )}

                     {activeTab === 'vacancies' && selectedIndustry && (
                        <button onClick={() => setSelectedIndustry(null)} className="text-sm font-bold text-slate-500 hover:text-slate-900">
                           Back to Categories
                        </button>
                     )}
                  </div>

                  {/* OVERVIEW CONTENT */}
                  {activeTab === 'overview' && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           <StatCard label="Pending Review" value="12" icon={Clock} color="amber" />
                           <StatCard label="Active Users" value="843" icon={Users} color="teal" />
                           <StatCard label="Open Vacancies" value="56" icon={Briefcase} color="slate" />
                           <StatCard label="Issues" value="3" icon={AlertCircle} color="red" />
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                              <h3 className="text-base font-bold text-slate-900 mb-6">Recent Registrations</h3>
                              <div className="space-y-4">
                                 {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                                             <Users className="w-5 h-5" />
                                          </div>
                                          <div>
                                             <p className="text-sm font-bold text-slate-900">New Candidate</p>
                                             <p className="text-xs text-slate-500">Registered 2 hours ago</p>
                                          </div>
                                       </div>
                                       <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded">Verified</span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                              <h3 className="text-base font-bold text-slate-900 mb-6">System Alerts</h3>
                              <div className="space-y-4">
                                 <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-4">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    <div>
                                       <p className="text-sm font-bold text-amber-800">High Server Load</p>
                                       <p className="text-xs text-amber-600 mt-1">System load is currently at 78% capacity.</p>
                                    </div>
                                 </div>
                                 <div className="p-4 bg-teal-50 rounded-lg border border-teal-100 flex gap-4">
                                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                                    <div>
                                       <p className="text-sm font-bold text-teal-800">Backup Completed</p>
                                       <p className="text-xs text-teal-600 mt-1">Daily database backup finished successfully.</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
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
