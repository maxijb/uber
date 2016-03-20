import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';

const UIStore = (() => {

	let _state = {};

	//Let the views know that the state is changed
	let emitChange = (key) => { pubsub.emit(events.stateChange, key); }


	pubsub.on(events.locationsLoaded, (locations) => {
		_state.locations = locations;
		emitChange('locations');
	});

	pubsub.on(events.moviesLoaded, (movies) => {
		_state.movies = movies;
		emitChange('movies');
	});


	return {
		getState() { return _state } 
	}


})();


export default UIStore;