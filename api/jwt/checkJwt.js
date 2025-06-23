
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

module.exports = { checkJwt };