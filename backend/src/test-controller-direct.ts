import { getLeads } from './controllers/leadController';
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Initialize Firebase (Required for Controller)
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

// Mock Request and Response
const req = {
    query: {
        page: '1',
        limit: '10'
    }
} as unknown as Request;

const res = {
    json: (data: any) => {
        console.log('--- SUCCESS: Controller returned data ---');
        console.log(`Total Leads: ${data.total}`);
        console.log(`Leads in Page: ${data.leads.length}`);
        if (data.leads.length > 0) {
            console.log('First Lead:', JSON.stringify(data.leads[0], null, 2));
        } else {
            console.log('WARNING: 0 Leads returned.');
        }
    },
    status: (code: number) => {
        console.log(`Response Status: ${code}`);
        return res;
    }
} as unknown as Response;

async function runTest() {
    console.log('Running getLeads controller directly...');
    try {
        await getLeads(req, res);
    } catch (error) {
        console.error('Controller threw error:', error);
    }
}

runTest();
