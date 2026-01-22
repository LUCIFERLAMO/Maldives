# System Requirements Specification (Supplementary)

## 5. Performance Requirements

This section defines the quantifiable performance constraints and quality attributes required for the efficient operation of the system.

### 5.1 Response Time
The system is engineered to provide immediate feedback to user interactions, minimizing latency to prevent user churn.
- **API Response Targets**: The backend API allows the system to render lists of vacancies with minimal delay, strictly targeting **sub-200ms response times** for critical read operations (e.g., `fetchJobs`).
- **Real-Time Data Mapping**: The `fetchJobs` function utilizes optimized aggregation pipelines to map active database records to frontend `JobStatus` enums in real-time, ensuring zero perception of lag during data rendering.

### 5.2 Throughput
The system is designed to handle high concurrency and significant data processing loads without performance degradation.
- **Asynchronous Concurrency**: Leveraging the **Node.js Event Loop**, the backend processes I/O-heavy functional requests (User Search, File Uploads) asynchronously. This prevents blocking operations and ensures the application remains responsive even under peak load.
- **Load Capacity**: The **Live Job Feed** component is stress-tested to remain responsive (~60 FPS UI rendering) even when multiple simultaneous users are filtering over **500+ job listings** in a single session.

### 5.3 Scalability
The system architecture supports horizontal growth in both user base and feature complexity.
- **Modular Architecture**: The codebase utilizes a decoupled **React Component Architecture**. Features such as `JobCard` and `DashboardSidebar` are isolated modules, allowing for the seamless addition of new distinct features (e.g., "Video Resume") without requiring regression testing of the core dashboard logic.
- **Storage Scalability**: The system scales binary data storage via **MongoDB GridFS**. As usage of the "Apply for Job" function scales, the storage layer automatically chunks and distributes large files (resumes), ensuring that the application performance remains O(1) even as the dataset grows from gigabytes to terabytes.

---

## 6. Non-Functional Requirements

This section details the quality attributes that ensure the system is usable, reliable, and secure.

### 6.1 Reliability
- **Fault Tolerance & Graceful Degradation**: The system prevents catastrophic failures through defensive programming.
  - *Implementation*: In `CandidateDashboard.jsx`, all asynchronous data fetching is wrapped in robust **try-catch blocks**.
  - *Fallback Strategy*: If the API becomes unreachable, the UI gracefully degrades to a "Temporary Maintenance" or "Empty State" view effectively masking the failure from the end-user and preventing a "White Screen of Death."
- **Data Integrity**: The system guarantees ACID-like properties for critical status updates. Application statuses (e.g., "Action Required" vs. "Submitted") are enforced by backend validation logic, ensuring a user never sees an inconsistent state (e.g., "Active" status for a "Rejected" application).

### 6.2 Security
- **Role-Based Access Control (RBAC)**: Security is enforced at the API context level (`AuthContext.jsx`). Access policies are strict:
  - *Rule*: A user with the `CANDIDATE` role receives a 403 Forbidden response when attempting to access any route prefixed with `/admin/*`.
- **Session Security**:
  - **Transport Security**: All API interactions occur over HTTPS (TLS 1.2+).
  - **Token Management**: Sessions are managed via **JWT (JSON Web Tokens)**. Tokens are signed with a strong secret and validated on every protected request to prevent session hijacking.
  - **Credential Storage**: Passwords are never stored in plain text; they are hashed using **BCrypt** with salt before storage in MongoDB.
- **Input Sanitization**: To mitigate Injection Attacks (NoSQL Injection, XSS), all user inputs—specifically free-text fields like the "Job Search Bar"—are sanitized and escaped server-side before processing.

### 6.3 Usability
- **Feedback & Responsiveness**: The System adheres to the **"System Status Visibility"** heuristic.
  - *Visual Cues*: Actions like "Share Job" trigger immediate feedback (Toast Notifications).
  - *Perceived Performance*: Skeleton screens are employed during data fetching states to reduce perceived wait times.
- **Intuitive Navigation**: The interface follows standard web navigation patterns (Sticky Navbar, Semantic Sidebar), ensuring a **zero-learning curve**. Standardized iconography (Lucide React) provides clear semantic meaning to actions.
- **Accessibility (A11y)**: The application is designed to meet WCAG 2.1 AA standards where feasible, utilizing **high-contrast color ratios** and semantic HTML structure to ensure usability for visually impaired users.
