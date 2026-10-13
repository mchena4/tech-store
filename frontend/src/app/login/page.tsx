"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      router.push(redirect);
    } catch (err: any) {
      console.error(err);
      setError("Usuario o contraseña incorrectos. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gunmetal/10 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-ocean-mist/15 text-deep-teal rounded-2xl flex items-center justify-center mx-auto mb-3">
            <User className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-gunmetal">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-gunmetal/60 mt-1">
            Ingresa tus datos para gestionar tus compras
          </p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gunmetal/60 uppercase tracking-wider mb-2">
              Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ocean-mist/5 border border-gunmetal/15 text-gunmetal placeholder-gunmetal/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-teal focus:bg-white text-sm"
              />
              <User className="w-4 h-4 text-gunmetal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gunmetal/60 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ocean-mist/5 border border-gunmetal/15 text-gunmetal placeholder-gunmetal/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-teal focus:bg-white text-sm"
              />
              <Lock className="w-4 h-4 text-gunmetal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />{" "}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-deep-teal text-white font-bold rounded-xl hover:bg-dark-cyan transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-sm"
          >
            {loading ? "Verificando..." : "Ingresar"}{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gunmetal/50">Cargando...</div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
