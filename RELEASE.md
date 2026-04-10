# Release Notes — v1.1.0

Release date: 2026-04-10
Package: `@fehmicorp/e2e-crypto`

## Summary

Version `1.1.0` introduces a formal packaging and release workflow with clearer operational guidance for integrators and maintainers.

## What changed

- Added standardized npm scripts for testing, package verification, and publishing.
- Added a formal release process document (this file).
- Added automated encryption/decryption smoke tests using Node's built-in test runner.
- Updated README with release adoption guidance and a formal publish flow.

## How to use and apply

### For application teams (consuming the SDK)

1. Install/upgrade:

```bash
npm install @fehmicorp/e2e-crypto@latest
```

2. Encrypt data client-side with `encryptPayload` (or `createClientCrypto`).
3. Decrypt on server with `decryptRequest` (or `createServerCrypto`).
4. Encrypt server responses with `encryptResponse` and decrypt client-side using `parseResponse`.

### For maintainers (publishing this SDK)

1. Confirm version in `package.json`.
2. Run quality gates:

```bash
npm test
npm run pack:check
```

3. Publish:

```bash
npm run release:publish
```

4. Tag release and attach these notes in your VCS release UI.

## Verification checklist

- [x] `npm test` passes
- [x] `npm run pack:check` includes only intended files
- [ ] `npm run release:publish` executed by authorized maintainer
- [ ] Git tag created (e.g., `v1.1.0`)
- [ ] Release published with notes
