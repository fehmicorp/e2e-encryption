# 🔐 Fehmi End-to-End Crypto

**`@fehmicorp/e2e-crypto`** is a lightweight JavaScript SDK for implementing **end-to-end encrypted API communication** between client applications and servers.

The package encrypts request payloads on the client, securely transmits them to the server, decrypts them for processing, and encrypts responses before sending them back.

This ensures that **API payloads remain encrypted in transit**, preventing exposure even if network traffic is intercepted.

---

# 🚀 Features

* End-to-End encrypted API communication
* Hybrid encryption model (**RSA + AES-256**)
* Works with **Node.js backends and browser clients**
* Simple integration with REST APIs
* Secure payload encryption and decryption
* Minimal dependencies
* Open-source and lightweight

---

# 📦 Installation

Install the package using npm:

```bash
npm install @fehmicorp/e2e-crypto
```

---

# 🔑 Encryption Architecture

The library uses a **hybrid encryption system**:

1. Client generates a random **AES-256 key**
2. Payload is encrypted using **AES**
3. AES key is encrypted using **RSA public key**
4. Server decrypts AES key using **RSA private key**
5. Server decrypts payload
6. Response can be encrypted again before returning

```
Client
   │
   │ Encrypt Payload (AES)
   │ Encrypt AES Key (RSA Public Key)
   ▼
Encrypted Request
   ▼
Server
   │
   │ Decrypt AES Key (RSA Private Key)
   │ Decrypt Payload
   │ Process Request
   │ Encrypt Response
   ▼
Client decrypts response
```

---

# 📁 Basic Usage

## Client Side (Encrypt Request)

```javascript
import { encryptPayload, parseResponse } from "@fehmicorp/e2e-crypto"

const publicKey = `-----BEGIN PUBLIC KEY-----
YOUR_PUBLIC_KEY
-----END PUBLIC KEY-----`

const payload = {
  username: "sameer",
  password: "secure-password"
}

const encrypted = encryptPayload(payload, publicKey)

const res = await fetch("/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({key: encrypted.key, payload: encrypted.payload})
})
const json = await res.json()
const result = parseResponse(json, encrypted.aesKey)
```

---

## Server Side (Decrypt Request) ===> NEXT JS

```javascript
import { decryptRequest, encryptResponse } from "@fehmicorp/e2e-crypto"
import fs from "fs"
import path from "path"

const privateKey = fs.readFileSync(
  path.join(process.cwd(), "/keys/private.pem"),
  "utf8"
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, aesKey } = decryptRequest(body, privateKey)
    const result = {
      message: "Hello from server",
      received: data
    }
    const encrypted = encryptResponse(result, aesKey)
    return NextResponse.json({
      success: true,
      data: encrypted
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Invalid encrypted request"
    })
  }
}
```

---

# 🌐 Multi Next.js Project Support

You can now use the SDK as a universal layer across multiple Next.js apps by customizing payload field names and adding a project identifier.

## Client (project-aware payload)

```javascript
import { createClientCrypto } from "@fehmicorp/e2e-crypto"

const cryptoClient = createClientCrypto({
  keyField: "encryptedKey",
  payloadField: "encryptedPayload",
  projectField: "projectId",
  responseSuccessField: "ok",
  responseDataField: "encryptedData"
})

const encrypted = cryptoClient.encryptPayload(payload, publicKey, {
  projectId: "dashboard-app"
})
```

## Server (project validation)

```javascript
import { createServerCrypto, encryptResponse } from "@fehmicorp/e2e-crypto"

const cryptoServer = createServerCrypto({
  keyField: "encryptedKey",
  payloadField: "encryptedPayload",
  projectField: "projectId"
})

const { data, aesKey } = cryptoServer.decryptRequest(body, privateKey, {
  expectedProjectId: "dashboard-app"
})

const encrypted = encryptResponse(result, aesKey)
```

This allows one shared encryption package to be reused safely across multiple Next.js projects with different request/response contracts.

---

# 🔁 Encrypting Server Responses

You can optionally encrypt server responses before returning them to the client.

Example:

```javascript
import { encryptAES } from "@fehmicorp/e2e-crypto"

const encryptedResponse = encryptAES(responseData, aesKey)

res.json(encryptedResponse)
```

---

# 🔐 Security Design

| Layer        | Encryption      |
| ------------ | --------------- |
| Payload      | AES-256-CBC     |
| Key Exchange | RSA-2048        |
| IV           | Random 16 bytes |
| Encoding     | Base64          |

---

# 📦 Payload Format

Encrypted payload sent to server:

```json
{
  "key": "encrypted_aes_key",
  "payload": {
    "iv": "initialization_vector",
    "data": "encrypted_payload"
  }
}
```

---

# 🧩 API Reference

## encryptPayload(data, publicKey)

Encrypts payload using AES and encrypts the AES key using RSA.

Returns:

```json
{
  "key": "encrypted_key",
  "payload": {
    "iv": "...",
    "data": "..."
  }
}
```

---

## decryptPayload(body, privateKey)

Decrypts encrypted request payload.

Returns:

```json
{
  "username": "sameer",
  "password": "secure-password"
}
```

---

# ⚙️ Generate RSA Keys

You can generate keys using OpenSSL:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

---

# 🧪 Example Workflow

```
Frontend
  │
  │ encryptPayload()
  ▼
Encrypted Request
  ▼
Backend
  │ decryptPayload()
  │ process logic
  ▼
Encrypted Response
  ▼
Frontend decrypt
```

---

# 📚 Supported Environments

* Node.js 16+
* Express.js
* React
* Next.js
* Vue
* Angular
* Any JavaScript runtime supporting crypto APIs

---

# 🛠 Development

Clone repository:

```bash
git clone https://github.com/fehmicorp/e2e-crypto
cd e2e-crypto
npm install
```

Run tests or development environment as needed.

---

# 📦 Publish to npm

Login:

```bash
npm login
```

Publish:

```bash
npm publish --access public
```

---

# 🧭 Roadmap

Planned improvements:

* Browser-native crypto support
* ECDH key exchange
* Forward secrecy
* Payload signing
* Replay attack protection
* Automatic key rotation
* TypeScript support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit a pull request

---

# 📄 License

MIT License

---

# 🌐 Maintained By

**Fehmi Corporation**

Building secure cloud and infrastructure tools.

GitHub
https://github.com/fehmicorp
