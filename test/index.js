var test = require('tape')
var spectrum = require('csv-spectrum')
var streamify = require('stream-array')
var bl = require('bl')

var csvFormatter
test('exports', function (t) {
  csvFormatter = require('../')
  t.equal(typeof csvFormatter, 'function')
  t.end()
})

test('csv-spectrum', function (t) {
  spectrum(function (err, data) {
    t.error(err, 'no error')

    t.plan(data.length + 1)

    data.forEach(function (datum) {

      // skip tests that don't make sense
      if (
        datum.name === 'empty' ||
        datum.name === 'empty_crlf'
      ) {
        return t.ok(true)
      }

      var options = {}
      if (/crlf/.test(datum.name)) {
        options.newline = '\r\n'
      } else {
        options.newline = '\n'
      }

      var input = JSON.parse(datum.json)
      streamify(input)
        .pipe(csvFormatter(options))
        .pipe(bl(function (err, buf) {
          var output = buf.toString()
          var expected = datum.csv.toString()
          // add ending newline to be consistent
          if (!(new RegExp(options.newline + '$').test(expected))) {
            expected = expected + options.newline
          }
          t.equal(output, expected)
        }))
    })
  })
})
