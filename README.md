# Latin Dance Management System - MERN Stack

A complete student-facing dance class management application built with MongoDB, Express.js, React, and Node.js.

## 🎯 What This Is

A full-stack MERN application for managing dance class enrollments, payments, and feedback. Students can browse classes, enroll (with automatic waitlist support), track payments, and submit feedback.

**Status**: ✅ Fully integrated and ready for testing

---

## 📋 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB running on localhost:27017
- npm or yarn

### Step 1: Setup Backend
```bash
cd BACKEND
npm install
npm start
```
Expected: `Server running on port 5001`

### Step 2: Setup Frontend (new terminal)
```bash
cd FRONTEND
npm install
npm run dev
```
Expected: `Local: http://localhost:5174/`

### Step 3: Access Application
Open browser: **http://localhost:5174**

---

## 📚 Documentation

Choose what you need to read based on your task:

| Document | Purpose | Time |
|----------|---------|------|
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Installation and configuration | 5 min |
| **[USER_JOURNEY.md](USER_JOURNEY.md)** | See how data flows through system | 10 min |
| **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** | Architecture and component overview | 10 min |
| **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** | Testing procedures and validation | 15 min |
| **[PROJECT_FILE_INVENTORY.md](PROJECT_FILE_INVENTORY.md)** | Complete file listing and status | 10 min |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                │
│           http://localhost:5174                     │
│  - Login & Registration                             │
│  - Browse Classes                                   │
│  - Manage Payments                                  │
│  - Submit Feedback                                  │
│  - Update Profile                                   │
└────────────┬────────────────────────────────────────┘
             │ HTTP Requests with JWT
             ↓
┌─────────────────────────────────────────────────────┐
│          Backend (Express.js + Node)                │
│         http://localhost:5001/api                   │
│  - Authentication (/auth)                           │
│  - Classes (/classes)                               │
│  - Enrollments (/enrollments)                       │
│  - Payments (/payments)                             │
│  - Feedback (/feedback)                             │
│  - Student Profile (/students)                      │
└────────────┬────────────────────────────────────────┘
             │ Mongoose ORM
             ↓
┌─────────────────────────────────────────────────────┐
│       MongoDB (localhost:27017)                     │
│   - users                                           │
│   - classes                                         │
│   - enrollments                                     │
│   - payments                                        │
│   - feedbacks                                       │
└─────────────────────────────────────────────────────┘
```

---

## 🔑 Key Features

### ✅ Authentication
- User registration with email validation
- Secure login with JWT tokens (7-day expiration)
- Password hashing with bcryptjs
- Automatic session management

### ✅ Class Management
- Browse available classes
- View class details (instructor, schedule, capacity)
- Real-time capacity tracking

### ✅ Enrollment System
- Enroll in classes
- Automatic waitlist when class is full
- Auto-promotion from waitlist when spots open
- Drop classes with cleanup

### ✅ Payment Tracking
- View student payment records
- Track payment status (Pending, Paid, Overdue)
- Record due dates and paid dates
- Download receipts

### ✅ Feedback System
- Submit feedback for attended classes
- Rate classes (1-5 stars)
- Add detailed comments
- View all student feedback
- One feedback per student per class

### ✅ Profile Management
- Update personal information
- Change password securely
- View profile information
- Manage account settings

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: String (student/instructor),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Classes Collection
```javascript
{
  _id: ObjectId,
  name: String,
  style: String,
  level: String (Beginner/Intermediate/Advanced),
  instructor: ObjectId (ref: User),
  schedule: String,
  capacity: Number,
  currentEnrollment: Number,
  status: String (Active/Full/Cancelled),
  price: Number,
  description: String,
  createdAt: Date
}
```

### Enrollments Collection
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  class: ObjectId (ref: Class),
  status: String (Active/Completed/Dropped),
  isWaitlisted: Boolean,
  waitlistPosition: Number,
  enrolledAt: Date
}
```

### Payments Collection
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  class: ObjectId (ref: Class),
  amount: Number,
  month: String,
  dueDate: Date,
  paidDate: Date,
  status: String (Pending/Paid/Overdue/Cancelled),
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Feedback Collection
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  instructor: ObjectId (ref: User),
  class: ObjectId (ref: Class),
  rating: Number (1-5),
  comment: String,
  submittedAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5001/api/health
```

### Automated Test Script
```bash
cd BACKEND
node test-apis.js
```

### Manual Testing
1. Register a new account
2. Login with credentials
3. Browse and enroll in classes
4. Check payments
5. Submit feedback
6. Update profile
7. Test logout

See [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) for detailed testing procedures.

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
netstat -ano | findstr :5001

# Or change PORT in BACKEND/.env
```

### MongoDB connection fails
```bash
# Make sure MongoDB is running
mongod

# Or check connection string in BACKEND/.env
```

### CORS errors
- Ensure frontend is on http://localhost:5174
- Check CORS middleware in backend server.js

