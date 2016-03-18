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

    t.plan((data.length - 2) * 2 + 1)

    data.forEach(function (datum) {
      // skip tests that don't make sense
      if (
        datum.name === 'empty' ||
        datum.name === 'empty_crlf'
      ) {
        return
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
          t.error(err, 'no error')
          var output = buf.toString()
          var expected = datum.csv.toString()
          // add ending newline to be consistent
          if (!(new RegExp(options.newline + '$').test(expected))) {
            expected = expected + options.newline
          }
          t.equal(output, expected, datum.name + ' output equals expected')
        }))
    })
  })
})

test('options', function (t) {
  t.test('undefined', function (t) {
    var csv = csvFormatter()
    var expected = {
      separator: ',',
      newline: '\n'
    }

    t.same(csv.options, expected, 'applies default options')
    t.end()
  })

  t.test('object', function (t) {
    t.test('separator', function (t) {
      var csv = csvFormatter({
        separator: ';'
      })

      t.equal(csv.options.separator, ';', 'applies separator option')
      t.end()
    })

    t.test('newline', function (t) {
      var csv = csvFormatter({
        newline: '\r\n'
      })

      t.equal(csv.options.newline, '\r\n', 'applies newline option')
      t.end()
    })

    t.test('headers', function (t) {
      var csv = csvFormatter({
        headers: ['index', 'message']
      })

      t.same(csv.options.headers, ['index', 'message'], 'applies headers option')
      t.end()
    })

    t.end()
  })

  t.test('array', function (t) {
    var csv = csvFormatter(['index', 'message'])
    var expected = {
      separator: ',',
      newline: '\n',
      headers: ['index', 'message']
    }

    t.same(csv.options, expected, 'applies default & headers options')
    t.end()
  })

  t.end()
})
