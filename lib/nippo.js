var Slack = require("slack-node")
var Esa = require('esa-nodejs');

var nippo = function(config, day) {

  var slack = new Slack(config.slack.token);
  var esa = Esa({
    team: config.esa.team,
    accessToken: config.esa.token
  });

  if (day === undefined) {
    day = 1;
  }

  getUsers(slack).then(function(users){
    getChannelId(slack, "report").then(function(channel){
      return getMessages(slack, channel, day, users);
    }).then(function(message){
      esapost(esa, message.join("\n\n"), day, config.esa.category);
    });
  }).catch(function(error) {
    console.error(error);
  });
}

function getChannelId(slack, name) {
  return new Promise(function(resolve){
    slack.api("channels.list",function(err, response){
      if (response.ok) {
        response.channels.forEach(function(data){
          if (data.is_channel && data.name == name) {
            resolve(data.id);
          }
        })
      } else {
        reject(Error("slack response error"));
      }
    });
  });
}

function getMessages(slack, channel, day, users) {
  return new Promise(function(resolve){
    slack.api('channels.history', {
      channel: channel,
      latest: endTime(day),
      oldest: startTime(day),
      count: 1000
    }, function(err, response){
      var text = "";
      if (response.ok) {
        var messages = response.messages.map(function(message){
          var text = "";
          var user = users[message.user];
          var text = user.name + " : " + tsToTimeName(message.ts) + "\n";
          text += message.text;
          return text;
        });

        resolve(messages);
      } else {
        reject(Error("slack response error"));
      }
    });
  });
}

function getUsers(slack) {
  return new Promise(function(resolve){
    slack.api('users.list',function(err, response){
      var users = [];
      response.members.forEach(function(member){
        users[member.id] = {
          name: member.name,
          image: member.profile.image_48
        };
      });
      resolve(users);
    });
  });
}


function esapost(esa, message, n, categoryBase) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  var category = categoryBase.replace("%year%", d.getFullYear()).replace("%month%", d.getMonth());

  esa.api.createPost({
    name: d.getDay(),
    category: category,
    wip: false,
    body_md: message
  },function(){

  })
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

function tsToTimeName(ts) {
  ts = Math.floor(ts);
  var d = new Date( ts * 1000 );
  var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
  var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
  var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
  return hour + ":" + min + ":" + sec
}

module.exports = nippo;
