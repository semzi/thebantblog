import { EyeClosedIcon, EyeIcon } from "lucide-react";
import React, { useState } from "react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Dummy validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    // TODO: Replace with real authentication logic
    alert("Signed in!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-p3/10 via-white to-brand-p3/20">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-brand-p1">Admin Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-p3"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-p3 pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-neutral-n3"
                onClick={() => setShowPwd((v) => !v)}
                tabIndex={-1}
              >
                {showPwd ? (
                  <span role="img" aria-label="Hide"> <EyeClosedIcon/> </span>
                ) : (
                  <span role="img" aria-label="Show"> <EyeIcon /> </span>
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full secondary text-white py-2 rounded font-semibold hover:bg-brand-p3/90 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;