import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Clock from "../components/Clock";
import RippleButton from "../components/RippleButton";
import Toast, { type ToastTipo } from "../components/Toast";
import { PontoApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ROTULOS_PROXIMO_REGISTRO, type StatusDia } from "../types";

const BLOQUEIO_MS = 5000; // Bloqueia novos cliques por 5 segundos após bater o ponto

export default function Ponto() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusDia | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [carregandoAcao, setCarregandoAcao] = useState(false);
  const [toast, setToast] = useState<{
    mensagem: string;
    tipo: ToastTipo;
  } | null>(null);

  const carregarStatus = useCallback(async () => {
    try {
      const dados = await PontoApi.obterStatus();
      setStatus(dados);
    } catch {
      setToast({
        mensagem: "Não foi possível carregar o status do dia.",
        tipo: "erro",
      });
    }
  }, []);

  useEffect(() => {
    carregarStatus();
  }, [carregarStatus]);

  async function handleRegistrar() {
    if (bloqueado || carregandoAcao || !status?.proximoRegistro) return;

    setCarregandoAcao(true);
    try {
      // O front-end apenas dispara a ação — o horário é sempre capturado pelo backend (RNF)
      const registro = await PontoApi.registrar();
      const horaFormatada = new Date(
        registro.dataHoraRegistro,
      ).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setToast({
        mensagem: `${registro.tipoRegistroDescricao} registrada às ${horaFormatada}!`,
        tipo: "sucesso",
      });
      await carregarStatus();

      setBloqueado(true);
      setTimeout(() => setBloqueado(false), BLOQUEIO_MS);
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem ||
        "Erro ao registrar o ponto. Tente novamente.";
      setToast({ mensagem, tipo: "erro" });
    } finally {
      setCarregandoAcao(false);
    }
  }

  const rotuloBotao = status?.proximoRegistro
    ? ROTULOS_PROXIMO_REGISTRO[status.proximoRegistro]
    : "Ciclo do dia concluído";

  return (
    <div className="min-h-screen bg-ctblack flex flex-col pb-24">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">
            Bem-vindo(a)
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
            onClick={() => navigate("/perfil")}
            className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
          >
            Perfil
          </button>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-ctred text-sm font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Relógio */}
      <div className="mt-8">
        <Clock />
      </div>

      {/* Botão principal de ponto */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <RippleButton
          onClick={handleRegistrar}
          disabled={bloqueado || carregandoAcao || !status?.proximoRegistro}
          className="w-56 h-56 rounded-full bg-ctred flex items-center justify-center
            shadow-2xl shadow-ctred/40 border-4 border-ctred2/30"
        >
          <span className="text-white font-bold text-lg text-center px-6 leading-tight">
            {carregandoAcao ? "Registrando..." : rotuloBotao}
          </span>
        </RippleButton>

        {bloqueado && (
          <p className="text-gray-500 text-xs">
            Aguarde alguns segundos para bater novamente
          </p>
        )}
      </div>

      {/* Resumo dos registros de hoje */}
      <div className="px-5">
        <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
          Registros de hoje
        </h2>
        <div className="bg-ctblack2 rounded-xl border border-ctgray divide-y divide-ctgray overflow-hidden">
          {status && status.registrosHoje.length > 0 ? (
            status.registrosHoje.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-gray-300 text-sm">
                  {r.tipoRegistroDescricao}
                </span>
                <span className="text-white font-semibold text-sm tabular-nums">
                  {new Date(r.dataHoraRegistro).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm text-center py-4">
              Nenhum registro hoje ainda
            </p>
          )}
        </div>
      </div>

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
