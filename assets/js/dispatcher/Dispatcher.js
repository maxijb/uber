/* We don't need waitFor() or all the overead introduced by the Flux dispatcher
   We might very well get away with Node's default EventEmitter
   to communicate actions with stores
*/

let EventEmitter = require('events').EventEmitter,
	pubsub;
 

if (typeof window !== "undefined") {
	//let's not override the global pubsub object with a new instance
	//that woudl duplicate our event emiters and our components 
	//could end up listening to different objects
	pubsub = window.pubsub || new EventEmitter();
	window.pubsub = pubsub;
} else {
	pubsub = new EventEmitter();
}

export default pubsub;