#!/usr/bin/env node
/**
 * Glazair Partner Portal — invitation token generator
 *
 * Usage:
 *   node scripts/generate-token.js --token-id=<id> --lang=<en|hu|de>
 *
 * Reads PORTAL_TOKEN_SECRET from .env in the repo root.
 * Prints the full invitation URL to stdout (nothing else).
 * Exits with code 1 on any error, writing the reason to stderr.
 */

import { createHmac } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

const VALID_LANGS = ['en', 'hu', 'de']
const BASE_URL = 'https://partners.glazair.com'

function fail(msg) {
  process.stderr.write(`Error: ${msg}\n`)
  process.exit(1)
}

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function loadEnv() {
  const envPath = resolve(REPO_ROOT, '.env')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!(key in process.env)) process.env[key] = val
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const result = {}
  for (const arg of args) {
    const m = arg.match(/^--([a-z-]+)=(.+)$/)
    if (m) result[m[1]] = m[2]
  }
  return result
}

loadEnv()

const args = parseArgs()
const tokenId = args['token-id']
const lang = args['lang']

if (!tokenId) fail('--token-id is required')
if (!lang) fail('--lang is required')
if (!VALID_LANGS.includes(lang)) fail(`--lang must be one of: ${VALID_LANGS.join(', ')}`)

const secret = process.env.PORTAL_TOKEN_SECRET
if (!secret) fail('PORTAL_TOKEN_SECRET is not set. Export it or add it to .env in the repo root.')

const payload = JSON.stringify({ token_id: tokenId, lang })
const payloadB64 = base64url(Buffer.from(payload, 'utf8'))
const sig = createHmac('sha256', secret).update(payloadB64).digest()
const sigB64 = base64url(sig)
const token = `${payloadB64}.${sigB64}`

process.stdout.write(`${BASE_URL}/${token}\n`)
