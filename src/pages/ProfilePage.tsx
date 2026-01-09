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
    sectors: isAgent ? 'Hospitality, Healthcare, Construction' : ''
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload the file and update the user profile here
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

        {/* Redesigned Profile Layout */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">

          {/* Header Section */}
          <div className="px-8 py-10 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{isAgent ? profileData.title : profileData.name}</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {isAgent ? 'Authorized Agency Partner' : profileData.title}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingPersonal(true)}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Contact Details Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="flex items-center gap-3 text-slate-900 font-medium p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400" />
                {profileData.email}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
              <div className="flex items-center gap-3 text-slate-900 font-medium p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400" />
                {profileData.phone}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <div className="flex items-center gap-3 text-slate-900 font-medium p-3 bg-slate-50 rounded-lg border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400" />
                {profileData.location}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Member Since</label>
              <div className="flex items-center gap-3 text-slate-900 font-medium p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400" />
                {profileData.founded}
              </div>
            </div>
          </div>


        </div>
      </div>
      {/* ---------------------------------------------------------------------- */}
      {/* SECURITY / RESET PASSWORD MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {
        isResettingPassword && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#0b0f1a]/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Update your account credentials</p>
                </div>
                <button onClick={() => setIsResettingPassword(false)} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePasswordReset} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={passwords.current}
                      onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.new}
                      onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                      placeholder="New password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.confirm}
                      onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Changing your password will sign you out of all other devices.
                  </p>
                </div>

                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* EDIT MODAL (REUSED FOR AGENT) */}
      {
        isEditingPersonal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#0b0f1a]/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-slate-900">Edit Profile Details</h3>
                <button onClick={() => setIsEditingPersonal(false)} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handlePersonalSubmit} className="p-6 space-y-5">
                <div className="space-y-5">

                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-slate-100">
                    <div className="relative w-24 h-24">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
                        {previewImage ? (
                          <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="profile-upload"
                        className="absolute bottom-0 right-0 p-1.5 bg-slate-900 rounded-full text-white cursor-pointer hover:bg-slate-800 transition-colors shadow-sm"
                        title="Upload Photo"
                      >
                        <Camera className="w-4 h-4" />
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Tap icon to change photo</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Contact Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                      placeholder="Enter contact email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default ProfilePage;
