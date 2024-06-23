# niconico-slack
Slackに書かれたコメントを、ニコニコ風コメントとして画面上に表示するアプリ

特定のチャンネルにSlack Botを追加して、メンションすることでコメントを送信できます。

## 動作環境
- node.js: v10.15.1
- electron: v1.4.13

## プロジェクト構成

- クライアント側: コメントを表示するためのデスクトップアプリ
- サーバ側: コメントの送受信用のWebSocketサーバ

の二つとSlack Appを使ってニコニコ風コメントを表示しています。

```
niconico-slack
├── LICENSE.txt
├── README.md
├── client/ # ローカルPCで動かすデスクトップアプリ
└── server/ # GAE上で動かすWebSocketサーバ
```

## サーバ
コメント送受信用のWebSocketのサーバです。

GCPのGoogle App Engine(GAE)上で動かします。

公式のチュートリアル
https://cloud.google.com/appengine/docs/standard/nodejs/quickstart?hl=ja
```
# GCPのプロジェクトが作成済み
cd server/
gcloud app deploy --project <project_name>
:
target url:      [https://niconico-slack-xxxxx-xxxxx.appspot.com]
(xxxxx-xxxxxのところはproject_nameによって変わる)

デプロイが成功すればOK
```

## Slack App
1. https://api.slack.com/apps からSlack Appを作成する
    - [Create New App] > App Name と Workspace を入力してCreate Appする
2. Bot Users
    - Bot Userを作成する
    - e.g. Display name:「niconico-slack」
3. Event Subscriptions
    - Request URL: 「https://niconico-slack-xxxxx-xxxxx.appspot.com/slack」を設定
    - Subscribe to Bot Events: 「app_mention」と「message.im」を登録
4. Install App

## クライアント
アプリを起動すると画面の最前面に透明のウィンドウが表示される

Slack Botがメンションされると、コメントが流れてくるようになる
```
cd client/
vim config/default.yaml
> hostname: "niconico-slack-xxxxx-xxxxx.appspot.com" に書き換える

# ローカルでの動作確認(透明のウィンドウが立ち上がればOK)
electron .

# アプリにパッケージ
electron-packager . niconico-slack --platform=darwin --arch=x64 --asar --electron-version=1.4.13 --icon=images/icon.icns
(client/niconico-slack-darwin-x64/に.appが吐き出されている）
```

## License
MIT

 ## 参考資料
 https://qiita.com/kengo92i/items/b1362ce1ab14180ff4bd