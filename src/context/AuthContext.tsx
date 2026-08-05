import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { AuthApi } from '../services/api'
import type { Usuario } from '../types'

interface AuthContextType {
  usuario: Usuario | null
  carregando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('ctfoco_usuario')
    const token = localStorage.getItem('ctfoco_token')
    if (usuarioSalvo && token) {
      setUsuario(JSON.parse(usuarioSalvo))
    }
    setCarregando(false)
  }, [])

  async function login(username: string, password: string) {
    const resposta = await AuthApi.login(username, password)
    localStorage.setItem('ctfoco_token', resposta.token)
    localStorage.setItem('ctfoco_usuario', JSON.stringify(resposta.usuario))
    setUsuario(resposta.usuario)
  }

  function logout() {
    localStorage.removeItem('ctfoco_token')
    localStorage.removeItem('ctfoco_usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return context
}
