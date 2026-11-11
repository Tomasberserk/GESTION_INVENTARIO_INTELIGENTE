import React, { useReducer, useMemo, useState } from 'react'
import {
  CheckCircle2,
  RotateCcw,
  Plus,
  Minus,
  TrendingUp,
  Receipt,
  Store,
  Sparkles,
  ArrowRight,
  PackageCheck
} from 'lucide-react'

// Productos de demostración estáticos con costos y precios colombianos realistas
const DEMO_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Arroz Diana 1 kg',
    cost: 4100,
    price: 5200,
    initialStock: 18,
    category: 'Abarrotes'
  },
  {
    id: 'prod-2',
    sku: 'SKU-014',
    name: 'Leche Alquería Entera 1 L',
    cost: 3500,
    price: 4500,
    initialStock: 12,
    category: 'Lácteos'
  },
  {
    id: 'prod-3',
    sku: 'SKU-022',
    name: 'Café Sello Rojo 250 g',
    cost: 13800,
    price: 17600,
    initialStock: 8,
    category: 'Despensa'
  }
]

const INITIAL_STATE = {
  // Productos y su stock actual en la simulación
  inventory: DEMO_PRODUCTS.map(p => ({ ...p, stock: p.initialStock })),
  // Carrito de compras actual (cantidades seleccionadas)
  cart: {
    'prod-1': 2,
    'prod-2': 1,
    'prod-3': 1
  },
  status: 'idle', // 'idle' | 'processing' | 'completed'
  completedSaleSummary: null
}

function posReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT_ITEM': {
      if (state.status === 'processing') return state
      const { id } = action.payload
      const product = state.inventory.find(p => p.id === id)
      if (!product || product.stock <= (state.cart[id] || 0)) return state

      return {
        ...state,
        status: 'idle',
        cart: {
          ...state.cart,
          [id]: (state.cart[id] || 0) + 1
        }
      }
    }

    case 'DECREMENT_ITEM': {
      if (state.status === 'processing') return state
      const { id } = action.payload
      const currentQty = state.cart[id] || 0
      if (currentQty <= 0) return state

      const newCart = { ...state.cart }
      if (currentQty === 1) {
        delete newCart[id]
      } else {
        newCart[id] = currentQty - 1
      }

      return {
        ...state,
        status: 'idle',
        cart: newCart
      }
    }

    case 'SET_PROCESSING': {
      if (state.status === 'processing') return state
      return {
        ...state,
        status: 'processing'
      }
    }

    case 'COMPLETE_SALE': {
      // Validar que hay artículos
      const hasItems = Object.values(state.cart).some(qty => qty > 0)
      if (!hasItems) return { ...state, status: 'idle' }

      // Descontar inventario de forma inmutable
      const newInventory = state.inventory.map(prod => {
        const qtySold = state.cart[prod.id] || 0
        return {
          ...prod,
          stock: Math.max(0, prod.stock - qtySold)
        }
      })

      return {
        ...state,
        inventory: newInventory,
        status: 'completed',
        completedSaleSummary: action.payload.summary,
        cart: {}
      }
    }

    case 'RESET_DEMO': {
      return {
        ...INITIAL_STATE,
        inventory: DEMO_PRODUCTS.map(p => ({ ...p, stock: p.initialStock }))
      }
    }

    default:
      return state
  }
}

