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

setTimeout(function() {
	console.log("writing...");
	sp1.write("10\n");
}, 5000);
