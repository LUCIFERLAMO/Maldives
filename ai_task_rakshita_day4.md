# 📋 Admin Dashboard Task (For Rakshita)

**Hi Rakshita! 👋**
Your task today is to build the **Agency Approval Section** in the Admin Dashboard. When recruitment agencies register, they need admin approval before their agents can log in. You'll create the UI for the admin to view, approve, or reject these pending agencies!

---

## ✅ Backend is READY!

Rithik has already created all the APIs you need. The database has **3 pending test agencies** ready for you to test with.

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I need to add an Agency Approval section to the Admin Dashboard.

1. **FILE TO EDIT:** `src/pages/AdminDashboard.jsx`

2. **TASK: CREATE AGENCY APPROVAL SECTION**
   
   **Part A: Fetch Pending Agencies**
   - Create a state variable: `const [pendingAgencies, setPendingAgencies] = useState([]);`
   - In `useEffect`, fetch all agencies with status 'Pending' from the backend:
     - API Endpoint: `GET http://localhost:5000/api/admin/agencies?status=Pending`
     - Store the response array in `pendingAgencies` state.
   
   **Part B: Build the Approval UI**
   - Add a new section/card titled **"Pending Agency Approvals"**
   - Display a table or card list showing each pending agency with:
     - Agency Name (from `agency.name`)
     - Contact Email (from `agency.email`)
     - Phone Number (from `agency.contact`)
     - Location (from `agency.location`)
     - Two Action Buttons: **"Approve"** (green) and **"Reject"** (red)
   
   **Part C: Implement Approve Action**
   - When "Approve" is clicked:
     - Call `PUT http://localhost:5000/api/admin/agencies/${agency._id}/approve`
     - On success, the API returns `agentCredentials` with email + temporaryPassword
     - Show a modal/alert with the agent's login credentials:
       "Agency approved! Agent credentials:
        Email: [email]
        Temporary Password: [password]"
     - Remove the agency from the `pendingAgencies` list
   
   **Part D: Implement Reject Action**
   - When "Reject" is clicked:
     - Call `PUT http://localhost:5000/api/admin/agencies/${agency._id}/reject`
     - On success, remove the agency from the `pendingAgencies` list
     - Show a toast: "Agency rejected."
   
   **Part E: Empty State**
   - If `pendingAgencies.length === 0`, show a friendly message:
     - Icon: A checkmark or clipboard
     - Text: "No pending approvals. All caught up! ✅"

3. **DESIGN REQUIREMENTS**
   - Match the existing Admin Dashboard styling.
   - Use the same card/panel design already in the dashboard.
   - Buttons should have hover effects.
   - Make it responsive for mobile screens.

4. **VERIFICATION**
   - Check the console for any errors.
   - You should see 3 pending agencies when the page loads.
   - Clicking "Approve" should show the generated credentials and remove from list.
   - Clicking "Reject" should remove the agency from the list.
```

---

## 📡 Backend API Reference (Already Working!)

| Action | Method | Endpoint | Returns |
|--------|--------|----------|---------|
| Get Pending | `GET` | `http://localhost:5000/api/admin/agencies?status=Pending` | Array of pending agencies |
| Approve | `PUT` | `http://localhost:5000/api/admin/agencies/:_id/approve` | `{ agency, agentCredentials }` |
| Reject | `PUT` | `http://localhost:5000/api/admin/agencies/:_id/reject` | `{ agency }` |

**Important:** Use `agency._id` (MongoDB's auto-generated ID) in the URL, NOT `agency.id`.

---

## 📋 Test Data Available

These 3 agencies are pending in the database:

| Agency Name | Email |
|-------------|-------|
| Island Careers Link | support@islandcareers.mv |
| Paradise Resort Staffing | hr@paradiseresort.com |
| Azure Talent Partners | contact@azuretalent.com |

---

## ✅ Final Check

After Antigravity finishes:

1. Log in as **Admin**.
2. Go to the **Admin Dashboard**.
3. Look for the **"Pending Agency Approvals"** section.
4. You should see **3 pending agencies**.
5. Click **Approve** on one → You should see credentials displayed → Agency removed from list.
6. Click **Reject** on another → Agency removed from list.
7. Approve all remaining → "All caught up!" message should appear.

**If everything works, you are done! 🎉**

---

## ⏰ Estimated Time: 45-60 minutes

---

## 🆘 Need Help?

If Antigravity shows errors:
1. Make sure the backend server is running (`npm start` in the server folder).
2. Check browser console (F12) for error messages.
3. Share the error with Rithik!
