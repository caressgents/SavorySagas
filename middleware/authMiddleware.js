import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Additional debugging information
    req.user = decoded;
    next();
  } catch (ex) {
    if (ex.name === 'TokenExpiredError') {
      res.status(401).send('Session expired. Please login again.');
    } else if (ex.name === 'JsonWebTokenError') {
      res.status(400).send('Invalid token. Please login again.');
    } else if (ex.name === 'NotBeforeError') {
      res.status(400).send('Token not active. Please wait or login again.');
    } else {
      res.status(400).send('Token error.');
    }
  }
};
