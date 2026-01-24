# 🟪 DAY 7 TASK - RAKSHITA

## 📋 Task: JobDetailPage.jsx - Submit Candidate Functionality

### ⏱️ Estimated Time: 1-2 hours

---

## 🎯 OBJECTIVE

Implement the "Submit Candidate" functionality in the `JobDetailPage.jsx`. When an **Agent** views a job, they should be able to submit a candidate application for that job directly.

---

## 📚 WHAT'S READY (Backend)

✅ **Application Model** updated to include `agent_id`.
✅ **API Endpoint** ready: `POST /api/applications` (supports file uploads).

---

## 🔌 API ENDPOINT TO USE

### Submit Application
```
POST http://localhost:5000/api/applications
```

**Content-Type:** `multipart/form-data` (Important! You are sending files)

**Form Data Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `job_id` | String | Yes | The ID of the job being applied for |
| `name` | String | Yes | Candidate's Full Name |
| `email` | String | Yes | Candidate's Email |
| `contact` | String | Yes | Candidate's Phone Number |
| `agent_id` | String | No | The ID of the logged-in agent (if applicable) |
| `resume` | File | Yes | PDF file of the resume |
| `certs` | File | No | PDF file of certificates (optional) |

**Success Response:**
```json
{
    "message": "Application submitted successfully!",
    "application": { ... }
}
```

---

## 📝 COPY-PASTE AI PROMPT

Copy and paste this entire prompt into your AI assistant:

```
I need to implement the "Submit Candidate" form logic in JobDetailPage.jsx.

## CURRENT FILE
The file is at: src/pages/JobDetailPage.jsx

## REQUIREMENTS

1. **Locate the "Submit Candidate" section/modal** in the existing code.

2. **Create a form submission handler** that does the following:
   - Prevents default form submission.
   - Gathers form data (Name, Email, Contact).
   - Gets the `resume` and `certs` files from the file inputs.
   - Gets `job_id` from the URL params or props.
   - Gets `agent_id` from the AuthContext (if user is logged in as Agent).

3. **Send a POST request** to `http://localhost:5000/api/applications`.
   - Use `FormData` object.
   - Append all fields: `job_id`, `name`, `email`, `contact`, `agent_id`, `resume`, `certs`.
   - IMPORTANT: `agent_id` should effectively link this application to the agent.

4. **Handle Loading & Response:**
   - Show a loading spinner/state while uploading.
   - On success (201), show a success message (e.g., "Candidate Submitted Successfully!") and reset the form.
   - On error, show an alert with the error message.

## CODE SNIPPET (Example Fetch)
```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('job_id', id); // 'id' from useParams
    formData.append('name', name);
    formData.append('email', email);
    formData.append('contact', contact);
    
    // Add Agent ID if logged in
    if (user && user.role === 'AGENT') {
        formData.append('agent_id', user._id);
    }
    
    if (resumeFile) formData.append('resume', resumeFile);
    if (certsFile) formData.append('certs', certsFile);

    try {
        const response = await fetch('http://localhost:5000/api/applications', {
            method: 'POST',
            body: formData, // No Content-Type header needed for FormData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Candidate submitted successfully!');
            // Close modal/reset form
        } else {
            alert(data.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error');
    } finally {
        setIsSubmitting(false);
    }
};
```

## STYLING
- Ensure the file input looks good (standard file picker is fine).
- Use a primary button for "Submit Application".
- Show a simple spinner or "Submitting..." text when loading.
```

---

## ✅ VERIFICATION STEPS

1. **Start the server**: `cd server && npm run dev`
2. **Login as an Agent** (e.g., `rakshita.agent@example.com` / `password123`).
3. **Go to "Browse Jobs"** and click on any job to view details.
4. **Fill out the "Submit Candidate" form**:
   - Name: "Test Candidate"
   - Email: "test.candidate@example.com"
   - Upload a small dummy PDF for resume.
5. **Click Submit**.
6. **Verify**:
   - You should see a success message.
   - (Optional) Check the "Admin Dashboard" -> "Job Requests" (or Applications tab if available) to see the new application.
