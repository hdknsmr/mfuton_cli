var http = require('http');

const URL = 'http://agile-shore-6333.herokuapp.com/';

var setStretch = require('./stretcher');

console.log("initializing...");

var portName = '/dev/ttyACM0';


function watch() {
	http.get(URL, (res) => {
		var body = '';
		res.setEncoding('utf8');

		res.on('data', (chunk) => {
			body += chunk;
		});

		res.on('end', (res) => {
			console.log({"body": body});
			res = JSON.parse(body);
			console.log({res: res});
			setStretch(res.stretch);
			setWatch(0);
		});
	}).on('error', (e) => {
		console.log(e.message);
		setWatch(10000);
	});
}

var timer = null;
function setWatch(timeout) {
	if (timer != null) {
		clearTimeout(timer);
		timer = null;
	}
	timer = setTimeout(watch, timeout);
}

setWatch(0);
