import {
  decryptAES,
  decryptRSA,
  encryptAES
} from "./crypto.js"

export function decryptRequest(body, privateKey) {

  const aesKey = decryptRSA(body.key, privateKey)

  return decryptAES(body.payload, aesKey)
}

export function encryptResponse(data, aesKey) {

  return encryptAES(data, aesKey)
}