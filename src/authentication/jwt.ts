const jwt = require('koa-jwt');

module.exports = jwt({
  secret: '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10', // Should not be hardcoded
});
