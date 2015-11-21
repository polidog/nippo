var config = require('config');
var nippo = require('./lib/nippo.js');

var day = 1;

if (process.argv.length > 2) {
  var _day = parseInt(process.argv[2]);
  if (!isNaN(_day)) {
    day = _day;
  }
  console.log(day);
}
nippo(config, day);
