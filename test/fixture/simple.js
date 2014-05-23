var aaa = require('aaa');
var bbb = require('bbb');

function foo() {
  return aaa.hello() + bbb.world();
}

module.exports = foo;
