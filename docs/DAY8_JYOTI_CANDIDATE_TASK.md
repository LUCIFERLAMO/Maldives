# Day 8 Task: Candidate Profile & Applications (Jyoti)

**Goal**: Implement the Candidate View (Profile + Application Status).

**Context**: 
Candidates need to see their own profile details and the status of jobs they applied for.

## 1. Setup & APIs
- **My Applications**: `GET /api/applications/candidate/:email`
- **My Profile**: `GET /api/profile` (or from local storage user object).
- **Login as Candidate**:
    - Email: `candidate.john@mail.com`
    - Password: `password123`

## 2. Requirements (ProfilePage.jsx)
- [ ] **Profile Section**:
    - Display Name, Email, Contact, Skills, Experience.
    - (Optional) "Edit Profile" button to update details.
- [ ] **My Applications Section** (Below Profile):
    - Fetch from `/api/applications/candidate/:email`.
    - List formatted as cards:
        - **Job Title** (e.g., Head Chef)
        - **Company** (e.g., Luxury Resort)
        - **Status Badge** (Pending/Accepted/Rejected).
        - **Date Applied**.

## 3. Verification
- Log in as Candidate John.
- Check Profile Page.
- Should see "Head Chef" application with "PENDING" status (or as set in seed).
