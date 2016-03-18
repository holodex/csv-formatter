var defined = require('defined')
var through = require('through2')
var keys = require('lodash.keys')
var getValues = require('lodash.values')
var pick = require('lodash.pick')

module.exports = csvFormatter

// code inspired by https://github.com/IWSLLC/json-csv/blob/master/exporter.js

function csvFormatter (options) {
  options = getOptions(options)

  var headerWritten = false

  var stream = through.obj(function (row, enc, cb) {
    if (!headerWritten) {
      this.push(formatHeaderRow(options, row))
      headerWritten = true
    }
    cb(null, formatBodyRow(options, row))
  })

  stream.options = options

  return stream
}

function getOptions (options) {
  if (Array.isArray(options)) {
    options = { headers: options }
  }

  options = defined(options, {})

  options.separator = defined(options.separator, ',')
  options.newline = defined(options.newline, '\n')

  return options
}

function formatHeaderRow (options, row) {
  var headers = options.headers = defined(options.headers, keys(row))
  return formatRow(options, headers)
}

function formatBodyRow (options, row) {
  var values = getValues(pick(row, options.headers))
  return formatRow(options, values)
}

function formatRow (options, fields) {
  var line = fields
    .map(formatField.bind(null, options))
    .join(options.separator)

  return line + options.newline
}

function formatField (options, field) {
  if (typeof field !== 'string') {
    field = field.toString()
  }

  var mustBeQuoted =
    field.indexOf('"') !== -1 ||
    field.indexOf(options.separator) !== -1 ||
    field.indexOf(options.newline) !== -1

  if (mustBeQuoted) {
    // quote
    //   replace quotes with two quotes
    field = field.replace(/\"/g, '""')
    //   enclose with quotes
    field = '"' + field + '"'
  }

  return field
}
