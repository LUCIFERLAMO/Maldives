import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../constants';
import { JobStatus } from '../types';
import FileUpload from '../components/FileUpload';
import { ArrowLeft, AlertCircle, ShieldCheck, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [job, setJob] = useState(undefined);


    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
    });


    const [files, setFiles] = useState({
        resume: null,
        certs: null,
        passport: null,
        pcc: null,
        goodStanding: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchJob() {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
                if (!response.ok) {
                    throw new Error('Job not found');
                }
                const data = await response.json();
                const mappedJob = {
                    ...data,
                    salaryRange: data.salary_range,
                    postedDate: data.posted_date,
                    status: data.status === 'OPEN' ? JobStatus.OPEN : JobStatus.CLOSED
                };
                setJob(mappedJob);
            } catch (error) {
                console.error('Error fetching job:', error);
                setJob(null);
            }
        }

        if (id) {
            fetchJob();
        }
    }, [id, navigate]);


    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                name: user.name,
                email: user.email,
                contact: '',
            });
        }
    }, [isAuthenticated, user]);

    if (!job) {
        return <div className="p-8 text-center">Loading job details...</div>;
    }

    const isClosed = job.status === JobStatus.CLOSED;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (key, file) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    // uploadFile function - now handled by the backend API via FormData
    const uploadFile = async (file, documentType) => {
        if (!file || !user) return null;

        // Security: Restrict File Types & Size
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert(`Invalid file type for ${documentType}. Please upload PDF or Images only.`);
            return null;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB limit
        if (file.size > maxSize) {
            alert(`File ${file.name} is too large. Max size is 5MB.`);
            return null;
        }

        // Return the file to be uploaded via FormData to the backend
        return {
            file,
            fileName: file.name,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // NOTE: Authentication check removed/bypassed for "No Supabase" mode.
        // If you still use Supabase Auth, you can uncomment this:
        /*
        if (!isAuthenticated) {
            alert('Please login to apply');
            setIsSubmitting(false);
            return;
        }
        */

        try {
            // Prepare FormData for the Backend (Multer/GridFS)
            const formDataPayload = new FormData();
            formDataPayload.append('job_id', job.id);
            formDataPayload.append('name', formData.name);
            formDataPayload.append('email', formData.email);
            formDataPayload.append('contact', formData.contact);

            // Append the Resume File
            if (files.resume) {
                formDataPayload.append('resume', files.resume);
            } else {
                alert('Please upload a resume');
                setIsSubmitting(false);
                return;
            }

            // Send to Local Backend
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                body: formDataPayload, // No Content-Type header needed (browser sets multipart/form-data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Application submission failed');
            }

            // Success
            navigate('/success');
        } catch (error) {
            console.error('Application error:', error);
            alert(`Failed to submit application: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const getDefaultFileName = (key) => {
        if (!isAuthenticated || !user) return null;
        switch (key) {
            case 'resume': return `${user.name.split(' ')[0]}_CV_2024.pdf`;
            case 'certs': return `Certificates_Combined.pdf`;
            case 'passport': return `Passport_Front_Page.jpg`;
            case 'pcc': return `Police_Clearance_2023.pdf`;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-4 sm:py-6">
            <button
                onClick={() => navigate('/jobs')}
                className="flex items-center text-slate-500 hover:text-maldives-600 mb-4 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
            </button>

            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    <span className="font-semibold text-maldives-700">{job.company}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{job.location}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-green-600 font-medium">{job.salaryRange}</span>
                </div>

                {isClosed && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                        <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Applications Closed</p>
                            <p className="text-sm">This position has been filled or is no longer accepting applications.</p>
                        </div>
                    </div>
                )}

                <div className="prose max-w-none text-slate-700 text-sm sm:text-base">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
                    <p className="mb-4 sm:mb-6 whitespace-pre-wrap">{job.description}</p>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 mb-4 sm:mb-6">
                        {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Application Form - Compact V2 */}
            {!isClosed && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">

                    {/* Header */}
                    <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Apply Now</h2>
                            {isAuthenticated ? (
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                                    <ShieldCheck className="w-3 h-3" /> Logged In as {user?.name}
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500 mt-0.5">Sign in to apply faster.</p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 sm:p-6">

                        {/* Section 1: Contact Info - 3 Columns */}
                        <div className="mb-5 sm:mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    1. Personal Information
                                    {isAuthenticated && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded normal-case font-normal border border-blue-100">Confirmed</span>}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-maldives-500 transition-all bg-white"
                                            placeholder="As per passport"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-maldives-500 transition-all bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            name="contact"
                                            required
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-maldives-500 transition-all bg-white"
                                            placeholder="Country Code + Number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100 my-5" />

                        {/* Section 2: Verified Static Docs (Passport/PCC) */}
                        {isAuthenticated ? (
                            <div className="mb-5 sm:mb-6">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    2. Verified Documents <Lock className="w-3 h-3 text-slate-400" />
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Passport Card */}
                                    <div className="border border-green-200 bg-green-50/50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-white rounded p-1.5 border border-green-100 shadow-sm text-green-600">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-xs">Passport / ID</div>
                                            <div className="text-[10px] text-green-700 font-medium">Verified</div>
                                        </div>
                                    </div>
                                    {/* PCC Card */}
                                    <div className="border border-green-200 bg-green-50/50 rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-white rounded p-1.5 border border-green-100 shadow-sm text-green-600">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-xs">Police Clearance</div>
                                            <div className="text-[10px] text-green-700 font-medium">Verified</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (

                            <div className="mb-5 sm:mb-6">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">2. Identification Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FileUpload
                                        id="passport"
                                        label="Passport / ID Copy"
                                        required
                                        currentFile={files.passport}
                                        onChange={(f) => handleFileChange('passport', f)}
                                    />
                                    <FileUpload
                                        id="pcc"
                                        label="Police Clearance (PCC)"
                                        currentFile={files.pcc}
                                        onChange={(f) => handleFileChange('pcc', f)}
                                    />
                                </div>
                            </div>
                        )}

                        <hr className="border-slate-100 my-5" />

                        {/* Section 3: Dynamic Docs (Resume/Certs) - 3 Cols */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                {isAuthenticated ? '3. Application Specifics' : '3. Qualification Documents'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <FileUpload
                                    id="resume"
                                    label="Resume / CV"
                                    required
                                    currentFile={files.resume}
                                    defaultFileName={getDefaultFileName('resume')}
                                    onChange={(f) => handleFileChange('resume', f)}
                                />
                                <FileUpload
                                    id="certs"
                                    label="Educational Certificates"
                                    required
                                    currentFile={files.certs}
                                    defaultFileName={getDefaultFileName('certs')}
                                    onChange={(f) => handleFileChange('certs', f)}
                                />
                                <FileUpload
                                    id="goodStanding"
                                    label="Good Standing Cert"
                                    currentFile={files.goodStanding}
                                    onChange={(f) => handleFileChange('goodStanding', f)}
                                />
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-xs text-amber-800 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>By clicking Submit, you agree to our Terms & Conditions and certify that all uploaded documents are authentic.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-xl font-bold text-base text-white shadow-lg transition-all ${isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-maldives-600 hover:bg-maldives-700 hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                        >
                            {isSubmitting ? 'Processing...' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default JobDetailPage;
