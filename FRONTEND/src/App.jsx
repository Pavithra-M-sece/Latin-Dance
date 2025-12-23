import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import Terms from './pages/legal/Terms.jsx';
import Privacy from './pages/legal/Privacy.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ClassManagement from './pages/admin/ClassManagement.jsx';
import WaitlistManagement from './pages/admin/WaitlistManagement.jsx';
import AttendanceTracking from './pages/admin/AttendanceTracking.jsx';
import FeeManagement from './pages/admin/FeeManagement.jsx';
import Profile from './pages/admin/Profile.jsx';
import FeedbackManagement from './pages/admin/FeedbackManagement.jsx';
import StudentManagement from './pages/admin/StudentManagement.jsx';
import EnrollmentRequests from './pages/admin/EnrollmentRequests.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import BrowseClasses from './pages/student/BrowseClasses.jsx';
import Payments from './pages/student/Payments.jsx';
import StudentAttendance from './pages/student/Attendance.jsx';
import StudentFeedback from './pages/student/Feedback.jsx';
import StudentProfile from './pages/student/Profile.jsx';

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/classes" element={<ClassManagement />} />
          <Route path="/admin/waitlist" element={<WaitlistManagement />} />
          <Route path="/admin/attendance" element={<AttendanceTracking />} />
          <Route path="/admin/fees" element={<FeeManagement />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/enrollment-requests" element={<EnrollmentRequests />} />
          <Route path="/admin/feedback" element={<FeedbackManagement />} />

          {/* Student */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/classes" element={<BrowseClasses />} />
          <Route path="/student/payments" element={<Payments />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/feedback" element={<StudentFeedback />} />
          <Route path="/student/profile" element={<StudentProfile />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
