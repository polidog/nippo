var Slack = require("slack-node");

var SlackInput = function(config) {
  if (config === undefined) {
    return new Error("'config' must be set. It's need have at least 'token' and 'channel'");
  }

  if (config.token === undefined) {
    return new Error("'config.token' must be set");
  }

  if (config.channel === undefined) {
    return new Error("'config.channel' must be set");
  }

  this.config = config
  this.slack = new Slack(config.token);
  this.channel = config.channel; // TODO: なんとかしたい・・・
}

SlackInput.prototype.read = function(day, options) {



  return Promise.resolve()
      .then(function(){
        return Promise.all([
          getUsers(this.slack),
          getChannelId(this.slack, this.channel)
        ]);
      }.bind(this))
      .then(function(results) {
        var users = results[0];
        var channelId = results[1];
        return getMessages(this.slack, channelId, day, users);
      }.bind(this));

}



var getMessages = function(slack, channel, day, users) {
  return new Promise(function(resolve,reject){
    slack.api('channels.history', {
      channel: channel,
      latest: endTime(day),
      oldest: startTime(day),
      count: 1000
    }, function(err, response){
      var text = "";
      if (response.ok) {
        var messages = response.messages.map(function(message){
          return {
            "user": users[message.user],
            "messages": message.text,
            "date": tsToDate(message.ts)
          }
        });
        resolve(messages);
      } else {
        reject(Error("slack response error"));
      }
    });
  });
}

function getChannelId(slack, name) {
  return new Promise(function(resolve, reject){
    slack.api("channels.list",function(err, response){
      if (response.ok) {
        var flag = false;

        response.channels.forEach(function(data){
          if (data.is_channel && data.name == name) {
            flag = true;
            resolve(data.id);
          }
        })

        if (!flag) {
          reject(Error("slack channel not found"));
        }

      } else {
        reject(Error("slack response error"));
      }
    });
  });
}


function getUsers(slack) {
  return new Promise(function(resolve, reject){
    slack.api('users.list', function(err, response){

      if (err || !response.ok) {
        reject(err);
        return;
      }

      var users = [];
      response.members.forEach(function(member){
        users[member.id] = {
          name: member.name,
          image: member.profile.image_48
        };
      });

      resolve(users)
    });

  });
}

function startTime(n) {
  var d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setDate(d.getDate() - n)
  return time(d);
}

function endTime(n) {
  var d = new Date();
  d.setHours(23);
  d.setMinutes(59);
  d.setSeconds(59);
  d.setDate(d.getDate() - n)
  return time(d);
}

function time(d) {
  return Math.floor( d.getTime() / 1000 ) ;
}

function tsToDate(ts) {
  ts = Math.floor(ts);
  return new Date( ts * 1000 );
}



module.exports = SlackInput;
