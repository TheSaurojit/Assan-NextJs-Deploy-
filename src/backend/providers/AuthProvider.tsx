"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "@/backend/firebase/firebase-client";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { AuthContextType, User } from "../types/types";
import { CustomError } from "../helpers/CustomError";

const AuthContext = createContext<AuthContextType>({
  user: null,
  signUpWithEmail: async () => {
    throw new Error("AuthProvider not found");
  },
  signInWithEmail: async () => {
    throw new Error("AuthProvider not found");
  },
  signInWithGoogle: async () => {
    throw new Error("AuthProvider not found");
  },
  // adminSignIn: async () => { throw new Error('AuthProvider not found'); },
  signOut: async () => {
    throw new Error("AuthProvider not found");
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        const userData = userDoc.data();
        setUser({
          uid: user.uid,
          email: user.email ?? "",
          role: userData?.role || "user",
        });
      } else {
        setUser(null);
      }
      // console.log("State change -->", user);

    });


    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(userCredential.user);

    await signOut(auth); // Log them out immediately

    // Add user to Firestore with default 'user' role
    await setDoc(doc(db, "Users", userCredential.user.uid), {
      email: userCredential.user.email,
      role: "user",
      createdAt: Timestamp.now(),
    });
    return userCredential;
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      await signOut(auth); // Log them out immediately
      throw new CustomError(
        "Email not verified. Verification email sent again.",
        "auth/email-not-verified",
        401
      );
    }

    await sendToken(await userCredential.user.getIdToken());

    return userCredential;
  };

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // Check if user exists in Firestore
    await sendToken(await result.user.getIdToken());

    const userDoc = await getDoc(doc(db, "Users", result.user.uid));
    if (!userDoc.exists()) {
      // Add new user with 'user' role
      await setDoc(doc(db, "Users", result.user.uid), {
        email: result.user.email,
        role: "user",
        createdAt: Timestamp.now(),
      });
    }

    return result;
  };

  const sendToken = async (token: string) => {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  };

  const removeToken = async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  };

  const logout = async () => {
    await removeToken();

    return signOut(auth);
  };

  const value: AuthContextType = {
    user,
    signUpWithEmail: signup,
    signInWithEmail: login,
    signInWithGoogle: googleLogin,
    // adminSignIn: async () => { throw new Error('adminSignIn not implemented'); },
    signOut: logout,
  };

  return (
    <AuthContext.Provider value={value}>
      { children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
