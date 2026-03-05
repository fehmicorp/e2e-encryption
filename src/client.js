import {
  generateAESKey,
  encryptAES,
  encryptRSA
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
    payload: encryptedPayload
  }
}