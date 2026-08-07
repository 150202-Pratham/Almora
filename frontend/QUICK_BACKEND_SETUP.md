# Quick Backend Setup - Contact Us Email Notifications

## 🚀 Fastest Implementation Path (15 minutes)

### 1. Install Dependencies
```bash
npm install nodemailer express-rate-limit
```

### 2. Create Email Configuration (.env)
```env
# Gmail Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@almora.com
ADMIN_EMAIL=admin@almora.com
```

**Note:** For Gmail, use [App Password](https://myaccount.google.com/apppasswords) not your regular password

### 3. Create Email Service (services/emailService.js)
```javascript
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
  const { name, email, subject, message, phone, contactId } = contactData;

  // Email to user
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: `We received your message: ${subject}`,
    html: `
      <h2>Thank you, ${name}!</h2>
      <p>We have received your message and will get back to you soon.</p>
      <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p><strong>${subject}</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
      <p><small>Reference: ${contactId}</small></p>
      <p style="margin-top: 30px; color: #999; font-size: 12px;">
        © 2024 Almora
      </p>
    `
  });

  // Email to admin
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Reference ID:</strong> ${contactId}</p>
      <hr>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  });
};
```

### 4. Create Contact Route (routes/contact.js)
```javascript
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendContactEmail } = require('../services/emailService');
const Contact = require('../models/Contact'); // If using MongoDB

// Rate limiting: 5 messages per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact form submissions, please try again later'
});

router.post('/', limiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message || message.length < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Please fill all required fields correctly'
      });
    }

    // Save to database (if using MongoDB)
    let contactId = 'web-' + Date.now();
    if (Contact) {
      const contact = new Contact({ name, email, phone, subject, message });
      await contact.save();
      contactId = contact._id;
    }

    // Send emails
    await sendContactEmail({ name, email, phone, subject, message, contactId });

    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully',
      contactId
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message. Please try again later.'
    });
  }
});

module.exports = router;
```

### 5. Add Route to Main App (server.js/app.js)
```javascript
const contactRoutes = require('./routes/contact');

// Add this line (usually before error handling middleware)
app.use('/api/contact', contactRoutes);

// Enable CORS for your frontend domain
app.use(cors({
  origin: 'http://localhost:5173',  // Your Vite dev server
  credentials: true
}));
```

### 6. Optional: MongoDB Contact Model (models/Contact.js)
```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
```

---

## 🧪 Testing Locally

### Test with cURL:
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "subject": "Test Subject",
    "message": "This is a test message from contact form"
  }'
```

### Expected Success Response:
```json
{
  "status": "success",
  "message": "Your message has been sent successfully",
  "contactId": "web-1701234567890"
}
```

---

## 📧 Gmail Setup (Recommended for Testing)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select Mail and Windows Computer
5. Copy the generated 16-character password
6. Use in `SMTP_PASSWORD` in .env

---

## ✅ Verification Checklist

- [ ] Dependencies installed: `nodemailer`, `express-rate-limit`
- [ ] `.env` file created with SMTP credentials
- [ ] Email service created in `services/emailService.js`
- [ ] Contact route created in `routes/contact.js`
- [ ] Route registered in main app file
- [ ] CORS enabled for frontend domain
- [ ] Test with cURL command
- [ ] Check email inbox (both user and admin)
- [ ] Check spam folder if emails not arriving
- [ ] Rate limiting working (test 6th request in 15 mins)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Error: connect ECONNREFUSED` | Check SMTP credentials, enable Less Secure Apps for Gmail |
| `Error: Invalid login` | Verify SMTP_USER and SMTP_PASSWORD in .env |
| `Emails in spam folder` | Set up SPF/DKIM records for your domain |
| `CORS error` | Add your frontend domain to CORS origin |
| `Form not submitting` | Check browser console, verify API endpoint URL |
| `Rate limit exceeded` | Tested successfully, limit is per IP per 15 mins |

---

## 📤 Frontend Call (Already Implemented)

The frontend at `src/pages/ContactUs.jsx` already sends:

```javascript
POST /api/contact
{
  name: "string",
  email: "string",
  phone: "string",
  subject: "string",
  message: "string"
}
```

Your backend just needs to handle this endpoint!

---

## 🎉 That's It!

Once the above is implemented:
1. ✅ Form submits from frontend
2. ✅ User receives confirmation email
3. ✅ Admin receives notification email
4. ✅ Message is rate-limited
5. ✅ Contact saved to database

Total implementation time: ~15 minutes

