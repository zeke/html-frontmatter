var assert = require("assert")
var fs = require("fs")
var path = require("path")
var fm = require("..")

var fixtures = {}
fs.readdirSync(__dirname + "/fixtures").forEach(function(file) {
  var key = path.basename(file).replace(".html", "")
  fixtures[key] = fs.readFileSync(__dirname + "/fixtures/" + file).toString()
})

describe("html-frontmatter", function() {

  // Essence

  it("extracts metadata from colon-delimited comments at the top of an HTML string", function(){
    assert.deepEqual(fm(fixtures.simple), {foo: "bar"})
  })

  it("returns null if frontmatter is not found", function(){
    assert.equal(fm("blah"), null)
  })

  it("handles values that contain colons", function(){
    assert.equal(fm(fixtures.colons_in_values).title, "How I roll: or, the life of a wheel")
  })

  it("handles line-wrapped values", function(){
    assert.equal(fm(fixtures.wrapped).description, "This is a line that wraps and wraps badly")
  })

  it("cleans up excess whitespace", function(){
    assert.deepEqual(fm(fixtures.dirty), {badly: "spaced", crappy: "input"})
  })

  it("ignores comments that are not at the top of the file", function(){
    assert.equal(fm(fixtures.not_at_the_top), null)
  })

  it("allows newlines before comments", function(){
    assert.deepEqual(fm(fixtures.preceding_whitespace), {foo: "bar"})
  })

  it("ignores comment lines starting with hashes (#)", function(){
    assert(fm(fixtures.cordova))
  })

  it("allows single-line comments", function(){
    assert.deepEqual(fm(fixtures.single_line), {foo: "bar"})
  })

  // Coercion

  it("coerces boolean strings into booleans", function(){
    assert.deepEqual(fm(fixtures.boolean), {good: true, bad: false})
  })

  it("coerces numeric strings into numbers", function(){
    var n = fm(fixtures.numeric)
    assert.strictEqual(n.integral, 10000000)
    assert.strictEqual(n.decimal, 3.1415)
    assert.strictEqual(n.negative, -100)
    assert.strictEqual(n.stringy, "I am not a number")
  })

  // Convenience

  it("exposes its regex pattern as `pattern`", function(){
    assert(fm.pattern)
  })

  it('handles missing right-hand-value', function() {
    assert.deepEqual(fm(fixtures.undefined), {demobox: ""})
  })

  // Arrays

  it("handles shallow arrays", function(){
    var n = fm(fixtures.arrays)
    assert.deepEqual(n.flow, ['one', 'two'])
    assert.deepEqual(n.spanning, ['one', 'two', 'three'])
    assert.deepEqual(n.coercion, [ 1, 'I am not a number', false, true ])
  })

})
