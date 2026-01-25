# 📋 Admin Dashboard Task (For Rakshita)

**Hi Rakshita! 👋**
Your task is to build the "Vacancy Management" drill-down view. You will allow Admins to navigate from **Category** → **Jobs** → **Candidates**. The backend is ready!

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I need to implement the Admin Vacancy Management flow.

1. **FILE TO EDIT:** `src/pages/AdminDashboard.jsx`

2. **TASK: IMPLEMENT HIERARCHICAL VIEW**
   - Create a section called "Vacancy Management".
   - Use State to manage the view: `[viewMode, setViewMode] = useState('CATEGORIES')` // Options: 'CATEGORIES', 'JOBS', 'CANDIDATES'

   - **VIEW 1: CATEGORIES** (Default)
     - Display cards for each Job Category (Hospitality, IT, etc.).
     - **Action:** Clicking a card sets `selectedCategory` and changes view to 'JOBS'.
     - API: (Static list or fetch from `/api/jobs/categories`)

   - **VIEW 2: JOBS LIST**
     - Show a list of jobs for the `selectedCategory`.
     - **API:** `GET /api/jobs?category={selectedCategory}`
     - **Action:** Clicking a job sets `selectedJobId` and changes view to 'CANDIDATES'.
     - **Back Button:** "← Back to Categories"

   - **VIEW 3: CANDIDATES LIST**
     - Show all applicants for `selectedJobId`.
     - **API:** `GET /api/applications?job_id={selectedJobId}`
     - **Display:** Application Name, Agent Name (if any), Resume Link (if available), and buttons to Approve/Reject.
     - **Back Button:** "← Back to Jobs"

3. **VERIFICATION**
   - Click "Hospitality" -> See list of Hospitality jobs.
   - Click "Head Chef" -> See candidates for Head Chef.
   - Verify the Back buttons work.
```

---

## ✅ Final Check

After Antigravity finishes:
1.  Log in as **Admin**.
2.  Navigate through the levels: **Category -> Job -> Candidate**.
3.  Ensure you can see the applicants at the end of the flow.

**If navigation works smoothly, you are done! 🎉**
