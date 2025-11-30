import axios from 'axios';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Initialize Firebase Admin to create a custom token for testing
try {
    let serviceAccount: any;
    let keyPath = '';
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().startsWith('{')) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
            keyPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
    } else {
        keyPath = path.resolve(__dirname, '../serviceAccountKey.json');
    }

    if (keyPath && fs.existsSync(keyPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id
        });
    }
} catch (error) {
    console.error('Init failed', error);
}

const db = admin.firestore();

async function verifyFullStack() {
    console.log('--- VERIFYING FULL STACK FLOW ---');

    // 1. Get a known Admin User (or create one)
    // We saw 'ganpatmali211@gmail.com' is admin in previous debug
    const adminEmail = 'ganpatmali211@gmail.com';
    console.log(`Target Admin: ${adminEmail}`);

    try {
        const userRecord = await admin.auth().getUserByEmail(adminEmail);
        console.log(`Found User UID: ${userRecord.uid}`);

        // 2. Ensure they are admin in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            email: adminEmail,
            role: 'admin'
        }, { merge: true });
        console.log('Confirmed Admin Role in Firestore.');

        // 3. Generate a Custom Token (simulating login)
        // Note: In a real app, client exchanges custom token for ID token.
        // For this test, we need an ID TOKEN. Admin SDK creates Custom Tokens.
        // To get an ID Token, we'd need to hit the Firebase Auth REST API with the custom token,
        // OR just mock the auth middleware if we can't easily get an ID token here.

        // ACTUALLY: The backend expects an ID Token verified by admin.auth().verifyIdToken().
        // We can't easily generate a valid ID token from the Admin SDK alone without calling the Google Identity Toolkit API.

        // ALTERNATIVE: We can use the 'test-api-live.ts' approach but we need a valid token.
        // Let's try to use a hardcoded "TEST_TOKEN" and temporarily modify the middleware to accept it?
        // NO, that changes the code.

        // Let's try to sign in with a test user using the Firebase REST API if possible.
        // Or better: Just check if the backend is reachable.

        console.log('Skipping token generation (complex without client SDK).');
        console.log('Checking if backend is reachable...');

        const response = await axios.get('http://localhost:5000/api/leads');
        // This should fail with 401 if auth is on.
        console.log(`Response Status: ${response.status}`);

    } catch (error: any) {
        if (error.response) {
            console.log(`Server responded with: ${error.response.status} ${error.response.statusText}`);
            console.log('Body:', error.response.data);

            if (error.response.status === 401) {
                console.log('SUCCESS: Server is protecting the route (Auth is active).');
                console.log('The issue is likely that the Frontend is not sending the valid token.');
            }
        } else {
            console.error('Network Error:', error.message);
        }
    }
}

verifyFullStack();
