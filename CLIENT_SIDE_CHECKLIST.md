# ✅ Client-Side Integration Checklist

## 🎯 **Focus: Candidate/User Portal Only**

---

## 📦 **PART 1: Initial Setup** (Do Once)

- [ ] Create Supabase account
- [ ] Create new project: `maldives-career-client`
- [ ] Get Project URL and anon key
- [ ] Install `@supabase/supabase-js` package
- [ ] Create `src/lib/supabase.js` file
- [ ] Run SQL script to create all 6 tables
- [ ] Create Storage bucket: `user-documents`
- [ ] Set up Storage policies
- [ ] Test connection works

---

## 🏠 **PART 2: HomePage**

- [ ] Add newsletter signup functionality
- [ ] Add real job statistics
- [ ] Test newsletter subscription
- [ ] Test statistics display

**Status:** ⏳ In Progress / ✅ Complete

---

## 🔐 **PART 3: AuthPage** (CRITICAL!)

- [ ] Update AuthContext.jsx with Supabase
- [ ] Implement login with Supabase
- [ ] Implement signup with Supabase
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test logout flow

**Status:** ⏳ In Progress / ✅ Complete

---

## 📋 **PART 4: BrowseJobsPage**

- [ ] Fetch jobs from database
- [ ] Replace MOCK_JOBS with real data
- [ ] Add loading state
- [ ] Test job listing displays
- [ ] Test search/filter works

**Status:** ⏳ In Progress / ✅ Complete

---

## 📄 **PART 5: JobDetailPage**

- [ ] Fetch job details by ID
- [ ] Implement file upload to Storage
- [ ] Create application record
- [ ] Link documents to application
- [ ] Test complete application flow

**Status:** ⏳ In Progress / ✅ Complete

---

## 📊 **PART 6: MyApplicationsPage**

- [ ] Fetch user's applications
- [ ] Join with jobs table
- [ ] Display application status
- [ ] Test application tracking

**Status:** ⏳ In Progress / ✅ Complete

---

## 🏠 **PART 7: CandidateDashboard**

- [ ] Fetch application stats
- [ ] Show action required count
- [ ] Display recent applications
- [ ] Test dashboard loads correctly

**Status:** ⏳ In Progress / ✅ Complete

---

## 👤 **PART 8: ProfilePage**

- [ ] Fetch user profile
- [ ] Update profile information
- [ ] Fetch user documents
- [ ] Upload documents to Storage
- [ ] Delete documents
- [ ] Test profile management

**Status:** ⏳ In Progress / ✅ Complete

---

## 💬 **PART 9: SupportPage**

- [ ] Submit support tickets
- [ ] Save to database
- [ ] Test ticket submission

**Status:** ⏳ In Progress / ✅ Complete

---

## ✅ **PART 10: SuccessPage**

- [ ] No changes needed (just confirmation)

**Status:** ✅ Complete

---

## 🎯 **Pages We're NOT Touching**

- ❌ AdminDashboard (teammate working on it)
- ❌ RecruiterDashboard (teammate working on it)

---

## 📝 **Quick Reference**

**Main Guide:** `CLIENT_SIDE_COMPLETE_GUIDE.md`
**This Checklist:** `CLIENT_SIDE_CHECKLIST.md`

---

## 🆘 **Need Help?**

1. Check Supabase Dashboard → Logs
2. Check browser console for errors
3. Verify RLS policies in Table Editor
4. Test queries in SQL Editor first

---

**Follow the complete guide step-by-step! 📚**
