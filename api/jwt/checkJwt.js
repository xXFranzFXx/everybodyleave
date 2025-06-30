
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// middleware for authenticated routes if needed
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN,
  algorithms: ["RS256"],
});

const validateAndParseToken = (token) => new Promise((resolve, reject) => {
  const { header, payload} = jwt.decode(token, {complete: true})
  if (!header || !header.kid || !payload) reject(new Error('Invalid Token'))
  checkJwt.getSigningKey(header.kid, (err, key) => {
    if (err) reject(new Error('Error getting signing key: ' + err.message))
    jwt.verify(token, key.publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) reject('jwt verify error: ' + err.message)
      resolve(decoded)
    })
  })
})
module.exports = { checkJwt, validateAndParseToken };