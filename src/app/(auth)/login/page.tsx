"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/backend/context/AuthContext"; // Adjust path if needed
import Link from "next/link";
import { toast } from "react-toastify";
import { withAuthProvider } from "@/backend/providers/Providers";

function LoginPage() {
  const { signInWithEmail, user, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      return router.push("/"); // Redirect to dashboard after successful login
    } catch (err: any) {
      if (err.code === "auth/email-not-verified") {
        toast.error(
          "Email not verified. Please check your inbox for the verification link."
        );
      } else if (err.code === "auth/invalid-credential") {
        toast.error("Invalid credentials");
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      return router.push("/"); // Redirect to dashboard after successful login
    } catch (err: any) {
      console.log(err);

      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[999] min-h-screen flex items-center justify-center bg-gray-100 overflow-y-hidden">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "black" }}
            className="w-full text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

                <div className="text-center my-4 text-gray-500">or</div>


        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing up..." : "Login with Google"}
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default withAuthProvider(LoginPage);
