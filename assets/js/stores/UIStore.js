import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';

const UIStore = (() => {

	let _state = {};

	//Let the views know that the state is changed
	let emitChange = () => { pubsub.emit(events.stateChange); }



	


	return {
		getState() { return _state } 
	}


})();


export default UIStore;