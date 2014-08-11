/* global process */
var esprima = require('esprima');
var esquery = require('esquery');
var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');
var typeName = require('type-name');

var extractRequiredModules = module.exports = function(code, options) {
  options = options || {};
  var cwd = options.cwd;
  var srcDir = options.src ? path.dirname(options.src) : cwd;
  var ast = esprima.parse(code);
  var matches = esquery(ast, "CallExpression[callee.name=\"require\"]");
  return matches.map(function(node) {
    var p = node.arguments.length === 1 &&
            node.arguments[0].type === 'Literal' &&
            node.arguments[0].value;
    // if the module name is relative path, change to relative path from cwd.
    if (cwd && p.charAt(0) === ".") {
      p = path.relative(cwd, path.resolve(srcDir, p));
      if (p.charAt(0) !== ".") {
        p = "./" + p;
      }
    }
    return p;
  }).filter(function(name) {
    if (name && options.ignore) {
      var ignores = typeName(options.ignore) === 'Array' ? options.ignore : [ options.ignore ];
      for (var i=0, len=ignores.length; i<len; i++) {
        var ignore = ignores[i];
        if (/[\*\?\!\{\}]/.test(ignore) ? minimatch(name, ignore) : name === ignore) {
          return false;
        }
      }
      return true;
    }
    return name;
  });
};

if (require.main === module) {
  var filename = process.argv[process.argv.length - 1];
  fs.readFile(filename, 'utf-8', function(err, data) {
    if (err) { return console.error(err); }
    var results = extractRequiredModules(data, { src: filename, cwd: process.cwd() });
    console.log(results); 
  });
}
