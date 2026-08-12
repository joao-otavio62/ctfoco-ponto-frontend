import axios from "axios";
import type {
  LoginResponse,
  RegistroPonto,
  RelatorioDia,
  StatusDia,
  Usuario,
  Cargo,
} from "../types";

// Trata a URL para garantir que o sufixo api esteja presente sem duplicar
const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const baseURL = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ctfoco_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  obterStatus: async () => {
    const { data } = await api.get<StatusDia>("/ponto/status");
    return data;
  },
  // RF02 / RNF - o front-end NÃO envia data/hora, apenas dispara a ação
  registrar: async () => {
    return new Promise<RegistroPonto>((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(
          new Error("Geolocalização não é suportada pelo seu navegador."),
        );
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const { data } = await api.post<RegistroPonto>("/ponto/registrar", {
              latitude,
              longitude,
            });
            resolve(data);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(
                new Error(
                  "Permissão negada. Você precisa autorizar o acesso à localização para bater o ponto.",
                ),
              );
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("Sinal de GPS/localização indisponível."));
              break;
            case error.TIMEOUT:
              reject(new Error("Tempo esgotado ao obter a localização."));
              break;
            default:
              reject(new Error("Erro ao capturar a localização."));
              break;
          }
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  },
};

export const RelatoriosApi = {
  obter: async (dataInicio: string, dataFim: string, usuarioId?: number) => {
    const { data } = await api.get<RelatorioDia[]>("/relatorios", {
      params: {
        dataInicio,
        dataFim,
        usuarioId,
      },
    });
    return data;
  },
};

export const UsuariosApi = {
  listar: async () => {
    const { data } = await api.get<Usuario[]>("/usuarios");
    return data;
  },

  listarFuncionarios: async () => {
    const { data } = await api.get<Usuario[]>("/usuarios");
    return data;
  },

  // Aceita o campo cargo na criação
  criarFuncionario: async (dados: {
    nome: string;
    username: string;
    cargo: Cargo;
  }) => {
    const { data } = await api.post("/usuarios/criar-funcionario", dados);
    return data;
  },

  deletarFuncionario: async (id: number) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};

export default api;
