# 📧 Contact Us Feature - Implementation Guide

## 🎉 Status: Frontend COMPLETE ✅ | Backend READY 📋

---

## 📌 Quick Navigation

- **I'm a frontend developer:** Jump to [Frontend Overview](#frontend-overview)
- **I'm a backend developer:** Jump to [Backend Implementation](#backend-implementation-guide)
- **I need to set up email:** Jump to [Email Configuration](#email-configuration)
- **I want a quick start:** Jump to [Quick Start (15 min)](#quick-start-15-minutes)
- **I need full details:** Jump to [Complete Documentation](#complete-documentation)

---

## 🎨 Frontend Overview

### What's New on Contact Us Page?

```
┌─────────────────────────────────────────────────────┐
│          🎨 HERO SECTION (Gradient)                │
│    "Get In Touch" - Modern title with description  │
└─────────────────────────────────────────────────────┘
         ↓
┌────────────────────┬────────────────────────────────┐
│  CONTACT FORM      │    CONTACT INFO CARDS          │
│  ┌──────────────┐  │  ┌──────┐  ┌──────┐  ┌──────┐ │
│  │ Name*        │  │  │ 📧   │  │ 📱   │  │ 📍   │ │
│  ├──────────────┤  │  │Email │  │Phone │  │Addr  │ │
│  │ Email*       │  │  └──────┘  └──────┘  └──────┘ │
│  ├──────────────┤  │  ┌──────────────────────────┐  │
│  │ Phone        │  │  │ ⏱️ Response Time Card    │  │
│  ├──────────────┤  │  │ We respond within 24hrs │  │
│  │ Subject*     │  │  └──────────────────────────┘  │
│  ├──────────────┤  └────────────────────────────────┘
│  │ Message*     │
│  │ (min 10)     │
│  ├──────────────┤
│  │ [Send] Btn   │
│  └──────────────┘
└────────────────────┴────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────┐
│              📚 FAQ SECTION                          │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │ Q: Shipping?     │  │ Q: Returns?      │         │
│  │ A: 5-7 days      │  │ A: 30-day policy │         │
│  └──────────────────┘  └──────────────────┘         │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │ Q: Authentic?    │  │ Q: Track Order?  │         │
│  │ A: 100% genuine  │  │ A: Yes, email    │         │
│  └──────────────────┘  └──────────────────┘         │
└──────────────────────────────────────────────────────┘
```

### Key Features
✅ **Form Validation** - Real-time error messages
✅ **Modern Design** - Gradients and animations
✅ **Responsive** - Works on mobile, tablet, desktop
✅ **State Management** - React hooks
✅ **Email Ready** - Posts to `/api/contact` endpoint
✅ **User Feedback** - Loading states and notifications
✅ **Accessibility** - Proper labels and ARIA attributes

---

## 🚀 Quick Start (15 minutes)

### For Backend Developers

**Step 1: Install Package**
```bash
npm install nodemailer express-rate-limit
```

**Step 2: Add .env File**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@almora.com
ADMIN_EMAIL=admin@almora.com
```

**Step 3: Create Email Service**
```javascript
// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.sendContactEmail = async (contactData) => {
  // Send confirmation to user
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: contactData.email,
    subject: `Thank you for contacting us: ${contactData.subject}`,
    html: `<h2>Hello ${contactData.name}!</h2>
           <p>We have received your message and will respond soon.</p>
           <p>Reference: ${contactData.contactId}</p>`
  });

  // Send notification to admin
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `New contact: ${contactData.subject}`,
    html: `<p><strong>From:</strong> ${contactData.name}</p>
           <p><strong>Email:</strong> ${contactData.email}</p>
           <p><strong>Message:</strong> ${contactData.message}</p>`
  });
};
```

**Step 4: Create API Route**
```javascript
// routes/contact.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendContactEmail } = require('../services/emailService');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

router.post('/', limiter, async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Validation
    if (!name || !email || !subject || !message || message.length < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Please fill all required fields'
      });
    }

    const contactId = 'web-' + Date.now();

    // Send emails
    await sendContactEmail({ name, email, subject, message, phone, contactId });

    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully',
      contactId
    });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message'
    });
  }
});

module.exports = router;
```

**Step 5: Register Route**
```javascript
// server.js
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);
```

**Step 6: Test**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message"
  }'
```

✅ **Done! 15 minutes to working contact form**

---

## 📧 Email Configuration

### Gmail Setup (Recommended for Testing)

1. Go to: https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Use in `SMTP_PASSWORD`

```
SMTP Settings:
- Host: smtp.gmail.com
- Port: 587
- Secure: false
- User: your-email@gmail.com
- Password: 16-character app password
```

### SendGrid Alternative

```
npm install @sendgrid/mail

SENDGRID_API_KEY=your-api-key
SENDGRID_FROM_EMAIL=noreply@almora.com
```

---

## 🔧 Backend Implementation Guide

### Full Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| `QUICK_BACKEND_SETUP.md` | 15-min implementation | 10 min ⭐ START HERE |
| `CONTACT_BACKEND_SETUP.md` | Comprehensive guide | 30 min |
| `CONTACT_IMPLEMENTATION_CHECKLIST.md` | Verification checklist | 5 min |

### What Needs to Be Implemented

```
Your Backend Must Handle:

1. POST /api/contact endpoint
   ↓
2. Receive form data:
   - name (required)
   - email (required, validated)
   - phone (optional)
   - subject (required)
   - message (required, min 10 chars)
   ↓
3. Send two emails:
   - Confirmation email to user
   - Notification email to admin
   ↓
4. Return success/error response
   ↓
5. Optionally store in database
```

---

## 📂 Frontend Files Modified/Created

