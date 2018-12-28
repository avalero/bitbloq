const jwt_v = require('koa-jwt');
//import * as jwt_v from 'koa-jwt';
//import sign from 'koa-jwt';

module.exports = function(args) {
  if (args.password === 'pass') {
    args.status = 200;
    args.body = {
      auth_token: jwt_v.sign(
        { role: 'user' },
        '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
      ), //Should be the same secret key as the one used is ./jwt.js
      message: 'Successfully logged in!',
      user_id: args._id,
    };
  } else {
    args.status = args.status = 401;
    args.body = {
      message: 'Authentication failed',
    };
  }
  return args;
};
