# How to Use Your Personal Gmail for Unlimited Emails

Yes! You can absolutely use your personal Gmail account (e.g., `yourname@gmail.com`) to send emails for the app testing.

## Why are we doing this?
Supabase's free email service only allows ~3 emails/hour. By connecting your Gmail, you bypass this limit and can send unlimited OTP codes for testing.

## Step-by-Step Configuration

### 1. Generate an "App Password" (CRITICAL)
**You cannot use your normal Gmail login password.** You must generate a special security code.

1.  Login to your **Personal Gmail** account.
2.  Go to **[Manage your Google Account](https://myaccount.google.com/)**.
3.  Click **Security** (on the left sidebar).
4.  Enable **2-Step Verification** (if it's not already on).
    *   *Google requires this to be ON to generate App Passwords.*
5.  After enabling 2FA, go back to the Security page.
6.  Search or look for **"App passwords"**.
    *   *Note: If you don't see it, search "App passwords" in the top search bar.*
7.  Create a new App Password:
    *   **App name:** "Supabase Test"
    *   Click **Create**.
8.  **COPY the 16-character code** (it looks like `abcd efgh ijkl mnop`). This is your **SMTP Password**.

### 2. Enter Settings in Supabase
Go to the **Custom SMTP** screen in Supabase and fill it in exactly like this:

*   **Sender email:** `your.personal.email@gmail.com` (Enter your actual Gmail)
*   **Sender name:** `My App Test` (Or whatever you want users to see)
*   **Host:** `smtp.gmail.com`
*   **Port number:** `465` (Important: Do not change this)
*   **Minimum interval:** `60`
*   **Username:** `your.personal.email@gmail.com` (Same as sender email)
*   **Password:** `[PASTE THE 16-CHARACTER APP PASSWORD HERE]`

### 3. Save
Click **Save**.

## Testing
Once saved, try signing up again in the app.
*   The email you receive will now come **from your personal Gmail**.
*   You will be able to sign up as many times as you want without hitting the "3 per hour" limit.
