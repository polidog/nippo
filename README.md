nippo
===


最近[Slackで簡単に「日報」ならぬ「分報」をチームで実現する3ステップ 〜 Problemが10分で解決するチャットを作ろう](http://c16e.com/1511101558/)が流行っていますが、分報をまとめて日報を作りたいと思ったので、分報をまとめてesaに日報を作成するツール作りました。  


## 使い方

まずはインストールしましょう。

```
$ npm install nippo
```

あとはjsをちょこっと書くだけ


```
var nippo = require("nippo")

var config = {
  "esa": {
    "team": "team name",
    "token": "access token",
    "category": "report/%year%/%month%"
  },
  "slack": {
    "token": "access token",
    "channel": "#general"
  }
};

nippo(config, 1); // 1を指定することで、1日前の日報を作成します。

```

## 最後に

コードは糞コードですごめんなさい・・・
