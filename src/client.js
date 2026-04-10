import {
  generateAESKey,
  encryptAES,
  encryptRSA,
  decryptAES
} from "./crypto.js"

const DEFAULT_CLIENT_CONFIG = {
  keyField: "key",
  payloadField: "payload",
  projectField: "project",
  responseSuccessField: "success",
  responseDataField: "data"
}

export function createClientCrypto(config = {}) {
  const resolvedConfig = {
    ...DEFAULT_CLIENT_CONFIG,
    ...config
  }

  return {
    encryptPayload: (payload, serverPublicKey, options = {}) =>
      encryptPayload(payload, serverPublicKey, {
        ...resolvedConfig,
        ...options
      }),
    parseResponse: (response, aesKey, options = {}) =>
      parseResponse(response, aesKey, {
        ...resolvedConfig,
        ...options
      })
  }
}

export function encryptPayload(payload, serverPublicKey, options = {}) {
  const {
    keyField = DEFAULT_CLIENT_CONFIG.keyField,
    payloadField = DEFAULT_CLIENT_CONFIG.payloadField,
    projectField = DEFAULT_CLIENT_CONFIG.projectField,
    projectId
  } = options

  const aesKey = generateAESKey()

  const encryptedPayload = encryptAES(payload, aesKey)

  const encryptedKey = encryptRSA(
    aesKey,
    serverPublicKey
  )

  const encryptedRequest = {
    [keyField]: encryptedKey,
    [payloadField]: encryptedPayload
  }

  if (projectId) {
    encryptedRequest[projectField] = projectId
  }

  return {
    ...encryptedRequest,
    aesKey
  }
}

export function parseResponse(response, aesKey, options = {}) {
  const {
    responseSuccessField = DEFAULT_CLIENT_CONFIG.responseSuccessField,
    responseDataField = DEFAULT_CLIENT_CONFIG.responseDataField
  } = options

  if (!response?.[responseSuccessField]) {
    return response
  }
  const decrypted = decryptAES(
    response[responseDataField],
    aesKey
  )
  return decrypted
}
