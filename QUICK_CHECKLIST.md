# ✅ Supabase Integration Quick Checklist

## 🎯 **DAY 1: Foundation**

### Morning Setup (2-3 hours)
- [ ] Create Supabase project (if not done)
- [ ] Run SQL queries to create all tables (`profiles`, `jobs`, `applications`, `documents`, `job_requests`)
- [ ] Create Storage bucket: `user-documents`
- [ ] Set up Storage policies
- [ ] Install `@supabase/supabase-js` package
- [ ] Create `src/lib/supabase.js` config file
- [ ] Add Supabase URL and keys to `.env` file

### Afternoon: Authentication (4-5 hours)
- [ ] **AuthPage.jsx** - Replace mock login with `supabase.auth.signInWithPassword()`
- [ ] **AuthPage.jsx** - Replace mock signup with `supabase.auth.signUp()`
- [ ] **AuthPage.jsx** - Create profile after signup
- [ ] **AuthContext.jsx** - Use `supabase.auth.onAuthStateChange()`
- [ ] **AuthContext.jsx** - Replace localStorage with Supabase session
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test logout flow

---

## 🎯 **DAY 2: Core Features**

### Morning: Job Listings (3-4 hours)
- [ ] **BrowseJobsPage.jsx** - Replace `MOCK_JOBS` with `supabase.from('jobs').select()`
- [ ] **BrowseJobsPage.jsx** - Implement search filter
- [ ] **BrowseJobsPage.jsx** - Implement industry filter
- [ ] **BrowseJobsPage.jsx** - Test job listing display

### Afternoon: Applications (4-5 hours)
- [ ] **JobDetailPage.jsx** - Fetch job by ID from Supabase
- [ ] **JobDetailPage.jsx** - Implement file upload to Storage
- [ ] **JobDetailPage.jsx** - Create application record
- [ ] **JobDetailPage.jsx** - Link documents to application
- [ ] **MyApplicationsPage.jsx** - Fetch user's applications
- [ ] **MyApplicationsPage.jsx** - Display application status
- [ ] **CandidateDashboard.jsx** - Fetch application stats
- [ ] Test complete application flow

---

## 🎯 **DAY 3: Advanced Features**

### Morning: Profile & Documents (3-4 hours)
- [ ] **ProfilePage.jsx** - Fetch profile from `profiles` table
- [ ] **ProfilePage.jsx** - Update profile information
- [ ] **ProfilePage.jsx** - Fetch documents from `documents` table
- [ ] **ProfilePage.jsx** - Upload documents to Storage
- [ ] **ProfilePage.jsx** - Delete documents
- [ ] Test profile management

### Afternoon: Recruiter & Admin (4-5 hours)
- [ ] **RecruiterDashboard.jsx** - Fetch job requests
- [ ] **RecruiterDashboard.jsx** - Create job requests
- [ ] **RecruiterDashboard.jsx** - Submit candidate applications
- [ ] **RecruiterDashboard.jsx** - Track pipeline
- [ ] **AdminDashboard.jsx** - Fetch all applications
- [ ] **AdminDashboard.jsx** - Update application statuses
- [ ] **AdminDashboard.jsx** - Manage jobs
- [ ] Test recruiter flow
- [ ] Test admin flow

### Evening: Polish (1-2 hours)
- [ ] **SupportPage.jsx** - Create support tickets table (optional)
- [ ] **SupportPage.jsx** - Submit tickets (optional)
- [ ] Test all pages end-to-end
- [ ] Fix any bugs
- [ ] Deploy!

---

## 🔍 **Testing After Each Page**

For each page you integrate, test:
- [ ] Data loads correctly
- [ ] Errors are handled gracefully
- [ ] Loading states work
- [ ] User can perform all actions
- [ ] Data persists after refresh
- [ ] Role-based access works (if applicable)

---

## 🐛 **Common Issues Quick Fix**

| Issue | Solution |
|-------|----------|
| "RLS policy violation" | Check table policies in Supabase dashboard |
| "Storage upload failed" | Verify bucket name and folder path |
| "Auth state lost" | Use `onAuthStateChange()` listener |
| "Query returns empty" | Check RLS policies allow SELECT |
| "Insert fails" | Check RLS policies allow INSERT |

---

## 📞 **Need Help?**

1. Check Supabase Dashboard → Logs
2. Check browser console for errors
3. Verify RLS policies are correct
4. Test queries in Supabase SQL Editor first

---

**You've got this! 💪**
