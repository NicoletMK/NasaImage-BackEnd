const jwt = require('jsonwebtoken');



const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    console.log(token);
    if (token == 'undefined' || token == ' ') {
      console.log('token is empty');
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);

      req.user = user;
      console.log('user token');
      next();
    });
  } catch (err) {
    res.status(500).send(' No token Provided');
  }
};
module.exports = authenticate;
