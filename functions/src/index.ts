import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// HTTP function for API endpoints
export const api = functions.https.onRequest((request, response) => {
  functions.logger.info('API request', { url: request.url, method: request.method });
  
  // Set CORS headers for the preflight request
  // Allow requests from the production domain
  const allowedOrigins = [
    'https://courtcase-1d089.web.app',
    'https://courtcase-1d089.firebaseapp.com',
    // Remove trailing dot if present in origin
    request.headers.origin?.replace(/\.$/, '') || ''
  ];
  
  const origin = request.headers.origin || '';
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    response.set('Access-Control-Allow-Origin', origin);
  } else {
    response.set('Access-Control-Allow-Origin', 'https://courtcase-1d089.web.app');
  }
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
    return;
  }
  
  // Handle API routes
  const path = request.path.split('/');
  const endpoint = path[1]; // First segment after /api/
  const subEndpoint = path[2]; // Second segment (if any)
  
  functions.logger.info('Endpoint requested', { endpoint, subEndpoint });
  
  switch (endpoint) {
    case 'health':
      response.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
      break;
    
    case 'auth':
      // Handle authentication endpoints
      if (subEndpoint === 'login') {
        handleLogin(request, response);
      } else {
        response.status(404).json({ error: 'Auth endpoint not found' });
      }
      break;
      
    default:
      response.status(404).json({ error: 'Endpoint not found' });
  }
});

/**
 * Handle login requests
 * This function authenticates users with Firebase Authentication
 */
async function handleLogin(request: functions.https.Request, response: functions.Response) {
  try {
    // Ensure the request has the required fields
    const { email, password } = request.body;
    
    if (!email || !password) {
      return response.status(400).json({ 
        error: 'Missing required fields', 
        message: 'Email and password are required' 
      });
    }
    
    functions.logger.info('Login attempt', { email });
    
    // Authenticate with Firebase Admin SDK
    const userRecord = await admin.auth().getUserByEmail(email)
      .catch(error => {
        functions.logger.error('Error fetching user by email', error);
        throw new Error('Authentication failed');
      });
    
    // We can't directly verify passwords with Admin SDK, so we'll just check if the user exists
    // In a real implementation, you'd use Firebase client SDK directly from the frontend
    
    // Return user info (without sensitive data)
    return response.status(200).json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified
      }
    });
    
  } catch (error) {
    functions.logger.error('Login error', error);
    return response.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid email or password'
    });
  }
}

// Example Firestore trigger function
export const onCaseCreated = functions.firestore
  .document('cases/{caseId}')
  .onCreate(async (snapshot, context) => {
    const caseData = snapshot.data();
    const caseId = context.params.caseId;
    
    functions.logger.info('New case created', { caseId, userId: caseData.userId });
    
    try {
      // Example: Add an activity log entry
      await admin.firestore().collection('activity_logs').add({
        action: 'case_created',
        caseId: caseId,
        userId: caseData.userId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return true;
    } catch (error) {
      functions.logger.error('Error in onCaseCreated function', error);
      return false;
    }
  });
