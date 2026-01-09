
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_JOBS, MOCK_APPLICATIONS } from '../constants';
import { JobStatus, ApplicationStatus } from '../types';
import { 
  Briefcase, 
  ArrowRight, 
  Send, 
  ChevronRight,
  Radar,
  Sparkles,
  AlertCircle,
  FileWarning,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const myApps = MOCK_APPLICATIONS; 
  const actionRequiredCount = myApps.filter(a => a.status === ApplicationStatus.ACTION_REQUIRED).length;
  const reopenedJobs = MOCK_JOBS.filter(j => j.isReopened && j.status === JobStatus.OPEN).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f0f9fa] pb-24 font-sans">
      
      {/* 1. VIBRANT HERO HEADER: Deep Ocean */}
      <div className="bg-[#0b1a33] text-white pt-24 pb-48 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                   <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_15px_#2dd4bf]"></div>
                   <p className="text-teal-400 font-black text-[11px] uppercase tracking-[0.3em]">Talent Passport Verified</p>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">Hi, {user?.name.split(' ')[0]}</h1>
                <p className="text-slate-400 font-medium text-xl max-w-md">Your Maldivian career pulse is active and healthy.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Link to="/profile" className="flex-1 md:flex-none text-center bg-white/5 hover:bg-white/10 px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest transition-all border border-white/10 backdrop-blur-md">
                   Update Profile
                </Link>
                <Link to="/applications" className="flex-1 md:flex-none text-center bg-teal-600 hover:bg-teal-500 px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest transition-all shadow-2xl shadow-teal-600/30">
                   Track Progress
                </Link>
              </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-24 relative z-20">
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 space-y-10">
              {/* Vitals Card */}
              <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col gap-10">
                 <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px] mb-2">Network Vitals</h3>
                    <p className="text-xs text-slate-400 font-medium">Real-time application metrics.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-6">
                    <div className="bg-[#f8fafc] p-8 rounded-[2.5rem] border border-slate-100 relative group overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                       <div className="text-5xl font-black text-slate-900 leading-none tracking-tighter mb-3">{myApps.length}</div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Applications</div>
                    </div>
                    <div className={`p-8 rounded-[2.5rem] border relative group overflow-hidden ${actionRequiredCount > 0 ? 'bg-orange-50 border-orange-100 shadow-xl shadow-orange-500/5' : 'bg-[#f8fafc] border-slate-100'}`}>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                       <div className={`text-5xl font-black leading-none tracking-tighter mb-3 ${actionRequiredCount > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{actionRequiredCount}</div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Immediate Actions</div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-50">
                    <div className="flex items-center justify-between text-[11px] font-black text-slate-900 uppercase tracking-widest">
                       <span>Profile Strength</span>
                       <span className="text-teal-600">85%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full mt-4 overflow-hidden">
                       <div className="h-full w-[85%] bg-teal-600 rounded-full shadow-lg shadow-teal-500/30"></div>
                    </div>
                 </div>
              </div>

              {/* Radar: Maldivian Dark Mode */}
              <div className="bg-[#121826] rounded-[3.5rem] p-12 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent"></div>
                 
                 <div className="flex items-center gap-5 mb-10 relative z-10">
                    <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
                       <Radar className="w-7 h-7 text-teal-400 animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight">Job Radar</h3>
                       <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em]">New in Paradise</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                    {reopenedJobs.map(job => (
                       <Link key={job.id} to={`/job/${job.id}`} className="block bg-white/5 hover:bg-white/10 p-6 rounded-[2rem] border border-white/5 transition-all group/item hover:border-teal-500/20">
                          <div className="flex items-center justify-between">
                             <div className="min-w-0 pr-4">
                                <div className="font-black truncate text-base leading-tight mb-1 group-hover/item:text-teal-400 transition-colors">{job.title}</div>
                                <div className="flex items-center gap-2">
                                   <MapPin className="w-3 h-3 text-slate-500" />
                                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{job.location}</span>
                                </div>
                             </div>
                             <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover/item:bg-teal-600 transition-all text-slate-400 group-hover/item:text-white">
                                <ChevronRight className="w-5 h-5" />
                             </div>
                          </div>
                       </Link>
                    ))}
                 </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-8 space-y-10">
               
               {/* HIGH CONTRAST ALERTS */}
               {myApps.filter(a => a.status === ApplicationStatus.ACTION_REQUIRED).map(app => (
                 <div key={app.id} className="bg-white border-2 border-orange-200 rounded-[3.5rem] p-12 shadow-2xl shadow-orange-900/5 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden group hover:border-orange-500/30 transition-all">
                    <div className="absolute top-0 left-0 w-3 h-full bg-orange-600"></div>
                    <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-orange-600 flex-shrink-0 border border-orange-100 shadow-xl shadow-orange-500/5">
                       <FileWarning className="w-12 h-12" />
                    </div>
                    <div className="flex-grow">
                       <div className="flex items-center gap-3 mb-6">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-orange-600 px-5 py-2 rounded-full shadow-lg shadow-orange-600/20">Action Required</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Case Ref: {app.id.toUpperCase()}</span>
                       </div>
                       <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">Correction requested for <span className="text-orange-600">{MOCK_JOBS.find(j => j.id === app.jobId)?.title}</span></h3>
                       <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative mb-10 ring-1 ring-slate-200/50">
                          <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                             "{app.adminFeedback}"
                          </p>
                          <div className="absolute -top-3 left-8 px-3 bg-slate-50 text-[10px] font-black text-slate-400 uppercase border border-slate-100 rounded-full">Recruiter Direct Note</div>
                       </div>
                       <Link to="/applications" className="inline-flex items-center gap-4 bg-[#121826] text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20">
                          Update My File <ArrowRight className="w-5 h-5" />
                       </Link>
                    </div>
                 </div>
               ))}

               {/* RECENT HISTORY: Clean & Premium */}
               <section className="bg-white rounded-[3.5rem] p-12 md:p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-slate-100 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex items-center justify-between mb-12 relative z-10">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/5 border border-teal-100/50">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Recent History</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">LATEST STATUS UPDATES</p>
                        </div>
                     </div>
                     <Link to="/applications" className="px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-all uppercase tracking-widest">See Full Log</Link>
                  </div>

                  <div className="space-y-6 relative z-10">
                     {myApps.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-8 bg-[#f8fafc] rounded-[2.5rem] hover:bg-white border-2 border-transparent hover:border-teal-500/20 transition-all group cursor-pointer shadow-sm hover:shadow-2xl">
                           <div className="flex gap-8 items-center min-w-0">
                              <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-slate-300 group-hover:text-teal-600 shadow-sm transition-colors border border-slate-100 group-hover:border-teal-100">
                                 <Briefcase className="w-8 h-8" />
                              </div>
                              <div className="min-w-0">
                                 <h3 className="font-black text-xl text-slate-900 truncate mb-1.5 group-hover:text-teal-600 transition-colors">{MOCK_JOBS.find(j => j.id === app.jobId)?.title}</h3>
                                 <div className="flex items-center gap-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {app.appliedDate}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    <span>{MOCK_JOBS.find(j => j.id === app.jobId)?.company}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hidden sm:block shadow-sm ${
                                app.status === ApplicationStatus.ACTION_REQUIRED ? 'bg-orange-600 text-white shadow-orange-600/20' : 'bg-white text-slate-600 border border-slate-100'
                              }`}>
                                {app.status}
                              </span>
                              <div className="w-14 h-14 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 group-hover:shadow-xl transition-all">
                                 <ChevronRight className="w-7 h-7" />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </div>

         </div>

      </div>
    </div>
  )
}

export default CandidateDashboard;
