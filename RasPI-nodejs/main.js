var http = require('http');

const URL = 'http://agile-shore-6333.herokuapp.com/';

var SerialPort = require('serialport');

console.log("initializing...");

var portName = '/dev/ttyACM0';

var spfunc = function(opt, opencb, datacb) {
    var sp = new SerialPort(opt.portName || portName, {
        baudRate: opt.baudrate || 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false,
        parser: SerialPort.parsers.readline("\n"),
    });

	sp.on("open", opencb || function(err) {
		if (err) {
			console.log("open failed err: "+err);
		}
	});
	sp.on('data', datacb || function(data) {
		console.log('data: '+data);
	});

	return {
		write : function(data, cb) {
			sp.write(data, cb);
		}
	};
};

var sp1 = spfunc({portName: '/dev/ttyACM0', bardrate: 9600});

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
			sp1.write(''+(res.stretch * 1.8)+'\n');
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
