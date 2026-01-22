# 📋 Candidate App Task (For Jennita)

**Hi Jennita! 👋**
Your task today is to create a welcoming **Empty State** for the Candidate Dashboard. When a new candidate joins, they won't have any applications yet, so we need to show them something nice!

---

## 🤖 The Magic Prompt (Copy & Paste)

Copy the **entire text box** below and paste it into the Antigravity chat.

```text
Hi Antigravity! I need to update the Candidate Dashboard for new users.

1. **FILE TO EDIT:** `src/pages/CandidateDashboard.jsx`

2. **TASK: IMPLEMENT EMPTY STATE**
   - In the `CandidateDashboard` component, check if `applications.length === 0`.
   - **IF EMPTY:** 
     - Hide the normal dashboard sections (Stats, Recent Applications).
     - Display a beautiful "Get Started" card/section.
     - **Design:**
       - Use an inviting icon (like a Search or Briefcase).
       - Title: "Start Your Journey in the Maldives"
       - Subtitle: "You haven't applied to any jobs yet. Browse our exclusive listings to find your dream role."
       - **Call to Action Button:** A big, visible button that links to `/jobs` (Find Jobs).
   - **IF NOT EMPTY:** 
     - Show the existing dashboard exactly as it is now.

3. **VERIFICATION**
   - Ensure the new section is responsive (looks good on mobile).
```

---

## ✅ Final Check

After Antigravity finishes:
1.  Log in as a **new candidate** (or sign up a fresh one).
2.  Go to the **Dashboard**.
3.  You should see the new "Start Your Journey" section instead of the empty stats.
4.  Click the button to make sure it takes you to the Jobs page.

**If that works, you are done! 🎉**
