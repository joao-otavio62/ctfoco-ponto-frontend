import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  rolesPermitidas?: Role[]
}

/**
 * Bloqueia o acesso a rotas que exigem autenticação e, opcionalmente,
 * uma Role específica (ex: dashboard apenas para Admin - RF04).
 */
export default function ProtectedRoute({ children, rolesPermitidas }: ProtectedRouteProps) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen bg-ctblack flex items-center justify-center text-white">
        Carregando...
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (rolesPermitidas && !rolesPermitidas.includes(usuario.role)) {
    return <Navigate to="/ponto" replace />
  }

  return <>{children}</>
}
