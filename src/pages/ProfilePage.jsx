import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    FileText,
    X,
    Camera,
    Lock,
    Plus,
    CheckCircle2,
    Clock,
    Trash2,
    FileBadge,
    Sparkles,
    Building2,
    Download,
    AlertTriangle,
    Briefcase
} from 'lucide-react';


// Error Boundary Component to catch crashes
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ProfilePage Error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 text-red-600">
                    <h2 className="font-bold text-2xl mb-4">Something went wrong!</h2>
                    <pre className="bg-red-50 p-4 rounded border border-red-200 text-sm overflow-auto">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

const CANDIDATE_DOCS = [
    { id: 'resume', label: 'Resume / CV', type: 'PDF', required: true, status: 'missing' },
    { id: 'passport', label: 'Passport Front', type: 'IMG', required: true, status: 'missing' },
    { id: 'pcc', label: 'Police Clearance', type: 'PDF', required: true, status: 'uploaded', date: '2024-01-15' },
    { id: 'edu', label: 'Education Certs', type: 'PDF', required: true, status: 'missing' },
    { id: 'photo', label: 'Passport Photo', type: 'IMG', required: true, status: 'uploaded', date: '2024-02-01' },
];


const AGENT_DOCS = [
    { id: 'license', label: 'Operating License', type: 'PDF', required: true, status: 'uploaded', date: '2023-11-10' },
    { id: 'tax', label: 'Tax Compliance (TRC)', type: 'PDF', required: true, status: 'missing' },
    { id: 'certs', label: 'Agency Certifications', type: 'PDF', required: false, status: 'missing' },
    { id: 'identity', label: 'Director ID Proof', type: 'IMG', required: true, status: 'uploaded', date: '2023-12-05' },
];


