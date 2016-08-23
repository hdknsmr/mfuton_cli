var setStretch = require('./stretcher');

console.log("initializing...");

var watcher = require('./cloudwatcher')();

watcher.onValue(function(snapshot) {
	var v = snapshot.val()
	console.log(v);
	if (v) {
		setStretch(100);
	} else {
		setStretch(0);
	}
});

