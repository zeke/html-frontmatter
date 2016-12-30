#!/usr/bin/env node

const dateutil = require('dateutil')
const isError = require('lodash').isError
const attempt = require('lodash').attempt
const pattern =
  new RegExp('^(?:\r\n?|\n)*<!--([^]*?)-->') // eslint-disable-line

const parse = module.exports = function parse (input) {
  if (!input.match(pattern)) return

  var obj = {}

  pattern
    .exec(input)[1]
    .replace(/(\r\n?|\n){2,}/g, '\n') // remove excess newlines
    .replace(/(\r\n?|\n) {2,}/g, ' ') // two-space indentation as a wrapped line
    .split('\n')
    .forEach(function (line) {
      if (line.match(/^\s?#/)) return // ignore lines starting with #
      var parts = line.split(/:(.+)?/) // split on _first_ colon
      if (parts.length < 2) return // key: value pair is required
      var key = (parts[0] || '').trim()
      var value = (parts[1] || '').trim()

      value = coerceValue(value)

      // if brakets then is an array of values that need to be parsed
      if (value[0] === '[' && value[value.length - 1] === ']') {
        // initially just parsing it as an array of strings
        var parsedValue =
        value.substring(1, value.length - 1) // get rid off the brackets
          .trim()
          .split(/\s*,\s*/) // ignore irrelevant spaces and split on commas
          .map(function (val) {
            return coerceValue(val)
          })

        // TODO: Add here a YAML or other parsers like JSON below

        // if a JSON value can be parsed then improve it using JSON.parse
        var wrapValue = '{"array":' + value + '}' // wrap value to try JSON
        if (!isError(attempt(JSON.parse.bind(null, wrapValue)))) {
          parsedValue = JSON.parse(wrapValue).array
        }
      }

      obj[key] = parsedValue || value
    })

  function coerceValue (value) {
    // boolean
    if (value === 'true') return true
    if (value === 'false') return false

    // date (within 200 years of today's date)
    var date = dateutil.parse(value)
    if (date.type !== 'unknown_date') {
      delete date.type
      delete date.size
      var now = new Date().getFullYear()
      var then = date.getFullYear()
      if (Math.abs(now - then) < 200) return date
    }

    // number
    var num = +value
    if (num) return num

    return value
  }

  return obj
}

parse.pattern = pattern