const CandidateProfile = ({ user, profileData, docs, handleDocAction, handleDeleteItem, setIsResettingPassword, setIsEditingPersonal, previewImage, isAddingDoc, setIsAddingDoc, newDocName, setNewDocName, handleAddDoc, applications }) => {
    return (
        <>
            {/* MALDIVES GRADIENT HEADER (CLIENT ONLY) */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 shadow-lg shadow-teal-900/5">
                <div className="container mx-auto max-w-5xl px-4 py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">My Profile</h1>
                            <p className="text-teal-100 font-medium mt-1">Manage your identity & professional documents.</p>
                        </div>
                        <button onClick={() => setIsResettingPassword(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-semibold transition-colors backdrop-blur-sm">
                            <Lock className="w-4 h-4" /> Password & Security
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
                {/* PERSONAL INFO CARD */}
                <div className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100">
                    <div className="bg-gradient-to-r from-teal-50/50 to-slate-50/50 rounded-[1.4rem] p-8 flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden relative group">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><User className="w-12 h-12" /></div>
                                )}
                                <button onClick={() => setIsEditingPersonal(true)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold uppercase tracking-wider">Change</button>
                            </div>
                        </div>
                        {/* Details */}
                        <div className="flex-grow space-y-6 w-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
                                    <p className="text-slate-600 font-medium text-lg">{profileData.title}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-teal-700 font-bold bg-teal-50 px-3 py-1 rounded-full inline-flex border border-teal-100">
                                        <ShieldCheck className="w-4 h-4" /> Verified Candidate
                                    </div>
                                    {profileData.experience > 0 && (
                                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full inline-flex border border-blue-100 ml-2">
                                            <Briefcase className="w-4 h-4" /> {profileData.experience} Years Exp
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setIsEditingPersonal(true)} className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-lg shadow-slate-900/10">Edit Details</button>
                            </div>
                            {/* Contact Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-200/60">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email</label>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium"><Mail className="w-4 h-4 text-slate-400" /> {profileData.email}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Phone</label>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium"><Phone className="w-4 h-4 text-slate-400" /> {profileData.phone}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</label>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium"><MapPin className="w-4 h-4 text-slate-400" /> {profileData.location}</div>
                                </div>
                            </div>
                            {/* Skills Section */}
                            {profileData.skills && (
                                <div className="pt-6 border-t border-slate-200/60">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-3">Skills</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(typeof profileData.skills === 'string' ? profileData.skills : '').split(',').map((skill, index) => (
                                            skill.trim() && (
                                                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                                                    {skill.trim()}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MY APPLICATIONS SECTION */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/30">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Briefcase className="w-6 h-6 text-teal-600" /> My Applications</h3>
                        <p className="text-slate-500 text-sm mt-1">Track the status of your job applications.</p>
                    </div>
                    <div className="p-8">
                        {applications && applications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {applications.map((app) => (
                                    <div key={app._id || app.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-teal-700 transition-colors">{app.job?.title || 'Job Title'}</h4>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{app.job?.company || 'Company Name'}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${app.status === 'APPROVED' || app.status === 'ACCEPTED' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    app.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-slate-50 text-slate-700 border-slate-100'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                            <MapPin className="w-3.5 h-3.5" /> {app.job?.location || 'Location'}
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-400">Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                                            <span className="text-xs font-bold text-teal-600">View Details &rarr;</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-slate-900 font-bold text-sm">No Applications Yet</h3>
                                <p className="text-slate-500 text-xs mt-1">Start applying for jobs to see them here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* DOCUMENTS SECTION */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FileBadge className="w-6 h-6 text-teal-600" /> My Documents</h3>
                            <p className="text-slate-500 text-sm mt-1">Upload required files for one-click applications.</p>
                        </div>
                        <button onClick={() => setIsAddingDoc(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm">
                            <Plus className="w-4 h-4" /> Add Custom
                        </button>
                    </div>

                    {isAddingDoc && (
                        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex gap-3 animate-in fade-in">
                            <input type="text" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} placeholder="Document Name..." className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500" autoFocus />
                            <button onClick={handleAddDoc} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg">Add</button>
                            <button onClick={() => setIsAddingDoc(false)} className="px-4 py-2 text-slate-500 text-sm font-medium">Cancel</button>
                        </div>
                    )}

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {docs.map((doc) => (
                            <div key={doc.id} className={`flex items-start justify-between p-5 rounded-2xl border transition-all hover:shadow-md ${doc.status === 'uploaded' ? 'bg-white border-slate-200' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${doc.status === 'uploaded' ? 'bg-teal-50 text-teal-600' : 'bg-white text-slate-300 border border-slate-100'}`}><FileText className="w-6 h-6" /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{doc.label}</h4>
                                        <div className="mt-1">
                                            {doc.status === 'uploaded' ?
                                                <span className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span> :
                                                <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Required</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => handleDocAction(doc.id)} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${doc.status === 'uploaded' ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                        {doc.status === 'uploaded' ? 'Remove' : 'Upload'}
                                    </button>
                                    {!doc.required && <button onClick={() => handleDeleteItem(doc.id, doc.required)} className="text-slate-300 hover:text-red-500 self-end p-1"><Trash2 className="w-4 h-4" /></button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </>
    );
};


const AgentProfile = ({ user, profileData, docs, handleDocAction, setIsResettingPassword, setIsEditingPersonal, previewImage }) => {
    // Determine agent status display
    const getAgentStatusBadge = () => {
        const status = user?.status || 'ACTIVE';
        if (status === 'ACTIVE') {
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>;
        } else if (status === 'INACTIVE' || status === 'Pending') {
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200"><Clock className="w-3.5 h-3.5" /> Pending Approval</span>;
        } else {
            return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200"><AlertTriangle className="w-3.5 h-3.5" /> Suspended</span>;
        }
    };

    return (
        <>
            {/* CORPORATE HEADER (AGENT ONLY) */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto max-w-5xl px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                <Building2 className="w-6 h-6 text-slate-400" />
                                {user?.name || 'Partner Profile'}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">Authorized Recruitment Partner • ID: {user?.id?.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsResettingPassword(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                                <Lock className="w-3.5 h-3.5" /> Security
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white border border-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-800">
                                <Download className="w-3.5 h-3.5" /> Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Agency Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 mb-6">
                            <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-300 mb-4 overflow-hidden">
                                {previewImage ? <img src={previewImage} className="w-full h-full object-cover" alt="Agent" /> : <Building2 className="w-10 h-10" />}
                            </div>
                            <h2 className="font-bold text-slate-900 text-lg">{profileData.title}</h2>
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mt-1">Tier 1 Partner</p>
                        </div>

                        {/* AGENCY DETAILS SECTION */}
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-slate-100">
                                <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Agency Name</label>
                                <div className="font-bold text-slate-900 text-lg mt-1">{user?.agencyName || user?.agency_name || 'Not Set'}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</label>
                                <div className="font-medium text-slate-900 text-sm flex items-center gap-2 mt-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user?.contact_number || user?.phone || 'Not Set'}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Email</label>
                                <div className="font-medium text-slate-900 text-sm flex items-center gap-2 mt-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {profileData.email}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</label>
                                <div className="mt-2">{getAgentStatusBadge()}</div>
                            </div>
                            <button onClick={() => setIsEditingPersonal(true)} className="w-full py-2 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-50 transition-colors mt-2">
                                Update Info
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-slate-300 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <ShieldCheck className="w-5 h-5" />
                            <h3 className="font-bold text-sm">Compliance Status</h3>
                        </div>
                        <div className="text-xs leading-relaxed opacity-80 mb-4">
                            Your agency license is valid until <span className="text-white font-bold">Dec 2024</span>. Ensure all candidate submissions adhere to the latest Maldives Employment Act regulations.
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-full"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider">
                            <span>Audit Score</span>
                            <span className="text-white">100%</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Required Documents */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Agency Compliance Documents</h3>
                            <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-bold">{docs.filter(d => d.status === 'uploaded').length}/{docs.length}</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {docs.map((doc) => (
                                <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${doc.status === 'uploaded' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{doc.label}</h4>
                                            {doc.status === 'uploaded' ? (
                                                <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Verified on {doc.date}</p>
                                            ) : (
                                                <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-0.5"><AlertTriangle className="w-3 h-3" /> Pending Submission</p>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDocAction(doc.id)} className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all ${doc.status === 'uploaded' ? 'border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'}`}>
                                        {doc.status === 'uploaded' ? 'Revoke' : 'Upload File'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    console.log("ProfilePage Rendered. User:", user);

    // AuthContext sets role to lowercase, but we check defensively
    const isAgent = user?.role?.toUpperCase() === 'AGENT';

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);


    const [profileData, setProfileData] = useState({
        name: '',
        title: isAgent ? 'Global Talent Ltd' : '',
        email: '',
        phone: isAgent ? '+1 (115) 555-0198' : '+91 98765 43110',
        location: isAgent ? 'Business District, Mumbai' : 'Mumbai, India',
        founded: '2016',
        sectors: isAgent ? 'Hospitality, Healthcare, Construction' : '',
        skills: '',
        experience: 0
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [docs, setDocs] = useState([]);
    const [newDocName, setNewDocName] = useState('');
    const [isAddingDoc, setIsAddingDoc] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [applications, setApplications] = useState([]);
    const fileInputRef = React.useRef(null);
    const [uploadingDocId, setUploadingDocId] = useState(null);

    useEffect(() => {
        if (user) {
            // Load initial profile data from AuthContext user object (which comes from 'profiles' table)
            setProfileData(prev => ({
                ...prev,
                name: user.name || user.full_name || '',
                title: user.title || (isAgent ? 'Global Talent Ltd' : ''),
                email: user.email || '',
                phone: user.phone || user.contact_number || '',
                location: user.location || (isAgent ? 'Business District, Mumbai' : 'Mumbai, India'),
                role: user.role || '',
                skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
                experience: user.experience_years || 0
            }));

            setPreviewImage(user.avatar || null);

            // Fetch Documents from MongoDB backend
            async function fetchDocuments() {
                try {
                    const response = await fetch(`http://localhost:5000/api/documents?user_id=${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        // Ensure data is array
                        const docArray = Array.isArray(data) ? data : [];

                        // Map backend documents to frontend structure
                        const backendDocs = docArray.map(d => ({
                            id: d._id,
                            label: d.document_type || 'DOCUMENT',
                            type: d.content_type?.includes('pdf') ? 'PDF' : 'IMG',
                            required: false,
                            status: 'uploaded',
                            date: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                            dbMetadata: d // Store full metadata
                        }));

                        // Merge with default required docs
                        const defaults = isAgent ? AGENT_DOCS : CANDIDATE_DOCS;

                        // Create a map of uploaded docs by label (or type) for easy lookup
                        const uploadedMap = {};
                        backendDocs.forEach(d => {
                            uploadedMap[d.label] = d;
                            // Also map by ID if strictly matching
                        });

                        const mergedDocs = defaults.map(defDoc => {
                            // detailed matching logic could go here, for now match by Label
                            const found = backendDocs.find(bd => bd.label === defDoc.label);
                            if (found) {
                                return { ...defDoc, ...found };
                            }
                            return defDoc;
                        });

                        // Add any custom docs that are not in defaults
                        const customDocs = backendDocs.filter(bd => !defaults.some(def => def.label === bd.label));

                        setDocs([...mergedDocs, ...customDocs]);
                    }
                } catch (err) {
                    console.error('Error fetching documents:', err);
                }
            }
            fetchDocuments();

            // Fetch Candidate Applications
            if (!isAgent) {
                async function fetchApplications() {
                    try {
                        const response = await fetch(`http://localhost:5000/api/applications/candidate/${user.email}`);
                        if (response.ok) {
                            const data = await response.json();
                            // Ensure data is array
                            if (Array.isArray(data)) {
                                setApplications(data);
                            } else {
                                console.warn("Applications API returned non-array:", data);
                                setApplications([]);
                            }
                        }
                    } catch (err) {
                        console.error('Error fetching applications:', err);
                        setApplications([]);
                    }
                }
                fetchApplications();
            }

            setDocs(isAgent ? AGENT_DOCS : CANDIDATE_DOCS);
        }
    }, [user, isAgent]);

    const handlePersonalSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: profileData.name, // Usually read-only but sending for consistency
                    contact_number: profileData.phone,
                    location: profileData.location, // Added location update
                    skills: profileData.skills.split(',').map(s => s.trim()).filter(Boolean),
                    experience_years: Number(profileData.experience)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Show the specific error message from the server (data.error)
                throw new Error(data.error || data.message || 'Failed to update profile');
            }

            // Update AuthContext to persist changes locally
            if (updateUser) {
                updateUser({
                    name: profileData.name,
                    phone: profileData.phone,
                    contact_number: profileData.phone,
                    location: profileData.location,
                    skills: profileData.skills.split(',').map(s => s.trim()).filter(Boolean),
                    experience_years: Number(profileData.experience)
                });
            }

            alert('Profile updated successfully');
            setIsEditingPersonal(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Failed: ${error.message}`);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("Passwords do not match");
            return;
        }

        if (passwords.new.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/auth/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Password update failed');
            }

            alert("Password updated successfully");
            setIsResettingPassword(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error('Error updating password:', error);
            alert(`Failed to update password: ${error.message}`);
        }
    };

    const handleDocAction = (id) => {
        const doc = docs.find(d => d.id === id);
        if (!doc) return;

        if (doc.status === 'uploaded') {
            if (window.confirm("Remove this document? This cannot be undone.")) {
                handleDeleteDocument(id);
            }
        } else {
            // Trigger upload
            setUploadingDocId(id);
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }
    };

    const handleDeleteDocument = async (id) => {
        // If it's a default required doc that hasn't been uploaded yet (local ID), just ignore
        // But here we are in 'uploaded' state, so it must have a DB ID if it was fetched from DB.
        // However, our merged state uses default IDs (strings) if not uploaded.
        // If uploaded, we replaced ID with DB ID? Let's check merge logic.
        // Actually, merged logic keeps default ID if we just spread ...found? 
        // No, if found exists, we use its ID? 
        // In merge: return { ...defDoc, ...found }; -> found.id overwrites defDoc.id

        try {
            const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Re-fetch or update local state
                // Simplest: update local state to 'missing' if it's a required doc, or remove if custom
                setDocs(prevDocs => prevDocs.map(d => {
                    if (d.id === id) {
                        // Check if it was a default doc by label
                        const defaults = isAgent ? AGENT_DOCS : CANDIDATE_DOCS;
                        const defaultDoc = defaults.find(def => def.label === d.label);

                        if (defaultDoc) {
                            // Reset to default state
                            return { ...defaultDoc, status: 'missing' };
                        } else {
                            // It was a custom doc, mark for filtering? 
                            return { ...d, _deleted: true };
                        }
                    }
                    return d;
                }).filter(d => !d._deleted));
                alert('Document removed');
            } else {
                alert('Failed to delete document');
            }
        } catch (err) {
            console.error('Error removing doc:', err);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file || !uploadingDocId) return;

        // Find the doc label/type
        const docToUpload = docs.find(d => d.id === uploadingDocId);
        if (!docToUpload) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', user.id);
        formData.append('document_type', docToUpload.label || 'Details');

        try {
            setIsAddingDoc(true); // Using this as loading indicator temporarily
            const response = await fetch('http://localhost:5000/api/documents', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const newDoc = data.document;

                // Update state
                setDocs(prevDocs => prevDocs.map(d => {
                    if (d.id === uploadingDocId) {
                        return {
                            ...d,
                            id: newDoc.id, // Update ID to database ID
                            status: 'uploaded',
                            date: new Date().toISOString().split('T')[0],
                            type: file.type.includes('pdf') ? 'PDF' : 'IMG'
                        };
                    }
                    return d;
                }));
                alert('Document uploaded successfully!');
            } else {
                const err = await response.json();
                alert(`Upload failed: ${err.message}`);
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed');
        } finally {
            setUploadingDocId(null);
            setIsAddingDoc(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleAddDoc = () => {
        if (!newDocName.trim()) return;
        const newDoc = {
            id: `custom-${Date.now()}`,
            label: newDocName,
            type: 'PDF',
            required: false,
            status: 'missing'
        };
        setDocs([...docs, newDoc]);
        setNewDocName('');
        setIsAddingDoc(false);
    };

    const handleDeleteItem = (id, isRequired) => {
        if (isRequired) return;
        setDocs(docs.filter(d => d.id !== id));
    };


    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-slate-50/50 pb-24 font-sans text-slate-800">

                {isAgent ? (
                    <AgentProfile
                        user={user}
                        profileData={profileData}
                        docs={docs}
                        handleDocAction={handleDocAction}
                        setIsResettingPassword={setIsResettingPassword}
                        setIsEditingPersonal={setIsEditingPersonal}
                        previewImage={previewImage}
                    />
                ) : (
                    <CandidateProfile
                        user={user}
                        profileData={profileData}
                        docs={docs}
                        handleDocAction={handleDocAction}
                        handleDeleteItem={handleDeleteItem}
                        setIsResettingPassword={setIsResettingPassword}
                        setIsEditingPersonal={setIsEditingPersonal}
                        previewImage={previewImage}
                        isAddingDoc={isAddingDoc}
                        setIsAddingDoc={setIsAddingDoc}
                        newDocName={newDocName}
                        setNewDocName={setNewDocName}
                        handleAddDoc={handleAddDoc}
                        applications={applications}
                    />
                )}

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                />

                {/* MODALS (Shared Logic, Visuals Neutral) */}
                {isResettingPassword && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900">Security Settings</h3>
                                <button onClick={() => setIsResettingPassword(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handlePasswordReset} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                    <input type="password" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input type="password" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                    <input type="password" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800">Update Password</button>
                            </form>
                        </div>
                    </div>
                )}

                {isEditingPersonal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900">Edit Details</h3>
                                <button onClick={() => setIsEditingPersonal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handlePersonalSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg outline-none cursor-not-allowed"
                                        value={profileData.name}
                                    />
                                </div>
                                {/* Title removed as per user request */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Numbers only)</label>
                                    <input
                                        type="tel"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        value={profileData.phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^[\d\s+\-]*$/.test(val)) {
                                                setProfileData({ ...profileData, phone: val });
                                            }
                                        }}
                                        placeholder="+960 1234567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        value={profileData.location}
                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        value={profileData.experience}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Allow empty string or digits
                                            if (val === '' || /^\d+$/.test(val)) {
                                                setProfileData({ ...profileData, experience: val });
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Skills (Comma separated)</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        value={profileData.skills}
                                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                                <button type="submit" className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800">Save Changes</button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </ErrorBoundary>
    );
};

export default ProfilePage;
