var SerialPort = require('serialport');

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
function setStretch(stretch) {
	sp1.write(''+(stretch * 1.8)+'\n');
}
module.exports = setStretch;


if (process.argv[1].match(/stretcher/)) {
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', (data) => {
		var r = parseInt(data);
		setStretch(r);
		console.log("stretch rate: "+r);
	});
	console.log("input stretch rate: ");
}
