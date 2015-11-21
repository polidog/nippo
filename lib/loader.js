module.exports = function(type, service, extendPath) {
  var Input = null;
  if (extendPath !== undefined) {
    Input = require(extendPath + "/" + service);
  } else {
    Input = require("./" + type + "/" + service);
  }
  return Input;
}
