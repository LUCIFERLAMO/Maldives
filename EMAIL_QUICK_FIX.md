# ⚡ Email Not Working? Quick Fix Guide

## 🎯 **Most Common Issues (90% of cases)**

### **1. Gmail Users - Using Wrong Password**
❌ **Problem:** Using regular Gmail password  
✅ **Solution:** Use **App Password** instead

**How to get App Password:**
1. Google Account → Security → 2-Step Verification (enable it)
2. App Passwords → Generate → Name it "Supabase"
3. Copy the 16-character password (no spaces!)
4. Use this in Supabase SMTP settings

---

### **2. Emails in Spam Folder**
❌ **Problem:** Emails sent but not in inbox  
✅ **Solution:** Check spam/junk folder

**Fix:**
- Check spam folder
- Mark as "Not Spam"
- Add sender to contacts

---

### **3. Wrong SMTP Settings**
❌ **Problem:** Connection errors  
✅ **Solution:** Verify settings

**Gmail Settings:**
```
Host: smtp.gmail.com
Port: 587
User: your-email@gmail.com
Password: [16-char App Password]
```

**SendGrid Settings:**
```
Host: smtp.sendgrid.net
Port: 587
User: apikey
Password: [Your SendGrid API Key]
```

---

## ✅ **5-Minute Fix Checklist**

- [ ] **Gmail?** → Using App Password (not regular password)
- [ ] **Checked spam folder?**
- [ ] **SMTP test email works?** (Dashboard → Settings → Auth → Send Test)
- [ ] **Host/Port correct?** (587 for TLS, 465 for SSL)
- [ ] **No extra spaces in password?**
- [ ] **Sender email matches SMTP account?**

---

## 🧪 **Test Your Setup**

1. Go to **Supabase Dashboard** → **Settings** → **Auth** → **SMTP Settings**
2. Click **"Send Test Email"**
3. Enter your email
4. Click **"Send"**
5. Check inbox (and spam!)

**If test email works:** Your SMTP is configured correctly ✅  
**If test email fails:** Check error message and follow troubleshooting guide

---

## 🆘 **Still Not Working?**

1. Check **Supabase Logs** → Look for SMTP errors
2. Try **different email provider** (SendGrid, Mailgun)
3. Check **Supabase Status** page for service issues
4. Read full guide: `SUPABASE_EMAIL_TROUBLESHOOTING.md`

---

**Most likely fix: Use Gmail App Password instead of regular password! 🔑**
