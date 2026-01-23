# 🟦 DAY 5 TASK - JYOTI

## 📋 Task: RecruiterDashboard.jsx - Request Job Form

### ⏱️ Estimated Time: 2-3 hours

---

## 🎯 OBJECTIVE

Add a "Request New Job" form to the RecruiterDashboard that allows agents to submit job requests for admin approval.

---

## 📚 WHAT'S ALREADY DONE (By Rithik - Database Head)

✅ **JobRequest Model** created with all necessary fields  
✅ **API Routes** ready for job requests  
✅ **Categories** available: Hospitality, Construction, Healthcare, IT, Education, Retail, Manufacturing, Tourism, Fishing, Agriculture, Other

---

## 🔌 API ENDPOINTS TO USE

### 1. Submit a Job Request
```
POST http://localhost:5000/api/job-requests
```

**Request Body (JSON):**
```json
{
    "agent_id": "user._id from localStorage",
    "agent_name": "user.full_name from localStorage",
    "agent_email": "user.email from localStorage",
    "agency_name": "user.agency_name from localStorage",
    "title": "Job Title",
    "company": "Company Name",
    "location": "Job Location",
    "category": "Hospitality",
    "salary_range": "$2000 - $3000/month",
    "description": "Job description here...",
    "requirements": ["Requirement 1", "Requirement 2"],
    "vacancies": 5
}
```

**Response:**
```json
{
    "message": "Job request submitted successfully. Awaiting admin approval.",
    "jobRequest": { ... }
}
```

### 2. Get Agent's Job Requests (to show their submitted requests)
```
GET http://localhost:5000/api/job-requests/agent/{agentId}
```

### 3. Get Categories List
```
GET http://localhost:5000/api/jobs/categories
```

---

## 📝 COPY-PASTE AI PROMPT

Copy and paste this entire prompt into your AI assistant:

```
I need to add a "Request New Job" form to RecruiterDashboard.jsx. Here's what I need:

## CURRENT FILE
The file is at: src/pages/RecruiterDashboard.jsx

## WHAT TO ADD

1. Add a new section/tab called "Request New Job" 

2. Create a form with these fields:
   - Job Title (text input, required)
   - Company Name (text input, required)
   - Location (text input, required)  
   - Category (dropdown select, required) - Options: Hospitality, Construction, Healthcare, IT, Education, Retail, Manufacturing, Tourism, Fishing, Agriculture, Other
   - Salary Range (text input, optional) - e.g., "$2000 - $3000/month"
   - Description (textarea, required)
   - Requirements (textarea - each line becomes an item in array)
   - Number of Vacancies (number input, default 1)

3. On form submit, call this API:
   POST http://localhost:5000/api/job-requests
   
   Body should be:
   {
       "agent_id": user._id (from localStorage 'user'),
       "agent_name": user.full_name,
       "agent_email": user.email,
       "agency_name": user.agency_name,
       "title": formData.title,
       "company": formData.company,
       "location": formData.location,
       "category": formData.category,
       "salary_range": formData.salary_range,
       "description": formData.description,
       "requirements": formData.requirements.split('\n').filter(r => r.trim()),
       "vacancies": formData.vacancies
   }

4. Add a section to display "My Job Requests" showing the agent's submitted requests:
   GET http://localhost:5000/api/job-requests/agent/{user._id}
   
   Show status badge: PENDING (yellow), APPROVED (green), REJECTED (red)

5. Show success toast/message when job request is submitted

## STYLING
- Use existing styles from the dashboard
- Make the form look professional and match the current UI theme
- Add form validation (required fields marked with *)

## GETTING USER DATA
const user = JSON.parse(localStorage.getItem('user'));
```

---

## ✅ VERIFICATION STEPS

1. **Start the server** (if not running):
   ```bash
   cd server
   node server.js
   ```

2. **Login as an Agent** at `/agent-login`

3. **Go to Recruiter Dashboard** at `/recruiter`

4. **Fill and submit a job request form**

5. **Check if request appears** in "My Job Requests" section with PENDING status

6. **Test API directly** (optional):
   ```
   Open browser console and run:
   fetch('http://localhost:5000/api/job-requests').then(r=>r.json()).then(console.log)
   ```

---

## 🚨 COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| "Failed to submit" | Check if server is running on port 5000 |
| User data undefined | Make sure you're logged in as an Agent |
| Category dropdown empty | Use hardcoded array: `['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other']` |

---

## 📂 FILES TO EDIT

- `src/pages/RecruiterDashboard.jsx` (main file)

---

**🎉 Once done, tell Rithik so he can verify the integration!**
