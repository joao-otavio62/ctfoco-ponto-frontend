import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RelatoriosApi, UsuariosApi } from "../services/api";
import type { RelatorioDia, Usuario } from "../types";

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

function primeiroDiaDoMesISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [funcionarios, setFuncionarios] = useState<Usuario[]>([]);
  const [relatorio, setRelatorio] = useState<RelatorioDia[]>([]);
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMesISO());
  const [dataFim, setDataFim] = useState(hojeISO());
  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    UsuariosApi.listar()
      .then(setFuncionarios)
      .catch(() => {});
  }, []);

  useEffect(() => {
    buscarRelatorio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buscarRelatorio() {
    setCarregando(true);
    setErro("");
    try {
      const usuarioId = funcionarioSelecionado
        ? Number(funcionarioSelecionado)
        : undefined;
      const dados = await RelatoriosApi.obter(dataInicio, dataFim, usuarioId);
      setRelatorio(dados);
    } catch {
      setErro("Não foi possível carregar o relatório.");
    } finally {
      setCarregando(false);
    }
  }

  // Cards de resumo (RF04)
  const totalHoras = relatorio.reduce((acc, r) => acc + r.horasTrabalhadas, 0);
  const totalAtrasos = relatorio.filter((r) => r.saldoHoras < 0).length;
  const totalExtras = relatorio.filter((r) => r.saldoHoras > 0).length;

  return (
    <div className="min-h-screen bg-ctblack pb-24">
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">
            Painel Admin
          </p>
          <p className="text-white font-semibold">{usuario?.nome}</p>
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

      {/* Filtros */}
      <div className="px-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-500 text-xs mb-1">De</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full bg-ctblack2 border border-ctgray text-white rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:border-ctred"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1">Até</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full bg-ctblack2 border border-ctgray text-white rounded-lg px-3 py-2 text-sm
                focus:outline-none focus:border-ctred"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-xs mb-1">
            Funcionário
          </label>
          <select
            value={funcionarioSelecionado}
            onChange={(e) => setFuncionarioSelecionado(e.target.value)}
            className="w-full bg-ctblack2 border border-ctgray text-white rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:border-ctred"
          >
            <option value="">Todos os funcionários</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={buscarRelatorio}
          className="w-full bg-ctred hover:bg-ctred2 text-white font-semibold py-2.5 rounded-lg
            transition-colors text-sm"
        >
          Filtrar
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-5">
        <div className="bg-ctblack2 border border-ctgray rounded-xl p-3 text-center">
          <p className="text-white font-bold text-lg">
            {totalHoras.toFixed(1)}h
          </p>
          <p className="text-gray-500 text-[11px] mt-0.5">Horas totais</p>
        </div>
        <div className="bg-ctblack2 border border-ctgray rounded-xl p-3 text-center">
          <p className="text-ctred2 font-bold text-lg">{totalAtrasos}</p>
          <p className="text-gray-500 text-[11px] mt-0.5">Atrasos</p>
        </div>
        <div className="bg-ctblack2 border border-ctgray rounded-xl p-3 text-center">
          <p className="text-green-500 font-bold text-lg">{totalExtras}</p>
          <p className="text-gray-500 text-[11px] mt-0.5">Horas extras</p>
        </div>
      </div>

      {/* Listagem */}
      <div className="px-5 mt-6">
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
          Registros do período
        </h2>

        {carregando && (
          <p className="text-gray-600 text-sm text-center py-6">
            Carregando...
          </p>
        )}
        {erro && <p className="text-ctred2 text-sm text-center py-6">{erro}</p>}

        {!carregando && !erro && relatorio.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-6">
            Nenhum registro no período.
          </p>
        )}

        <div className="space-y-3">
          {relatorio.map((r, idx) => (
            <div
              key={`${r.usuarioId}-${r.data}-${idx}`}
              className="bg-ctblack2 border border-ctgray rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {r.nomeUsuario}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(r.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    r.status === "Completo"
                      ? "bg-green-600/20 text-green-500"
                      : r.status === "Em andamento"
                        ? "bg-yellow-600/20 text-yellow-500"
                        : "bg-ctred/20 text-ctred2"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center mb-2">
                <HorarioMini label="Entrada" valor={r.entrada} />
                <HorarioMini label="Intervalo" valor={r.inicioIntervalo} />
                <HorarioMini label="Retorno" valor={r.fimIntervalo} />
                <HorarioMini label="Saída" valor={r.saida} />
              </div>

              <div className="flex items-center justify-between border-t border-ctgray pt-2 mt-2">
                <span className="text-gray-400 text-xs">Horas trabalhadas</span>
                <span className="text-white font-bold text-sm">
                  {r.horasTrabalhadas.toFixed(2)}h
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Saldo</span>
                <span
                  className={`font-bold text-sm ${
                    r.saldoHoras > 0
                      ? "text-green-500"
                      : r.saldoHoras < 0
                        ? "text-ctred2"
                        : "text-gray-400"
                  }`}
                >
                  {r.saldoHoras > 0 ? "+" : ""}
                  {r.saldoHoras.toFixed(2)}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HorarioMini({
  label,
  valor,
}: {
  label: string;
  valor: string | null;
}) {
  return (
    <div>
      <p className="text-gray-600 text-[10px] uppercase">{label}</p>
      <p className="text-gray-200 text-xs font-semibold tabular-nums">
        {valor
          ? new Date(valor).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--"}
      </p>
    </div>
  );
}
