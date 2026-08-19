import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#08090a] px-5 text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-10">
          <img src="/images/logo2.png" alt="Hammer Head Towing" className="h-8 w-auto object-contain" />
          <div className="h-6 w-px bg-white/[0.08]" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[.22em] text-white/22">Intelligence</p>
            <p className="mt-0.5 text-xs font-medium text-white/65">Admin Access</p>
          </div>
        </div>

        <div className="border border-white/[0.08] bg-white/[0.02] p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-600"><Lock size={16} /></div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Sign in</h1>
              <p className="text-xs text-white/35">Operations Command</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs text-red-400">
              <AlertTriangle size={14} />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/50" placeholder="admin@hammerheadtowing.com" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/50" />
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-red-600 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-red-500 disabled:opacity-50">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
