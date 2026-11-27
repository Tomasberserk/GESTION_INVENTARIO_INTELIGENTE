import { test, expect } from '@playwright/test'
import crypto from 'node:crypto'

const API_URL = process.env.MOBILE_API_URL || 'http://127.0.0.1:8000'
const PUBLIC_ONLY = process.env.MOBILE_PUBLIC_ONLY === '1'
const MIN_TARGET = 48

async function assertNoHorizontalOverflow(page, routeLabel, { checkMain = false, checkHeader = false } = {}) {
  const dims = await page.evaluate(() => {
    const main = document.querySelector('main')
    const header = document.querySelector('header')
    return {
      innerWidth: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      headerScrollWidth: header ? header.scrollWidth : null,
      headerClientWidth: header ? header.clientWidth : null,
      mainScrollWidth: main ? main.scrollWidth : null,
      mainClientWidth: main ? main.clientWidth : null,
    }
  })

  expect(
    dims.docScrollWidth,
    `${routeLabel}: documentElement.scrollWidth (${dims.docScrollWidth}) > innerWidth (${dims.innerWidth})`
  ).toBeLessThanOrEqual(dims.innerWidth)

  if (checkHeader && dims.headerScrollWidth !== null) {
    expect(
      dims.headerScrollWidth,
      `${routeLabel}: header.scrollWidth (${dims.headerScrollWidth}) > header.clientWidth (${dims.headerClientWidth})`
    ).toBeLessThanOrEqual(dims.headerClientWidth)
  }

  if (checkMain && dims.mainScrollWidth !== null) {
    expect(
      dims.mainScrollWidth,
      `${routeLabel}: main.scrollWidth (${dims.mainScrollWidth}) > main.clientWidth (${dims.mainClientWidth})`
    ).toBeLessThanOrEqual(dims.mainClientWidth)
  }

  return dims
}

async function assertMinTouchTarget(locator, label, { minWidth = MIN_TARGET, minHeight = MIN_TARGET, maxRight = 360 } = {}) {
  await expect(locator, `${label} debe ser visible`).toBeVisible()
  const box = await locator.boundingBox()
  expect(box, `${label} debe tener boundingBox`).not.toBeNull()
  expect(box.height, `${label}: height ${box.height}px < ${minHeight}px`).toBeGreaterThanOrEqual(minHeight)
  expect(box.width, `${label}: width ${box.width}px < ${minWidth}px`).toBeGreaterThanOrEqual(minWidth)
  expect(
    Math.round((box.x + box.width) * 100) / 100,
    `${label}: borde derecho ${box.x + box.width}px excede ${maxRight}px`
  ).toBeLessThanOrEqual(maxRight)
  return box
}

async function apiPost(path, body, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let parsed = null
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = text
  }
  if (!res.ok) {
    throw new Error(`POST ${path} fallo con HTTP ${res.status}: ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`)
  }
  return parsed
}

test.describe('Rutas públicas a 360×800 (S2-1)', () => {
  test('Landing (/): sin overflow horizontal y CTAs >=48px', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await assertNoHorizontalOverflow(page, '/')

    await assertMinTouchTarget(page.locator('header a[href="/registro"]').first(), 'Header CTA Crear cuenta')
    await assertMinTouchTarget(page.locator('main section').first().locator('a[href="/registro"]').first(), 'Hero CTA principal')
    await assertMinTouchTarget(page.locator('main section').first().locator('button:has-text("Ver cómo funciona")'), 'Hero CTA Ver cómo funciona')
  })

  test('Login (/login): sin overflow horizontal e inputs/botones >=48px', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' })
    await assertNoHorizontalOverflow(page, '/login')

    await assertMinTouchTarget(page.locator('input[name="email"]'), 'Login input email')
    await assertMinTouchTarget(page.locator('input[name="password"]'), 'Login input password')
    await assertMinTouchTarget(page.locator('button[type="submit"]'), 'Login submit')
    await assertMinTouchTarget(page.locator('a[href="/"]').first(), 'Login volver a inicio')
  })

  test('Registro (/registro): sin overflow horizontal e inputs/botones >=48px', async ({ page }) => {
    await page.goto('/registro', { waitUntil: 'networkidle' })
    await assertNoHorizontalOverflow(page, '/registro')

    await assertMinTouchTarget(page.locator('input[name="nombre_comercial"]'), 'Registro input nombre_comercial')
    await assertMinTouchTarget(page.locator('input[name="nit_o_cedula"]'), 'Registro input nit_o_cedula')
    await assertMinTouchTarget(page.locator('input[name="email"]'), 'Registro input email')
    await assertMinTouchTarget(page.locator('input[name="password"]'), 'Registro input password')
    await assertMinTouchTarget(page.locator('button[type="submit"]'), 'Registro submit')
    await assertMinTouchTarget(page.locator('a[href="/"]').first(), 'Registro volver a inicio')
  })
})

