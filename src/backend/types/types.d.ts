import {  UserCredential } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

// Define user role type
export type UserRole = 'user' | 'admin';

// Define user document interface for Firestore
export interface  User {
  uid: string;
  email: string;
  role: UserRole;
  createdAt?: Date | Timestamp;
}

// Define the context value interface
export interface AuthContextType {
  user:   User | null;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

export interface ArticleCreate {
  userId : string ,
  title : string ,
  description : string ,
  thumbnail : string ,
  video : string | null ,
  content : string ,
  createdAt :  Timestamp
}

export interface ArticleUpdate {
  title : string ,
  description : string ,
  thumbnail : string ,
  video : string | null ,
  content : string ,
}


export interface ArticleView {
  id : string ,
  userId : string ,
  title : string ,
  description : string ,
  thumbnail : string ,
  video : string | null ,
  content : string ,
  createdAt :  Timestamp
}

export interface AffiliateType {
  id : string ,
  link : string ,
  thumbnail : string ,
  createdAt :  Timestamp
}

