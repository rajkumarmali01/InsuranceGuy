import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Initialize Firebase
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

async function debugLeads() {
    console.log('--- DEBUGGING LEADS ---');

    // 1. Count Total
    const snapshot = await db.collection('leads').get();
    console.log(`Total Documents in 'leads' collection: ${snapshot.size}`);

    if (snapshot.empty) {
        console.log('Collection is empty.');
        return;
    }

    // 2. Inspect First 5
    console.log('\n--- First 5 Leads Data ---');
    snapshot.docs.slice(0, 5).forEach((doc, index) => {
        const data = doc.data();
        console.log(`\n[${index + 1}] ID: ${doc.id}`);
        console.log(`    Name: ${data.name || data.fullName || 'N/A'}`);
        console.log(`    Phone: ${data.phone || 'N/A'}`);
        console.log(`    Created At: ${data.created_at} (Type: ${typeof data.created_at})`);
        console.log(`    Status: ${data.status}`);
    });

    // 3. Test Query (Simulate Controller)
    console.log('\n--- Testing Controller Query ---');
    try {
        const querySnapshot = await db.collection('leads')
            .orderBy('created_at', 'desc')
            .limit(5)
            .get();
        console.log(`Query (orderBy created_at desc) returned: ${querySnapshot.size} docs`);
    } catch (error: any) {
        console.error('Query FAILED:', error.message);
    }

    // 4. List Users to get a UID for testing
    console.log('\n--- Users ---');
    const usersSnapshot = await db.collection('users').get();
    usersSnapshot.forEach(doc => {
        console.log(`User ID: ${doc.id}, Role: ${doc.data().role}, Email: ${doc.data().email}`);
    });
}

debugLeads().catch(console.error);
