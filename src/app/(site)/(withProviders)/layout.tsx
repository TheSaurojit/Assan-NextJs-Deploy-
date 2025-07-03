import { AuthProvider } from "@/backend/context/AuthContext";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </div>
    </>
  );
}
