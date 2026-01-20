# 📋 Candidate App Task (For Jennita)

**Hi Jennita! 👋**
Your task is to connect the **Candidate Login** and **Sign Up** pages to our database.
I have prepared a single "Magic Prompt" that you can paste into Antigravity. It will handle everything for you.

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I need your help to fully implement the Candidate Login and Signup flow.

Please follow these instructions exactly:

1. **ENVIRONMENT CHECK:**
   - Please verify if the backend server is running on port 5000.
   - If it is NOT running, please open a terminal in the `server/` directory and run `npm start`.
   - Wait for "Mongoose connected" before proceeding.

2. **FILE TO EDIT:** `src/pages/CandidateLoginPage.jsx`

3. **DATABASE CONTEXT:**
   - **CRITICAL:** We use a MongoDB collection named `profiles` for ALL users.
   - Do not create any new collections. All data goes to `profiles`.

4. **TASK A: LOGIN LOGIC**
   - The `handleLoginSubmit` function should send credentials to: `POST http://localhost:5000/api/auth/login`
   - **Body:** `{ email, password, role: 'CANDIDATE' }`
   - If success: Redirect to `/dashboard`.
   - If error: Alert "Invalid email or password."

5. **TASK B: SIGN UP LOGIC (Replace old code)**
   - Replace the current OTP/Stepped signup with a standard form (Name, Email, Password, Phone).
   - On "Create Profile" click, send to: `POST http://localhost:5000/api/auth/register`
   - **Body:**
     { 
       "name": "User Name", 
       "email": "user@email.com", 
       "password": "userpassword", 
       "phone": "userphone",
       "role": "CANDIDATE", // HARDCODED
       "skills": []
     }
   - Remove any old verify/OTP functions.
   - On Success: Alert "Account created!" and switch to Login mode.

Please implement these changes now.
```

---

## ✅ Final Check

After Antigravity finishes:
1.  Go to the **Candidate Login Page**.
2.  Try to **Sign Up** as a new user.
3.  If it says "Account created", try to **Log In**.

**If you get to the Dashboard, you are done! 🎉**
