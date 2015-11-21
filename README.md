nippo
===


[Slackで簡単に「日報」ならぬ「分報」をチームで実現する3ステップ 〜 Problemが10分で解決するチャットを作ろう](http://c16e.com/1511101558/)  

個人的にこの分報を使い始めて、便利だと思いました。  
しかし、分報をまとめて日報にしたい人も多いはずです。(おそらく)  

確かにSlackにはアーカイブ機能がありますが、他のドキュメントツールと連携して日報を作れたなら、分報がより良いモノになる気がします。  
ということで、Slackから[esa.io](https://esa.io/)やその他のドキュメントサービスに日報としてまとまられるツールを作りました。

今後、Slack以外のチャットツールや、esa.io以外のドキュメントツールにも対応していこうと思います。

## 使い方

まずはインストールしましょう。

```
$ npm install nippo
```

あとはjsをちょこっと書くだけ


```
var nippo = require("nippo")

var config = {
  "output": {
    "service": "esa",
    "team": "your team name",
    "token": "your token",
    "category": "report/%year%/%month%"
  },
  "input": {
    "service": "slack",
    "token": "your token",
    "channel": "report"
  },
  "formatter": {
    "service": "default"
  }
};

nippo(config, 1); // 1を指定することで、1日前の日報を作成します。

```

## esa.ioに反映するときのフォーマットを変更する

自分でesa.ioに保存するドキュメントのフォーマットを変更することも出来ます。

まずは適当なディレクトリにフォーマッターを用意します。

```
$ mkdir ./formatter
```

次にフォーマッターファイルを用意します。

```
vi ./formatter/my_formatter.js

function tsToTimeName(d) {
  var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
  var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
  var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
  return hour + ":" + min + ":" + sec
}

module.exports = function(messages) {
    return messages.map(function(message){
      var d = message.date;
      var text = message.user.name + " 投稿時間 " + tsToTimeName(message.date) + "\n #メッセージ\n\n" + message.messages;
      return text;
    }).join("\n\n");
}
```

最後に、フォーマッターファイルの位置をしていします。

`service`を先ほど作成した`my_formatter.js`にし、`dir`でディレクトリを指定します。

```
var nippo = require("nippo");


nippo({
  "output": {
    "service": "esa",
    "team": "polidog",
    "token": "27e082c09ea407f9e4b49afa94b3add568c00396b1720df508d8f8a5d14fdd5f",
    "category": "report/%year%/%month%"
  },
  "input": {
    "service": "slack",
    "token": "xoxp-2449639275-2449639279-2642519233-bb79e1",
    "channel": "report"
  },
  "formatter": {
    "service": "my_formatter",
    "dir": __dirname + "/formatter"
  }
},1);
```

これでカスタムのフォーマッターを使うことが出来ます。



## 最後に

コードは糞コードですごめんなさい・・・
