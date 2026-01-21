# SRS Document - Updated Sections

## 3. Functional and Technical Requirements

### 3.1. Core Portal Requirements

#### 3.1.1. Module A: Candidate Portal (The Job Seeker)
- **Open Application Access:** Job seekers can see "OPEN" positions and apply directly after registration.
- **Profile Management:** Candidates can manage their personal details and uploaded documents.
- **Status Privacy:** The default setting is that candidates cannot see the status of their applications (for example, "Selected" or "Rejected").
- **Status Access Request:** The system allows candidates to "Request Status Access" from the Admin. The candidate can access the status of his/her application only after approval from the Admin.

#### 3.1.2. Module B: Agency Portal (The Strategic Partner)
- **Talent Supply:** The main purpose is to provide candidates for the already listed jobs on the platform.
- **Corporate Registration:** The agencies are required to register with Business License information.
- **Pipeline Management:** Agencies can view the candidates they have submitted or received.
- **Advanced Workflows:**
  - **Job Hosting Requests:** Agents are required to make a "Vacancy Request" (Title, Salary, Headcount) to the Admin.
  - **Inbound Talent Stream:** The "Selected Candidates" are received by the agencies from the Admin, and they automatically appear in the agencies' dashboard.

#### 3.1.3. Module C: Admin Portal (The Central Controller)
- **System Overview:** A master dashboard displaying Global User Counts and Active Job Stats.
- **User Management:** Search and view any User (Candidate or Agent) profile.
- **Content Management:** Complete control to Create, Edit, Publish, and Close Job Listings.
- **Advanced Workflows:**
  - **Job Request Moderation:** The Admin handles the "Agency Job Request Queue" with three different operations: Accept (Publishes the job), Reject (Returns with feedback), and Hold (Holds it in a waitlist state).
  - **Status Access Approval:** A queue to examine Candidate requests to "View Status."
  - **Centralized Selection:** The Admin examines all applications. If a candidate is selected as "SELECTED," the system will transfer the candidate's complete information to the concerned Agency.

---

### 3.2. Input-Output Relationship (System Actions)

| Module | User Input (Action) | System Output (Response) |
|--------|---------------------|--------------------------|
| Candidate | Apply for Job: Clicks "Apply Now" on a Job. | Application is submitted to the database. Dashboard shows "Application Sent" (Status remains hidden). |
| Candidate | Request Access: Clicks "Request to see Status". | System sends a request to the Admin. Button changes to "Request Pending". |
| Agency | Supply Candidate: Agent uploads Resume for an Active Job. | System accepts the file and adds the candidate to the Admin's review queue. |
| Agency | Request Job: Agent fills "New Job Request" form. | System inserts job_requests row. Admin receives notification. |
| Admin | Accept Job Request: Clicks "Approve" on Agent Request. | System creates a public jobs entry. Vacancy appears on Public Landing Page. |
| Admin | Reject Job Request: Clicks "Reject" on Agent Request. | Request status updates to REJECTED. Agent notified. |
| Admin | Approve Status View: Clicks "Grant Access" for User A. | Property can_view_status = True. User A can now see their status (e.g., "Shortlisted"). |

---

### 3.3. Possible Outcomes & Logic

#### A. Candidate Application Logic
- **Outcome I (Successful Apply):** A candidate applies. The application is recorded in the database. The candidate can view the record in their history, but they will not be able to view the status of Rejected or Selected.
- **Outcome II (Status Request):** The candidate requests to see the status. An admin approves the request, and the candidate's dashboard will then show the actual status tags (for example, "Interview Scheduled").

#### B. Agency Job Request Logic
- **Outcome I (Acceptance):** The admin accepts the request, and the job is posted on the public board.
- **Outcome II (Rejection):** The admin rejects the request, and the agency can see the reason for rejection on their dashboard.
- **Outcome III (Hold):** The admin puts the request on hold. The job is not posted but is still queued for possible activation at a later stage.

#### C. Admin Selection Logic
- **Outcome I (Match Made):** The admin chooses a public applicant for an Agency Job. The details of the candidate, including phone number, resume, and experience, are transferred to the agency dashboard.
- **Outcome II (Rejection):** The admin rejects an application. The applicant is placed in the archive, and the agency loses access to the applicant.

---

## 4. User Interface and Software Interfaces

### 4.1. User Interface Requirements

