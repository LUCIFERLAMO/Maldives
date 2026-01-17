# 📧 Supabase Email/SMTP Troubleshooting Guide

## 🔍 **Problem: Not Receiving Emails from Supabase**

If you've configured SMTP in Supabase but emails aren't being delivered, follow this troubleshooting guide step-by-step.

---

## ✅ **Step 1: Verify SMTP Configuration**

### **Check Your SMTP Settings**

1. Go to **Supabase Dashboard** → **Settings** → **Auth** → **SMTP Settings**
2. Verify these fields are filled correctly:

```
SMTP Host: (e.g., smtp.gmail.com, smtp.sendgrid.net)
SMTP Port: (usually 587 for TLS or 465 for SSL)
SMTP User: (your email address)
SMTP Password: (app-specific password, NOT your regular password)
Sender Email: (email address that will send emails)
Sender Name: (display name for emails)
```

### **Common SMTP Providers:**

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- User: Your Gmail address
- Password: **App Password** (NOT your regular password - see Step 2)

**SendGrid:**
- Host: `smtp.sendgrid.net`
- Port: `587`
- User: `apikey`
- Password: Your SendGrid API key

**Mailgun:**
- Host: `smtp.mailgun.org`
- Port: `587`
- User: Your Mailgun SMTP username
- Password: Your Mailgun SMTP password

**Outlook/Office365:**
- Host: `smtp.office365.com`
- Port: `587`
- User: Your Outlook email
- Password: Your Outlook password

---

## 🔑 **Step 2: Gmail App Password Setup (If Using Gmail)**

If you're using Gmail, you **MUST** use an App Password, not your regular password.

### **How to Create Gmail App Password:**

1. Go to your **Google Account** → **Security**
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords** (search for it)
4. Select **Mail** and **Other (Custom name)**
5. Enter name: `Supabase`
6. Click **Generate**
7. **Copy the 16-character password** (no spaces)
8. Use this password in Supabase SMTP settings

**⚠️ Important:** 
- Don't use your regular Gmail password
- App passwords are 16 characters with no spaces
- If you see spaces, remove them

---

## 🧪 **Step 3: Test SMTP Connection**

### **Test in Supabase Dashboard:**

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Click **"Send Test Email"** button
3. Enter your email address
4. Click **"Send"**
5. Check if you receive the test email

### **Check Supabase Logs:**

1. Go to **Logs** → **Postgres Logs** or **API Logs**
2. Look for SMTP-related errors
3. Common errors:
   - `535 Authentication failed` → Wrong password
   - `Connection timeout` → Wrong host/port
   - `550 Relaying denied` → SMTP server issue

---

## 🔧 **Step 4: Common Issues & Solutions**

### **Issue 1: "Authentication Failed" Error**

**Symptoms:**
- Error: `535 Authentication failed`
- Email not sending

**Solutions:**
- ✅ Verify you're using **App Password** (for Gmail), not regular password
- ✅ Check username/email is correct
- ✅ Ensure password has no extra spaces
- ✅ Try regenerating app password
- ✅ For Gmail, make sure 2-Step Verification is enabled

---

### **Issue 2: "Connection Timeout"**

**Symptoms:**
- Error: `Connection timeout` or `Connection refused`
- Can't connect to SMTP server

