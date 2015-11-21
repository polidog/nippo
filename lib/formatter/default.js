function tsToTimeName(d) {
  var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
  var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
  var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
  return hour + ":" + min + ":" + sec
}

module.exports = function(messages) {
    return messages.map(function(message){
      var d = message.date;
      var text = message.user.name + " at " + tsToTimeName(message.date) + "\n" + message.messages;
      return text;
    }).join("\n\n");
}
