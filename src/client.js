import {
  generateAESKey,
  encryptAES,
  encryptRSA,
  decryptAES
} from "./crypto.js"

export function encryptPayload(payload, serverPublicKey) {

  const aesKey = generateAESKey()

  const encryptedPayload = encryptAES(payload, aesKey)

  const encryptedKey = encryptRSA(
    aesKey,
    serverPublicKey
  )

  return {
    key: encryptedKey,
    payload: encryptedPayload,
    aesKey
  }
}

export function parseResponse(response, aesKey) {
  if (!response.success) {
    return response
  }
  const decrypted = decryptAES(
    response.data,
    aesKey
  )
  return decrypted
}
