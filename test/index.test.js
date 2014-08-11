/* global describe, it */
var fs = require('fs');
var path = require('path');
var assert = require('power-assert');
var extractRequiredModule = require('../index');

describe("extract-require", function() {

  it("should list all required modules", function() {
    var fixtureDir = __dirname + '/fixture/';
    var filenames = fs.readdirSync(fixtureDir).filter(function(filename) {
      return /\.js$/.test(filename);
    });
    filenames.forEach(function(filename) {
      filename = filename.split('.')[0];
      var filepath = fixtureDir + filename + '.js';
      var code = fs.readFileSync(filepath, 'utf-8');
      var expected = fs.readFileSync(fixtureDir + filename + '.expected.json', 'utf-8');
      var extracted = extractRequiredModule(code, { cwd: fixtureDir, src: filepath, ignore: [ './dir1/**/*', 'ddd' ] });
      assert.ok(JSON.stringify(extracted) === expected);
    });
  });

});