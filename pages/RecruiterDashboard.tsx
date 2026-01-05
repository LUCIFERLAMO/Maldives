
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
  AlignLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RecruiterDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'vacancies' | 'blocked' | 'agentHiring'>('agentHiring');
  const [agentSubTab, setAgentSubTab] = useState<'list' | 'post' | 'edit'>('list');
  
  // Data State
  const [applications, setApplications] = useState<CandidateApplication[]>(MOCK_APPLICATIONS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [selectedJobForSubmission, setSelectedJobForSubmission] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Agent Hiring State (Expanded with new fields)
  const [internalVacancies, setInternalVacancies] = useState([
    { 
      id: 'av-1', 
      title: 'Regional Field Scout', 
      region: 'Kerala, India', 
      requirements: ['Local networking', '5yr HR experience'],
      description: 'We are looking for a dedicated scout to verify potential hospitality candidates locally before they are processed for the Maldives. Must have strong ties to local hospitality schools.',
      candidatesNeeded: 3,
      sector: 'Hospitality'
    },
    { 
      id: 'av-2', 
      title: 'Medical Sourcing Lead', 
      region: 'Colombo, Sri Lanka', 
      requirements: ['Medical background', 'Recruitment exp'],
      description: 'Specialized role focusing on sourcing Head Nurses and Resort Medics. Requires understanding of medical certification standards in the Maldives.',
      candidatesNeeded: 2,
      sector: 'Healthcare'
    }
  ]);

  const [editingVacancy, setEditingVacancy] = useState<any>(null);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    region: '', 
    requirements: '', 
    description: '', 
    candidatesNeeded: 1, 
    sector: 'Hospitality' 
  });

  // Filter jobs based on search
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.status === JobStatus.OPEN && 
      (j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       j.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [jobs, searchTerm]);

  // Handle Edit Click
  const handleStartEdit = (v: any) => {
    setEditingVacancy(v);
    setEditForm({
      title: v.title,
      region: v.region,
      requirements: v.requirements.join(', '),
      description: v.description || '',
      candidatesNeeded: v.candidatesNeeded || 1,
      sector: v.sector || 'Hospitality'
    });
    setAgentSubTab('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVacancy) return;

    setInternalVacancies(prev => prev.map(v => {
      if (v.id === editingVacancy.id) {
        return {
          ...v,
          title: editForm.title.trim() || v.title,
          region: editForm.region.trim() || v.region,
          description: editForm.description.trim() || v.description,
          candidatesNeeded: editForm.candidatesNeeded,
          sector: editForm.sector,
          requirements: editForm.requirements.trim() 
            ? editForm.requirements.split(',').map(r => r.trim()).filter(r => r !== "")
            : v.requirements
        };
      }
      return v;
    }));

    setAgentSubTab('list');
    setEditingVacancy(null);
  };

  // Open submission modal
  const handleOpenSubmission = (job: Job) => {
    setSelectedJobForSubmission(job);
  };

  const handleConfirmSubmission = () => {
    alert("Candidate submission successful! The profile has been entered into the vetting queue.");
    setSelectedJobForSubmission(null);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0b0f1a] text-slate-400 flex flex-col flex-shrink-0 shadow-2xl z-20">
         <div className="h-20 flex flex-col justify-center px-8 bg-[#0b0f1a] border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Globe className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="font-black text-white text-[11px] uppercase tracking-[0.2em] block leading-none">PARTNER CHANNEL</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">BROKER PORTAL</span>
              </div>
            </div>
         </div>

         <nav className="flex-1 px-4 py-12 space-y-2">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'overview' 
                  ? 'bg-[#524ff3] text-white shadow-2xl shadow-indigo-500/20' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" /> DASHBOARD
            </button>
            <button 
              onClick={() => setActiveTab('vacancies')} 
              className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'vacancies' 
                  ? 'bg-[#524ff3] text-white shadow-2xl shadow-indigo-500/20' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5" /> ACTIVE VACANCIES
            </button>
            <button 
              onClick={() => setActiveTab('blocked')} 
              className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'blocked' 
                  ? 'bg-[#524ff3] text-white shadow-2xl shadow-indigo-500/20' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" /> PIPELINE TRACKING
            </button>
            <button 
              onClick={() => setActiveTab('agentHiring')} 
              className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === 'agentHiring' 
                  ? 'bg-[#524ff3] text-white shadow-2xl shadow-indigo-500/20' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <UserPlus className="w-5 h-5" /> AGENT HIRING
            </button>
         </nav>

         <div className="p-8 border-t border-white/5">
            <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-400 transition-all">
               <LogOut className="w-5 h-5" /> Sign Out
            </button>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* PRIMARY TOP BRAND HEADER */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 z-10">
           <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#0d9488] rounded flex items-center justify-center text-white">
                 <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-black text-[#0d9488] tracking-tighter text-lg">MaldivesCareer</span>
           </div>

           <div className="absolute left-1/2 -translate-x-1/2">
              <span className="text-slate-600 font-bold text-xs uppercase tracking-widest">Broker Dashboard</span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-xs font-black text-slate-900 tracking-tight">{user?.name || 'Global Talent Ltd'}</span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AGENCY PARTNER</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden bg-slate-100">
                 <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" className="w-full h-full object-cover" alt="Partner" />
              </div>
           </div>
        </header>

        {/* DASHBOARD CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-12 bg-[#f8fafc]">
           <div className="max-w-[1400px] mx-auto space-y-12">
              
              {/* TAB CONTENT: AGENT HIRING */}
              {activeTab === 'agentHiring' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                  
                  {/* Sub-Header & Navigation */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agent Recruitment Hub</h2>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Scale your internal partner network</p>
                    </div>
                    
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      <button 
                        onClick={() => setAgentSubTab('list')}
                        className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Active Needs
                      </button>
                      <button 
                        onClick={() => { setAgentSubTab('post'); setEditingVacancy(null); }}
                        className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${agentSubTab === 'post' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        New Vacancy
                      </button>
                    </div>
                  </div>

                  {/* AGENT SUB-TAB: LIST VIEW */}
                  {agentSubTab === 'list' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {internalVacancies.map(v => (
                         <div key={v.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
                            <div className="absolute top-8 right-8">
                               <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">{v.sector.toUpperCase()}</span>
                            </div>
                            
                            <div className="flex justify-between items-start mb-8">
                               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                                  <Target className="w-7 h-7" />
                               </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4">{v.title}</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                               <div className="flex items-center gap-2 text-slate-500 font-bold">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{v.region}</span>
                               </div>
                               <div className="flex items-center gap-2 text-indigo-600 font-bold">
                                  <Users className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{v.candidatesNeeded} HEADCOUNT</span>
                               </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <AlignLeft className="w-3 h-3" /> Role Description
                               </p>
                               <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                                  {v.description}
                                </p>
                            </div>
                            
                            <div className="space-y-3 mb-10">
                               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Mandatory Requirements</p>
                               <div className="flex flex-wrap gap-2">
                                  {v.requirements.map((r, i) => (
                                    <span key={i} className="px-3 py-1 bg-white text-slate-700 rounded-lg text-[9px] font-bold border border-slate-200">{r}</span>
                                  ))}
                               </div>
                            </div>

                            <button 
                              onClick={() => handleStartEdit(v)}
                              className="w-full py-4 bg-[#0b0f1a] text-white rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                            >
                               Update Parameters <Settings className="w-3.5 h-3.5 text-indigo-400" />
                            </button>
                         </div>
                       ))}
                       <button onClick={() => setAgentSubTab('post')} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-slate-400 hover:border-indigo-400 hover:text-indigo-400 transition-all group">
                          <PlusCircle className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Publish New Sourcing Goal</span>
                       </button>
                    </div>
                  )}

                  {/* AGENT SUB-TAB: POST NEW VACANCY */}
                  {agentSubTab === 'post' && (
                    <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl border border-slate-100 animate-in slide-in-from-right duration-500">
                       <div className="max-w-4xl mx-auto">
                          <div className="flex items-center gap-4 mb-12">
                             <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <FileText className="w-7 h-7" />
                             </div>
                             <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Post Internal Vacancy</h3>
                                <p className="text-slate-600 font-bold text-xs uppercase tracking-widest">Define requirements for your internal network</p>
                             </div>
                          </div>

                          <form className="space-y-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Vacancy Title *</label>
                                   <input type="text" placeholder="e.g. Sub-Agent / Field Scout" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Target Region *</label>
                                   <input type="text" placeholder="e.g. Southeast Asia / India" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                      <Layers className="w-3 h-3" /> Target Sector *
                                   </label>
                                   <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none">
                                      {['Hospitality', 'Healthcare', 'Finance', 'Construction', 'Transportation', 'IT'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                      ))}
                                   </select>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                      <Hash className="w-3 h-3" /> Candidates Required *
                                   </label>
                                   <input type="number" min="1" defaultValue="1" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                                </div>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Job Description *</label>
                                <textarea 
                                  rows={5} 
                                  placeholder="Provide a detailed overview of the role, daily tasks, and working conditions..." 
                                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                                ></textarea>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Core Requirements *</label>
                                <textarea 
                                  rows={3} 
                                  placeholder="List mandatory certifications, network reach, or language skills..." 
                                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                                ></textarea>
                                <p className="text-[9px] text-slate-500 font-bold italic ml-2">Separate requirements with commas for auto-tagging.</p>
                             </div>

                             <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setAgentSubTab('list')} className="px-12 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                                <button type="button" onClick={() => setAgentSubTab('list')} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Publish Goal</button>
                             </div>
                          </form>
                       </div>
                    </div>
                  )}

                  {/* AGENT SUB-TAB: EDIT VACANCY */}
                  {agentSubTab === 'edit' && (
                    <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-xl border border-slate-100 animate-in slide-in-from-right duration-500">
                       <div className="max-w-4xl mx-auto">
                          <div className="flex items-center gap-4 mb-12">
                             <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Settings className="w-7 h-7" />
                             </div>
                             <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Edit Vacancy Details</h3>
                                <p className="text-slate-600 font-bold text-xs uppercase tracking-widest">Update internal sourcing parameters</p>
                             </div>
                          </div>

                          <form onSubmit={handleSaveEdit} className="space-y-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Vacancy Title *</label>
                                   <input 
                                    type="text" 
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Target Region *</label>
                                   <input 
                                    type="text" 
                                    value={editForm.region}
                                    onChange={(e) => setEditForm({...editForm, region: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                                   />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                      <Layers className="w-3 h-3" /> Target Sector *
                                   </label>
                                   <select 
                                      value={editForm.sector}
                                      onChange={(e) => setEditForm({...editForm, sector: e.target.value})}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none"
                                    >
                                      {['Hospitality', 'Healthcare', 'Finance', 'Construction', 'Transportation', 'IT'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                      ))}
                                   </select>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                      <Hash className="w-3 h-3" /> Candidates Required *
                                   </label>
                                   <input 
                                      type="number" 
                                      min="1" 
                                      value={editForm.candidatesNeeded}
                                      onChange={(e) => setEditForm({...editForm, candidatesNeeded: parseInt(e.target.value) || 1})}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                                   />
                                </div>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Job Description *</label>
                                <textarea 
                                  rows={5} 
                                  value={editForm.description}
                                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                                ></textarea>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Core Requirements *</label>
                                <textarea 
                                  rows={3} 
                                  value={editForm.requirements}
                                  onChange={(e) => setEditForm({...editForm, requirements: e.target.value})}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
                                ></textarea>
                             </div>

                             <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setAgentSubTab('list')} className="px-12 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Save Changes</button>
                             </div>
                          </form>
                       </div>
                    </div>
                  )}

                </div>
              ) : activeTab === 'vacancies' ? (
                /* TAB CONTENT: ACTIVE VACANCIES (EXISTING) */
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Open Vacancies</h2>
                      <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest text-[10px]">ACCEPTING SUBMISSIONS FROM VERIFIED PARTNERS</p>
                    </div>

                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Filter by role..." 
                        className="bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-6 text-xs outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all w-full md:w-[320px] font-bold shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredJobs.map((job) => (
                      <div 
                        key={job.id} 
                        className="bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col"
                      >
                        <div className="flex items-start gap-6 mb-10">
                           <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-slate-100/50">
                              <BriefcaseIcon className="w-7 h-7" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <h3 className="font-black text-slate-900 text-lg leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{job.company}</p>
                           </div>
                        </div>

                        <div className="space-y-4 mb-10 flex-grow">
                           <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-slate-300" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.location}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <Award className="w-4 h-4 text-slate-300" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.experience.toUpperCase()} EXP. REQ.</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <Users className="w-4 h-4 text-slate-300" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1 OPENINGS</span>
                           </div>
                        </div>

                        <button 
                          onClick={() => handleOpenSubmission(job)}
                          className="w-full bg-[#121826] text-white py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10"
                        >
                           <UserPlus className="w-4 h-4" /> SUBMIT CANDIDATE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'overview' ? (
                /* PARTNER OVERVIEW (EXISTING) */
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">SUBMISSIONS</div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-slate-900 leading-none tracking-tighter">450</span>
                          </div>
                        </div>
                        <Globe className="absolute -bottom-6 -right-6 w-36 h-36 text-slate-50 opacity-40" />
                      </div>
                      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                          <div className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-4">APPROVED</div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-teal-600 leading-none tracking-tighter">380</span>
                          </div>
                        </div>
                        <CheckCircle className="absolute -bottom-6 -right-6 w-36 h-36 text-slate-50 opacity-40" />
                      </div>
                      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                          <div className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">PENDING</div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-amber-600 leading-none tracking-tighter">12</span>
                          </div>
                        </div>
                        <Activity className="absolute -bottom-6 -right-6 w-36 h-36 text-slate-50 opacity-40" />
                      </div>
                      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                          <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4">REJECTED</div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-black text-red-600 leading-none tracking-tighter">58</span>
                          </div>
                        </div>
                        <X className="absolute -bottom-6 -right-6 w-36 h-36 text-slate-50 opacity-40" />
                      </div>
                   </div>
                   
                   <div className="bg-[#0b0f1a] rounded-[3rem] p-16 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-[500px] h-full bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                         <div className="max-w-2xl">
                            <h3 className="text-4xl font-black tracking-tight mb-6">Partner Performance Metrics</h3>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                               Your agency is currently at 84% approval rate. Higher quality submissions lead to priority review by resort managers. Keep up the standard.
                            </p>
                         </div>
                         <button onClick={() => setActiveTab('vacancies')} className="bg-white text-indigo-950 px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-4 shadow-2xl">
                            EXPLORE VACANCIES <ArrowRight className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>
              ) : (
                /* PIPELINE TRACKING (EXISTING) */
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] overflow-hidden">
                      <div className="px-12 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">CANDIDATE SUBMISSION HISTORY</h3>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total: {applications.length}</span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">
                              <tr>
                                 <th className="px-12 py-8">CANDIDATE</th>
                                 <th className="px-12 py-8">TARGET ROLE</th>
                                 <th className="px-12 py-8 text-center">CURRENT STATUS</th>
                                 <th className="px-12 py-8 text-right">ACTION</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                   <td className="px-12 py-8">
                                      <div className="font-black text-slate-900 text-sm">{app.candidateName}</div>
                                      <div className="text-[10px] text-slate-400 font-bold mt-1">{app.email}</div>
                                   </td>
                                   <td className="px-12 py-8">
                                      <div className="font-bold text-slate-600 text-sm">{jobs.find(j => j.id === app.jobId)?.title}</div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{jobs.find(j => j.id === app.jobId)?.company}</div>
                                   </td>
                                   <td className="px-12 py-8 text-center">
                                      <span className="bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">
                                         {app.status}
                                      </span>
                                   </td>
                                   <td className="px-12 py-8 text-right">
                                      <button className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-lg transition-all border border-transparent group-hover:border-slate-100">
                                         <Eye className="w-5 h-5" />
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
           </div>
        </div>
      </main>

      {/* PARTNER SUBMISSION MODAL (EXISTING) */}
      {selectedJobForSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col h-fit max-h-[90vh]">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                       <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight">Partner Submission</h2>
                       <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1.5">
                          APPLYING FOR: {selectedJobForSubmission.title.toUpperCase()}
                       </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => setSelectedJobForSubmission(null)}
                  className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:text-slate-900 border border-slate-100 transition-colors"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-8">
                    <User className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">1. IDENTITY DETAILS</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">CANDIDATE FULL NAME *</label>
                      <input type="text" placeholder="Full Name" className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 outline-none focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">EMAIL ADDRESS *</label>
                      <input type="email" placeholder="email@candidate.com" className="w-full bg-[#f8fafc] border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 outline-none focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>

                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">2. MANDATORY DOCUMENT BUNDLE</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-200 rounded-3xl group hover:border-indigo-500 hover:bg-indigo-50/30 transition-all gap-4">
                       <UploadCloud className="w-7 h-7 text-slate-300 group-hover:text-indigo-500" />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">RESUME/CV</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-200 rounded-3xl group hover:border-indigo-500 hover:bg-indigo-50/30 transition-all gap-4">
                       <Shield className="w-7 h-7 text-slate-300 group-hover:text-indigo-500" />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">ID PROOF</span>
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 flex items-start gap-6">
                   <AlertTriangle className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                   <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">
                      COMPLIANCE NOTICE: BY SUBMITTING THIS CANDIDATE, YOU CONFIRM THEY MEET ALL JOB REQUIREMENTS.
                   </p>
                </div>
              </div>

              <div className="p-10 border-t border-slate-50 flex items-center justify-center gap-6">
                 <button onClick={() => setSelectedJobForSubmission(null)} className="px-12 py-5 bg-[#f8fafc] text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-3xl">CANCEL</button>
                 <button onClick={handleConfirmSubmission} className="px-12 py-5 bg-[#524ff3] text-white font-black uppercase text-[10px] tracking-widest rounded-3xl shadow-xl shadow-indigo-600/20">CONFIRM SUBMISSION</button>
              </div>
           </div>
        </div>
      )}

      {/* Internal Custom Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
};

export default RecruiterDashboard;
