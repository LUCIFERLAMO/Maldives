# 📋 Agent App Task (For Jyoti)

**Hi Jyoti! 👋**
Your task today is to polish the **Agent Registration** and ensure the **Profile Page** looks great for Agents.

I have prepared a single "Magic Prompt" that you can paste into Antigravity. It will handle the code changes for you.

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I'm working on the Agent flow for Day 3.

Please help me with the following tasks:

1. **ENVIRONMENT CHECK:**
   - Verify the backend is running on port 5000.
   - Ensure the database is connected.

2. **TASK A: AGENT REGISTRATION (`src/pages/AgentRegistrationPage.jsx`)**
   - Review the current `handleSubmit` function.
   - VALIDATION: Ensure `agencyName` and `phone` are mandatory.
   - API CALL: Confirm it posts to `http://localhost:5000/api/auth/register` with:
     ```json
     {
       "role": "AGENT",
       "agencyName": "...", // From form
       "contact": "...",    // From form
       "name": "...", 
       "email": "...", 
       "password": "..."
     }
     ```
   - FEEDBACK: On success, ensure the "Registration Successful" modal appears clearly.
   - ERROR HANDLING: If the API returns a 400 or 500 error, show a readable alert to the user.

3. **TASK B: AGENT PROFILE (`src/pages/ProfilePage.jsx`)**
   - Detect if `user.role === 'AGENT'`.
   - If true, display an **"Agency Details"** section in the profile.
   - Show fields: **Agency Name**, **Contact Number**, and **status** (e.g., "Pending Approval" or "Active").
   - You can fetch this info from the `user` object context.

Please apply these changes now!
```

---

## ✅ Final Check

After Antigravity finishes:
1.  Go to **/register/agent**.
2.  Fill out the form and submit.
3.  Check if you get the Success Modal.
4.  Log in with that new account.
5.  Go to **/profile** and verify you can see your Agency Name.

**If that works, you are done! 🎉**
