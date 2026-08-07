import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(username, password);
      navigate("/ponto");
    } catch {
      setErro("Usuário ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-ctblack flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-ctred flex items-center justify-center mb-4 shadow-lg shadow-ctred/30">
            <span className="text-white font-black text-3xl">CT</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            CT <span className="text-ctred">FOCO</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Módulo de Ponto</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="seu.usuario"
              className="w-full bg-ctblack2 border border-ctgray text-white rounded-xl px-4 py-3.5
                focus:outline-none focus:border-ctred focus:ring-1 focus:ring-ctred transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-1.5 uppercase tracking-wide">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-ctblack2 border border-ctgray text-white rounded-xl px-4 py-3.5
                focus:outline-none focus:border-ctred focus:ring-1 focus:ring-ctred transition-colors"
            />
          </div>

          {erro && (
            <p className="text-ctred2 text-sm text-center font-medium">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-ctred hover:bg-ctred2 disabled:opacity-60 text-white font-bold
              py-3.5 rounded-xl transition-colors shadow-lg shadow-ctred/20 mt-2"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
