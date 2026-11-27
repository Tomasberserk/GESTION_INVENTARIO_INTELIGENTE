import { Bell, User, Menu, LogOut, ShoppingCart, Sparkles, Mic, Bot } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useAgent } from '../../context/AgentContext'
import { isAdmin } from '../../utils/permissions'

export default function Header({ onMenuToggle }) {
  const { usuario, logout } = useAuth()
  const { carrito, setCarritoAbierto } = useCart()
  const {
    tieneAccesoPro,
    esTrialActivo,
    trialExpirado,
    esPlanPro,
    diasTrialRestantes,
    chatAbierto,
    abrirModoVoz,
    toggleChat,
    abrirUpsell,
  } = useAgent()

  const esAdmin = isAdmin(usuario)
  const nombreMostrar = usuario?.nombre?.trim() || usuario?.email?.split('@')[0] || 'Usuario'
  const rolTexto = esAdmin ? 'Administrador' : 'Cajero'

  return (
    <header className="min-h-14 py-1 bg-slate-800 border-b border-slate-700 flex items-center justify-between gap-1 sm:gap-3 px-2 sm:px-6 shrink-0">
      <div className="flex items-center gap-1 sm:gap-3 min-w-0">
        {/* Hamburguesa — solo visible en mobile */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Abrir menú"
          className="min-w-12 min-h-12 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors shrink-0 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white font-semibold text-sm sm:text-lg tracking-tight truncate">
            Gestión Neiva
          </span>
          <span className="hidden md:inline-block text-slate-500 text-xs font-mono shrink-0">
            v1.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* Accesos Inteligentes: Modo Voz y Chat IA */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Badge de Suscripción / Trial Pro */}
          {esTrialActivo && (
            <button
              type="button"
              onClick={() => abrirUpsell('conocer_pro')}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 hover:from-violet-500/30 hover:to-indigo-500/30 border border-violet-400/30 text-violet-200 hover:text-white text-[11px] font-semibold transition-all"
              title="Período de prueba Pro de 15 días activo. Clic para conocer más."
            >
              <Sparkles size={12} className="text-amber-300" />
              <span>Prueba Pro ({diasTrialRestantes}d)</span>
            </button>
          )}

          {trialExpirado && (
            <button
              type="button"
              onClick={() => abrirUpsell('trial_vencido')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[11px] font-bold transition-all"
              title="Prueba de 15 días finalizada. Clic para reactivar el Plan Pro."
            >
              <span>Activar Pro</span>
            </button>
          )}

          {esPlanPro && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
              ⭐ Pro
            </span>
          )}

          {/* Botón Modo Voz */}
          <button
            type="button"
            onClick={abrirModoVoz}
            aria-label={tieneAccesoPro ? 'Abrir Modo Mostrador por Voz' : 'Modo Voz (Función Pro)'}
            className={`min-w-12 min-h-12 flex items-center justify-center gap-1 px-2 sm:px-3 rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95 ${
              tieneAccesoPro
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 border border-slate-600'
            }`}
            title={tieneAccesoPro ? 'Abrir Modo Mostrador por Voz (Manos Libres)' : 'Modo Voz (Función Pro)'}
          >
            <Mic size={16} className={tieneAccesoPro ? 'animate-pulse text-cyan-200' : 'text-slate-400'} />
            <span className="hidden sm:inline">Voz</span>
          </button>

          {/* Botón Chat IA */}
          <button
            type="button"
            onClick={toggleChat}
            aria-label={tieneAccesoPro ? 'Abrir Asistente Virtual POS' : 'Chat IA (Función Pro)'}
            className={`min-w-12 min-h-12 flex items-center justify-center gap-1 px-2 sm:px-3 rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95 ${
              chatAbierto
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                : tieneAccesoPro
                ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 border border-slate-600'
            }`}
            title={tieneAccesoPro ? 'Abrir Asistente Virtual POS' : 'Chat IA (Función Pro)'}
          >
            <Bot size={16} className={tieneAccesoPro ? 'text-indigo-300' : 'text-slate-400'} />
            <span className="hidden sm:inline">Chat IA</span>
          </button>
        </div>

        {/* Botón permanente del Carrito / Caja Registradora */}
        <button
          type="button"
          onClick={() => setCarritoAbierto((prev) => !prev)}
          aria-label="Abrir mostrador de ventas"
          className="relative min-w-12 min-h-12 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          title="Abrir mostrador de ventas"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Caja / Mostrador</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 sm:static sm:ml-1 px-1.5 py-0.5 rounded-full bg-white text-emerald-800 text-[10px] font-black leading-none shadow-xs">
              {carrito.length}
            </span>
          )}
        </button>

        {/* Identidad del usuario con badge sutil */}
        <div className="hidden sm:flex items-center gap-2 text-slate-300 text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 text-xs font-bold">
            {nombreMostrar.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-medium text-slate-200 truncate max-w-[150px] leading-tight">
              {nombreMostrar}
            </span>
            <span
              className={`text-[10px] font-medium leading-none mt-0.5 px-1.5 py-0.5 rounded w-fit ${
                esAdmin
                  ? 'bg-violet-900/60 text-violet-300 border border-violet-700/50'
                  : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
              }`}
            >
              {rolTexto}
            </span>
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <button
          type="button"
          onClick={logout}
          aria-label="Cerrar sesión"
          className="min-w-12 min-h-12 flex items-center justify-center gap-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 px-2 sm:px-2.5 rounded-lg text-xs font-medium transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