test.describe('Recorrido autenticado local a 360×800 (S2-2 y S2-3)', () => {
  test.skip(PUBLIC_ONLY, 'Ejecución limitada a rutas públicas (MOBILE_PUBLIC_ONLY=1)')

  test('Registro local -> Login UI -> Dashboard -> Sidebar -> Inventario -> ModalProducto -> Carrito/Cobro -> Ventas -> Soporte -> Logout', async ({ page }) => {
    const tag = crypto.randomBytes(4).toString('hex')
    const digits = String(10000000 + crypto.randomInt(89999999))
    const email = `s2_4_${tag}@example.com`
    const password = 'TestPassword123!'

    // 1. Crear cuenta única de prueba local en gestion_neiva_test (sin Vercel/producción)
    const reg = await apiPost('/api/v1/auth/registro-completo', {
      nombre_comercial: `Tienda Movil E2E ${tag}`,
      nit_o_cedula: `902${digits}-1`,
      email,
      password,
      rol: 'admin',
    })
    const token = reg.access_token
    const vence = new Date(Date.now() + 5 * 86400 * 1000).toISOString().slice(0, 10)

    await apiPost(
      '/api/v1/productos',
      {
        nombre: 'Panela Huilense Movil E2E',
        codigo_barras: `770S24${tag}`,
        precio_costo: 3000.0,
        precio_venta: 4500.0,
        cantidad_actual: 10.0,
        unidad_medida: 'unidad',
        categoria: 'Snacks',
        fecha_vencimiento: vence,
      },
      token
    )

    await apiPost(
      '/api/v1/soporte/tickets',
      {
        asunto: `Ticket Movil E2E ${tag}`,
        mensaje: 'Verificación automatizada 360x800 sin desbordamiento horizontal.',
      },
      token
    )

    // 2. Login real mediante la interfaz /login
    await page.goto('/login', { waitUntil: 'networkidle' })
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill(password)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('**/dashboard', { timeout: 15_000 })
    await page.waitForLoadState('networkidle')

    // 3. Dashboard + Header controls
    await assertNoHorizontalOverflow(page, '/dashboard', { checkMain: true, checkHeader: true })
    await assertMinTouchTarget(page.locator('header button[aria-label="Abrir menú"]'), 'Header Abrir menú')
    await assertMinTouchTarget(page.locator('header button[title*="Voz"]'), 'Header Modo Voz')
    await assertMinTouchTarget(page.locator('header button[title*="Asistente"], header button[title*="Chat IA"]').first(), 'Header Chat IA')
    await assertMinTouchTarget(page.locator('header button[title="Abrir mostrador de ventas"]'), 'Header Carrito')
    await assertMinTouchTarget(page.locator('header button[title="Cerrar sesión"]'), 'Header Cerrar sesión')

    // 4. Sidebar: abrir, verificar targets y navegar a Inventario
    await page.locator('header button[aria-label="Abrir menú"]').click()
    await page.waitForTimeout(300)
    await assertMinTouchTarget(page.locator('aside button[aria-label="Cerrar menú"]'), 'Sidebar Cerrar menú')
    const navLinks = page.locator('aside nav a')
    const navCount = await navLinks.count()
    expect(navCount).toBeGreaterThanOrEqual(4)
    for (let i = 0; i < navCount; i++) {
      await assertMinTouchTarget(navLinks.nth(i), `Sidebar link #${i + 1}`)
    }
    await page.locator('aside nav a:has-text("Productos")').click()
    await page.waitForURL('**/inventario')
    await page.waitForLoadState('networkidle')

    // 5. Inventario + ProductoCard + ModalProducto
    await assertNoHorizontalOverflow(page, '/inventario', { checkMain: true, checkHeader: true })
    await assertMinTouchTarget(page.locator('main input[placeholder*="Buscar"]'), 'Inventario búsqueda')
    await assertMinTouchTarget(page.locator('main button:has-text("+ Producto")'), 'Inventario + Producto')
    await assertMinTouchTarget(page.locator('main button:has-text("Agregar")').first(), 'ProductoCard Agregar')
    await assertMinTouchTarget(page.locator('main button[title="Editar"]').first(), 'ProductoCard Editar')
    await assertMinTouchTarget(page.locator('main button[title="Eliminar"]').first(), 'ProductoCard Eliminar')

    await page.locator('main button:has-text("+ Producto")').click()
    const modal = page.locator('[role="dialog"]').first()
    await expect(modal).toBeVisible()
    const modalScroll = await modal.locator('> div').first().evaluate((el) => ({
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
      overflowY: getComputedStyle(el).overflowY,
    }))
    expect(modalScroll.scrollWidth).toBeLessThanOrEqual(modalScroll.clientWidth)
    expect(modalScroll.overflowY).toBe('auto')
    await assertMinTouchTarget(modal.locator('button[aria-label="Cerrar modal de producto"]'), 'ModalProducto Cerrar')
    await assertMinTouchTarget(modal.locator('input[name="nombre"]'), 'ModalProducto nombre')
    await assertMinTouchTarget(modal.locator('button[title*="cámara"]'), 'ModalProducto cámara')
    await assertMinTouchTarget(modal.locator('button:has-text("Cancelar")'), 'ModalProducto Cancelar')
    await assertMinTouchTarget(modal.locator('button[type="submit"]'), 'ModalProducto Guardar')
    await modal.locator('button[aria-label="Cerrar modal de producto"]').click()
    await expect(modal).toBeHidden()

    // 6. Carrito + Checkout real
    await page.locator('main button:has-text("Agregar")').first().click()
    await page.locator('header button[title="Abrir mostrador de ventas"]').click()
    await page.waitForTimeout(300)
    const cartDrawer = page.locator('div:has(> div > h2:text-is("Carrito"))').first()
    await assertMinTouchTarget(cartDrawer.locator('button[aria-label="Cerrar carrito"]'), 'Cart Cerrar')
    await assertMinTouchTarget(cartDrawer.locator('button:has-text("−")'), 'Cart restar')
    await assertMinTouchTarget(cartDrawer.locator('button:has-text("+")'), 'Cart sumar')
    await assertMinTouchTarget(cartDrawer.locator('button:has-text("Cobrar venta")'), 'Cart Cobrar venta')
    await assertMinTouchTarget(cartDrawer.locator('button:has-text("Vaciar carrito")'), 'Cart Vaciar carrito')

    await cartDrawer.locator('button:has-text("Cobrar venta")').click()
    await assertMinTouchTarget(page.locator('button:has-text("Cancelar")'), 'Cart Modal Cancelar')
    const confirmBtn = page.locator('button:has-text("Confirmar venta")')
    await assertMinTouchTarget(confirmBtn, 'Cart Modal Confirmar venta')
    await confirmBtn.click()
    await expect(cartDrawer.locator('text=Venta registrada')).toBeVisible({ timeout: 10_000 })
    await cartDrawer.locator('button[aria-label="Cerrar carrito"]').click()
    await page.waitForTimeout(300)

    // 7. Ventas (Actividad del Día + Histórico)
    await page.locator('header button[aria-label="Abrir menú"]').click()
    await page.waitForTimeout(250)
    await page.locator('aside nav a:has-text("Ventas")').click()
    await page.waitForURL('**/ventas')
    await page.waitForLoadState('networkidle')
    await assertNoHorizontalOverflow(page, '/ventas', { checkMain: true, checkHeader: true })
    await assertMinTouchTarget(page.locator('button:has-text("Actividad del Día")'), 'Ventas Actividad del Día')
    await assertMinTouchTarget(page.locator('button:has-text("Histórico")'), 'Ventas Histórico')
    await assertMinTouchTarget(page.locator('button[title="Día anterior"]'), 'Ventas Día anterior')
    await assertMinTouchTarget(page.locator('button[title="Día siguiente"]'), 'Ventas Día siguiente')
    await assertMinTouchTarget(page.locator('main select'), 'Ventas Select cajero')
    await assertMinTouchTarget(page.locator('button[title="Refrescar actividad"]'), 'Ventas Refrescar')

    await page.locator('button:has-text("Histórico")').click()
    await page.waitForLoadState('networkidle')
    await assertNoHorizontalOverflow(page, '/ventas (histórico)', { checkMain: true, checkHeader: true })
    await assertMinTouchTarget(page.locator('main button:has-text("Hoy")'), 'Ventas Tab Hoy')
    await assertMinTouchTarget(page.locator('main button:has-text("Semana")'), 'Ventas Tab Semana')

    // 8. Soporte (lista + detalle + caja de respuesta visible dentro de 360px)
    await page.locator('header button[aria-label="Abrir menú"]').click()
    await page.waitForTimeout(250)
    await page.locator('aside nav a:has-text("Ayuda")').click()
    await page.waitForURL('**/soporte')
    await page.waitForLoadState('networkidle')
    await assertNoHorizontalOverflow(page, '/soporte (lista)', { checkMain: true, checkHeader: true })
    await assertMinTouchTarget(page.locator('main button[title="Actualizar lista"]'), 'Soporte Actualizar')
    await assertMinTouchTarget(page.locator('main button:has-text("Ver video tutorial")'), 'Soporte Ver video')
    await assertMinTouchTarget(page.locator('main button:has-text("Reactivar guía")'), 'Soporte Reactivar guía')
    await assertMinTouchTarget(page.locator('main button:has-text("Nuevo Ticket")'), 'Soporte Nuevo Ticket')

    await page.locator('main ul li button').first().click()
    await page.waitForLoadState('networkidle')
    await assertNoHorizontalOverflow(page, '/soporte (detalle)', { checkMain: true, checkHeader: true })
    await assertMinTouchTarget(page.locator('main textarea[placeholder*="respuesta"]'), 'Soporte Textarea respuesta')
    await assertMinTouchTarget(page.locator('main button[aria-label="Enviar respuesta"]'), 'Soporte Enviar respuesta')

    // 9. Logout stateless -> redirección a /login y limpieza de access_token
    await page.locator('header button[title="Cerrar sesión"]').click()
    await page.waitForURL('**/login', { timeout: 10_000 })
    const storedToken = await page.evaluate(() => localStorage.getItem('access_token'))
    expect(storedToken).toBeNull()
  })
})
