# 📋 Agent App Task (For Jyoti)

**Hi Jyoti! 👋**
Your task is to fix the **Agent Login** and **Registration** pages.
I have prepared two prompts for you. Just paste them one by one into Antigravity.

---

## 🤖 Prompt 1: Fix Login (Copy & Paste)

Copy this **entire text box** and paste it into Antigravity.

```text
Hi Antigravity! I need to fix the Agent Login page.

1. **ENVIRONMENT CHECK:**
   - Check if the backend server is running (port 5000). If not, please run `npm start` in the `server/` folder.

2. **FILE TO EDIT:** `src/pages/AgentLoginPage.jsx`

3. **CONTEXT:**
   - **CRITICAL:** All users (including Agents) are stored in the `profiles` MongoDB collection.
   - The Login API checks this `profiles` collection.

4. **THE FIX:**
   - Currently, the page uses a default login function that sends `role: 'CANDIDATE'`. This is wrong for me.
   - Please rewrite `handleLoginSubmit` to use `fetch` directly.
   - **Endpoint:** `POST http://localhost:5000/api/auth/login`
   - **Body:**
     {
       "email": formData.email,
       "password": formData.password,
       "role": "AGENT"  // <--- MUST BE HARDCODED AS 'AGENT'
     }
   - **On Success:** Save user to localStorage and navigate to `/recruiter`.
   - **On Error:** Alert "Invalid email or password."

Please implement this fix.
```

---

## 🤖 Prompt 2: Fix Registration (Copy & Paste)

Once Login is fixed, paste this **second prompt** to fix Registration.

```text
Hi Antigravity! Now I need to duplicate the success by fixing the Agent Registration page.

1. **FILE TO EDIT:** `src/pages/AgentRegistrationPage.jsx`

2. **DATABASE RULE:**
   - **CRITICAL:** All new agents must be saved to the `profiles` collection.
   - Do NOT create an `agents` collection. Use `profiles`.

3. **THE TASK:**
   - Simplify the form to a single step.
   - Remove: File Uploads, OTP, Region Field, Preview Mode.
   - Keep: Name, Email, Password, Phone, Company Name.

4. **SUBMISSION LOGIC:**
   - Send to: `POST http://localhost:5000/api/auth/register`
   - **Body:**
     {
       "name": formData.fullName,
       "email": formData.workEmail,
       "password": formData.password,
       "role": "AGENT",               // HARDCODED
       "agencyName": formData.companyName,
       "contact": formData.phone
     }
   - **On Success:** Alert "Account Created! Please Login." and go to `/agent-login`.

Please rewrite the page with these simple rules.
```

---

## ✅ Final Check

After Antigravity finishes:
1.  Go to the **Agent Registration** page.
2.  Register a new agent (e.g., `jyoti@agency.com`).
3.  If successful, try to **Login** with those details.

**If you enter the Recruiter Dashboard, you are done! 🎉**
