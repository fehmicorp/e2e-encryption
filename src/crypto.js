import crypto from "crypto"

export function generateAESKey() {
  return crypto.randomBytes(32)
}

export function encryptAES(data, key) {

  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    key,
    iv
  )

  let encrypted = cipher.update(
    JSON.stringify(data),
    "utf8",
    "base64"
  )

  encrypted += cipher.final("base64")

  return {
    iv: iv.toString("base64"),
    data: encrypted
  }
}

export function decryptAES(payload, key) {

  const iv = Buffer.from(payload.iv, "base64")

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    iv
  )

  let decrypted = decipher.update(
    payload.data,
    "base64",
    "utf8"
  )

  decrypted += decipher.final("utf8")

  return JSON.parse(decrypted)
}

export function encryptRSA(data, publicKey) {

  return crypto.publicEncrypt(
    publicKey,
    Buffer.from(data)
  ).toString("base64")
}

export function decryptRSA(data, privateKey) {

  return crypto.privateDecrypt(
    privateKey,
    Buffer.from(data, "base64")
  )
}