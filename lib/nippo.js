var loader = require("./loader");
var formatter = require("./formatter/default");

var nippo = function(config, day) {

  var Input = loader('input', config.input.service, config.input.dir);
  var Output = loader('output', config.output.service, config.output.dir);
  var formatter = loader('formatter', config.formatter.service, config.formatter.dir);

  var input = new Input(config.input);
  var output = new Output(config.output, formatter);
  input.read(day).then(function(messages){
    output.write(day,messages)
  });

}

module.exports = nippo;
