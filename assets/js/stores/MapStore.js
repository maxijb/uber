import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';

const SidebarStore = (() => {

	let _state = {
		listItems: []
	};

	//Let the views know that the state is changed
	let emitChange = () => { pubsub.emit(events.mapStateChange, _state); }



	pubsub.on(events.locationsLoaded, (response) => {
		_state.mapLocations = response.items;
		emitChange();
	});


	pubsub.on(events.districtsLoaded, (response) => {
		console.log(response);
		_state.districts = response.items;
		_state.mapLocations = response.items;
		emitChange();
	});
	

	return {
		getState() { return _state } 
	}


})();


export default SidebarStore;