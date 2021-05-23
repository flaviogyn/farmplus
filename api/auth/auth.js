const jwt = require('jsonwebtoken');
const expire = 14400;  

const geraToken = (req, res, id) => {
  const token = jwt.sign({ id }, process.env.AUTH_SECRET, {
    expiresIn: expire
  })
  res.json({ auth: true, token: token })
};

const geraTokenInt = (id) => {
  return jwt.sign({ id }, process.env.AUTH_SECRET, {
    expiresIn: expire
  })
};

const validaTokenWeb = (req, res, token) => {
  jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
    return res.status(200).send({ valid: !err })
  })
}

const validaToken = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(!token) {
    var token = req.headers['authorization'];
  }

  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.AUTH_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    next();
  });

};

const cancelaToken = (req, res, next) => {
  res.status(200).send({ auth: false, token: null });
};

module.exports = { geraToken, validaToken, validaTokenWeb, geraTokenInt, cancelaToken }
