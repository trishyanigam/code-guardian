import crypto from 'crypto';
import config from '../config/env.config.js';

/**
 * Verifies GitHub webhook HMAC signature using Node.js crypto module.
 *
 * @param {string|object} arg1 - Signature header ('sha256=...'), payload, or options object/req
 * @param {string|Buffer|object} [arg2] - Payload/body or signature header
 * @param {string} [arg3] - Webhook secret (defaults to GITHUB_WEBHOOK_SECRET env)
 * @returns {boolean} True if signature is valid, false otherwise
 */
export const verifyGithubSignature = (arg1, arg2, arg3) => {
  try {
    let signature = null;
    let payload = null;
    let secret = arg3;

    // Read GITHUB_WEBHOOK_SECRET
    if (!secret) {
      secret = process.env.GITHUB_WEBHOOK_SECRET || config?.github?.webhookSecret || '';
    }

    if (!secret) {
      return false;
    }

    // Parse input arguments flexible formats
    if (typeof arg1 === 'object' && arg1 !== null) {
      if (arg1.signature || arg1.payload) {
        signature = arg1.signature;
        payload = arg1.payload;
        secret = arg1.secret || secret;
      } else if (arg1.headers) {
        signature =
          arg1.headers['x-hub-signature-256'] ||
          arg1.headers['x-hub-signature'] ||
          arg1.headers['X-Hub-Signature-256'] ||
          arg1.headers['X-Hub-Signature'];
        payload = arg1.rawBody || arg1.body;
      }
    }

    if (!signature && typeof arg1 === 'string' && (arg1.startsWith('sha256=') || arg1.startsWith('sha1='))) {
      signature = arg1;
      payload = arg2;
    } else if (!signature && typeof arg2 === 'string' && (arg2.startsWith('sha256=') || arg2.startsWith('sha1='))) {
      signature = arg2;
      payload = arg1;
    } else if (!signature) {
      if (typeof arg1 === 'string') {
        signature = arg1;
        payload = arg2;
      } else {
        payload = arg1;
        signature = arg2;
      }
    }

    if (!signature || payload === undefined || payload === null) {
      return false;
    }

    // Convert payload to string or Buffer
    let payloadData = '';
    if (Buffer.isBuffer(payload)) {
      payloadData = payload;
    } else if (typeof payload === 'object') {
      payloadData = JSON.stringify(payload);
    } else {
      payloadData = String(payload);
    }

    // Extract algorithm and hash digest from signature (e.g., 'sha256=...')
    let algo = 'sha256';
    let expectedHash = signature;

    if (signature.includes('=')) {
      const parts = signature.split('=');
      algo = parts[0].toLowerCase();
      expectedHash = parts[1];
    }

    // Calculate HMAC
    const hmac = crypto.createHmac(algo, secret);
    hmac.update(payloadData);
    const actualHash = hmac.digest('hex');

    const expectedBuffer = Buffer.from(expectedHash, 'utf8');
    const actualBuffer = Buffer.from(actualHash, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (error) {
    return false;
  }
};

export default verifyGithubSignature;
