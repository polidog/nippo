var Qiita = require("qiita-js");
var moment = require('moment');
require('isomorphic-fetch');

var QiitaTeamOutput = function(config, formatter) {
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

  Qiita.setToken(config.token);
  // Qiita.setEndpoint("https://" + config.team + ".qiita.com/");
  Qiita.setEndpoint("https://" + config.team + ".qiita.com/");

}


QiitaTeamOutput.prototype.write = function(d, messages) {

  var date = moment().day(d);
  date = date.local();
  var title = date.format("YYYY年MM日DD日")+"の日報";

  if (this.config.title !== undefined) {
    title = this.config.title;
  }
  title = title.replace("%day%", date.format("DD"));

  var tags = [];
  if (this.config.tags !== undefined) {
    tags = this.config.tags.map(function(tag){
      return {name: tag}
    });
  }

  return Qiita.Resources.Item.create_item({
    title: title,
    body: this.formatter(messages),
    coediting: true,
    gist: false,
    private: true,
    tags: tags,
    tweet: false
  });

}

module.exports = QiitaTeamOutput;
