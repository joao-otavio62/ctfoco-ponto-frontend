import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast, { type ToastTipo } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { AuthApi } from "../services/api";

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState<{
    mensagem: string;
    tipo: ToastTipo;
  } | null>(null);

  async function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      setToast({
        mensagem: "A nova senha e a confirmação não coincidem.",
        tipo: "erro",
      });
      return;
    }

    if (novaSenha.length < 6) {
      setToast({
        mensagem: "A nova senha deve ter no mínimo 6 caracteres.",
        tipo: "erro",
      });
      return;
    }

    const possuiMaiuscula = /[A-Z]/.test(novaSenha);
    const possuiNumero = /[0-9]/.test(novaSenha);
    const possuiEspecial = /[^A-Za-z0-9]/.test(novaSenha);

    if (!possuiMaiuscula || !possuiNumero || !possuiEspecial) {
      setToast({
        mensagem:
          "A senha deve conter pelo menos uma letra maiúscula, um caractere especial e um número.",
        tipo: "erro",
      });
      return;
    }

    setCarregando(true);
    try {
      const resposta = await AuthApi.alterarSenha({ senhaAtual, novaSenha });

      setToast({
        mensagem: resposta.mensagem || "Senha alterada com sucesso!",
        tipo: "sucesso",
      });

      // Limpa o formulário após sucesso
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem ||
        "Erro ao alterar a senha. Verifique seus dados.";
      setToast({ mensagem, tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-ctblack flex flex-col pb-24">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between px-5 pt-6 pb-6">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">
            Perfil do Usuário
          </p>
          <h1 className="text-white font-semibold text-lg">Meus Dados</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/ponto")}
            className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
          >
            Início
          </button>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-ctred text-sm font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex-1 px-5 flex flex-col gap-6">
        {/* Card de Informações do Usuário */}
        <section>
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
            Informações Pessoais
          </h2>
          <div className="bg-ctblack2 rounded-xl border border-ctgray p-4 flex flex-col gap-3">
            <div>
              <p className="text-gray-500 text-xs">Nome completo</p>
              <p className="text-white text-sm font-medium">{usuario?.nome}</p>
            </div>
            <div className="h-px bg-ctgray w-full"></div>
            <div>
              <p className="text-gray-500 text-xs">Nome de usuário (Login)</p>
              <p className="text-white text-sm font-medium">
                {usuario?.username}
              </p>
            </div>
            <div className="h-px bg-ctgray w-full"></div>
            <div>
              <p className="text-gray-500 text-xs">Cargo</p>
              <p className="text-white text-sm font-medium">{usuario?.role}</p>
            </div>
          </div>
        </section>

        {/* Card de Alteração de Senha */}
        <section>
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
            Segurança
          </h2>
          <p className="text-red-500/45 text-xs leading-relaxed mb-3">
            A senha deve conter pelo menos uma letra maiúscula, um caractere
            especial e um número.
          </p>
          <form
            onSubmit={handleAlterarSenha}
            className="bg-ctblack2 rounded-xl border border-ctgray p-4 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs font-medium">
                Senha Atual
              </label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                required
                className="bg-ctblack border border-ctgray rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ctred transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs font-medium">
                Nova Senha
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                className="bg-ctblack border border-ctgray rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ctred transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-xs font-medium">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="bg-ctblack border border-ctgray rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ctred transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 w-full bg-ctred hover:bg-ctred2 text-white font-semibold text-sm py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? "Atualizando..." : "Alterar Senha"}
            </button>
          </form>
        </section>
      </div>

      {/* Exibição de Feedback */}
      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onFechar={() => setToast(null)}
        />
      )}
    </div>
  );
}
