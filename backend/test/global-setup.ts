import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'

const TEST_DATABASE_FILE = 'test.db'

export function setup() {
  rmSync(TEST_DATABASE_FILE, { force: true })
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: `file:./${TEST_DATABASE_FILE}` },
    stdio: 'ignore',
  })
}

export function teardown() {
  rmSync(TEST_DATABASE_FILE, { force: true })
}
