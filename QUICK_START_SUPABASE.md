# ⚡ Quick Start - Supabase Integration

## 🎯 **For AI Coding Assistants (Like Cursor/Anti-gravity)**

This guide helps AI assistants integrate Supabase with the React app.

---

## 📝 **Step-by-Step Instructions**

### **1. Install Supabase Package**

```bash
npm install @supabase/supabase-js
```

### **2. Create Environment File**

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get values from:** Supabase Dashboard → Settings → API

### **3. Create Supabase Client**

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### **4. Update AuthContext**

Replace `context/AuthContext.tsx` with Supabase-based authentication (see full guide).

### **5. Set Up Database**

Run SQL in Supabase Dashboard → SQL Editor (see full guide for SQL).

---

## 🔑 **Key Files to Create/Update**

1. ✅ `.env.local` - Environment variables
2. ✅ `lib/supabase.ts` - Supabase client
3. ✅ `context/AuthContext.tsx` - Update with Supabase auth
4. ✅ `components/FileUpload.tsx` - Update with Supabase storage

---

## 📋 **Database Tables Needed**

- `profiles` - User profiles
- `jobs` - Job listings
- `applications` - Job applications
- `user_documents` - File references

---

## 🗄️ **Storage Bucket**

- Name: `documents`
- Type: Public (initially)

---

## ✅ **Verification**

After setup, test:
```typescript
import { supabase } from './lib/supabase'

// Test connection
const { data, error } = await supabase.from('jobs').select('*')
console.log(data, error)
```

---

**See `SUPABASE_SETUP_GUIDE.md` for complete details!**

