import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Download,
  ShieldCheck,
  FileText,
  Building2,
  Globe,
  X,
  Save,
  Upload,
  Calendar,
  Lock,
  Award,
  Target,
  Shield,
  Key,
  AlertTriangle,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';

// Mock Document Structure for Candidates
const CANDIDATE_DOCS = [
  { id: 'resume', label: 'Resume / CV', type: 'PDF', required: true },
  { id: 'passport', label: 'Passport Front', type: 'IMG', required: true },
  { id: 'pcc', label: 'Police Clearance', type: 'PDF', required: true },
  { id: 'edu', label: 'Education Certs', type: 'PDF', required: true },
  { id: 'photo', label: 'Passport Photo', type: 'IMG', required: true },
];

// Mock Document Structure for Agents
const AGENT_DOCS = [
  { id: 'license', label: 'Operating License', type: 'PDF', required: true },
  { id: 'tax', label: 'Tax Compliance (TRC)', type: 'PDF', required: true },
  { id: 'certs', label: 'Agency Certifications', type: 'PDF', required: false },
  { id: 'identity', label: 'Director ID Proof', type: 'IMG', required: true },
];

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const isAgent = user?.role === 'employer';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingDocs, setIsEditingDocs] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // --- STATE MANAGEMENT ---

  // 1. Personal / Agency Details State
  const [profileData, setProfileData] = useState({
    name: '',
    title: isAgent ? 'Global Talent Ltd' : 'Senior Guest Relations Officer',
    email: '',
    phone: isAgent ? '+1 (115) 555-0198' : '+91 98765 43110',
    location: isAgent ? 'Business District, Mumbai' : 'Mumbai, India',
    founded: '2016',
    sectors: isAgent ? 'Hospitality, Healthcare, Construction' : '',
    website: isAgent ? 'www.globaltalentltd.com' : ''
  });

  // 2. Security State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // 3. Document State
  const [docs, setDocs] = useState<any[]>([]);
  const [newDocName, setNewDocName] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // 4. Photo State
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      setDocs(isAgent ? AGENT_DOCS : CANDIDATE_DOCS);
      setPreviewImage(user.avatar || null);
    }
  }, [user, isAgent]);

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPersonal(false);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully via secure gateway.");
    setIsResettingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteDoc = (id: string) => {
    if (window.confirm("Are you sure you want to remove this document?")) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  const handleAddDoc = () => {
    if (!newDocName.trim()) return;
    const newDoc = {
      id: `custom-${Date.now()}`,
      label: newDocName,
      type: 'PDF',
      required: false
    };
    setDocs([...docs, newDoc]);
    setNewDocName('');
    setIsAddingDoc(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 md:py-16 px-4 font-sans">
      <div className="container mx-auto max-w-6xl">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              {isAgent ? 'Agency Profile' : 'My Passport Profile'}
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest text-[10px]">
              {isAgent ? 'Governance & Operational Identity' : 'International Career Ledger'}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsResettingPassword(true)}
              className="w-full md:w-auto bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" /> Security
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">

          {/* Left Column: Identity Card */}
          <div className="w-full lg:w-[35%] space-y-8">
            <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative">
              <div className={`h-32 md:h-40 ${isAgent ? 'bg-indigo-600' : 'bg-teal-600'} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
                <Globe className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10" />
              </div>

              <div className={`px-6 md:px-10 pb-10 relative ${isAgent ? 'pt-10' : ''}`}>
                {!isAgent && (
                  <div className="-mt-16 mb-8 flex justify-center relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl relative group">
                      <div className="w-full h-full rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden border border-slate-100 relative">
                        {previewImage ? (
                          <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12" />
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#0b0f1a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                )}

                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-2">{isAgent ? profileData.title : profileData.name}</h2>
                  <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isAgent ? 'text-indigo-500' : 'text-teal-600'}`}>
                    {isAgent ? 'AUTHORIZED AGENCY PARTNER' : profileData.title}
                  </p>
                  <div className="flex justify-center mt-6">
                    <span className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/10">
                      <ShieldCheck className="w-4 h-4 text-teal-400" /> SYSTEM VERIFIED
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-600 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-bold truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-bold">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-bold">{profileData.location}</span>
                  </div>
                  {isAgent && (
                    <div className="flex items-center gap-4 text-slate-600 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <Globe className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-indigo-600 underline cursor-pointer">{profileData.website}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="w-full mt-10 bg-[#0b0f1a] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-2xl"
                >
                  Update Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Sections */}
          <div className="flex-1 space-y-8">

            {/* Business / Qualification Details - ONLY FOR AGENT OR IF NEEDED (REMOVED QUALIFICATION DOSSIER FOR CANDIDATE) */}
            {isAgent && (
              <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 ${isAgent ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'} rounded-[1.8rem] flex items-center justify-center border border-slate-50`}>
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        Agency Parameters
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Operational Benchmarks</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" /> Specialized Sectors
                    </div>
                    <p className="text-sm font-black text-slate-800">{profileData.sectors}</p>
                  </div>
                  <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Founded Year
                    </div>
                    <p className="text-sm font-black text-slate-800">{profileData.founded}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Vault */}
            <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Ledger</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified Documentation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingDocs(!isEditingDocs)}
                  className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditingDocs ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-100'
                    }`}
                >
                  {isEditingDocs ? 'Finish Sync' : 'Manage Docs'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {docs.map((doc) => (
                  <div key={doc.id} className="group bg-slate-50/50 border border-slate-100/50 rounded-[2rem] p-6 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all relative overflow-hidden">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${doc.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'} border border-slate-100 shadow-sm`}>
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="min-w-0 pr-4">
                        <h4 className="font-black text-slate-900 text-sm tracking-tight truncate">{doc.label}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {doc.required ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">ENCRYPTED & VETTED</span>
                            </>
                          ) : (
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OPTIONAL</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isEditingDocs ? (
                      <div className="flex gap-2">
                        <button className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all">
                          <Upload className="w-4 h-4" />
                        </button>
                        {!doc.required && (
                          <button onClick={() => handleDeleteDoc(doc.id)} className="p-3 bg-white rounded-xl text-red-600 shadow-sm border border-slate-100 hover:bg-red-600 hover:text-white transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors flex-shrink-0">
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* ADD NEW DOCUMENT CARD */}
                {isEditingDocs && (
                  <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-all cursor-pointer min-h-[120px]" onClick={() => setIsAddingDoc(true)}>
                    {!isAddingDoc ? (
                      <>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                          <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Document</span>
                      </>
                    ) : (
                      <div className="w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          autoFocus
                          type="text"
                          placeholder="Document Name..."
                          className="w-full p-3 text-sm font-bold bg-white rounded-xl border-none focus:ring-2 focus:ring-indigo-500 mb-2"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddDoc();
                            if (e.key === 'Escape') setIsAddingDoc(false);
                          }}
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setIsAddingDoc(false)} className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-700">CANCEL</button>
                          <button onClick={handleAddDoc} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-indigo-700">Add</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SECURITY / RESET PASSWORD MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {isResettingPassword && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#0b0f1a]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center hidden md:flex">
                  <Key className="w-8 h-8 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Security Access</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Update Gateway Credentials</p>
                </div>
              </div>
              <button onClick={() => setIsResettingPassword(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordReset} className="p-8 md:p-10 space-y-6">
              {/* ... (Existing Password Fields - No changes needed logic-wise, just verifying styles) ... */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">
                  Caution: Resetting your password will log you out of all other active sessions immediately.
                </p>
              </div>

              <button type="submit" className="w-full py-6 bg-[#0b0f1a] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3">
                Update Password <Save className="w-4 h-4 text-teal-400" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL (REUSED FOR AGENT) */}
      {isEditingPersonal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#0b0f1a]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-2xl text-slate-900 tracking-tight">Identity Parameters</h3>
              <button onClick={() => setIsEditingPersonal(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handlePersonalSubmit} className="p-8 md:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agency Brand Name</label>
                  <input
                    type="text"
                    value={isAgent ? profileData.title : profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
              </div>
              {isAgent && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Website</label>
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core Sourcing Sectors</label>
                    <input
                      type="text"
                      value={profileData.sectors}
                      onChange={(e) => setProfileData({ ...profileData, sectors: e.target.value })}
                      className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                    />
                  </div>
                </div>
              )}
              <div className="pt-4">
                <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-[2rem] hover:bg-black transition-all shadow-2xl">
                  Commit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
