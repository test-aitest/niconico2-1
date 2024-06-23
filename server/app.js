const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.json());

io.on('connection', function (socket) {
    socket.on('message', function (msg) {
        io.emit('message', msg);
    });
});

app.post('/slack', async function (req, res) {
    console.log(req.body);

    const { type, event } = req.body;

    if (type === 'challenge') {
        res.status(200).send(req.body.challenge);
    } else if (type === 'event_callback') {
        if (event.thread_ts) {
            // スレッドへの返信かどうか確認する
            try {
                const response = await axios.post('https://slack.com/api/conversations.replies', {
                    channel: event.channel,
                    ts: event.thread_ts,
                    limit: 1
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
                    }
                });

                const parentMessage = response.data.messages[0];
                if (parentMessage && parentMessage.text.includes('ニコニコ起動')) {
                    // 親メッセージに「ニコニコ起動」が含まれているか確認する
                    console.log(event.text);
                    io.emit('message', event.text);
                }
            } catch (error) {
                console.error('Error fetching parent message:', error);
            }
        }
    }

    res.status(200).json(req.body);
});

http.listen(PORT, function () {
    console.log('server listening. Port:' + PORT);
});
