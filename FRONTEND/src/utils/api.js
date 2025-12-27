const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function for API calls with enhanced error handling
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log(`API Call: ${options.method || 'GET'} ${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`API Response: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error.message);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (data) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiCall('/auth/me'),
};

// Class APIs
export const classAPI = {
  getAll: () => apiCall('/classes'),
  getById: (id) => apiCall(`/classes/${id}`),
  create: (data) => apiCall('/classes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/classes/${id}`, { method: 'DELETE' }),
};

// Enrollment APIs
export const enrollmentAPI = {
  getAll: () => apiCall('/enrollments'),
  getStudentEnrollments: (studentId) => apiCall(`/enrollments/student/${studentId}`),
  getClassEnrollments: (classId) => apiCall(`/enrollments/class/${classId}`),
  enroll: (data) => apiCall('/enrollments', { method: 'POST', body: JSON.stringify(data) }),
  drop: (enrollmentId) => apiCall(`/enrollments/${enrollmentId}`, { method: 'DELETE' }),
  approve: (enrollmentId) => apiCall(`/enrollments/${enrollmentId}/approve`, { method: 'PUT' }),
  reject: (enrollmentId) => apiCall(`/enrollments/${enrollmentId}/reject`, { method: 'PUT' }),
};

// Payment APIs
export const paymentAPI = {
  getAll: () => apiCall('/payments'),
  getStudentPayments: (studentId) => apiCall(`/payments/student/${studentId}`),
  create: (data) => apiCall('/payments', { method: 'POST', body: JSON.stringify(data) }),
  update: (paymentId, data) => apiCall(`/payments/${paymentId}`, { method: 'PUT', body: JSON.stringify(data) }),
  getSummary: () => apiCall('/payments/summary'),
};

// Feedback APIs
export const feedbackAPI = {
  getAll: () => apiCall('/feedback'),
  getClassFeedback: (classId) => apiCall(`/feedback/class/${classId}`),
  getStudentFeedback: (studentId) => apiCall(`/feedback/student/${studentId}`),
  submit: (data) => apiCall('/feedback', { method: 'POST', body: JSON.stringify(data) }),
  update: (feedbackId, data) => apiCall(`/feedback/${feedbackId}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (feedbackId) => apiCall(`/feedback/${feedbackId}`, { method: 'DELETE' }),
};

// Student APIs
export const studentAPI = {
  getProfile: (studentId) => apiCall(`/students/${studentId}`),
  updateProfile: (studentId, data) => apiCall(`/students/${studentId}`, { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (studentId, data) => apiCall(`/students/${studentId}/change-password`, { method: 'POST', body: JSON.stringify(data) }),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: () => apiCall('/attendance'),
  getStudentAttendance: (studentId) => apiCall(`/attendance/student/${studentId}`),
  markAttendance: (data) => apiCall('/attendance', { method: 'POST', body: JSON.stringify(data) }),
};

// Admin APIs
export const adminAPI = {
  getUsers: () => apiCall('/auth/users'),
  updateUserStatus: (userId, data) => apiCall(`/auth/users/${userId}/status`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Contact APIs
export const contactAPI = {
  getAll: () => apiCall('/contacts'),
  create: (data) => apiCall('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, data) => apiCall(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/contacts/${id}`, { method: 'DELETE' }),
};

export default {
  authAPI,
  classAPI,
  enrollmentAPI,
  paymentAPI,
  feedbackAPI,
  studentAPI,
  adminAPI,
  contactAPI,
  attendanceAPI,
};
