import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Example HTTP function
export const api = functions.https.onRequest((request, response) => {
  functions.logger.info('API request', { url: request.url });
  
  response.set('Access-Control-Allow-Origin', '*');
  
  if (request.method === 'OPTIONS') {
    // Handle CORS preflight requests
    response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
    return;
  }
  
  // Handle API routes
  const path = request.path.split('/');
  const endpoint = path[1]; // First segment after /api/
  
  switch (endpoint) {
    case 'health':
      response.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
      break;
      
    default:
      response.status(404).json({ error: 'Endpoint not found' });
  }
});

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
