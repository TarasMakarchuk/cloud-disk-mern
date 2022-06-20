const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.header.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ maessage: 'Auth error'});
    }
    req.user = jwt.verify(token, config.get('secretKey'));
    next();

  } catch (e) {
    return res.status(401).json({ maessage: 'Auth error'});
  }
};
