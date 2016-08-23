var firebase = require("firebase");
var db;
var ref;

function _init() {
	// Initialize the app with no authentication
	firebase.initializeApp({
		databaseURL: "https://magicfuton.firebaseio.com/"
	});

	// The app only has access to public data as defined in the Security Rules
	db = firebase.database();
	ref = db.ref("/status");
}

function _on(ev, cb) {
	// console.log(ref);
	ref.on(ev, cb);
}

module.exports = function() {
	_init();
	return {
		_ref : ref,
		onValue : function(cb) {
			_on("value", cb);
		}
	};
}

if (process.argv[1].match(/cloudwatcher/)) {
	m = module.exports();
	m.onValue(function(snapshot) {
		console.log(snapshot.val());
	});
}
