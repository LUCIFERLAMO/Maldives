# 🚀 Supabase Integration Plan - 3 Day Implementation Guide

## 📋 Overview

This document provides a step-by-step plan to integrate Supabase into your Maldives Career Connect platform. You have **11 pages** total, and we'll integrate them systematically over **3 days**.

---

## 🗄️ **DAY 1: Foundation & Authentication** (Start Here!)

### **Step 1: Set Up Supabase Project Structure**

#### **1.1 Create Database Tables**

Go to Supabase Dashboard → SQL Editor → Run these queries:

```sql
-- ============================================
-- TABLE 1: profiles (Extended User Profiles)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'employer', 'admin')),
  avatar_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- TABLE 2: jobs
-- ============================================
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  salary_range TEXT NOT NULL,
  experience TEXT,
  industry TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'Current Opening' CHECK (status IN ('Current Opening', 'Closed')),
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read open jobs
CREATE POLICY "Anyone can view open jobs" ON jobs
  FOR SELECT USING (status = 'Current Opening');

-- Policy: Admins and employers can create jobs
CREATE POLICY "Employers can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('employer', 'admin')
    )
  );

-- ============================================
-- TABLE 3: applications
-- ============================================
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES auth.users(id),
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (
    status IN (
      'Applied', 'Processing', 'Action Required', 
      'Interview', 'Selected', 'Pending Arrival', 
      'Arrived', 'Rejected', 'Blacklisted'
    )
  ),
  applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_feedback TEXT,
  document_feedbacks JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Candidates can view their own applications
CREATE POLICY "Candidates view own applications" ON applications
  FOR SELECT USING (
    candidate_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('employer', 'admin')
    )
  );

-- Policy: Candidates can create applications
CREATE POLICY "Candidates can apply" ON applications
  FOR INSERT WITH CHECK (candidate_id = auth.uid());

-- ============================================
-- TABLE 4: documents (User Document Storage Metadata)
-- ============================================
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (
    document_type IN (
      'resume', 'passport', 'pcc', 'certs', 
      'goodStanding', 'identity', 'license', 'tax', 'custom'
    )
  ),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size BIGINT,
  mime_type TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own documents
CREATE POLICY "Users manage own documents" ON documents
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- TABLE 5: job_requests (For Recruiters)
-- ============================================
CREATE TABLE job_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  field TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary TEXT NOT NULL,
  headcount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Recruiters can manage their requests
CREATE POLICY "Recruiters manage own requests" ON job_requests
  FOR ALL USING (
    recruiter_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

#### **1.2 Set Up Storage Buckets**

Go to Supabase Dashboard → Storage → Create buckets:

1. **Bucket Name:** `user-documents`
   - **Public:** No (Private)
   - **File Size Limit:** 10 MB
   - **Allowed MIME Types:** `application/pdf, image/jpeg, image/png`

2. **Storage Policies** (SQL Editor):
```sql
-- Policy: Users can upload to their own folder
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can read their own documents
CREATE POLICY "Users can read own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

### **Step 2: Install Supabase Client**

In your project root, run:
```bash
npm install @supabase/supabase-js
```

---

### **Step 3: Create Supabase Configuration File**

