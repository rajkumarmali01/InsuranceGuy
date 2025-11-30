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

async function fixLeads() {
    console.log('Checking for leads with missing created_at...');

    // Get ALL leads (no ordering to ensure we get everything)
    const snapshot = await db.collection('leads').get();

    let fixedCount = 0;
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!data.created_at) {
            console.log(`Fixing lead: ${doc.id} (${data.name || 'Unknown'})`);
            const ref = db.collection('leads').doc(doc.id);
            batch.update(ref, {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            fixedCount++;
        }
    });

    if (fixedCount > 0) {
        await batch.commit();
        console.log(`Successfully fixed ${fixedCount} leads!`);
    } else {
        console.log('All leads already have created_at timestamps.');
    }
}

fixLeads().catch(console.error);
