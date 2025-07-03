"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/backend/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { withAuthProvider } from "@/backend/providers/Providers";

 function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const router = useRouter();
  
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false); // <-- loading state

  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }
    setLoading(true); // start loading
    try {
      await signUpWithEmail(email, password);
      toast.success("Signup successful! We have sent you a verification link.");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Please try another email.");
      } else {
        toast.error("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      return router.push("/"); // Redirect to dashboard after successful login

    } catch (err: any) {
      console.log(err);
      
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[999] min-h-screen flex items-center justify-center bg-gray-100 overflow-y-hidden">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "black" }}
            className="w-full text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign up with Email"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">or</div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default withAuthProvider(SignupPage)
