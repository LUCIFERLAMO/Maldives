# 📋 Agent Login Task (For Jyoti)

**Hi Jyoti! 👋**
Your task today is to update the **Agent Login Page** to handle **first-time login with password change**. When an admin approves an agency, the agent receives a temporary password. On their first login, they MUST change this password before accessing the dashboard!

---

## ✅ Backend is READY!

Rithik has already created all the APIs you need. The login API now returns `requiresPasswordChange: true` for first-time agents.

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I need to update the Agent Login Page to handle first-time logins with mandatory password change.

1. **FILE TO EDIT:** `src/pages/AgentLoginPage.jsx`

2. **TASK: IMPLEMENT FIRST LOGIN + PASSWORD CHANGE FLOW**

   **Part A: Add New State Variables**
   - Add these states at the top of your component:
     ```javascript
     const [showPasswordChange, setShowPasswordChange] = useState(false);
     const [newPassword, setNewPassword] = useState('');
     const [confirmNewPassword, setConfirmNewPassword] = useState('');
     const [userEmail, setUserEmail] = useState('');
     ```

   **Part B: Modify Login Response Handling**
   - After a successful login API call, check the response for `requiresPasswordChange`
   - If `data.requiresPasswordChange === true`:
     - Store the user's email: `setUserEmail(email)`
     - Set `setShowPasswordChange(true)`
     - Do NOT navigate to dashboard yet! Do NOT call login() from AuthContext!
   - If `data.requiresPasswordChange` is false or not present:
     - Proceed with normal login flow (call login() and navigate to `/recruiter`)

   **Part C: Create Password Change Form**
   - Use conditional rendering: `{showPasswordChange ? (PasswordChangeForm) : (LoginForm)}`
   - When `showPasswordChange` is true, display a NEW form instead of the login form:
     - **Title:** "Welcome! Please Set Your New Password"
     - **Subtitle:** "For security, you must change your temporary password."
     - **Fields:**
       - New Password (password input with visibility toggle)
       - Confirm New Password (password input with visibility toggle)
     - **Button:** "Set New Password & Continue"
   
   **Part D: Password Change Submission**
   - Create `handlePasswordChange` async function
   - On form submit, validate:
     - New password is at least 8 characters
     - New password matches confirm password
     - Show error if validation fails
   - Call API: `PUT http://localhost:5000/api/auth/change-password`
     - Body: `{ email: userEmail, newPassword: newPassword }`
   - On success (status 200):
     - Show success toast/message: "Password updated successfully!"
     - Navigate to `/recruiter` dashboard using `navigate('/recruiter')`
   - On error:
     - Show error message from API response

   **Part E: Styling**
   - The password change form should look consistent with the existing login form
   - Use the same card/container styling and colors
   - Add a lock icon (🔒) near the title for visual cue
   - Keep the same background and layout
   - Make the form mobile-responsive

3. **VERIFICATION**
   - First, ask Rakshita to approve a pending agency to get test credentials
   - Test login with the temporary password → Password change form should appear
   - Set new password → Should redirect to agent dashboard
   - Log out and log back in with new password → Should go directly to dashboard
```

---

## 🔄 How The Flow Works

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT LOGIN FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Agent enters Email + Temporary Password                    │
│                    ↓                                        │
│  POST /api/auth/login → { requiresPasswordChange: true }    │
│                    ↓                                        │
│  ┌─────────────────────────────────────────┐               │
│  │   🔒 "Welcome! Set Your New Password"   │               │
│  │   ┌───────────────────────────────┐     │               │
│  │   │ New Password: [________]      │     │               │
│  │   │ Confirm:      [________]      │     │               │
│  │   │                               │     │               │
│  │   │   [ Set New Password ]        │     │               │
│  │   └───────────────────────────────┘     │               │
│  └─────────────────────────────────────────┘               │
│                    ↓                                        │
│  PUT /api/auth/change-password → Success!                   │
│                    ↓                                        │
│  Navigate to /recruiter Dashboard                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 Backend API Reference (Already Working!)

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Login | `POST` | `http://localhost:5000/api/auth/login` | `{ email, password, role: 'AGENT' }` |
| Change Password | `PUT` | `http://localhost:5000/api/auth/change-password` | `{ email, newPassword }` |

**Login Response (First Time):**
```json
{
  "message": "Login successful",
  "user": { "_id": "...", "full_name": "Agency Name", "role": "AGENT" },
  "requiresPasswordChange": true
}
```

**Login Response (Normal - after password changed):**
```json
{
  "message": "Login successful",
  "user": { "_id": "...", "full_name": "Agency Name", "role": "AGENT" },
  "requiresPasswordChange": false
}
```

---

## 🧪 How to Get Test Credentials

1. Ask **Rakshita** to approve one of the pending agencies from her Admin Dashboard.
2. When she clicks **Approve**, she will see credentials like:
   - Email: `support@islandcareers.mv`
   - Temporary Password: `Temp@ABC123`
3. Use these credentials to test your first-login flow!

---

## ✅ Final Check

After Antigravity finishes:

1. **Test First-Time Login:**
   - Get credentials from Rakshita (after she approves an agency).
   - Enter email + temporary password → Click Login.
   - You should see the **"Set Your New Password"** form (NOT the dashboard!).
   - Enter a new password (8+ characters) + confirm it.
   - Click "Set New Password" → Should redirect to Agent Dashboard.

2. **Test Normal Login:**
   - Log out and log back in with the **NEW** password.
   - You should go **DIRECTLY** to the dashboard (no password change form).

3. **Test Validation:**
   - Try passwords that don't match → Error should appear.
   - Try password less than 8 characters → Error should appear.

**If all tests pass, you are done! 🎉**

---

## ⏰ Estimated Time: 45-60 minutes

---

## 🆘 Need Help?

If something doesn't work:
1. Make sure backend server is running (`npm start` in the server folder).
2. Make sure Rakshita has approved an agency first (you need those credentials!).
3. Check browser console (F12) for error messages.
4. Share the error with Rithik!
