import { NavLink } from "react-router-dom";

/**
 * Menu inferior visível apenas para administradores, permitindo alternar
 * entre "Bater Ponto" e "Relatórios".
 */
export default function BottomNav() {
  const itemClasse = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium transition-colors ${
      isActive ? "text-ctred" : "text-gray-500"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-ctblack2 border-t border-ctgray flex items-stretch h-16 z-40">
      <NavLink to="/ponto" className={itemClasse}>
        <span className="text-xl">⏱️</span>
        Bater Ponto
      </NavLink>
      <NavLink to="/dashboard" className={itemClasse}>
        <span className="text-xl">📊</span>
        Relatórios
      </NavLink>
    </nav>
  );
}
