# 🟪 DAY 5 TASK - RAKSHITA

## 📋 Task: AdminDashboard.jsx - Job Approval + Category View

### ⏱️ Estimated Time: 2-3 hours

---

## 🎯 OBJECTIVE

Add functionality to the AdminDashboard that allows admins to:
1. View pending job requests submitted by agents
2. Approve or Reject job requests
3. When APPROVED → job request becomes a live job
4. Filter/view jobs by category

---

## 📚 WHAT'S ALREADY DONE (By Rithik - Database Head)

✅ **JobRequest Model** created with all necessary fields  
✅ **Job Model** with `category` field added  
✅ **API Routes** ready for approval/rejection  
✅ **Sample Data** seeded in database:
   - 4 pending job requests ready for review
   - 1 approved example, 1 rejected example  
✅ **Categories**: Hospitality, Construction, Healthcare, IT, Education, Retail, Manufacturing, Tourism, Fishing, Agriculture, Other

---

## 🔌 API ENDPOINTS TO USE

### 1. Get All Pending Job Requests (Admin View)
```
GET http://localhost:5000/api/admin/job-requests?status=PENDING
```

**Response:**
```json
[
    {
        "id": "uuid-here",
        "_id": "mongodb-id",
        "agent_id": "agent-uuid",
        "agent_name": "Rakshita Agent",
        "agent_email": "rakshita.agent@example.com",
        "agency_name": "Maldives Elite Staffing",
        "title": "Senior Sous Chef",
        "company": "Grand Resort Maldives",
        "location": "Male, Maldives",
        "category": "Hospitality",
        "salary_range": "$2000 - $3000/month",
        "description": "Looking for an experienced chef...",
        "requirements": ["5+ years experience", "Culinary degree"],
        "vacancies": 2,
        "status": "PENDING",
        "createdAt": "2026-01-24T10:18:26.661Z"
    }
]
```

### 2. Get Pending Count (for dashboard stats)
```
GET http://localhost:5000/api/admin/job-requests/pending/count
```

**Response:**
```json
{ "count": 4 }
```

### 3. ✅ Approve a Job Request (Creates Live Job!)
```
PUT http://localhost:5000/api/admin/job-requests/{_id}/approve
```

**Request Body (JSON):**
```json
{
    "reviewed_by": "Admin Name",
    "review_notes": "Approved - looks great!"
}
```

**Response:**
```json
{
    "message": "Job request approved and job created successfully",
    "jobRequest": { ... status: "APPROVED" ... },
    "job": { ... newly created live job ... }
}
```

### 4. ❌ Reject a Job Request
```
PUT http://localhost:5000/api/admin/job-requests/{_id}/reject
```

**Request Body (JSON):**
```json
{
    "reviewed_by": "Admin Name",
    "review_notes": "Rejected - incomplete information"
}
```

**Response:**
```json
{
    "message": "Job request rejected",
    "jobRequest": { ... status: "REJECTED" ... }
}
```

### 5. Get Jobs by Category
```
GET http://localhost:5000/api/jobs?category=Hospitality
```

### 6. Get All Categories
```
GET http://localhost:5000/api/jobs/categories
```

**Response:**
```json
["Hospitality", "Construction", "Healthcare", "IT", "Education", "Retail", "Manufacturing", "Tourism", "Fishing", "Agriculture", "Other"]
```

---

## 📝 COPY-PASTE AI PROMPT

Copy and paste this entire prompt into your AI assistant:

