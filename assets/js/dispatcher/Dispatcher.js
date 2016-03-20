let EventEmitter = require('events').EventEmitter,
	pubsub;
 

if (typeof window !== "undefined") {
	//let's not override the global pubsub object with a new instance
	pubsub = window.pubsub || new EventEmitter();
	window.pubsub = pubsub;
} else {
	pubsub = new EventEmitter();
}

export default pubsub;