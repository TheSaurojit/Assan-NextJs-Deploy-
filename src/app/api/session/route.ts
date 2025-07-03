// app/api/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/backend/firebase/firebase-admin";

export async function POST(req: Request) {
  const { token } = await req.json();

  try {
    // Optional: verify the token here to be extra safe
   await adminAuth.verifyIdToken(token);


    // Set HTTP-only cookie
    (await cookies()).set("__session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
