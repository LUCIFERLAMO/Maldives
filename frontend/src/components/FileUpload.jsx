import React, { useRef } from 'react';
import { UploadCloud, CheckCircle, FileText, Trash2, ShieldCheck } from 'lucide-react';

const FileUpload = ({
    label,
    required = false,
    acceptedFormats = ".pdf,.doc,.docx,.jpg,.jpeg",
    onChange,
    currentFile,
    fileName, // Fallback if currentFile object isn't passed directly but name is
    defaultFileName,
    isProfileDoc = false,
    id
}) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0]);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Determine what to show
    // 1. New file selected? -> Show name
    // 2. No new file, but default exists? -> Show default name
    // 3. Nothing? -> Show empty state

    const activeFileName = currentFile ? currentFile.name : (fileName || defaultFileName || null);
    const isUsingDefault = !currentFile && !!defaultFileName;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
                type="file"
                id={id}
                ref={fileInputRef}
                accept={acceptedFormats}
                onChange={handleFileChange}
                className="hidden"
            />

            {activeFileName ? (
                // File Selected / Pre-filled State
                <div className={`border rounded-xl p-4 flex items-center justify-between transition-all shadow-sm ${isUsingDefault ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-maldives-500 ring-1 ring-maldives-500/20'}`}>
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${isUsingDefault ? 'bg-blue-100 text-blue-600' : 'bg-maldives-100 text-maldives-600'}`}>
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex flex-col">
                            <p className="text-sm font-bold text-slate-800 truncate">{activeFileName}</p>
                            {isUsingDefault ? (
                                <div className="flex items-center gap-1.5 text-xs text-blue-700 font-medium mt-0.5">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Verified from Profile</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs text-maldives-600 font-medium mt-0.5">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Ready to submit</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pl-4">
                        <button
                            type="button"
                            onClick={triggerUpload}
                            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
                        >
                            {isUsingDefault ? 'Replace' : 'Change'}
                        </button>
                        {!required && !isUsingDefault && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                title="Remove"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                // Empty State
                <div
                    onClick={triggerUpload}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-maldives-400 hover:bg-slate-50 transition-colors group h-32"
                >
                    <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-maldives-50 group-hover:text-maldives-600 transition-colors">
                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-maldives-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Click to upload document</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOC, JPG (Max 5MB)</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
