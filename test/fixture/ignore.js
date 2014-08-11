var aaa = require('aaa');
var bbb = require('bbb');
var ddd = require('ddd');
var foo = require('./dir1/foo');
var bar = require('./dir1/dir2/bar');
var baz = require('./dir3/baz');

function example() {
  return baz(aaa() + foo(), bbb() + bar()) * ddd();
}

module.exports = example;
