import { spawn } from 'node:child_process'

const [command, ...args] = process.argv.slice(2)

if (!command) {
  console.error('Usage: node scripts/run-with-node-options.mjs <command> [...args]')
  process.exit(1)
}

const nextEnv = {
  ...process.env,
  NODE_OPTIONS: '--max-old-space-size=2048',
  NODE_ENV: process.env.NODE_ENV || 'development',
}

const child = spawn(command, args, {
  stdio: 'inherit',
  shell: true,
  env: nextEnv,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})
