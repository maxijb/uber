import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';

const UIStore = (() => {

	let _state = {};

	//Let the views know that the state is changed
	let emitChange = () => { pubsub.emit(events.stateChange); }



	pubsub.on(events.moviesLoaded, (movies) => {
		console.log(movies);
		_state.movies = movies;
		emitChange();
	});

	pubsub.on(events.locationsLoaded, (locations) => {
		_state.mapLocations = locations;
		emitChange();
	});


	pubsub.on(events.districtsLoaded, (districts) => {
		_state.districts = districts;
		_state.mapLocations = districts;
		emitChange();
	});


	return {
		getState() { return _state } 
	}


})();


export default UIStore;