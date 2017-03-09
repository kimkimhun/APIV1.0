var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  bodyParser = require('body-parser'),
  io = require('socket.io')(server);

const logger = require('morgan');
const router = express.Router();
const port = process.env.PORT || 7777;

app.use(bodyParser.json());
app.use(logger('dev'));
//app.use('/api/v1', router);
const onmessage = require('./onmessage');

server.listen(port);
console.log(`App Runs on ${port}`);

var mqtt = require('mqtt');
// mqttcore
// 123456
//port: 14539

// 17037
// vcniortv
// uKQSMOpZiih1
var options = {

  port:17037,
  host: 'mqtt://m13.cloudmqtt.com',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'vcniortv',
  password: 'uKQSMOpZiih1',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
}

var client = mqtt.connect('mqtt://m13.cloudmqtt.com', options);
var topictest = ['SEND', 'SETDEVICE', 'APPSET','SETAPP'];
//var data;

client.on('connect', function () {
  console.log('connected');
  client.subscribe(topictest, function () {
    console.log('subscribe : ' + topictest);
  });

});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {

  console.log('a user connected  : ' + socket.id);

  //  socket.on('subscribe', function (data) {
  //  console.log('Subscribing to '+data.topic);
  //  socket.join(data.topic);
  //  client.subscribe(data.topic);
  //  });

  //  socket.on('publish', function (data) {
  //      console.log('Publishing to '+data.topic);
  //      client.publish(data.topic,data.payload);
  //  });


  socket.on('disconnect', function () {
    console.log('a user disconnected  : ' + socket.id);
  });

  // Receive message from App to server to device
  socket.on('SETAPP', (topic, payload) => {
    var message = onmessage.messageemit(payload);
    if (message.lost == 0) {
      console.log({ message: 'data lost' });
    } else {
      console.log(topic + " " + "check message: %j", message);
      client.publish(topic, message);
    }
  });

  socket.on('Test', (topic, message) => {
    console.log(topic+ " "+message);
    // console.log('Publishing to ' + topic);
  });
});


// Receive message from server to app
client.on('message', function (topic, payload) {
  console.log(topic + '=' + payload);
  if (topic == "SEND") {
    var message = onmessage.messagecomming(payload);
    if (message.lost == 0) {
      console.log({ message: 'data lost' });
    } else {
      console.log(topic + " " + "message: %j", message);
      io.emit('DeviceSend', {
        'temperature': message.temperasure,
        'humidity': message.humidity,
        'hour': message.hour,
        'day': message.day,
        'connect': message.connected
      });
    }
  }
  else if (topic == "DEVICESET") {
    var message = onmessage.messagecommingSet(payload);
    if (message.lost == 0) {
      console.log({ message: 'data lost' });
    } else {
      console.log(topic + " " + "message: %j", message);
       io.emit('DeviceSet', {
        'temperature': message.temperasure,
        'humidity': message.humidity,
        'hour': message.hour
      });
    }
  }         
});
