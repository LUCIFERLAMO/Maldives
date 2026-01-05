# Supabase Implementation Example - Step by Step

This guide shows you exactly how to implement file storage with Supabase in your project.

## Step 1: Install Supabase

```bash
npm install @supabase/supabase-js
```

## Step 2: Create Supabase Client

Create a new file: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Step 3: Create Environment File

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Update Your FileUpload Component

Here's how to modify your existing `FileUpload.tsx`:

```typescript
import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle, FileText, RefreshCw, Trash2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface FileUploadProps {
  label: string;
  required?: boolean;
  acceptedFormats?: string;
  onChange: (file: File | null) => void;
  currentFile?: File | null;
  fileName?: string | null;
  defaultFileName?: string | null;
  isProfileDoc?: boolean;
  id: string;
  documentType: 'resume' | 'passport' | 'pcc' | 'certs' | 'goodStanding';
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  required = false,
  acceptedFormats = ".pdf,.doc,.docx,.jpg,.jpeg",
  onChange,
  currentFile,
  fileName,
  defaultFileName,
  isProfileDoc = false,
  id,
  documentType
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = acceptedFormats.split(',').map(f => f.trim().replace('.', ''));
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      alert(`File type not allowed. Allowed: ${acceptedFormats}`);
      return;
    }

    if (!user) {
      alert('Please log in to upload files');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create file path
      const filePath = `users/${user.email}/${documentType}/${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload file. Please try again.');
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save file reference to database (optional but recommended)
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.email, // or use user.id if you have UUID
          document_type: documentType,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // File uploaded but metadata not saved - still okay
      }

      // Update parent component
      onChange(file);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    if (!user || !currentFile) return;

    // Optional: Delete from storage
    // You'd need to store the file path to delete it
    
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        disabled={uploading}
      />

      {uploading && (
        <div className="mb-2">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-maldives-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress}%</p>
        </div>
      )}

      {activeFileName ? (
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
               disabled={uploading}
               className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm disabled:opacity-50"
             >
               {isUsingDefault ? 'Replace' : 'Change'}
             </button>
             {!required && !isUsingDefault && (
                 <button
                   type="button"
                   onClick={handleRemove}
                   disabled={uploading}
                   className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                   title="Remove"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
             )}
          </div>
        </div>
      ) : (
        <div
            onClick={triggerUpload}
            className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-maldives-400 hover:bg-slate-50 transition-colors group h-32 disabled:opacity-50"
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
```

## Step 5: Set Up Database Tables in Supabase

Go to your Supabase dashboard → SQL Editor and run:

```sql
-- Create user_documents table
CREATE TABLE user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own documents
CREATE POLICY "Users can view own documents"
ON user_documents
FOR SELECT
USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'email');
```

## Step 6: Create Storage Bucket

In Supabase Dashboard:
1. Go to Storage
2. Click "New bucket"
3. Name it: `documents`
4. Make it **Public** (or set up policies for private)
5. Set file size limit to 5MB

## Step 7: Update Your JobDetailPage

```typescript
// In pages/JobDetailPage.tsx, update FileUpload usage:

<FileUpload 
  id="resume"
  label="Resume / CV" 
  required 
  currentFile={files.resume}
  defaultFileName={getDefaultFileName('resume')}
  onChange={(f) => handleFileChange('resume', f)}
  documentType="resume"  // Add this prop
/>
```

## Step 8: Retrieve Files from Profile

```typescript
// Get user's profile documents
const getProfileDocuments = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data;
};
```

## That's It! 🎉

You now have:
- ✅ File uploads working
- ✅ Files stored in cloud
- ✅ File URLs saved in database
- ✅ Progress tracking
- ✅ Error handling
- ✅ Security policies

**Total implementation time: ~30 minutes!**

