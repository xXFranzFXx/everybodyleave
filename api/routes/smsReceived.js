// Node.js example using crypto
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  const signatureHash = signature.split('=')[1];
  
  return crypto.timingSafeEqual(
    Buffer.from(signatureHash),
    Buffer.from(digest)
  );
}

// Express middleware example
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-signature'];
  const payload = req.body;
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process the webhook
  console.log('Webhook verified:', payload);
  res.status(200).send('OK');
});