### Modified
```
src/pages/ContactUs.jsx (Complete redesign)
├── Modern design with gradients
├── Form with validation
├── State management
├── Email submission
└── FAQ section
```

### Created
```
src/api/contactService.js
└── submitContactForm() function

QUICK_BACKEND_SETUP.md
└── 15-minute implementation guide

CONTACT_BACKEND_SETUP.md
└── Comprehensive backend guide

CONTACT_IMPLEMENTATION_CHECKLIST.md
└── Complete verification checklist

CONTACT_PAGE_SUMMARY.md
└── Status report

CONTACT_US_IMPLEMENTATION_OVERVIEW.md
└── High-level overview

CONTACT_README.md (this file)
└── Quick navigation guide
```

---

## ✅ Verification Steps

### Frontend (Already Done ✅)
- [x] Page loads without errors
- [x] Form validates correctly
- [x] Success/error messages show
- [x] Form clears after submission
- [x] Responsive on all devices
- [x] Build successful (0 errors)

### Backend (Your Turn)
- [ ] API endpoint responds
- [ ] Form data received correctly
- [ ] Validation working
- [ ] Emails sent successfully
- [ ] User gets confirmation email
- [ ] Admin gets notification email
- [ ] Error responses appropriate
- [ ] Rate limiting working

### Testing
```bash
# Test with cURL
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "subject": "Test Subject",
    "message": "This is a test message to verify setup"
  }'

# Expected Response
{
  "status": "success",
  "message": "Your message has been sent successfully",
  "contactId": "web-1701234567890"
}
```

---

## 🎯 API Specification

### Endpoint
```
POST /api/contact
```

### Request Format
```javascript
{
  "name": "John Doe",                    // Required, string
  "email": "john@example.com",           // Required, valid email
  "phone": "+91 8295756906",             // Optional, string
  "subject": "Product Inquiry",          // Required, string
  "message": "I have a question about..." // Required, min 10 chars
}
```

### Response - Success (201/200)
```javascript
{
  "status": "success",
  "message": "Your message has been received. We will contact you soon.",
  "contactId": "web-1701234567890"
}
```

### Response - Error (400/500)
```javascript
{
  "status": "error",
  "message": "Please fill all required fields correctly"
}
```

---

## 📊 Current Status

| Component | Status | Details |
|-----------|--------|---------|
| Frontend UI | ✅ Done | Modern, responsive, validated |
| Form Handling | ✅ Done | State management working |
| API Service | ✅ Done | contactService.js created |
| Backend Endpoint | 📋 Ready | Documentation provided |
| Email Service | 📋 Ready | Code examples provided |
| Database | 📋 Ready | Schema example provided |
| Testing | ⏳ Next | After backend complete |
| Deployment | ⏳ Later | Post-testing |

---

## 🆘 Troubleshooting

### Email Not Sending?
1. Check SMTP credentials in .env
2. Verify Gmail app password (if using Gmail)
3. Check email provider's activity log
4. Verify recipient email is correct
5. Check server logs for errors

### Form Not Submitting?
1. Open browser DevTools (F12)
2. Check Network tab for request
3. Verify API endpoint URL is `/api/contact`
4. Check console for JavaScript errors
5. Verify CORS allows frontend domain

### Emails in Spam?
1. Setup SPF record for domain
2. Setup DKIM record for domain
3. Setup DMARC record for domain
4. Use verified sender email
5. Add unsubscribe link in template

---

## 📚 Complete Documentation

### For Quick Reference
- `QUICK_BACKEND_SETUP.md` - Start here (15 min)
- `CONTACT_IMPLEMENTATION_CHECKLIST.md` - Checklist

### For Detailed Information
- `CONTACT_BACKEND_SETUP.md` - Complete guide
- `CONTACT_PAGE_SUMMARY.md` - Status report
- `CONTACT_US_IMPLEMENTATION_OVERVIEW.md` - Overview

---

## 🚀 Timeline

| Phase | Status | Duration | Owner |
|-------|--------|----------|-------|
| Frontend | ✅ Complete | 2 hours | Frontend Team |
| Backend Setup | 📋 Ready | 15 min | Backend Team |
| Email Service | 📋 Ready | 30 min | Backend Team |
| Testing | ⏳ Pending | 30 min | QA Team |
| Deployment | ⏳ Pending | 1 hour | DevOps |

**Total Time: 3-4 hours**

---

## 💡 Pro Tips

1. **Start with Gmail** - Fastest to setup for testing
2. **Use Nodemailer** - Works with any SMTP provider
3. **Test early** - Use cURL before integrating with frontend
4. **Add logging** - Track all contact submissions
5. **Monitor emails** - Check spam folder initially
6. **Use environment variables** - Never hardcode credentials
7. **Rate limit** - Prevent spam (5 per 15 min recommended)
8. **Store data** - Keep contact messages in database

---

## ✨ Success Criteria

✅ Contact form submits from frontend
✅ User receives confirmation email
✅ Admin receives notification email
✅ Form data saved to database (optional)
✅ Rate limiting prevents spam
✅ Error handling user-friendly
✅ End-to-end testing passes
✅ Ready for production

---

## 📞 Need Help?

1. Read `QUICK_BACKEND_SETUP.md` (answers 80% of questions)
2. Check troubleshooting section above
3. Review detailed guide: `CONTACT_BACKEND_SETUP.md`
4. Check browser console for errors
5. Review server logs for backend errors

---

## 🎉 Ready to Build?

**Next Step:** Open `QUICK_BACKEND_SETUP.md` and follow the 15-minute implementation guide!

**You've got this! 🚀**

---

*Last Updated: December 2024*
*Frontend Status: ✅ Complete*
*Backend Status: 📋 Ready for Implementation*

