# Supabase Email OTP Configuration Guide

## 1. How to Change "Magic Link" to "OTP Code"
You asked: *"where is the option to change to otp?"*

**Answer:** It is hidden inside the **"Confirm sign up"** template.

### Step-by-Step (Look at your 2nd Screenshot):
1.  Go to **Authentication** -> **Email** (where you took the screenshot).
2.  Look at the list under "Authentication" (in the middle of the screen).
3.  Click on the first item: **"Confirm sign up"**.
4.  In the "User Verification" or "Message Body" section, delete the default HTML.
5.  Paste this code instead:
    ```html
    <h2>Your Verification Code</h2>
    <p>Please enter this code to verify your account:</p>
    <h1>{{ .Token }}</h1>
    ```
6.  **Crucial:** Make sure you use `{{ .Token }}`. 
    *   If you use `{{ .ConfirmationURL }}`, it sends a link.
    *   If you use `{{ .Token }}`, it sends a code.
7.  Click **Save**.

## 2. Important Setting: OTP Length
Your screenshot shows the length is **8**.
*   **Problem:** Our app has 6 boxes for the code.
*   **Fix:** In the same Email Settings page, scroll down to **"Email OTP Length"** and change it to **6**.

## 3. Email Limits (Free Tier)
You asked: *"is it unlimited emails?"*

**Answer: NO.**
*   The free "built-in" email service is for **testing only**.
*   **Limit:** You can send about **3 emails per hour** to the same address.
*   **Total Limit:** You cannot send thousands of emails. It is capped to prevent spam.

**How to get Unlimited Emails?**
*   You must set up a **Custom SMTP**.
*   This connects Supabase to a real email provider like **Resend (Recommended)**, SendGrid, or AWS SES.
*   Resend has a generous free tier (3,000 emails/month) and is easy to set up.
