# 📋 Profile Page Task (For Jyoti)

**Hi Jyoti! 👋**
Your task is to build the **User Profile Page**. Candidates (and other users) need to see and edit their details. Rithik has added the new API endpoints for you!

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I need to implement the User Profile Page with View and Edit modes.

1. **FILE TO EDIT:** `src/pages/ProfilePage.jsx`

2. **TASK: PROFILE VIEW & EDIT**
   - **Goal:** Allow users to view their details and update them.
   - **Fetch Data:**
     - On mount, `GET /api/profile/${user.id}`.
     - Store in state: `profileData`.

   - **UI Implementation:**
     - **Header:** "My Profile" with an "Edit" button (pencil icon).
     - **Read-Only Mode (Default):**
       - Display: Full Name, Email, Contact Number.
       - If Candidate: Show `Skills` (as tags) and `Experience (Years)`.
     - **Edit Mode (When "Edit" clicked):**
       - Turn text fields into Inputs.
       - "Edit" button changes to "Save" and "Cancel".
       - **Action:** Clicking "Save" triggers `PUT /api/profile/${user.id}` with updated data.
   
   - **Validation:**
     - Ensure Contact Number is distinct (e.g., must be digits).
     - Ensure Experience is a number.

3. **VERIFICATION**
   - Log in as a Candidate.
   - Go to Profile.
   - Click Edit, change "Experience" or "Contact", and Click Save.
   - Refresh the page to make sure changes persisted.
```

---

## ✅ Final Check

After Antigravity finishes:
1.  Log in as a **Candidate**.
2.  Go to `/profile`.
3.  Click **Edit**, adds some skills (e.g., "Swimming", "Cooking"), and **Save**.
4.  Reload the page. If the skills are still there, it works!

**If you can save your profile, you are done! 🎉**