### Token expired errors
- Clear browser cache and localStorage
- Login again to get fresh token

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting.

---

## 📁 Project Structure

```
LATIN-DANCE/
├── BACKEND/
│   ├── db-connect/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── errorHandler.js          # Error handling
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Class.js                 # Class schema
│   │   ├── Enrollment.js            # Enrollment schema
│   │   ├── Payment.js               # Payment schema
│   │   └── Feedback.js              # Feedback schema
│   ├── api-function/
│   │   ├── auth-function.js         # Auth controllers
│   │   ├── class-function.js        # Class controllers
│   │   ├── enrollment-function.js   # Enrollment controllers
│   │   ├── payment-function.js      # Payment controllers
│   │   ├── feedback-function.js     # Feedback controllers
│   │   └── student-function.js      # Student controllers
│   ├── routes/
│   │   ├── authRoutes.js            # Auth routes
│   │   ├── classRoutes.js           # Class routes
│   │   ├── enrollmentRoutes.js      # Enrollment routes
│   │   ├── paymentRoutes.js         # Payment routes
│   │   ├── feedbackRoutes.js        # Feedback routes
│   │   └── studentRoutes.js         # Student routes
│   ├── server.js                    # Express app
│   ├── .env                         # Environment config
│   ├── package.json                 # Dependencies
│   └── test-apis.js                 # API tests
│
├── FRONTEND/
│   └── src/
│       ├── pages/
│       │   ├── auth/
│       │   │   └── Login.jsx        # Login page
│       │   └── student/
│       │       ├── StudentDashboard.jsx
│       │       ├── BrowseClasses.jsx
│       │       ├── Payments.jsx
│       │       ├── Feedback.jsx
│       │       ├── Profile.jsx
│       │       └── StudentDashboard.css
│       ├── utils/
│       │   └── api.js               # API service layer
│       ├── App.jsx                  # Router setup
│       └── main.jsx                 # Entry point
│
├── Documentation/
│   ├── README.md                    # This file
│   ├── SETUP_GUIDE.md               # Installation guide
│   ├── INTEGRATION_SUMMARY.md       # Architecture
│   ├── USER_JOURNEY.md              # Data flow
│   ├── VERIFICATION_CHECKLIST.md    # Testing
│   ├── PROJECT_FILE_INVENTORY.md    # File listing
│   ├── QUICKSTART.bat               # Windows script
│   ├── QUICKSTART.sh                # Unix script
│   └── diagnostic.js                # Diagnostic tool
```

---

## 🔐 Security Features

✅ **Password Security**
- Hashed with bcryptjs (10 salt rounds)
- Never stored in plaintext
- Validated on every login

✅ **JWT Tokens**
- 7-day expiration
- Signed with secret key
- Sent via Bearer token in Authorization header

✅ **Database Security**
- Mongoose validation on all schemas
- Required field enforcement
- Type checking

✅ **API Security**
- CORS restricted to localhost:5174
- 401 responses trigger session clear
- Token validation on protected routes

---

## 🚀 Deployment Considerations

Before going to production:

1. **Environment Variables**
   - Use strong JWT_SECRET
   - Configure real MongoDB URI
   - Set production CORS origins

2. **Database**
   - Add indexes on frequently queried fields
   - Enable MongoDB authentication
   - Setup backup strategy

3. **API Endpoints**
   - Add rate limiting
   - Implement request validation
   - Add comprehensive logging

4. **Frontend**
   - Build for production: `npm run build`
   - Minify and optimize assets
   - Configure real API URL

5. **Monitoring**
   - Setup error tracking (Sentry)
   - Monitor database performance
   - Track user analytics

---

## 📞 Support & Resources

### Getting Help
1. Check [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) for common issues
2. Read [USER_JOURNEY.md](USER_JOURNEY.md) to understand data flow
3. Run `diagnostic.js` to check system status
4. Review backend console logs for errors

### API Documentation
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete API endpoint listing

### Architecture Details
See [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) for system design

---

## 📝 License

This project is provided as-is for educational purposes.

---

## ✅ Verification Status

- ✅ Backend fully functional and tested
- ✅ Frontend properly connected to backend
- ✅ All 25+ API endpoints working
- ✅ Database models and relationships defined
- ✅ Authentication and authorization implemented
- ✅ Error handling and logging configured
- ✅ Documentation comprehensive
- ✅ Waitlist and enrollment logic complete
- ✅ Payment tracking integrated
- ✅ Feedback system implemented

**Current Status**: Ready for development and testing

---

## 📅 What's Next?

1. Run diagnostic tool: `node diagnostic.js`
2. Start backend: `cd BACKEND && npm start`
3. Start frontend: `cd FRONTEND && npm run dev`
4. Open http://localhost:5174
5. Register and test the system
6. Check [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) for detailed testing

**Happy coding! 🎉**
