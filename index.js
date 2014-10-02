#!/usr/bin/env node

var path = require("path")
var fs = require("fs")
var fmt = require("util").format
var frontmatterPattern = new RegExp("^<!--\n([^]*)\n-->")

var parse = module.exports = function(input) {

  if (!input.match(frontmatterPattern)) return

  var obj = {}

  frontmatterPattern
    .exec(input)[1]
    .replace(/\n{2,}/g, "\n")  // remove excess newlines
    .replace(/\n\s{2,}/g, " ") // treat two-space indentation as a wrapped line
    .replace(/\s{2,}/g, " ")   // remove excess spaces
    .split("\n")
    .forEach(function(line) {
      var parts = line.split(/:(.+)?/) // split on _first_ colon
      obj[parts[0].trim()] = parts[1].trim()
    })

  return obj
}
