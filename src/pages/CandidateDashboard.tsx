
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../constants';
import { ApplicationStatus } from '../types';
import {
   Briefcase,
   ArrowRight,
   Clock,
   MapPin,
   Bell,
   Stethoscope,
   Calendar,
   ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard: React.FC = () => {
   const { user } = useAuth();
   const myApps = MOCK_APPLICATIONS;
   const actionRequiredCount = myApps.filter(a => a.status === ApplicationStatus.ACTION_REQUIRED).length;

   // Mock logic for watchlist
   const foundJobAlert = {
      id: 'nurse-specialist',
      title: 'Head Nurse (ICU)',
      category: 'Medical',
      location: 'Male\' City',
      matchScore: '98%',
      isNew: true
   };

   return (
      <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">

         {/* 1. HERO SECTION: Maldives Ocean Gradient */}
         <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 pb-12 pt-10 px-6 shadow-lg shadow-teal-900/10 sticky top-0 z-10 backdrop-blur-md">
            <div className="container mx-auto max-w-6xl">
               <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                  <div>
                     <p className="text-teal-100 font-medium text-sm mb-2">Good Morning,</p>
                     <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                        {user?.name}
                     </h1>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                     <Link to="/profile" className="flex-1 md:flex-none px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
                        My Profile
                     </Link>
                     <Link to="/applications" className="flex-1 md:flex-none px-6 py-3 bg-white text-teal-800 rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors shadow-lg shadow-teal-900/20 active:scale-95 transform transition-transform">
                        Track Applications
                     </Link>
                  </div>
               </div>
            </div>
         </div>

         <div className="container mx-auto max-w-6xl px-4 mt-8 pb-20">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

               {/* LEFT COLUMN - Alerts & Vitals */}
               <div className="lg:col-span-4 space-y-6">

                  {/* STATUS SUMMARY CARDS */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Apps</div>
                        <div className="text-3xl font-bold text-slate-900">{myApps.length}</div>
                        <div className="mt-2 text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded-md">
                           On Track
                        </div>
                     </div>
                     <div className={`p-5 rounded-2xl border shadow-sm transition-shadow ${actionRequiredCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${actionRequiredCount > 0 ? 'text-amber-700' : 'text-slate-400'}`}>Action Needed</div>
                        <div className={`text-3xl font-bold ${actionRequiredCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>{actionRequiredCount}</div>
                        {actionRequiredCount > 0 && (
                           <div className="mt-2 text-xs text-amber-700 font-medium bg-amber-100/50 inline-block px-2 py-1 rounded-md">
                              Review Now
                           </div>
                        )}
                     </div>
                  </div>

                  {/* SMART ALERT (Humanized & Pretty) */}
                  <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white p-1 rounded-3xl shadow-xl shadow-teal-900/10">
                     <div className="bg-white/10 backdrop-blur-sm p-6 rounded-[1.3rem]">
                        <div className="flex items-start justify-between mb-4">
                           <span className="p-2 bg-white/20 rounded-xl text-white">
                              <Bell className="w-5 h-5" />
                           </span>
                           <span className="px-3 py-1 rounded-full bg-teal-400 text-teal-950 text-xs font-bold shadow-sm">
                              New Match
                           </span>
                        </div>

                        <div className="mb-6">
                           <h3 className="font-bold text-xl mb-1 text-white">{foundJobAlert.title}</h3>
                           <p className="text-teal-100 text-sm">
                              Matches your interest in "{foundJobAlert.category}"
                           </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium text-teal-50 mb-6">
                           <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {foundJobAlert.location}</span>
                           <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> 98% Match</span>
                        </div>

                        <button className="w-full py-3.5 bg-white text-teal-900 rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors shadow-sm">
                           View Opportunity
                        </button>
                     </div>
                  </div>
               </div>

               {/* RIGHT COLUMN - Content */}
               <div className="lg:col-span-8 space-y-8">

                  {/* ACTION ALERTS */}
                  {myApps.filter(a => a.status === ApplicationStatus.ACTION_REQUIRED).map(app => (
                     <div key={app.id} className="bg-white border-l-4 border-amber-500 rounded-r-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col sm:flex-row gap-6">
                        <div className="flex-grow">
                           <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-amber-500" />
                              Action Required
                           </h3>
                           <p className="text-slate-600 text-sm mb-4">
                              Update requested for application to <span className="font-semibold text-slate-900">{MOCK_JOBS.find(j => j.id === app.jobId)?.title}</span>.
                           </p>
                           <div className="bg-amber-50 p-4 rounded-xl text-sm italic text-amber-900 border border-amber-100/50 mb-0">
                              "{app.adminFeedback}"
                           </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center">
                           <Link to="/applications" className="px-5 py-2.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors">
                              Fix Now
                           </Link>
                        </div>
                     </div>
                  ))}

                  {/* RECENT APPLICATIONS LIST */}
                  <section>
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg text-slate-900">Recent Applications</h2>
                        <Link to="/applications" className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                           View All <ArrowRight className="w-4 h-4" />
                        </Link>
                     </div>

                     <div className="space-y-3">
                        {myApps.slice(0, 3).map((app) => (
                           <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between cursor-pointer">
                              <div className="flex gap-4 items-center">
                                 <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                    <Briefcase className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-slate-900 text-base">{MOCK_JOBS.find(j => j.id === app.jobId)?.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                                       <span>{MOCK_JOBS.find(j => j.id === app.jobId)?.company}</span>
                                       <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                       <span>{app.appliedDate}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === ApplicationStatus.ACTION_REQUIRED ? 'bg-amber-100 text-amber-700' :
                                       'bg-slate-100 text-slate-600'
                                    }`}>
                                    {app.status}
                                 </span>
                                 <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600" />
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
