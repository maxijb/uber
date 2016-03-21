import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';

const SidebarStore = (() => {

	let _state = {
		listItems: []
	};

	//Let the views know that the state is changed
	let emitChange = () => { pubsub.emit(events.mapStateChange, _state); }



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


export default SidebarStore;