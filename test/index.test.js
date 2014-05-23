/* global describe, it */
var fs = require('fs');
var path = require('path');
var assert = require('power-assert');
var extractRequiredModule = require('../index');

describe("extract-require", function() {

  it("should list all required modules", function() {
    var filenames = fs.readdirSync(__dirname + '/fixture/').filter(function(filename) {
      return /\.js$/.test(filename);
    });
    filenames.forEach(function(filename) {
      filename = filename.split('.')[0];
      var filepath = __dirname + '/fixture/'+ filename + '.js'
      var code = fs.readFileSync(filepath, 'utf-8');
      var expected = fs.readFileSync(__dirname + '/fixture/'+ filename + '.expected.json', 'utf-8');
      var extracted = extractRequiredModule(code, { cwd: __dirname, src: filepath });
      assert.ok(JSON.stringify(extracted) === expected);
    });
  });

});