Create `src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### **Step 4: Integrate Authentication (AuthPage.jsx)**

**Priority: HIGHEST** - This is the foundation for everything else.

**What to do:**
1. Replace mock login with `supabase.auth.signInWithPassword()`
2. Replace mock signup with `supabase.auth.signUp()`
3. Create profile record in `profiles` table after signup
4. Update `AuthContext.jsx` to use Supabase auth state

**Files to modify:**
- `src/pages/AuthPage.jsx`
- `src/context/AuthContext.jsx`

**Integration Points:**
- Login form submission → `supabase.auth.signInWithPassword()`
- Signup form submission → `supabase.auth.signUp()` + insert into `profiles`
- OTP verification → Supabase handles this automatically
- Admin 2FA → Can use Supabase MFA or custom logic

---

## 📄 **DAY 2: Core Data Pages** (Jobs & Applications)

### **Step 5: Integrate BrowseJobsPage.jsx**

**Priority: HIGH** - Main user-facing page

**What to do:**
1. Replace `MOCK_JOBS` with `supabase.from('jobs').select()`
2. Add real-time subscriptions for new jobs
3. Implement search/filter using Supabase queries
4. Add pagination if needed

**Integration Points:**
- Page load → Fetch jobs from `jobs` table
- Search → Use `.ilike()` or `.textSearch()`
- Filter by industry → Use `.eq('industry', value)`
- Sort by date → Use `.order('posted_date', { ascending: false })`

---

### **Step 6: Integrate JobDetailPage.jsx**

**Priority: HIGH** - Critical for applications

**What to do:**
1. Fetch job details from `jobs` table by ID
2. Replace file upload mock with Supabase Storage upload
3. Create application record in `applications` table
4. Link uploaded documents to `documents` table

**Integration Points:**
- Job details → `supabase.from('jobs').select().eq('id', jobId).single()`
- File upload → `supabase.storage.from('user-documents').upload()`
- Application submission → Insert into `applications` table
- Document metadata → Insert into `documents` table

**File Upload Flow:**
```javascript
// Upload file
const filePath = `${userId}/${documentType}/${fileName}`;
const { data, error } = await supabase.storage
  .from('user-documents')
  .upload(filePath, file);

// Save metadata
await supabase.from('documents').insert({
  user_id: userId,
  document_type: documentType,
  file_name: fileName,
  file_path: filePath,
  file_size: file.size,
  mime_type: file.type
});
```

---

### **Step 7: Integrate MyApplicationsPage.jsx**

**Priority: HIGH** - User tracking

**What to do:**
1. Fetch applications from `applications` table filtered by `candidate_id`
2. Join with `jobs` table to get job details
3. Add real-time updates for status changes
4. Implement document re-upload functionality

**Integration Points:**
- Load applications → `supabase.from('applications').select('*, jobs(*)').eq('candidate_id', userId)`
- Status updates → Listen to changes with `.on('UPDATE')`
- Document feedback → Update `document_feedbacks` JSONB field

---

### **Step 8: Integrate CandidateDashboard.jsx**

**Priority: MEDIUM** - Dashboard overview

**What to do:**
1. Fetch user's applications count
2. Fetch action required applications
3. Replace mock job alerts with real job matching logic
4. Display real statistics

**Integration Points:**
- Stats → Aggregate queries on `applications` table
- Action required → Filter by `status = 'Action Required'`
- Job alerts → Query `jobs` table with user preferences

---

## 🔧 **DAY 3: Advanced Features & Admin** (Final Day)

### **Step 9: Integrate ProfilePage.jsx**

**Priority: MEDIUM** - User management

**What to do:**
1. Fetch profile from `profiles` table
2. Update profile information
3. Fetch documents from `documents` table
4. Upload/delete documents via Storage API
5. Update password via Supabase Auth

**Integration Points:**
- Load profile → `supabase.from('profiles').select().eq('id', userId).single()`
- Update profile → `supabase.from('profiles').update().eq('id', userId)`
- Load documents → `supabase.from('documents').select().eq('user_id', userId)`
- Delete document → Delete from Storage + `documents` table

---

### **Step 10: Integrate RecruiterDashboard.jsx**

**Priority: MEDIUM** - Partner portal

**What to do:**
1. Fetch job requests from `job_requests` table
2. Create new job requests
3. Fetch applications submitted by recruiter
4. Submit candidate applications (create in `applications` table)
5. Track pipeline status

**Integration Points:**
- Job requests → `supabase.from('job_requests').select().eq('recruiter_id', userId)`
- Create request → Insert into `job_requests`
- Candidate submissions → Insert into `applications` with recruiter context
- Pipeline → Query `applications` with filters

---

### **Step 11: Integrate AdminDashboard.jsx**

**Priority: LOW** - Admin features (can be done last)

**What to do:**
1. Fetch all applications for admin review
2. Update application statuses
3. Manage job postings
4. Approve/reject job requests
5. View system statistics

**Integration Points:**
- All applications → `supabase.from('applications').select('*, jobs(*), profiles(*)')`
- Update status → `supabase.from('applications').update().eq('id', appId)`
- Job management → CRUD on `jobs` table
- Approve requests → Update `job_requests.status`

---

### **Step 12: Integrate SupportPage.jsx** (Optional)

**Priority: LOW** - Nice to have

**What to do:**
1. Create `support_tickets` table
2. Submit tickets to database
3. Track ticket status

**Optional Table:**
```sql
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **Step 13: Integrate SuccessPage.jsx**

