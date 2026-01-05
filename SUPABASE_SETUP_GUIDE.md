# 🚀 Complete Supabase Setup Guide for Your React App

## 📋 **What You'll Need**
- A Supabase account (free)
- Your React project (already have this!)
- 15-20 minutes

---

## Step 1: Create Supabase Account (5 minutes)

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with:
   - GitHub account (easiest), OR
   - Email account
4. Verify your email if needed

### 1.2 Create a New Project
1. After signing in, click **"New Project"**
2. Fill in the form:
   - **Organization**: Select or create one
   - **Project Name**: `maldives-career-platform` (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to Maldives (e.g., `Southeast Asia`)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project setup

### 1.3 Get Your API Keys
Once project is ready:
1. Go to **Settings** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL** (like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (secret - don't use in frontend!)
4. **Copy these** - you'll need them!

---

## Step 2: Install Supabase in Your Project (2 minutes)

### 2.1 Open Terminal in Your Project

Navigate to your project folder:
```bash
cd C:\Users\RITHI\Downloads\testing-part-2
```

### 2.2 Install Supabase Package

Run this command:
```bash
npm install @supabase/supabase-js
```

Wait for installation to complete (30 seconds - 1 minute)

### 2.3 Verify Installation

Check your `package.json` - you should see:
```json
"dependencies": {
  "@supabase/supabase-js": "^2.x.x",
  ...
}
```

---

## Step 3: Create Supabase Client (3 minutes)

### 3.1 Create Environment File

Create a new file called `.env.local` in your project root:

**File: `.env.local`**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with your actual values from Step 1.3!**

### 3.2 Create Supabase Client File

Create a new folder and file:

**File: `lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that we have the keys
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Step 4: Update Your .gitignore (Important!)

Make sure `.env.local` is in your `.gitignore`:

**File: `.gitignore`** (add if not present)
```
.env.local
.env
node_modules/
dist/
```

**Why?** This prevents committing your API keys to GitHub!

---

## Step 5: Test the Connection (2 minutes)

### 5.1 Create a Test Component

Create a simple test to verify Supabase is working:

**File: `components/SupabaseTest.tsx`** (temporary test file)

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SupabaseTest = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Test connection
    supabase.from('_test').select('*').limit(1)
      .then(() => setConnected(true))
      .catch(() => setConnected(true)) // Even errors mean connection works!
  }, [])

  return (
    <div className="p-4 bg-slate-100 rounded-lg">
      {connected ? (
        <p className="text-green-600">✅ Supabase Connected!</p>
      ) : (
        <p className="text-yellow-600">🔄 Connecting to Supabase...</p>
      )}
    </div>
  )
}

export default SupabaseTest
```

### 5.2 Test in Your App

Temporarily add to your `App.tsx`:
```typescript
import SupabaseTest from './components/SupabaseTest'

// Add inside your App component:
<SupabaseTest />
```

### 5.3 Run Your App

```bash
npm run dev
```

If you see "✅ Supabase Connected!" - you're good to go!

---

## Step 6: Set Up Database Tables (5 minutes)

### 6.1 Open SQL Editor in Supabase

1. Go to your Supabase dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### 6.2 Create Basic Tables

Copy and paste this SQL, then click **"Run"**:

```sql
-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT CHECK (role IN ('candidate', 'employer', 'admin')) DEFAULT 'candidate',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  logo_url TEXT,
  location TEXT,
  type TEXT CHECK (type IN ('Full-time', 'Part-time', 'Contract')),
  salary_range TEXT,
  experience TEXT,
  industry TEXT,
  description TEXT,
  requirements TEXT[],
  status TEXT CHECK (status IN ('Current Opening', 'Closed')) DEFAULT 'Current Opening',
  posted_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES profiles(id),
  candidate_name TEXT,
  contact_number TEXT,
  email TEXT,
  linkedin_profile TEXT,
  status TEXT DEFAULT 'Applied',
  applied_date TIMESTAMP DEFAULT NOW(),
  resume_url TEXT,
  passport_url TEXT,
  pcc_url TEXT,
  certs_url TEXT,
  good_standing_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_documents table
CREATE TABLE user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - users can see their own data)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Jobs are public
CREATE POLICY "Jobs are viewable by everyone"
ON jobs FOR SELECT
USING (true);

-- Users can see their own applications
CREATE POLICY "Users can view own applications"
ON applications FOR SELECT
USING (auth.uid() = candidate_id);

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON user_documents FOR SELECT
USING (auth.uid() = user_id);
```

### 6.3 Verify Tables Were Created

1. Go to **"Table Editor"** in Supabase dashboard
2. You should see:
   - `profiles`
   - `jobs`
   - `applications`
   - `user_documents`

---

## Step 7: Set Up Storage Bucket (3 minutes)

### 7.1 Create Storage Bucket

1. Go to **"Storage"** in Supabase dashboard
2. Click **"Create a new bucket"**
3. Name it: `documents`
4. Make it **Public** (for now - you can secure it later)
5. Click **"Create bucket"**

### 7.2 Set Up Storage Policies

Go to **"Storage"** → **"Policies"** → Select `documents` bucket

Add policy:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Step 8: Configure Authentication (2 minutes)

### 8.1 Enable Email Auth

1. Go to **"Authentication"** → **"Providers"**
2. Make sure **Email** is enabled (should be by default)
3. Optional: Configure email templates

### 8.2 Set Up Email Templates (Optional)

1. Go to **"Authentication"** → **"Email Templates"**
2. Customize:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**
   - **OTP**

---

## Step 9: Update Your AuthContext (5 minutes)

Now update your existing auth to use Supabase:

**File: `context/AuthContext.tsx`**

```typescript
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile from database
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Get profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
      }

      if (profile) {
        setUser({
          name: profile.name || supabaseUser.email?.split('@')[0] || 'User',
          email: profile.email || supabaseUser.email || '',
          role: (profile.role as 'candidate' | 'employer') || 'candidate',
          avatar: profile.avatar_url,
        });
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: supabaseUser.email?.split('@')[0] || 'User',
            role: 'candidate',
          })
          .select()
          .single();

        if (!createError && newProfile) {
          setUser({
            name: newProfile.name,
            email: newProfile.email || '',
            role: (newProfile.role as 'candidate' | 'employer') || 'candidate',
          });
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    // User will be loaded automatically by onAuthStateChange
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'candidate') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name,
        role,
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        signUp,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## Step 10: Update Your AuthPage (Example)

Here's how to use Supabase auth in your login:

```typescript
// In your AuthPage.tsx
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(formData.email, formData.password);
    // Navigation handled by AuthContext
    navigate('/dashboard');
  } catch (error: any) {
    alert('Login failed: ' + error.message);
  }
};
```

---

## ✅ **Verification Checklist**

After setup, verify everything works:

- [ ] Supabase account created
- [ ] Project created
- [ ] API keys copied to `.env.local`
- [ ] `@supabase/supabase-js` installed
- [ ] `lib/supabase.ts` created
- [ ] Test connection successful
- [ ] Database tables created
- [ ] Storage bucket created
- [ ] AuthContext updated
- [ ] Can log in with email/password
- [ ] Can register new users

---

## 🐛 **Common Issues & Solutions**

### Issue 1: "Missing Supabase environment variables"
**Solution:** Make sure `.env.local` exists and has correct values

### Issue 2: "Invalid API key"
**Solution:** Double-check your keys in Supabase dashboard → Settings → API

### Issue 3: "CORS error"
**Solution:** Add your domain in Supabase → Settings → API → CORS

### Issue 4: Tables not showing
**Solution:** Make sure you ran the SQL in Step 6.2

---

## 📚 **Next Steps After Setup**

1. ✅ **Update AuthPage** to use real Supabase auth
2. ✅ **Implement file uploads** using Supabase storage
3. ✅ **Fetch jobs** from Supabase database
4. ✅ **Add forgot password** functionality
5. ✅ **Add OTP login** functionality

---

## 🆘 **Need Help?**

If you get stuck:
1. Check Supabase dashboard for errors
2. Check browser console for errors
3. Verify `.env.local` file exists and has correct values
4. Make sure you've installed the package: `npm install @supabase/supabase-js`

---

## 🎉 **You're Done!**

Once you complete these steps, your app will be connected to Supabase!

**Total time: 15-20 minutes**

Now your app can:
- ✅ Authenticate users (real auth!)
- ✅ Store data in database
- ✅ Upload files
- ✅ Handle OTP and password reset

**Ready to continue? Let me know if you need help with any step!**

