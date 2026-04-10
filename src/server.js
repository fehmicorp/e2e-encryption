import {
  decryptAES,
  decryptRSA,
  encryptAES
} from "./crypto.js"

const DEFAULT_SERVER_CONFIG = {
  keyField: "key",
  payloadField: "payload",
  projectField: "project"
}

export function createServerCrypto(config = {}) {
  const resolvedConfig = {
    ...DEFAULT_SERVER_CONFIG,
    ...config
  }

  return {
    decryptRequest: (body, privateKey, options = {}) =>
      decryptRequest(body, privateKey, {
        ...resolvedConfig,
        ...options
      }),
    encryptResponse
  }
}

export function decryptRequest(body, privateKey, options = {}) {
  const {
    keyField = DEFAULT_SERVER_CONFIG.keyField,
    payloadField = DEFAULT_SERVER_CONFIG.payloadField,
    projectField = DEFAULT_SERVER_CONFIG.projectField,
    expectedProjectId
  } = options

  if (expectedProjectId && body?.[projectField] !== expectedProjectId) {
    throw new Error("Invalid project identifier")
  }

  const aesKey = decryptRSA(body[keyField], privateKey)

  const data = decryptAES(body[payloadField], aesKey)
  
  return { data, aesKey }
}

export function encryptResponse(data, aesKey) {

  return encryptAES(data, aesKey)
}
