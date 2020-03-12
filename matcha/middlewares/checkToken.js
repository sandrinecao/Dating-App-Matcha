const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.id && req.body.id !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  }catch(err){
		error: "Invalid token";
		res.render('signin');
    };
};