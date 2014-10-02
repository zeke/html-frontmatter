var assert = require("assert")
var fs = require("fs")
var fm = require("..")

var fixtures = {
  simple: fs.readFileSync(__dirname + "/fixtures/simple.html").toString(),
  colonsInValues: fs.readFileSync(__dirname + "/fixtures/colons-in-values.html").toString(),
  wrapped: fs.readFileSync(__dirname + "/fixtures/wrapped.html").toString(),
  dirty: fs.readFileSync(__dirname + "/fixtures/dirty.html").toString(),
  notAtTheTop: fs.readFileSync(__dirname + "/fixtures/not-at-the-top.html").toString(),
}

describe("html-frontmatter", function() {

  it("extracts metadata from colon-delimited comments at the top of an HTML string", function(){
    assert.deepEqual(fm(fixtures.simple), {foo: "bar"})
  })

  it("returns null if frontmatter is not found", function(){
    assert.equal(fm("blah"), null)
  })

  it("handles values that contain colons", function(){
    assert.equal(fm(fixtures.colonsInValues).title, "How I roll: or, the life of a wheel")
  })

  it("handles line-wrapped values", function(){
    assert.equal(fm(fixtures.wrapped).description, "This is a line that wraps and wraps badly")
  })

  it("cleans up excess whitespace", function(){
    assert.deepEqual(fm(fixtures.dirty), {badly: "spaced", crappy: "input"})
  })

  it("ignores comments that are not at the top of the file", function(){
    assert.equal(fm(fixtures.notAtTheTop), null)
  })

})
