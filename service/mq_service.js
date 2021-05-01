let amqp = require('amqplib/callback_api');
const CONN = 'amqps://dwtaooxl:AQBJB04TyLfIqbnFFnA3LPLpAnr7p3xi@puffin.rmq2.cloudamqp.com/dwtaooxl';

let channel = null;
amqp.connect(CONN, function (err, conn) {
    if (err) {
        console.log(err);
    }
    conn.createChannel((err, ch) => {
        if (err) {
            console.log(err);
        }
        channel = ch;

        channel.consume('queue-name', function (msg) {
            console.log(msg);
            channel.ack(msg);

        }, {
            noAck: false
        });
    });
});

process.on('exit', (code) => {
    channel.close();
    console.log('mq channel is closed');
});


exports.publishMessage = function (data) {
    channel.sendToQueue('queue-name', Buffer.from(data), {
        persistent: true
    });
}

