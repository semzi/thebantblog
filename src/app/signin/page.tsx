"use client";
import { useEffect, useState } from "react";
import { adminLogin, type LoginCredentials } from "@/lib/api/endpoints";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token) router.replace('/admin');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const creds: LoginCredentials = { email, password };
      const data: any = await adminLogin(creds);
      const token = data?.responseObject?.token || data?.responseObject?.accessToken;
      if (!token) {
        throw new Error('No token returned by server');
      }
      if (typeof window !== 'undefined') localStorage.setItem('token', token);
      router.replace('/admin');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-padding-x py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" required />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="primary text-white px-4 py-2 rounded">{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </div>
  );
}


