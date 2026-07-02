"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee, Lock, Mail, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Connexion réussie ! Accès au tableau de bord.");
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      toast.error("Identifiants incorrects ou compte inexistant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2A21] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#13352B] border border-[#D6B370]/30 rounded-3xl p-8 shadow-2xl relative z-10 text-white"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Coffee className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider uppercase text-white" style={{ fontFamily: "var(--font-heading)" }}>
            AFNENE COFFEE
          </h1>
          <p className="text-xs text-white/70 mt-1">Espace d&apos;Administration Sécurisé</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wider">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5 uppercase tracking-wider">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-secondary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-dark font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Connexion...</span>
            ) : (
              <>
                <span>Se Connecter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
