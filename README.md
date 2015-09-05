# csv-formatter

streaming CSV formatter that aims for compatibility with the [csv-spectrum](https://npmjs.org/csv-spectrum) CSV acid test suite.

```
npm install csv-formatter
```

## usage

simply instantiate `csv` and pump rows in as objects and get out a csv file.

you can use `csv-formatter` in the browser with [browserify](http://browserify.org/)

``` js
var csv = require('csv-formatter')

streamify([{ ... }, ...])
  .pipe(csv())
  .pipe(fs.createWriteStream('some-csv-file.csv'))
```

the csv constructor accepts the following options as well

``` js
var stream = csv({
  separator: ',', // specify optional cell separator
  newline: '\n',  // specify a newline character
})
```
it accepts too an array, that specifies the headers for the object returned:

``` js
var stream = csv(['index', 'message'])
```

or in the option object as well

``` js
var stream = csv({
  separator: ',', // specify optional cell separator
  newline: '\n', // specify a newline character
  headers: ['index', 'message'] // Specifing the headers
})
```

if you do not specify the headers, csv-formatter will take the keys of the first object supplied and treat it like the headers

## License

ISC
