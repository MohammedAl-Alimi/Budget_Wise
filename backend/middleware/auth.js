const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Get this URL from your Clerk dashboard
const CLERK_DOMAIN = 'https://driven-sawfish-1.clerk.accounts.dev';

const client = jwksClient({
  jwksUri: `${CLERK_DOMAIN}/.well-known/jwks.json`
});

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Received token:', token.substring(0, 20) + '...');

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) {
      console.error('Failed to decode token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const key = await client.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const verified = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        issuer: CLERK_DOMAIN
      });
      
      console.log('Token verified successfully');
      req.user = { userId: verified.sub };
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(401).json({ message: 'Token verification failed' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}; 