**Solutions:**
- ✅ Verify SMTP host is correct (check provider's documentation)
- ✅ Check port number (587 for TLS, 465 for SSL)
- ✅ Try different port if one doesn't work
- ✅ Check firewall/network isn't blocking port
- ✅ Verify SMTP server is accessible

---

### **Issue 3: Emails Going to Spam**

**Symptoms:**
- Emails sent but in spam folder
- Not appearing in inbox

**Solutions:**
- ✅ Check spam/junk folder
- ✅ Mark as "Not Spam" if found
- ✅ Add sender email to contacts
- ✅ Verify SPF/DKIM records (for custom domains)
- ✅ Use reputable SMTP provider (SendGrid, Mailgun)

---

### **Issue 4: "Relaying Denied" Error**

**Symptoms:**
- Error: `550 Relaying denied`
- SMTP server rejecting emails

**Solutions:**
- ✅ Verify sender email matches SMTP account
- ✅ Check if SMTP provider requires verified sender
- ✅ Some providers need domain verification
- ✅ Contact SMTP provider support

---

### **Issue 5: No Error, But No Email**

**Symptoms:**
- No errors in logs
- Email appears to send
- But never received

**Solutions:**
- ✅ Check spam folder
- ✅ Verify recipient email is correct
- ✅ Test with different email address
- ✅ Check Supabase logs for delivery status
- ✅ Verify SMTP test email works
- ✅ Check email provider's delivery logs (if available)

---

## 📝 **Step 5: Verify Supabase Auth Email Settings**

### **Check Email Templates:**

1. Go to **Settings** → **Auth** → **Email Templates**
2. Verify templates are configured:
   - **Confirm signup** (for email verification)
   - **Magic Link** (if using magic links)
   - **Change Email Address**
   - **Reset Password**

### **Check Auth Settings:**

1. Go to **Settings** → **Auth**
2. Verify:
   - ✅ **Enable email confirmations** (if needed)
   - ✅ **Enable email change** (if needed)
   - ✅ **Site URL** is correct
   - ✅ **Redirect URLs** are configured

---

## 🧪 **Step 6: Test Email Sending from Code**

### **Test Email Function:**

Create a test function to verify email sending:

```javascript
// Test email sending
async function testEmail() {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'your-test-email@example.com',
    options: {
      emailRedirectTo: 'https://your-site.com'
    }
  });

  if (error) {
    console.error('Email error:', error);
  } else {
    console.log('Email sent successfully!');
  }
}
```

### **Check Supabase Dashboard:**

1. Go to **Authentication** → **Users**
2. Check if user was created
3. Check email verification status
4. Look for email sending attempts in logs

---

## 🔍 **Step 7: Debugging Checklist**

Use this checklist to systematically debug:

- [ ] SMTP host is correct
- [ ] SMTP port is correct (587 or 465)
- [ ] SMTP username/email is correct
- [ ] SMTP password is correct (App Password for Gmail)
- [ ] Sender email matches SMTP account
- [ ] Test email works in Supabase dashboard
- [ ] Checked spam/junk folder
- [ ] Verified recipient email is correct
- [ ] Checked Supabase logs for errors
- [ ] Tried different email provider
- [ ] Verified network/firewall isn't blocking
- [ ] Email templates are configured
- [ ] Auth settings are correct

---

## 🚀 **Step 8: Alternative Solutions**

### **Option 1: Use Supabase Built-in Email (Recommended for Testing)**

Supabase has built-in email service (limited but works for testing):

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. **Disable custom SMTP** temporarily
3. Use Supabase's default email service
4. Test if emails work
5. If yes, issue is with your SMTP config
6. If no, issue is elsewhere

### **Option 2: Use Third-Party Email Service**

Consider using dedicated email services:

**SendGrid (Recommended):**
- Free tier: 100 emails/day
- Easy setup
- Good deliverability
- Reliable

**Mailgun:**
- Free tier: 5,000 emails/month
- Good for production
- API-based

**Resend:**
- Modern email API
- Good developer experience
- Free tier available

### **Option 3: Use Supabase Edge Functions**

Create an Edge Function to send emails via API:

```javascript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { to, subject, body } = await req.json()

  // Use Resend, SendGrid, or other email API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_API_KEY`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'your-email@domain.com',
      to: [to],
      subject: subject,
      html: body,
    }),
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

## 📋 **Step 9: Gmail-Specific Troubleshooting**

### **If Using Gmail:**

1. **Enable Less Secure Apps** (if using regular password):
   - ⚠️ Not recommended - use App Password instead

2. **Use App Password** (Recommended):
   - Enable 2-Step Verification
   - Generate App Password
   - Use 16-character password (no spaces)

3. **Check Gmail Settings:**
   - Go to Gmail → Settings → Forwarding and POP/IMAP
   - Enable IMAP if needed
   - Check if account is locked

4. **Gmail SMTP Settings:**
   ```
   Host: smtp.gmail.com
   Port: 587 (TLS) or 465 (SSL)
   Username: your-email@gmail.com
   Password: [16-character App Password]
   ```

---

## 🔐 **Step 10: Security Best Practices**

### **For Production:**

1. **Don't use personal Gmail** for production
2. **Use dedicated email service** (SendGrid, Mailgun)
3. **Set up SPF/DKIM records** for custom domains
4. **Use environment variables** for SMTP credentials
5. **Monitor email delivery** rates
6. **Set up email bounces** handling

---

## 📞 **Step 11: Get Help**

### **If Still Not Working:**

1. **Check Supabase Status:**
   - Go to https://status.supabase.com
   - Check if there are any email service issues

2. **Supabase Support:**
   - Go to Supabase Dashboard → Support
   - Create a ticket with:
     - SMTP provider you're using
     - Error messages from logs
     - Steps you've tried

3. **Community:**
   - Supabase Discord: https://discord.supabase.com
   - Supabase GitHub Discussions
   - Stack Overflow (tag: supabase)

---

## ✅ **Quick Fix Checklist**

Run through this quickly:

1. ✅ Using Gmail? → Use **App Password**, not regular password
2. ✅ Checked **spam folder**?
3. ✅ SMTP **test email** works in dashboard?
4. ✅ Verified **host/port** are correct?
5. ✅ Checked **Supabase logs** for errors?
6. ✅ Tried **different email** address?
7. ✅ Verified **sender email** matches SMTP account?

---

## 🎯 **Most Common Solution**

**90% of issues are:**

1. **Gmail users using regular password instead of App Password**
   - **Fix:** Generate App Password and use that

2. **Emails going to spam**
   - **Fix:** Check spam folder, mark as not spam

3. **Wrong SMTP host/port**
   - **Fix:** Verify with provider's documentation

---

## 📝 **Testing Template**

Use this to test your setup:

```javascript
// Test SMTP Configuration
async function testSMTP() {
  console.log('Testing SMTP...');
  
  // Test 1: Send OTP email
  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'test@example.com'
  });
  
  if (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
  
  console.log('✅ Email sent! Check inbox.');
  return true;
}
```

---

## 🎉 **Success Indicators**

You'll know it's working when:

- ✅ Test email arrives in inbox (not spam)
- ✅ No errors in Supabase logs
- ✅ User receives verification emails
- ✅ Password reset emails work
- ✅ Magic link emails work

---

**Good luck! 🚀 Most email issues are SMTP configuration problems. Double-check your credentials!**
