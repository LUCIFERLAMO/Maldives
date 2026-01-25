# 📋 Recruiter Dashboard Task (For Jennita)

**Hi Jennita! 👋**
Your task today is to build the **Candidate Pipeline** in the Recruiter/Agent Dashboard. Rithik has already set up the backend, so you just need to fetch and display the data!

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I need to implement the Candidate Pipeline for the Recruiter Agent.

1. **FILE TO EDIT:** `src/pages/RecruiterDashboard.jsx` (or `AgentDashboard.jsx` if named differently)

2. **TASK: IMPLEMENT CANDIDATE PIPELINE**
   - **Goal:** Display a list of candidates that I (the logged-in agent) have submitted.
   - **Data Fetching:**
     - Use `axios` to fetch data from: `GET /api/applications/agent/${user.id}/all`
     - Access `user.id` from `localStorage` or your AuthContext.
   - **UI Implementation:**
     - Create a section called "Candidate Pipeline".
     - Display a responsive **Table** or **Card List** with these columns/fields:
       - **Candidate Name** (`candidate_name`)
       - **Target Job** (`jobs.title` - Note: `jobs` object comes from the API)
       - **Company** (`jobs.company`)
       - **Date Applied** (Format `applied_at` nicely)
       - **Status** (`status`) - Use badges/chips with colors:
         - PENDING: Yellow
         - REVIEWING: Blue
         - ACCEPTED: Green
         - REJECTED: Red
   - **Empty State:**
     - If the list is empty, show a nice message: "No active candidates yet. Start submitting applications!" with a button to the Job Board.

3. **VERIFICATION**
   - Log in as an Agent (e.g., `agent.smith@agency.com` / `password123`).
   - Check the dashboard; you should see the test candidates Rithik added.
   - Ensure the Status colors are correct.
```

---

## ✅ Final Check

After Antigravity finishes:
1.  Log in as **Agent Smith**.
2.  Go to your **Dashboard**.
3.  Verify you see the candidates in a table.
4.  Check that the Job Title and Company Names are showing up correctly (not undefined).

**If that works, you are done! 🎉**
