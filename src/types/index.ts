export type Role = "Admin" | "Colaborador";

export enum TipoRegistro {
  Entrada = 1,
  InicioIntervalo = 2,
  FimIntervalo = 3,
  Saida = 4,
}

export interface Usuario {
  id: number;
  nome: string;
  username: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  expiraEm: string;
  usuario: Usuario;
}

export interface RegistroPonto {
  id: number;
  tipoRegistro: TipoRegistro;
  tipoRegistroDescricao: string;
  dataHoraRegistro: string;
  proximoRegistro: TipoRegistro | null;
}

export interface StatusDia {
  registrosHoje: RegistroPonto[];
  proximoRegistro: TipoRegistro | null;
  cicloCompleto: boolean;
}

export interface RelatorioDia {
  usuarioId: number;
  nomeUsuario: string;
  data: string;
  entrada: string | null;
  inicioIntervalo: string | null;
  fimIntervalo: string | null;
  saida: string | null;
  horasTrabalhadas: number;
  saldoHoras: number;
  status: string;
}

export const ROTULOS_PROXIMO_REGISTRO: Record<TipoRegistro, string> = {
  [TipoRegistro.Entrada]: "Registrar Entrada",
  [TipoRegistro.InicioIntervalo]: "Iniciar Intervalo",
  [TipoRegistro.FimIntervalo]: "Encerrar Intervalo",
  [TipoRegistro.Saida]: "Registrar Saída",
};
