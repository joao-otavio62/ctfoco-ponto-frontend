import axios from "axios";
import type {
  LoginResponse,
  RegistroPonto,
  RelatorioDia,
  StatusDia,
  Usuario,
} from "../types";

// Trata a URL para garantir que o sufixo api esteja presente sem duplicar
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const baseURL = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
});

// Anexa o token JWT em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ctfoco_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirar/for inválido, desloga automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("ctfoco_token");
      localStorage.removeItem("ctfoco_usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const AuthApi = {
  alterarSenha: async (dados: { senhaAtual: string; novaSenha: string }) => {
    const response = await api.put("/auth/alterar-senha", dados);
    return response.data;
  },

  login: async (username: string, password: string) => {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    return data;
  },
};

export const PontoApi = {
  // RF03 - status do dia para saber qual o próximo botão exibir
  obterStatus: async () => {
    const { data } = await api.get<StatusDia>("/ponto/status");
    return data;
  },
  // RF02 / RNF - o front-end NÃO envia data/hora, apenas dispara a ação
  registrar: async () => {
    const { data } = await api.post<RegistroPonto>("/ponto/registrar");
    return data;
  },
};

export const RelatoriosApi = {
  obter: async (dataInicio: string, dataFim: string, usuarioId?: number) => {
    const { data } = await api.get<RelatorioDia[]>("/relatorios", {
      params: { dataInicio, dataFim, usuarioId },
    });
    return data;
  },
};

export const UsuariosApi = {
  // Alias para manter compatibilidade com o Dashboard
  listar: async () => {
    const { data } = await api.get<Usuario[]>("/usuarios");
    return data;
  },

  // Método utilizado no PainelAdmin
  listarFuncionarios: async () => {
    const { data } = await api.get<Usuario[]>("/usuarios");
    return data;
  },

  criarFuncionario: async (dados: { nome: string; username: string }) => {
    const { data } = await api.post("/usuarios/criar-funcionario", dados);
    return data;
  },

  deletarFuncionario: async (id: number) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};

export default api;
