# 🟪 DAY 7 TASK - JENNITA

## 📋 Task: Candidate Dashboard & My Applications Page

### ⏱️ Estimated Time: 1-2 hours

---

## 🎯 OBJECTIVE

Enhance the **Candidate Dashboard** (`CandidateDashboard.jsx`) to show a summary of applications and implement the **My Applications Page** (`MyApplicationsPage.jsx`) to list all applications submitted by the logged-in candidate.

---

## 📚 WHAT'S READY (Backend)

✅ **Application Model** ready.
✅ **API Endpoint** ready: `GET /api/applications/candidate/:email`.

---

## 🔌 API ENDPOINT TO USE

### Get Candidate Applications
```
GET http://localhost:5000/api/applications/candidate/{candidate_email}
```

**Response:**
```json
[
    {
        "id": "app-id",
        "job_id": "job-id",
        "candidate_name": "Jennita Candidate",
        "email": "jennita@example.com",
        "status": "PENDING",
        "applied_at": "2026-01-24T10:00:00Z"
    },
    ...
]
```

---

## 📝 COPY-PASTE AI PROMPT

Copy and paste this entire prompt into your AI assistant:

```
I need to implement the "My Applications" list for the Candidate logic in both CandidateDashboard.jsx and MyApplicationsPage.jsx.

## CURRENT FILES
- src/pages/CandidateDashboard.jsx
- src/pages/MyApplicationsPage.jsx

## REQUIREMENTS

### 1. CandidateDashboard.jsx (Summary)
- **Fetch Applications:** On mount, fetch applications for the logged-in candidate.
  - Endpoint: `GET http://localhost:5000/api/applications/candidate/{user.email}`
- **Display Stats:**
  - "Total Applications": Count of total applications.
  - "Pending": Count of applications with status 'PENDING'.
- **Recent Activity:** Show the top 3 most recent applications (Job ID, Status, Date).

### 2. MyApplicationsPage.jsx (Detailed List)
- **Fetch Applications:** Same as above.
- **Display Table/List:**
  - Show a table of ALL applications.
  - Columns:
    - **Job ID** (or Title if available, currently just ID is fine)
    - **Date Applied** (Format: DD MMM YYYY)
    - **Status** (Badge: Yellow for Pending, Green for Accepted, Red for Rejected)
  - **Empty State:** If no applications, show a "No applications yet" message with a link to "Browse Jobs".
- **Loading State:** Show a spinner while fetching.

## CODE SNIPPET (Example Fetch)
```javascript
useEffect(() => {
    if (user && user.email) {
        fetch(`http://localhost:5000/api/applications/candidate/${user.email}`)
            .then(res => res.json())
            .then(data => setApplications(data))
            .catch(err => console.error(err));
    }
}, [user]);
```

## STYLING
- Use the existing design system (Tailwind classes).
- Make the status badges look distinct.
- Ensure the table is responsive.
```

---

## ✅ VERIFICATION STEPS

1. **Start the server**: `cd server && npm run dev`
2. **Login as a Candidate** (Create one if needed or use existing).
3. **Go to "Candidate Dashboard"**:
   - Verify the stats count matches your actual applications (might be 0 initially).
4. **Go to "My Applications"**:
   - Verify the list is empty (if new user).
5. **Apply for a Job** (Go to Browse Jobs -> Apply):
   - Submit an application.
6. **Return to My Applications**:
   - Verify the new application appears in the list with "PENDING" status.
