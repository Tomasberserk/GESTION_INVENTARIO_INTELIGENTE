import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND_DIR = path.resolve(__dirname, '..', '..')
const PREVIEW_PORT = Number(process.env.LIGHTHOUSE_PREVIEW_PORT || 4176)
const MIN_A11Y_SCORE = Number(process.env.LIGHTHOUSE_MIN_A11Y || 90)
const ROUTES = ['/', '/login', '/registro']

function waitForPort(host, port, timeoutMs = 20_000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.createConnection({ host, port })
      socket.once('connect', () => {
        socket.destroy()
        resolve()
      })
      socket.once('error', () => {
        socket.destroy()
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timeout esperando ${host}:${port}`))
        } else {
          setTimeout(attempt, 250)
        }
      })
    }
    attempt()
  })
}

function runProcess(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: 'inherit' })
    p.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

function killTree(child) {
  if (!child || child.exitCode !== null) return
  if (process.platform === 'win32') {
    spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    try {
      child.kill('SIGTERM')
    } catch {
      // ignore
    }
  }
}

async function main() {
  const runTag = crypto.randomUUID()
  const outDir = path.join(os.tmpdir(), `gestion-inventario-s2-4-${runTag}`)
  const customReportsDir = process.env.LIGHTHOUSE_REPORTS_DIR?.trim()
  const reportsDir = customReportsDir
    ? path.resolve(FRONTEND_DIR, customReportsDir)
    : path.join(outDir, 'lighthouse-reports')
  fs.mkdirSync(reportsDir, { recursive: true })

  const viteBin = path.join(FRONTEND_DIR, 'node_modules', 'vite', 'bin', 'vite.js')

  console.log(`[S2-4 Lighthouse] Building SPA into isolated temp dir: ${outDir}`)
  await runProcess(process.execPath, [viteBin, 'build', '--outDir', outDir], FRONTEND_DIR)

  const previewProc = spawn(
    process.execPath,
    [viteBin, 'preview', '--outDir', outDir, '--port', String(PREVIEW_PORT), '--host', '127.0.0.1', '--strictPort'],
    { cwd: FRONTEND_DIR, stdio: 'ignore' }
  )

  let chrome = null
  try {
    await waitForPort('127.0.0.1', PREVIEW_PORT)

    const chromePath = chromium.executablePath()
    if (!fs.existsSync(chromePath)) {
      throw new Error(`Playwright Chromium no encontrado en ${chromePath}. Ejecuta: npx playwright install chromium`)
    }

    chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    })

    const summary = {
      buildOutDir: outDir,
      reportsDir,
      minAccessibilityScore: MIN_A11Y_SCORE,
      routes: [],
    }

    let allPassed = true

    for (const route of ROUTES) {
      const url = `http://127.0.0.1:${PREVIEW_PORT}${route}`
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        logLevel: 'error',
        output: ['json', 'html'],
        onlyCategories: ['accessibility'],
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 800,
          deviceScaleFactor: 2,
          disabled: false,
        },
      })

      const a11yScore = Math.round((runnerResult.lhr.categories.accessibility.score ?? 0) * 100)
      const slug = route === '/' ? 'landing' : route.replace(/^\//, '').replace(/\W+/g, '_')
      const jsonPath = path.join(reportsDir, `lighthouse-${slug}.json`)
      const htmlPath = path.join(reportsDir, `lighthouse-${slug}.html`)
      fs.writeFileSync(jsonPath, runnerResult.report[0], 'utf-8')
      fs.writeFileSync(htmlPath, runnerResult.report[1], 'utf-8')

      const failedAudits = Object.values(runnerResult.lhr.audits)
        .filter((a) => a.score !== null && a.score < 1)
        .map((a) => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue || '' }))

      summary.routes.push({
        route,
        url,
        accessibilityScore: a11yScore,
        passed: a11yScore >= MIN_A11Y_SCORE,
        failedAudits,
        jsonPath,
        htmlPath,
      })

      if (a11yScore < MIN_A11Y_SCORE) allPassed = false
    }

    const summaryPath = path.join(reportsDir, 'summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8')
    console.log(JSON.stringify(summary, null, 2))

    if (!allPassed) {
      process.exitCode = 1
    }
  } finally {
    if (chrome) {
      try {
        await chrome.kill()
      } catch {
        // ignore
      }
    }
    killTree(previewProc)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
