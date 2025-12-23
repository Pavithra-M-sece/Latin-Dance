import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api';

let authToken = '';
let userId = '';
let classId = '';
let enrollmentId = '';
let paymentId = '';

const log = (title, data) => {
  console.log(`\n📝 ${title}`);
  console.log('─'.repeat(50));
  console.log(JSON.stringify(data, null, 2));
};

const apiCall = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (authToken) {
    options.headers.Authorization = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint}:`, error.message);
    throw error;
  }
};

const runTests = async () => {
  try {
    // Test 1: Health Check
    console.log('\n🏥 HEALTH CHECK');
    const health = await apiCall('GET', '/health');
    log('Health Check', health);

    // Test 2: Register User
    console.log('\n👤 AUTH TESTS');
    const registerData = {
      name: 'John Doe',
      email: `john${Date.now()}@example.com`,
      password: 'password123',
      role: 'student',
    };
    const registerRes = await apiCall('POST', '/auth/register', registerData);
    log('Register User', registerRes);
    userId = registerRes.userId;

    // Test 3: Login
    const loginRes = await apiCall('POST', '/auth/login', {
      email: registerData.email,
      password: 'password123',
    });
    log('Login User', loginRes);
    authToken = loginRes.token;

    // Test 4: Get Current User
    const meRes = await apiCall('GET', '/auth/me');
    log('Get Current User', meRes);

    // Test 5: Get All Classes
    console.log('\n📚 CLASS TESTS');
    const classesRes = await apiCall('GET', '/classes');
    log('Get All Classes', classesRes);
    
    if (classesRes.length > 0) {
      classId = classesRes[0]._id;
    } else {
      // Create a test class if none exist
      const createClassRes = await apiCall('POST', '/classes', {
        name: 'Test Class',
        description: 'Test Description',
        instructor: userId,
        schedule: 'Monday 6PM',
        capacity: 10,
        level: 'Beginner',
      });
      log('Create Class', createClassRes);
      classId = createClassRes._id;
    }

    // Test 6: Get Single Class
    const singleClassRes = await apiCall('GET', `/classes/${classId}`);
    log('Get Single Class', singleClassRes);

    // Test 7: Enroll in Class
    console.log('\n✍️  ENROLLMENT TESTS');
    const enrollRes = await apiCall('POST', '/enrollments', {
      studentId: userId,
      classId: classId,
    });
    log('Enroll in Class', enrollRes);
    enrollmentId = enrollRes._id;

    // Test 8: Get Student Enrollments
    const enrollmentsRes = await apiCall('GET', `/enrollments/student/${userId}`);
    log('Get Student Enrollments', enrollmentsRes);

    // Test 9: Create Payment
    console.log('\n💳 PAYMENT TESTS');
    const paymentRes = await apiCall('POST', '/payments', {
      studentId: userId,
      classId: classId,
      amount: 100,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    log('Create Payment', paymentRes);
    paymentId = paymentRes._id;

    // Test 10: Get Student Payments
    const paymentsRes = await apiCall('GET', `/payments/student/${userId}`);
    log('Get Student Payments', paymentsRes);

    // Test 11: Submit Feedback
    console.log('\n⭐ FEEDBACK TESTS');
    const feedbackRes = await apiCall('POST', '/feedback', {
      studentId: userId,
      classId: classId,
      rating: 5,
      comment: 'Great class!',
    });
    log('Submit Feedback', feedbackRes);

    // Test 12: Get All Feedback
    const allFeedbackRes = await apiCall('GET', '/feedback');
    log('Get All Feedback', allFeedbackRes);

    // Test 13: Get Student Profile
    console.log('\n👤 STUDENT TESTS');
    const profileRes = await apiCall('GET', `/students/${userId}`);
    log('Get Student Profile', profileRes);

    console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
};

// Wait for backend to be ready
setTimeout(runTests, 1000);
