const { expressjwt: jwt } = require('express-jwt');

//instantiate the JWT token validation middlaware

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload', // we'll be able to access the decoded jwt in req.payload
  getToken: getTokenFromHeaders, //the function below to extract the jwt
});

function getTokenFromHeaders(req) {
  //checks if the token is available on the request headers

  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    //get the token and return it
    const token = req.headers.authorization.split(' ')[1];
    return token;
  }

  return null;
}

module.exports = { isAuthenticated };
