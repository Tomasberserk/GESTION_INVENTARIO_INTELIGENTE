import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND_DIR = path.resolve(__dirname, '..', '..')
const REPO_ROOT = path.resolve(FRONTEND_DIR, '..')

const PUBLIC_ONLY = process.env.MOBILE_PUBLIC_ONLY === '1'
const FRONTEND_PORT = Number(process.env.MOBILE_FRONTEND_PORT || 5175)
const BACKEND_PORT = Number(process.env.MOBILE_BACKEND_PORT || 8000)

function waitForPort(host, port, timeoutMs = 30_000) {
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
          setTimeout(attempt, 300)
        }
      })
    }
    attempt()
  })
}

function resolveUvicorn() {
  const winVenv = path.join(REPO_ROOT, '.venv', 'Scripts', 'uvicorn.exe')
  if (fs.existsSync(winVenv)) return winVenv
  const unixVenv = path.join(REPO_ROOT, '.venv', 'bin', 'uvicorn')
  if (fs.existsSync(unixVenv)) return unixVenv
  return 'uvicorn'
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
  const children = []
  try {
    if (!PUBLIC_ONLY && process.env.MOBILE_EXTERNAL_SERVERS !== '1') {
      const uvicornBin = resolveUvicorn()
      const dbUrl =
        process.env.TEST_POSTGRES_URL ||
        process.env.MOBILE_TEST_DB_URL ||
        'postgresql://postgres:postgres@localhost:5432/gestion_neiva_test'

      const backendEnv = {
        ...process.env,
        DATABASE_URL: dbUrl,
        SECRET_KEY: process.env.SECRET_KEY || 'local-mobile-e2e-secret-key-not-for-prod',
        SUPERADMIN_KEY: process.env.SUPERADMIN_KEY || 'local-mobile-e2e-superadmin-key',
      }

      const backendProc = spawn(
        uvicornBin,
        ['app.main:app', '--host', '127.0.0.1', '--port', String(BACKEND_PORT), '--log-level', 'warning'],
        { cwd: REPO_ROOT, env: backendEnv, stdio: 'ignore' }
      )
      children.push(backendProc)
      await waitForPort('127.0.0.1', BACKEND_PORT)
    }

    if (process.env.MOBILE_EXTERNAL_SERVERS !== '1') {
      const viteBin = path.join(FRONTEND_DIR, 'node_modules', 'vite', 'bin', 'vite.js')
      const viteProc = spawn(
        process.execPath,
        [viteBin, '--port', String(FRONTEND_PORT), '--host', '127.0.0.1', '--strictPort'],
        { cwd: FRONTEND_DIR, env: process.env, stdio: 'ignore' }
      )
      children.push(viteProc)
      await waitForPort('127.0.0.1', FRONTEND_PORT)
    }

    const pwCli = path.join(FRONTEND_DIR, 'node_modules', '@playwright', 'test', 'cli.js')
    const configPath = path.join(__dirname, 'playwright.config.mjs')
    const exitCode = await new Promise((resolve) => {
      const runner = spawn(
        process.execPath,
        [pwCli, 'test', '-c', configPath],
        {
          cwd: FRONTEND_DIR,
          env: {
            ...process.env,
            MOBILE_BASE_URL: `http://127.0.0.1:${FRONTEND_PORT}`,
            MOBILE_API_URL: `http://127.0.0.1:${BACKEND_PORT}`,
          },
          stdio: 'inherit',
        }
      )
      runner.on('close', (code) => resolve(code ?? 1))
    })

    process.exitCode = exitCode
  } finally {
    for (const c of children) killTree(c)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
