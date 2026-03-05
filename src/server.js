import {
  decryptAES,
  decryptRSA,
  encryptAES
} from "./crypto.js"

export function decryptRequest(body, privateKey) {

  const aesKey = decryptRSA(body.key, privateKey)

  const data = decryptAES(body.payload, aesKey)
  
  return { data, aesKey }
}

export function encryptResponse(data, aesKey) {

  return encryptAES(data, aesKey)
}