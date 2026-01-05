
import React, { useState } from 'react';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../constants';
import { ApplicationStatus, CandidateApplication } from '../types';
import { 
  ArrowLeft, 
  Search, 
  Briefcase, 
  Building2, 
  X,
  ChevronRight,
  AlertTriangle,
  Upload,
  Info,
  Send,
  Lock,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyApplicationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);
  const [apps, setApps] = useState<CandidateApplication[]>(MOCK_APPLICATIONS);

  const handleRequestProgress = (appId: string) => {
    setApps(prev => prev.map(a => 
      a.id === appId ? { ...a, statusRequestStatus: 'pending' } : a
    ));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, statusRequestStatus: 'pending' });
    }
    alert("Request sent to employer.");
  };

  const allApplications = apps.map(app => {
    const job = MOCK_JOBS.find(j => j.id === app.jobId);
    return { ...app, jobTitle: job?.title, company: job?.company };
  }).filter(app => 
    app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAppCard = (app: any) => {
    const isAction = app.status === ApplicationStatus.ACTION_REQUIRED;
    
    return (
      <div 
        key={app.id} 
        onClick={() => setSelectedApp(app)}
        className={`group bg-white rounded-[2.5rem] border-2 transition-all p-8 cursor-pointer relative mb-4 shadow-sm ${
          isAction ? 'border-amber-200 bg-amber-50/20 shadow-xl shadow-amber-900/5 hover:border-amber-400' : 'border-slate-100 hover:border-maldives-300 hover:shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 min-w-0">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
               isAction ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-300 group-hover:bg-maldives-50 group-hover:text-maldives-600 transition-colors'
             }`}>
                {isAction ? <AlertTriangle className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
             </div>
             <div className="min-w-0">
               <h3 className="font-black text-slate-900 text-xl tracking-tight truncate">{app.jobTitle}</h3>
               <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{app.company} • {app.appliedDate}</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] ${
                    isAction ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                    {app.status}
                </span>
                {app.statusRequestStatus === 'pending' && (
                  <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mt-2">Request Sent</span>
                )}
             </div>
             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-maldives-600 group-hover:text-white transition-all">
                <ChevronRight className="w-6 h-6" />
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        
        <div className="mb-12">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-maldives-600 mb-8 font-black text-xs uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pulse
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">My Applications</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search your jobs..." 
                className="pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-maldives-500/10 w-full md:w-80 font-bold shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
           {allApplications.length > 0 ? (
             allApplications.map(app => renderAppCard(app))
           ) : (
             <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <Briefcase className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No matching applications</p>
             </div>
           )}
        </div>

      </div>

      {/* DRAWER */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedApp(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[4rem]">
            
            <div className="p-12 border-b border-slate-50 flex justify-between items-start">
              <div className="min-w-0 pr-6">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-3 truncate">{MOCK_JOBS.find(j => j.id === selectedApp.jobId)?.title}</h2>
                <div className="flex items-center gap-3 text-maldives-600 font-black text-xs uppercase tracking-[0.2em]">
                  <Building2 className="w-4 h-4" /> {MOCK_JOBS.find(j => j.id === selectedApp.jobId)?.company}
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-5 bg-slate-50 rounded-[2rem] text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-12">
              
              {/* ACTION REQUIRED SECTION: SPECIFIC DOC CORRECTIONS */}
              {selectedApp.status === ApplicationStatus.ACTION_REQUIRED && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="bg-amber-600 text-white rounded-[3rem] p-10 shadow-2xl shadow-amber-600/30 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                      <div className="flex items-center gap-4 mb-6">
                        <AlertTriangle className="w-10 h-10" />
                        <h3 className="text-2xl font-black tracking-tight">Admin Correction Request</h3>
                      </div>
                      <p className="text-amber-50 font-bold text-lg leading-tight mb-2">The admin has flagged documents for correction.</p>
                      <p className="text-amber-100 text-sm italic">Please check the specific items below and re-upload.</p>
                   </div>

                   <div className="space-y-4">
                      <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] ml-4">Required Action Items</h4>
                      {selectedApp.documentFeedbacks?.map((fb, idx) => (
                        <div key={idx} className="bg-white border-2 border-slate-100 rounded-3xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
                                    <FileText className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <div className="font-black text-slate-800 text-sm uppercase tracking-tighter">Corrupt Doc: {fb.docId.toUpperCase()}</div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase">{fb.timestamp}</div>
                                 </div>
                              </div>
                              <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                                 <Upload className="w-3 h-3" /> Fix Now
                              </button>
                           </div>
                           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 font-medium italic">
                              "{fb.message}"
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* PROGRESS ACCESS REQUEST */}
              {selectedApp.status !== ApplicationStatus.ACTION_REQUIRED && (
                <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                       <Info className="w-6 h-6 text-slate-400" />
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Recruitment Radar</h3>
                    </div>
                    <div className="text-4xl font-black text-slate-900 mb-4">{selectedApp.status}</div>
                    
                    {selectedApp.statusRequestStatus === 'approved' ? (
                       <div className="bg-green-50 text-green-700 p-8 rounded-[2.5rem] border border-green-100 flex items-start gap-5">
                          <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Detailed Visibility Granted</p>
                            <p className="text-sm mt-2 font-medium opacity-80">You have been given a "High Quality" internal score. The system expects a contact from the HR manager within 48-72 hours.</p>
                          </div>
                       </div>
                    ) : selectedApp.statusRequestStatus === 'pending' ? (
                       <div className="bg-indigo-50 text-indigo-700 p-8 rounded-[2.5rem] border border-indigo-100 flex items-start gap-5">
                          <Clock className="w-8 h-8 flex-shrink-0" />
                          <div>
                            <p className="font-black text-lg">Request in Queue</p>
                            <p className="text-sm mt-2 font-medium opacity-80">The recruiter has been notified of your request for internal status visibility. They will review your profile before granting access.</p>
                          </div>
                       </div>
                    ) : (
                       <div className="space-y-6">
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Want to see more than just "Applied"? Request full access to see your internal recruitment scoring and the HR's private notes regarding your profile.
                          </p>
                          <button 
                            onClick={() => handleRequestProgress(selectedApp.id)}
                            className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3"
                          >
                             <Send className="w-4 h-4" /> Grant Tracking Access
                          </button>
                       </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                 <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Activity Log</div>
                    <div className="font-black text-slate-900 text-xl tracking-tighter">Applied {selectedApp.appliedDate}</div>
                 </div>
                 <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Intelligence Tier</div>
                    <div className={`font-black text-xl tracking-tighter flex items-center gap-2 ${selectedApp.statusRequestStatus === 'approved' ? 'text-green-600' : 'text-slate-300'}`}>
                       {selectedApp.statusRequestStatus === 'approved' ? 'Full Visibility' : 'Locked'}
                       {selectedApp.statusRequestStatus !== 'approved' && <Lock className="w-5 h-5" />}
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
