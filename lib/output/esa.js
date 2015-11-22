var Esa = require('esa-nodejs');

var EsaOutput = function(config, formatter) {

  if (config === undefined) {
    return new Error("'config' must be set. It's need have at least 'token' and 'team'");
  }

  if (config.token === undefined) {
    return new Error("'config.token' must be set");
  }

  if (config.team === undefined) {
    return new Error("'config.channel' must be set");
  }

  this.config = config;
  this.formatter = formatter;

  this.esa = Esa({
    team: this.config.team,
    accessToken: this.config.token
  });

}

EsaOutput.prototype.write = function(d, messages) {


  var targetDate = getDate(d);
  var name = "%day%の日報";
  var category = null;
  var wip = this.config.wip;

  if (wip === undefined) {
    wip = false;
  }

  if (this.config.category !== undefined) {
    category = this.config.category.replace("%year%", targetDate.getFullYear()).replace("%month%", targetDate.getMonth() + 1);
  }
  if (this.config.name !== undefined) {
    name = this.config.name;
  }
  name = name.replace("%day%", targetDate.getDay());

  return new Promise(function(resolve, reject){
    this.esa.api.createPost({
      name: name,
      category: category,
      wip: wip,
      body_md: this.formatter(messages),
    },function(err, response){
      if (err) {
        reject(err);
      } else {
        resolve(response)
      }
    });
  }.bind(this));


}

function getDate(n) {
  var d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setDate(d.getDate() - n);
  return d;
}

module.exports = EsaOutput;
