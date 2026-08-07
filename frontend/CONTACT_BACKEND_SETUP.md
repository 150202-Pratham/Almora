# Contact Us - Backend Integration Guide

## Overview
The Contact Us page sends form data to a backend endpoint that should handle email notifications to both the user and admin.

## Frontend Integration
The ContactUs.jsx component sends POST requests to `/api/contact` with the following structure:

### Request Format
```javascript
POST /api/contact
Content-Type: application/json

{
  "name": "string",           // Required: User's full name
  "email": "string",          // Required: User's email address
  "phone": "string",          // Optional: User's phone number
  "subject": "string",        // Required: Subject of inquiry
  "message": "string"         // Required: Message content (min 10 chars)
}
```

### Response Format
**Success (200-201):**
```javascript
{
  "status": "success",
  "message": "Message sent successfully",
  "contactId": "123456"       // Optional: ID of stored contact record
}
```

**Error (400-500):**
```javascript
{
  "status": "error",
  "message": "Error description"
}
```

---

## Backend Implementation Guide

### Step 1: Create Contact API Endpoint

**Using Node.js/Express:**

```javascript
// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../services/emailService');
const { validateContactForm } = require('../middlewares/validation');

// POST /api/contact
router.post('/', validateContactForm, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // 1. Save contact message to database (optional but recommended)
    const contact = new Contact({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      createdAt: new Date(),
      status: 'new'
    });
    await contact.save();

    // 2. Send email notifications
    await sendContactEmail({
      userEmail: email,
      userName: name,
      subject,
      message,
      phone,
      contactId: contact._id
    });

    res.status(201).json({
      status: 'success',
      message: 'Your message has been received. We will contact you soon.',
      contactId: contact._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process your request. Please try again later.'
    });
  }
});

module.exports = router;
```

### Step 2: Create Contact Model (MongoDB Example)

```javascript
// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  phone: {
    type: String,
    default: null
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    minlength: 10
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  repliedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Contact', contactSchema);
```

### Step 3: Setup Email Service

**Using Nodemailer (SMTP):**

```javascript
// services/emailService.js
const nodemailer = require('nodemailer');

// Configure SMTP (update with your email provider)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // e.g., smtp.gmail.com
  port: process.env.SMTP_PORT,        // Usually 587 or 465
  secure: process.env.SMTP_PORT === 465, // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,       // Your email
    pass: process.env.SMTP_PASSWORD    // Your app password or email password
  }
});

exports.sendContactEmail = async ({
  userEmail,
  userName,
  subject,
  message,
  phone,
  contactId
}) => {
  try {
    // 1. Email to user (confirmation)
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: userEmail,
      subject: `We received your message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Thank you for contacting us, ${userName}!</h2>
          
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${subject}</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>
            <strong>Your Details:</strong><br>
            Name: ${userName}<br>
            Email: ${userEmail}<br>
            ${phone ? `Phone: ${phone}<br>` : ''}
            Reference ID: ${contactId}
          </p>
          
          <p>If you have any questions, feel free to contact us directly:</p>
          <p>
            📧 Email: support@almora.com<br>
            📱 Phone: +91 8295756906
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            © 2024 Almora. All rights reserved.
          </p>
        </div>
      `
    });

    // 2. Email to admin (notification)
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${userName}</p>
            <p><strong>Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Reference ID:</strong> ${contactId}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          
          <p style="margin-top: 30px;">
            <a href="http://your-admin-panel.com/contacts/${contactId}" 
               style="background: #FF6B35; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View in Admin Panel
            </a>
          </p>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email notification');
  }
};
```

**Using SendGrid (Alternative):**

```javascript
// services/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendContactEmail = async ({
  userEmail,
  userName,
  subject,
  message,
  phone,
  contactId
}) => {
  try {
    // Email to user
    await sgMail.send({
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `We received your message: ${subject}`,
      html: `
        <h2>Thank you for contacting us, ${userName}!</h2>
        <p>We have received your message and will get back to you soon.</p>
        <p><strong>Reference ID:</strong> ${contactId}</p>
      `
    });

    // Email to admin
    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });
  } catch (error) {
    console.error('SendGrid error:', error);
    throw error;
  }
};
```

### Step 4: Add Validation Middleware

```javascript
// middlewares/validation.js
exports.validateContactForm = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
    errors.push('Valid email is required');
  if (!subject || !subject.trim()) errors.push('Subject is required');
  if (!message || message.trim().length < 10) 
    errors.push('Message must be at least 10 characters');

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: errors.join(', ')
    });
  }

  next();
};
```

### Step 5: Environment Configuration

**.env file:**
```
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use app-specific password for Gmail
SMTP_FROM_EMAIL=noreply@almora.com

ADMIN_EMAIL=admin@almora.com

# Or if using SendGrid:
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@almora.com
```

### Step 6: Add Route to Main App

```javascript
// server.js or app.js
const contactRoutes = require('./routes/contact');

app.use('/api/contact', contactRoutes);
```

---

## Email Provider Setup Instructions

### Gmail (SMTP)
1. Enable 2-Factor Authentication on your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Use this password in SMTP_PASSWORD
4. SMTP Settings:
   - Host: smtp.gmail.com
   - Port: 587
   - Secure: false

### SendGrid
1. Create SendGrid account
2. Get API key from dashboard
3. Verify sender email
4. Install: `npm install @sendgrid/mail`

### AWS SES
1. Set up AWS SES in your region
2. Verify sender and recipient emails
3. Get AWS credentials
4. Install: `npm install aws-sdk`

---

## Testing the Integration

### Frontend Test
1. Navigate to Contact Us page
2. Fill in the form with test data
3. Click "Send Message"
4. Check browser console for errors
5. Verify success message appears

### Backend Test (using cURL)
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "subject": "Test Subject",
    "message": "This is a test message to verify the contact form works correctly."
  }'
```

---

## Security Considerations

1. **Rate Limiting**: Prevent spam
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,  // 15 minutes
     max: 5  // Limit each IP to 5 requests per windowMs
   });
   router.post('/', limiter, validateContactForm, ...);
   ```

2. **Input Sanitization**: Prevent XSS
   ```javascript
   const sanitizeHtml = require('sanitize-html');
   message = sanitizeHtml(message, { 
     allowedTags: [], 
     allowedAttributes: {} 
   });
   ```

3. **CORS**: Allow requests from your frontend
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

4. **Error Messages**: Don't expose sensitive info
   - Frontend gets generic error messages
   - Backend logs detailed errors for debugging

---

## Monitoring & Logging

Add logging to track submissions:

```javascript
// In email service
console.log(`Contact form submitted: ${contactId} from ${email}`);

// In route handler
logger.info(`Contact form processed: ${contact._id}`, {
  email: contact.email,
  subject: contact.subject,
  timestamp: new Date()
});
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 550 - Authentication failed | Check SMTP credentials in .env |
| 421 - Service unavailable | SMTP rate limit - retry after delay |
| Emails in spam | Set up SPF, DKIM, DMARC records |
| CORS errors | Add frontend URL to CORS whitelist |
| Form not submitting | Check browser console for API errors |
| Emails not sending | Check email service logs, verify recipient email |