export default function LiveDemoPos() {
  const [state, dispatch] = useReducer(posReducer, INITIAL_STATE)

  // Cálculos financieros deterministas memorizados
  const calculations = useMemo(() => {
    let totalSale = 0
    let totalCost = 0
    let itemsCount = 0

    state.inventory.forEach(product => {
      const qty = state.cart[product.id] || 0
      if (qty > 0) {
        itemsCount += qty
        totalSale += product.price * qty
        totalCost += product.cost * qty
      }
    })

    const grossMarginValue = totalSale - totalCost
    const grossMarginPercent = totalSale > 0 ? ((grossMarginValue / totalSale) * 100).toFixed(1) : '0.0'

    return {
      totalSale,
      totalCost,
      grossMarginValue,
      grossMarginPercent,
      itemsCount
    }
  }, [state.cart, state.inventory])

  // Manejador de cobro protegido con transición breve
  const handleCobrarVenta = () => {
    if (state.status === 'processing' || calculations.itemsCount === 0) return

    dispatch({ type: 'SET_PROCESSING' })

    // Simulación de respuesta inmediata de caja (350ms)
    setTimeout(() => {
      dispatch({
        type: 'COMPLETE_SALE',
        payload: {
          summary: {
            total: calculations.totalSale,
            marginValue: calculations.grossMarginValue,
            marginPercent: calculations.grossMarginPercent,
            itemsSold: calculations.itemsCount
          }
        }
      })
    }, 350)
  }

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl p-5 sm:p-6 backdrop-blur-xl border shadow-2xl relative overflow-hidden transition-all"
      style={{
        background: 'rgba(22, 40, 31, 0.92)',
        borderColor: 'rgba(245, 239, 230, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(10, 15, 12, 0.7)'
      }}
    >
      {/* Top Header del Terminal */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Store size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-slate-100 uppercase font-mono">
                Terminal POS · GIN
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                En Línea
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Caja Mostrador · Tienda Local
            </p>
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'RESET_DEMO' })}
          className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-amber-400/30 hover:bg-white/5 transition-all"
          title="Restablecer simulación"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline font-mono text-[11px]">Reiniciar</span>
        </button>
      </div>

      {/* Métricas Financieras en Vivo: Margen Bruto Estimado */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="bg-[#101613]/90 rounded-2xl p-3 border border-white/5">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
            Total en Mostrador
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#f5efe6] font-mono tracking-tight block">
            {state.status === 'completed' && state.completedSaleSummary
              ? formatCOP(state.completedSaleSummary.total)
              : formatCOP(calculations.totalSale)}
          </span>
          <span className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1 mt-0.5">
            {calculations.itemsCount} {calculations.itemsCount === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        <div className="bg-[#101613]/90 rounded-2xl p-3 border border-amber-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300/90 flex items-center gap-1">
              <TrendingUp size={12} />
              Margen Bruto Est.
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
              +{state.status === 'completed' && state.completedSaleSummary
                ? state.completedSaleSummary.marginPercent
                : calculations.grossMarginPercent}%
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-200 font-mono tracking-tight block">
            {state.status === 'completed' && state.completedSaleSummary
              ? formatCOP(state.completedSaleSummary.marginValue)
              : formatCOP(calculations.grossMarginValue)}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            Venta menos costo base
          </span>
        </div>
      </div>

      {/* Lista Táctil de Productos en Caja */}
      <div className="space-y-2.5 my-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>Artículo / Existencias</span>
          <span>Precio / Cantidad</span>
        </div>

        {state.inventory.map((product) => {
          const qty = state.cart[product.id] || 0
          const isOutOfStock = product.stock === 0

          return (
            <div
              key={product.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                qty > 0
                  ? 'bg-[#101613] border-emerald-500/30 shadow-sm'
                  : 'bg-[#101613]/50 border-white/5 opacity-80'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#f5efe6] truncate block">
                    {product.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs font-mono">
                  <span className="text-slate-400">
                    Stock: <strong className={product.stock <= 5 ? 'text-amber-400' : 'text-slate-200'}>{product.stock}</strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Costo: {formatCOP(product.cost)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#f5efe6] block">
                    {formatCOP(product.price * (qty || 1))}
                  </span>
                  {qty > 1 && (
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {formatCOP(product.price)} c/u
                    </span>
                  )}
                </div>

                {/* Controles Táctiles [+] [-] */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    aria-label={`Quitar unidad de ${product.name}`}
                    disabled={qty === 0 || state.status === 'processing'}
                    onClick={() => dispatch({ type: 'DECREMENT_ITEM', payload: { id: product.id } })}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <Minus size={13} />
                  </button>

                  <span className="w-6 text-center font-mono font-bold text-xs text-[#f5efe6]">
                    {qty}
                  </span>

                  <button
                    type="button"
                    aria-label={`Agregar unidad de ${product.name}`}
                    disabled={isOutOfStock || qty >= product.stock || state.status === 'processing'}
                    onClick={() => dispatch({ type: 'INCREMENT_ITEM', payload: { id: product.id } })}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-300 hover:text-white hover:bg-amber-500/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Estado de Venta / Botón Principal de Acción */}
      <div className="pt-2">
        {state.status === 'completed' ? (
          <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-3.5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm mb-1">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>¡Venta registrada con éxito!</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              Stock descontado al instante · Ganancia bruta asegurada: {formatCOP(state.completedSaleSummary?.marginValue || 0)}
            </p>
            <button
              onClick={() => dispatch({ type: 'RESET_DEMO' })}
              className="mt-3 text-xs text-emerald-400 underline underline-offset-4 hover:text-emerald-300 font-semibold"
            >
              Simular otra venta de mostrador
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={calculations.itemsCount === 0 || state.status === 'processing'}
            onClick={handleCobrarVenta}
            className="w-full font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            style={{
              background: 'var(--ambar)',
              color: 'var(--noche)',
              boxShadow: '0 10px 25px -5px rgba(216, 154, 61, 0.4)'
            }}
          >
            {state.status === 'processing' ? (
              <span className="flex items-center gap-2 font-mono text-sm">
                <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Registrando en caja...
              </span>
            ) : (
              <>
                <Receipt size={18} />
                <span>Cobrar venta {calculations.totalSale > 0 && `(${formatCOP(calculations.totalSale)})`}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer del Simulador: Transparencia y Datos Ilustrativos */}
      <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          SIMULACIÓN · DATOS ILUSTRATIVOS
        </span>
        <span className="text-slate-400">
          Aritmética determinista
        </span>
      </div>
    </div>
  )
}