**Priority: LOW** - Simple confirmation

**What to do:**
- No database changes needed
- Just ensure it redirects properly after application submission

---

### **Step 14: Integrate HomePage.jsx**

**Priority: LOW** - Static content mostly

**What to do:**
- Optional: Fetch job count statistics
- Optional: Newsletter signup table

---

## 📊 **Integration Priority Summary**

### **Day 1 (Foundation):**
1. ✅ Set up Supabase tables & storage
2. ✅ Install Supabase client
3. ✅ **AuthPage.jsx** - Authentication (CRITICAL)

### **Day 2 (Core Features):**
4. ✅ **BrowseJobsPage.jsx** - Job listings
5. ✅ **JobDetailPage.jsx** - Job details & applications
6. ✅ **MyApplicationsPage.jsx** - Application tracking
7. ✅ **CandidateDashboard.jsx** - Dashboard overview

### **Day 3 (Advanced & Admin):**
8. ✅ **ProfilePage.jsx** - Profile management
9. ✅ **RecruiterDashboard.jsx** - Partner portal
10. ✅ **AdminDashboard.jsx** - Admin panel
11. ✅ **SupportPage.jsx** - Support tickets (optional)
12. ✅ **SuccessPage.jsx** - Confirmation (minimal)
13. ✅ **HomePage.jsx** - Landing (optional stats)

---

## 🔐 **Security Checklist**

- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Create appropriate policies for each user role
- [ ] Set up Storage bucket policies
- [ ] Validate file types and sizes on upload
- [ ] Sanitize user inputs
- [ ] Use Supabase Auth for all authentication
- [ ] Never expose service role key in frontend

---

## 📝 **Testing Checklist**

After each integration:
- [ ] Test authentication flow (login/signup)
- [ ] Test data fetching (jobs, applications)
- [ ] Test data creation (applications, documents)
- [ ] Test file uploads
- [ ] Test role-based access (candidate/employer/admin)
- [ ] Test error handling
- [ ] Test real-time updates (if implemented)

---

## 🚨 **Common Issues & Solutions**

1. **RLS Policy Errors:** Make sure policies allow the operations you need
2. **Storage Upload Fails:** Check bucket name and folder structure
3. **Auth State Not Persisting:** Use `supabase.auth.onAuthStateChange()`
4. **Real-time Not Working:** Enable Realtime on tables in Supabase dashboard

---

## 📚 **Resources**

- Supabase Docs: https://supabase.com/docs
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Storage: https://supabase.com/docs/guides/storage
- Supabase Realtime: https://supabase.com/docs/guides/realtime

---

## ✅ **Final Notes**

- **Start with AuthPage.jsx** - Everything depends on authentication
- **Test incrementally** - Don't move to next page until current one works
- **Use Supabase Dashboard** - Monitor your database and logs
- **Backup your data** - Export your mock data before replacing
- **Keep mock data** - Comment it out, don't delete (for reference)

---

**Good luck! 🎉 You've got this!**