#### General Design:
- **Aesthetic:** "Tropical Professional" design with teal and white, emphasizing clean interaction points.
- **Responsiveness:** Mobile first for candidates, desktop optimized for agents and admins.

#### Specific Interfaces:
- **Candidate UI:** Focus on "Job Cards" and simple "Apply" flows. The Status column in tables should be hidden or masked by default.
- **Agency UI:** Emphasize "Data Tables" for handling the large number of candidates and job requests.
- **Admin UI:** Feature "Queues" (Status Request Queue, Job Request Queue) with prominent action buttons: Accept, Reject, Hold.

---

### 4.2. Software Interfaces

#### 1. Data Interface (MongoDB & Node.js Backend)

- **Authentication:** Custom JWT-based authentication system using Node.js and Express.js. Handles login, signup, and session tokens for all three roles (Admin, Agent, Candidate).

- **Database (MongoDB Atlas):**
  - NoSQL document database hosted on MongoDB Atlas (Free Tier).
  - Stores all user profiles, jobs, applications, and agency data.
  - Collections include:
    - `profiles` - User accounts for Admin, Agent, and Candidate roles
    - `jobs` - Job listings created by Admin or requested by Agents
    - `applications` - Candidate applications linked to jobs
    - `agencies` - Agency registration details and business information

- **Data Security:**
  - Role-based access control implemented at the API level.
  - Password hashing for secure credential storage.
  - JWT tokens for session management and API authorization.
  - API middleware validates user roles before granting access to protected routes.

#### 2. API Interface (RESTful APIs)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration for all roles |
| `/api/auth/login` | POST | User authentication and JWT token generation |
| `/api/jobs` | GET | Fetch all published job listings |
| `/api/jobs` | POST | Create new job (Admin only) |
| `/api/applications` | POST | Submit job application (Candidate) |
| `/api/applications` | GET | Fetch applications (Role-based filtering) |

#### 3. File Interface (Cloud Storage)

- **Uploads:** The user uploads PDFs/JPEGs (resumes, passports).
- **Storage:** Files stored locally or on cloud storage services.
- **Security:**
  - `agency-docs`: Private storage for business licenses.
  - `candidate-docs`: Secured storage; agents can upload and admins can read.

#### 4. Notification Interface

- **Email:** Transactional emails sent through an SMTP service when statuses are updated or requests are approved.

---

## 7. Project Schedule (8 Weeks)

| Phase | Week | Activities | Deliverables |
|-------|------|------------|--------------|
| Requirements Analysis | Week 1 | Client meetings, requirement gathering, scope definition | SRS Document |
| System Design | Week 2 | Database design, UI/UX mockups, system architecture | Design Document |
| Frontend Development | Week 3-4 | UI implementation, page development, responsive design | Frontend Modules |
| Backend Development | Week 4-5 | API development, database integration, authentication | Backend APIs |
| Integration | Week 6 | Frontend-Backend integration, API testing | Integrated System |
| Testing & Bug Fixes | Week 7 | Unit testing, integration testing, UAT, bug fixes | Test Reports |
| Deployment & Handover | Week 8 | Production deployment, documentation, client training | Final Deliverables |

### Milestones

| Milestone | Week | Description |
|-----------|------|-------------|
| M1 | Week 1 | SRS Document Approved |
| M2 | Week 2 | Design Sign-off |
| M3 | Week 5 | Development Complete |
| M4 | Week 7 | Testing Complete |
| M5 | Week 8 | Project Handover |

---

## 8. Budget

### 8.1 Technology Stack

| Layer | Technology | Cost |
|-------|------------|------|
| Frontend | React.js, Vite, CSS | ₹0 (Open Source) |
| Backend | Node.js, Express.js | ₹0 (Open Source) |
| Database | MongoDB Atlas | ₹0 (Free Tier) |
| Version Control | Git, GitHub | ₹0 |

### 8.2 Project Cost

| Item | Cost |
|------|------|
| Development | ₹0 |
| Software & Tools | ₹0 |
| Hosting | ₹0 (Free Tier) |
| **Total Project Cost** | **₹0** |

### 8.3 Client-Borne Costs

| Item | Estimated Cost | Remarks |
|------|----------------|---------|
| Domain Name | ₹800 - ₹1,500/year | Paid by client |
| Future Expansion | As required | Paid by client |
