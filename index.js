#!/usr/bin/env node

var path = require("path")
var fs = require("fs")
var fmt = require("util").format
var pattern = new RegExp("^\n*<!--\n([^]*)\n-->")

var parse = module.exports = function(input) {

  if (!input.match(pattern)) return

  var obj = {}

  pattern
    .exec(input)[1]
    .replace(/\n{2,}/g, "\n")  // remove excess newlines
    .replace(/\n\s{2,}/g, " ") // treat two-space indentation as a wrapped line
    .replace(/\s{2,}/g, " ")   // remove excess spaces
    .split("\n")
    .forEach(function(line) {
      if (line.match(/^\s?#/)) return  // ignore lines starting with #
      var parts = line.split(/:(.+)?/) // split on _first_ colon
      if (parts.length < 2) return     // key: value pair is required
      var key = (parts[0] || '').trim()
      var value = (parts[1] || '').trim()

      if (value === "true") value = true
      if (value === "false") value = false

      obj[key] = value
    })

  return obj
}

parse.pattern = pattern