```
I need to add Job Approval functionality and Category filtering to AdminDashboard.jsx. Here's what I need:

## CURRENT FILE
The file is at: src/pages/AdminDashboard.jsx

## WHAT TO ADD

### PART 1: JOB REQUESTS SECTION (Approval/Rejection)

1. Add a new section/tab called "Job Requests" that shows pending requests from agents

2. Fetch pending requests on component mount:
   GET http://localhost:5000/api/admin/job-requests?status=PENDING
   
3. Display each job request as a card showing:
   - Job Title
   - Company Name
   - Agent Name + Agency Name
   - Category badge
   - Location
   - Salary Range
   - Description (collapsible)
   - Requirements list
   - Vacancies count
   - Date submitted
   - APPROVE button (green)
   - REJECT button (red)

4. On APPROVE click, call:
   PUT http://localhost:5000/api/admin/job-requests/{request._id}/approve
   Body: { "reviewed_by": "Admin", "review_notes": "Approved" }
   
   This automatically creates a new live job! Show success message.
   Remove the request from the pending list.

5. On REJECT click, show a modal/prompt for rejection reason, then call:
   PUT http://localhost:5000/api/admin/job-requests/{request._id}/reject
   Body: { "reviewed_by": "Admin", "review_notes": userInputReason }
   
   Remove from pending list, show confirmation.

6. Add a count badge next to "Job Requests" tab showing pending count:
   GET http://localhost:5000/api/admin/job-requests/pending/count

### PART 2: CATEGORY FILTER FOR JOBS

1. Add a category dropdown filter to the existing Jobs section

2. Categories to show: Hospitality, Construction, Healthcare, IT, Education, Retail, Manufacturing, Tourism, Fishing, Agriculture, Other

3. When category is selected, filter jobs:
   GET http://localhost:5000/api/jobs?category=Hospitality
   
4. Add an "All Categories" option that shows all jobs

## STATUS BADGES STYLING
- PENDING: Yellow/Amber background
- APPROVED: Green background  
- REJECTED: Red background

## STYLING
- Match existing AdminDashboard UI theme
- Use cards for job requests
- Add hover effects on Approve/Reject buttons
- Make it responsive

## IMPORTANT
- Use _id (MongoDB ObjectId) for API calls, not the uuid id field
- Refresh the requests list after each approve/reject action
- Show loading states during API calls
```

---

## ✅ VERIFICATION STEPS

1. **Start the server** (if not running):
   ```bash
   cd server
   npm run dev
   ```

2. **Login as Admin** at `/admin` or your admin login page

3. **Go to Admin Dashboard**

4. **Check "Job Requests" section** - you should see 4 pending requests from the seeded data

5. **Click APPROVE on one request** - verify:
   - Success message appears
   - Request disappears from pending list
   - New job appears in Jobs section

6. **Click REJECT on another request** - verify:
   - Modal asks for rejection reason
   - Request disappears from pending list

7. **Test Category Filter**:
   - Select "Hospitality" → only hospitality jobs shown
   - Select "All" → all jobs shown

8. **Test API directly** (optional):
   ```javascript
   // In browser console:
   fetch('http://localhost:5000/api/admin/job-requests?status=PENDING')
     .then(r=>r.json())
     .then(console.log)
   ```

---

## 🚨 COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| "Failed to approve" | Use `request._id` not `request.id` for the API URL |
| No pending requests shown | Run the seed script: `cd server && node seed_approval_data.js` |
| Server not running | Run `cd server && npm run dev` |
| Categories not loading | Use hardcoded array: `['Hospitality', 'Construction', 'Healthcare', 'IT', 'Education', 'Retail', 'Manufacturing', 'Tourism', 'Fishing', 'Agriculture', 'Other']` |
| CORS error | Make sure backend runs on port 5000 |

---

## 🧪 TEST ACCOUNTS

| Role | Email | Password |
|------|-------|----------|
| Test Agent | rakshita.agent@example.com | password123 |
| Admin | (use your existing admin account) | |

---

## 📊 DATABASE COLLECTIONS (Already Set Up)

| Collection | Description |
|------------|-------------|
| `jobrequests` | Agent-submitted requests (PENDING/APPROVED/REJECTED) |
| `jobs` | Live job listings (created when request is approved) |
| `profiles` | User accounts |

---

## 📂 FILES TO EDIT

* `src/pages/AdminDashboard.jsx` (main file)

---

## 🔄 APPROVAL FLOW DIAGRAM

```
Agent submits job request
         ↓
   Status: PENDING
   (stored in jobrequests collection)
         ↓
Admin sees in Dashboard
         ↓
    ┌────┴────┐
    ↓         ↓
 APPROVE   REJECT
    ↓         ↓
Creates new  Status: REJECTED
job in jobs  (stays in jobrequests)
collection
    ↓
Job is now LIVE
on Browse Jobs page!
```

---

**🎉 Once done, tell Rithik so he can verify the integration!**
