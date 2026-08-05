import { useEffect, useState } from 'react'

/**
 * Relógio digital apenas visual (a fonte de verdade do horário é sempre o servidor).
 * Atualiza a cada segundo com base no relógio local do dispositivo.
 */
export default function Clock() {
  const [agora, setAgora] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const data = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-white tracking-wider tabular-nums">{hora}</p>
      <p className="text-sm text-gray-400 capitalize mt-1">{data}</p>
    </div>
  )
}
