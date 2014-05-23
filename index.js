var esprima = require('esprima');
var esquery = require('esquery');
var fs = require('fs');
var path = require('path');

var extractRequire = module.exports = function(code, options) {
  options = options || {}
  var cwd = options.cwd || process.cwd();
  var srcDir = options.src ? path.dirname(options.src) : cwd;
  var ast = esprima.parse(code);
  var matches = esquery(ast, "CallExpression[callee.name=\"require\"]");
  return matches.map(function(node) {
    var p = node.arguments.length === 1 &&
            node.arguments[0].type === 'Literal' &&
            node.arguments[0].value;
    return p[0] === "." ? path.relative(cwd, path.resolve(srcDir, p)) : p;
  }).filter(function(name) { return name; });
}

if (require.main === module) {
  var filename = process.argv[process.argv.length - 1];
  fs.readFile(filename, 'utf-8', function(err, data) {
    if (err) { return console.error(err); }
    var results = extractRequire(data, { src: filename, cwd: process.cwd() });
    console.log(results); 
  });
}
