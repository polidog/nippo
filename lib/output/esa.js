var Esa = require('esa-nodejs');
var moment = require('moment');

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

  var date = moment().day(d);
  date = date.local();
  var name = date.format("YYYY年MM日DD日")+"の日報";
  var category = null;
  var wip = this.config.wip;

  if (wip === undefined) {
    wip = false;
  }

  if (this.config.category !== undefined) {
    category = this.config.category.replace("%year%", date.format("YYYY")).replace("%month%", date.format("MM"));
  }
  if (this.config.name !== undefined) {
    name = this.config.name;
  }
  name = name.replace("%day%", date.format("DD"));
  name = category + "/" + name;

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

module.exports = EsaOutput;
