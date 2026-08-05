import { useEffect } from 'react'

export type ToastTipo = 'sucesso' | 'erro'

interface ToastProps {
  mensagem: string
  tipo: ToastTipo
  onFechar: () => void
  duracaoMs?: number
}

/**
 * Notificação toast: verde para sucesso (confirmação do horário salvo),
 * vermelha para erros de validação de sequência.
 */
export default function Toast({ mensagem, tipo, onFechar, duracaoMs = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onFechar, duracaoMs)
    return () => clearTimeout(timer)
  }, [onFechar, duracaoMs])

  const cor = tipo === 'sucesso' ? 'bg-green-600' : 'bg-ctred'

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm
        ${cor} text-white font-medium px-4 py-3 rounded-xl shadow-2xl
        animate-[fadeIn_0.2s_ease-out] text-center text-sm`}
    >
      {mensagem}
    </div>
  )
}
