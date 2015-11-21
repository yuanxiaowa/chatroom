var express = require('express'),
	path = require('path'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	
// ������־����
io.on('connection', function (socket) {
	socket.emit('open');
	var client = {
		socket: socket,
		name: false,
		color: getColor()
	};
	
	socket.on('message', function (msg) {
		var obj = {
			time: getTime(),
			color: client.color
		};
		// �ж��ǲ��ǵ�һ�����ӣ��Ե�һ����Ϣ��Ϊ�û���
		if (!client.name) {
			client.name = msg;
			obj['text'] = client.name;
			obj['author'] = 'System';
			obj['type'] = 'welcome';
			console.log(client.name + ' login');
			//���ػ�ӭ��
			socket.emit('system', obj);
			//�㲥���û��ѵ�½
			socket.broadcast.emit('sytem', obj);
		} else {
			//������ǵ�һ�ε����ӣ�������������Ϣ
			obj['text'] = msg;
			obj['author'] = client.name;
			obj['type'] = 'message';
			console.log(client.name + ' say: ' + msg);
			// ������Ϣ������ʡ�ԣ�
			socket.emit('message', obj);
			// �㲥�������û�����Ϣ
			socket.broadcast.emit('message', obj);
		}
	});
	socket.on('disconnect', function () {
		var obj = {
			time: getTime(),
			color: client.color,
			author: 'System',
			text: client.name,
			type: 'disconnect'
		};
		socket.broadcast.emit('system', obj);
		console.log(client.name + ' Disconnect');
	});
});

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
	res.sendFile(__dirname +'/views/chat.html');
});

server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});

var getTime = function () {
	var date = new Date;
	return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
};

var getColor = function () {
	var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green','orange','blue','blueviolet','brown','burlywood','cadetblue']
	return colors[Math.round(Math.random() * 10000 % colors.length)];
}