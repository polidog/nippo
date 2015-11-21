module.exports = function(type, service) {
  var Input = require("./" + type + "/" + service);
  return Input;
}
