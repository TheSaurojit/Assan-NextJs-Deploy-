import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/backend/firebase/firebase-admin';

export async function POST(req : NextRequest) {

  const { token } = await req.json();

    let userData = null;

    if (token) {
        try {
            const user = await adminAuth.verifyIdToken(token);

            // console.log(user , " \nuser from routes.ts\n");
            

            const docRef = adminDb.collection("Users").doc(user.uid);
            const docSnap = await docRef.get();

            userData = docSnap.exists ? docSnap.data() : null;

        } catch (err) {
            console.error("Token verification failed:", err);
        }
    }

    return NextResponse.json({ success: true, user: userData });
}
