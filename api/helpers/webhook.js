const crypto = require('crypto');

function generateHmacSha256(key, data) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  return hmac.digest('hex');
}

// Function to verify HMAC-SHA256
function verifyHmacSha256(key, message, expectedHmac) {
  const computedHmac = generateHmacSha256(key, message);
  return computedHmac === expectedHmac;
}

async function processWebhook(data) {
  const rawBody = await data.raw;
  const signature = await data.headers['X-Signature'];
  const buffer = JSON.stringify(rawBody)
  console.log("buffer: ", Buffer.from(rawBody))
  

  if (!verifyHmacSha256( process.env.WEBHOOK_SECRET, rawBody, signature)) {
      throw new NonRetriableError("failed signature verification");
    }

  const payload =  await JSON.parse(rawBody);
//   const { sender, message, receivedAt } =  payload;

  return payload;
}

module.exports = { processWebhook }