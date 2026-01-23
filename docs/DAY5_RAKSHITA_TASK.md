# 🟦 DAY 5 TASK - RAKSHITA

## 📋 Task: BrowseJobsPage.jsx & JobDetailPage.jsx

### ⏱️ Estimated Time: 2-3 hours

---

## 🎯 OBJECTIVES

1. **BrowseJobsPage.jsx** - Display all jobs with category filter
2. **JobDetailPage.jsx** - Show complete job details with Apply button

---

## 📚 WHAT'S ALREADY DONE (By Rithik - Database Head)

✅ **Jobs Table** created with categories  
✅ **15 Sample Jobs** seeded in database  
✅ **API Routes** ready for fetching jobs  
✅ **Categories**: Hospitality, Construction, Healthcare, IT, Education, Retail, Manufacturing, Tourism, Fishing, Agriculture, Other

---

## 🔌 API ENDPOINTS TO USE

### 1. Get All Jobs (with optional category filter)
```
GET http://localhost:5000/api/jobs
GET http://localhost:5000/api/jobs?category=Hospitality
GET http://localhost:5000/api/jobs?status=OPEN
```

**Response:**
```json
[
    {
        "_id": "...",
        "id": "uuid-string",
        "title": "Hotel Front Desk Manager",
        "company": "Paradise Resort Maldives",
        "location": "Malé, Maldives",
        "category": "Hospitality",
        "salary_range": "$2,500 - $3,500/month",
        "description": "We are looking for...",
        "requirements": ["3+ years experience", "Fluent English"],
        "status": "OPEN",
        "posted_date": "2026-01-23T..."
    }
]
```

### 2. Get Job Categories List
```
GET http://localhost:5000/api/jobs/categories
```

**Response:**
```json
["Hospitality", "Construction", "Healthcare", "IT", "Education", "Retail", "Manufacturing", "Tourism", "Fishing", "Agriculture", "Other"]
```

### 3. Get Single Job by ID
```
GET http://localhost:5000/api/jobs/{id}
```

---

## 📝 COPY-PASTE AI PROMPT FOR BrowseJobsPage.jsx

```
I need to update BrowseJobsPage.jsx to fetch and display real jobs from the database. Here's what I need:

## CURRENT FILE
The file is at: src/pages/BrowseJobsPage.jsx

## WHAT TO IMPLEMENT

1. **Fetch jobs from API on page load:**
   ```javascript
   useEffect(() => {
       fetch('http://localhost:5000/api/jobs')
           .then(res => res.json())
           .then(data => setJobs(data))
           .catch(err => console.error(err));
   }, []);
   ```

2. **Add Category Filter dropdown:**
   - Options: All, Hospitality, Construction, Healthcare, IT, Education, Retail, Manufacturing, Tourism, Fishing, Agriculture, Other
   - When category changes, refetch:
     ```javascript
     fetch(`http://localhost:5000/api/jobs?category=${selectedCategory}`)
     ```

3. **Display Job Cards with these fields:**
   - job.title (bold header)
   - job.company
   - job.location
   - job.category (as a badge/tag)
   - job.salary_range
   - job.posted_date (formatted as "Posted X days ago")
   - "View Details" button → navigates to /jobs/{job.id}

4. **Add Loading state** while fetching

5. **Add Search functionality** (filter by title or company)

6. **Show job count** (e.g., "Showing 15 jobs")

## STYLING
- Use card grid layout (2-3 cards per row)
- Category badge with colored background
- Hover effect on cards
- Professional and clean look

## NAVIGATION
Use react-router-dom:
```javascript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
// On card click:
navigate(`/jobs/${job.id}`);
```
```

---

## 📝 COPY-PASTE AI PROMPT FOR JobDetailPage.jsx

```
I need to update JobDetailPage.jsx to display complete job details. Here's what I need:

## CURRENT FILE
The file is at: src/pages/JobDetailPage.jsx

## WHAT TO IMPLEMENT

1. **Get job ID from URL params:**
   ```javascript
   import { useParams } from 'react-router-dom';
   const { id } = useParams();
   ```

2. **Fetch job details on load:**
   ```javascript
   useEffect(() => {
       fetch(`http://localhost:5000/api/jobs/${id}`)
           .then(res => res.json())
           .then(data => setJob(data))
           .catch(err => console.error(err));
   }, [id]);
   ```

3. **Display all job information:**
   - job.title (large heading)
   - job.company (with icon)
   - job.location (with map pin icon)
   - job.category (badge)
   - job.salary_range (highlighted)
   - job.posted_date (formatted)
   - job.status (OPEN = green, CLOSED = red)
   - job.description (paragraph)
   - job.requirements (as bullet list)

4. **Add "Apply Now" button:**
   - If user is logged in as CANDIDATE, show Apply button
   - If not logged in, show "Login to Apply" → redirect to /candidate-login
   - Check: `const user = JSON.parse(localStorage.getItem('user'));`

5. **Add "Back to Jobs" link** → navigates to /browse-jobs

6. **Handle "Job not found" error** gracefully

## STYLING
- Clean, professional layout
- Two-column layout on desktop (details left, apply box right)
- Requirements as checkmarks or bullet points
- Salary should stand out (maybe in a highlight box)
```

---

## ✅ VERIFICATION STEPS

### For BrowseJobsPage:
1. Go to `/browse-jobs`
2. Check if jobs are loading from database
3. Test category filter - select "Hospitality", should show only hospitality jobs
4. Click on a job card, should navigate to `/jobs/{job.id}`

### For JobDetailPage:
1. Go to `/jobs/{any-job-id}` 
2. Check if all job details display correctly
3. Check Apply button behavior (logged in vs not logged in)

### Quick Test in Browser Console:
```javascript
// Test jobs API
fetch('http://localhost:5000/api/jobs').then(r=>r.json()).then(console.log)

// Test single job
fetch('http://localhost:5000/api/jobs').then(r=>r.json()).then(jobs => {
    if(jobs[0]) {
        console.log('First job ID:', jobs[0].id);
        fetch(`http://localhost:5000/api/jobs/${jobs[0].id}`).then(r=>r.json()).then(console.log)
    }
})
```

---

## 🚨 COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| Jobs not loading | Make sure server is running: `cd server && node server.js` |
| Empty job list | Run seed script: `cd server && node seedJobs.js` |
| Job details 404 | Use `job.id` (UUID string), not `job._id` (MongoDB ObjectId) |
| Category filter not working | Check API call includes query param: `?category=Hospitality` |

---

## 📂 FILES TO EDIT

- `src/pages/BrowseJobsPage.jsx`
- `src/pages/JobDetailPage.jsx`

---

**🎉 Once done, tell Rithik so he can verify the integration!**
