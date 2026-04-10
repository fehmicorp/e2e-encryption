import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

import {
  encryptPayload,
  parseResponse,
  decryptRequest,
  encryptResponse,
  createClientCrypto,
  createServerCrypto
} from '../index.js'

test('encryptPayload/decryptRequest roundtrip works', () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048
  })

  const payload = { username: 'sameer', password: 'secure-password' }
  const encrypted = encryptPayload(payload, publicKey.export({ type: 'spki', format: 'pem' }))
  const decrypted = decryptRequest(encrypted, privateKey.export({ type: 'pkcs8', format: 'pem' }))

  assert.deepEqual(decrypted.data, payload)
})

test('client/server factories support project-aware contracts', () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048
  })

  const client = createClientCrypto({
    keyField: 'encryptedKey',
    payloadField: 'encryptedPayload',
    projectField: 'projectId',
    responseSuccessField: 'ok',
    responseDataField: 'encryptedData'
  })

  const server = createServerCrypto({
    keyField: 'encryptedKey',
    payloadField: 'encryptedPayload',
    projectField: 'projectId'
  })

  const payload = { message: 'hello world' }

  const encryptedRequest = client.encryptPayload(
    payload,
    publicKey.export({ type: 'spki', format: 'pem' }),
    { projectId: 'dashboard-app' }
  )

  const { data, aesKey } = server.decryptRequest(
    encryptedRequest,
    privateKey.export({ type: 'pkcs8', format: 'pem' }),
    { expectedProjectId: 'dashboard-app' }
  )

  assert.deepEqual(data, payload)

  const encryptedServerData = encryptResponse({ accepted: true }, aesKey)
  const parsed = client.parseResponse({ ok: true, encryptedData: encryptedServerData }, aesKey)

  assert.deepEqual(parsed, { accepted: true })
})
