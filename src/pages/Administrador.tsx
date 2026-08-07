import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast, { type ToastTipo } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { UsuariosApi } from "../services/api";

interface Funcionario {
  id: number;
  nome: string;
  username: string;
  role: string;
}

export default function PainelAdmin() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState<"cadastrar" | "listar">("cadastrar");

  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");

  // Estados da Listagem
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState<{
    mensagem: string;
    tipo: ToastTipo;
  } | null>(null);

  useEffect(() => {
    if (abaAtiva === "listar") {
      carregarFuncionarios();
    }
  }, [abaAtiva]);

  function alternarAba(novaAba: "cadastrar" | "listar") {
    setAbaAtiva(novaAba);
    if (novaAba === "listar") {
      carregarFuncionarios();
    }
  }

  async function carregarFuncionarios() {
    setCarregandoLista(true);
    try {
      console.log("Chamando UsuariosApi.listarFuncionarios()...");
      const data = await UsuariosApi.listarFuncionarios();
      console.log("Funcionários recebidos:", data);
      setFuncionarios(data);
    } catch (err: any) {
      console.error("Erro ao carregar funcionários:", err);
      const mensagem =
        err?.response?.data?.mensagem ||
        err?.response?.data ||
        "Erro ao carregar a lista de funcionários.";

      setToast({
        mensagem,
        tipo: "erro",
      });
    } finally {
      setCarregandoLista(false);
    }
  }

  async function handleCriarFuncionario(e: React.FormEvent) {
    e.preventDefault();

    if (nome.length < 3 || username.length < 3) {
      setToast({
        mensagem: "Preencha os campos com pelo menos 3 caracteres.",
        tipo: "erro",
      });
      return;
    }

    setCarregando(true);

    try {
      const resposta = await UsuariosApi.criarFuncionario({ nome, username });

      setToast({
        mensagem: resposta.mensagem || "Funcionário criado com sucesso!",
        tipo: "sucesso",
      });

      setNome("");
      setUsername("");
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem ||
        (err?.response?.status === 401
          ? "Sessão expirada. Faça login novamente."
          : err?.response?.status === 403
            ? "Acesso negado: Apenas administradores podem realizar esta ação."
            : "Erro ao criar funcionário.");

      setToast({ mensagem, tipo: "erro" });
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletarFuncionario(id: number, nomeFuncionario: string) {
    if (!window.confirm(`Tem certeza que deseja remover ${nomeFuncionario}?`)) {
      return;
    }

    setDeletandoId(id);

    try {
      const resposta = await UsuariosApi.deletarFuncionario(id);

      setToast({
        mensagem: resposta.mensagem || "Funcionário removido com sucesso!",
        tipo: "sucesso",
      });

      // Atualiza a lista localmente
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem || "Erro ao remover funcionário.";
      setToast({ mensagem, tipo: "erro" });
    } finally {
      setDeletandoId(null);
    }
  }

  return (
    <div className="min-h-screen bg-ctblack flex flex-col pb-24">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between px-5 pt-6 pb-6">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">
            Painel Admin
          </p>
          <h1 className="text-white font-semibold text-lg">
            Gestão de Colaboradores
          </h1>
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
        {/* Navegação entre Abas */}
        <div className="flex bg-ctblack2 p-1 rounded-xl border border-ctgray">
          <button
            type="button"
            onClick={() => alternarAba("cadastrar")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              abaAtiva === "cadastrar"
                ? "bg-ctblack text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => alternarAba("listar")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              abaAtiva === "listar"
                ? "bg-ctblack text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Equipe Ativa
          </button>
        </div>

        {/* Conteúdo da Aba 1: Formulário de Cadastro */}
        {abaAtiva === "cadastrar" && (
          <section>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
              Dados do Novo Colaborador
            </h2>
            <form
              onSubmit={handleCriarFuncionario}
              className="bg-ctblack2 rounded-xl border border-ctgray p-4 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs font-medium">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="bg-ctblack border border-ctgray rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ctred transition-colors"
                  placeholder="Ex: Carlos Silva"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-xs font-medium">
                  Nome de usuário (Login)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-ctblack border border-ctgray rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ctred transition-colors"
                  placeholder="Ex: carlos.silva"
                />
              </div>

              <div className="bg-ctblack border-l-2 border-ctgray p-3 rounded-r-lg mt-2">
                <p className="text-gray-400 text-xs leading-relaxed">
                  A senha inicial será configurada automaticamente como: <br />
                  <strong className="text-white">Funcfoco@2024</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="mt-2 w-full bg-ctred hover:bg-ctred2 text-white font-semibold text-sm py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregando ? "Processando..." : "Cadastrar Funcionário"}
              </button>
            </form>
          </section>
        )}

        {/* Conteúdo da Aba 2: Lista de Funcionários */}
        {abaAtiva === "listar" && (
          <section>
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
              Funcionários Cadastrados
            </h2>
            <div className="bg-ctblack2 rounded-xl border border-ctgray p-4 flex flex-col gap-3">
              {carregandoLista ? (
                <p className="text-gray-500 text-xs text-center py-4">
                  Carregando lista...
                </p>
              ) : funcionarios.length === 0 ? (
                <p className="text-gray-500 text-xs text-center py-4">
                  Nenhum funcionário cadastrado.
                </p>
              ) : (
                funcionarios.map((func, index) => (
                  <div key={func.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">
                          {func.nome}
                        </p>
                        <p className="text-gray-500 text-xs">
                          @{func.username}
                        </p>
                      </div>

                      {func.role !== "Admin" && (
                        <button
                          onClick={() =>
                            handleDeletarFuncionario(func.id, func.nome)
                          }
                          disabled={deletandoId === func.id}
                          className="bg-ctblack hover:bg-ctred/20 text-ctred border border-ctred/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {deletandoId === func.id ? "..." : "Remover"}
                        </button>
                      )}
                    </div>

                    {index < funcionarios.length - 1 && (
                      <div className="h-px bg-ctgray w-full"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>

      {/* Toast de Feedback */}
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
