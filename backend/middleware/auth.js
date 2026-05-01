// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the user info to the request
    next(); // Pass control to the next function
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;