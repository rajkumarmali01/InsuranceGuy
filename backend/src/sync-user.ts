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

async function syncUser(email: string) {
    console.log(`--- SYNCING USER: ${email} ---`);
    try {
        // 1. Get the REAL UID from Auth
        const userRecord = await admin.auth().getUserByEmail(email);
        const realUid = userRecord.uid;
        console.log(`Auth UID: ${realUid}`);

        // 2. Check if Firestore has this doc
        const userDoc = await db.collection('users').doc(realUid).get();

        if (!userDoc.exists) {
            console.log('Firestore doc missing for this UID. Creating it...');
        } else {
            console.log(`Firestore doc exists. Current Role: ${userDoc.data()?.role}`);
        }

        // 3. Force update
        await db.collection('users').doc(realUid).set({
            email: email,
            role: 'admin',
            updated_at: new Date().toISOString()
        }, { merge: true });

        console.log('SUCCESS: User is now definitely an Admin in Firestore.');

    } catch (error) {
        console.error('Error syncing user:', error);
    }
}

// Run for both known emails to be safe
async function run() {
    await syncUser('ganpatmali211@gmail.com');
    await syncUser('tirthbhaipatel123@gmail.com');
}

run();
