import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';
import {EventEmitter} from 'events';

const MapStore = Object.assign({}, EventEmitter.prototype, (() => {

	let _state = {
		districts: [],
		mapLocations: []
	};

	pubsub
		.on(events.locationsLoaded, (response) => {
			_state.mapLocations = response.items;
			MapStore.emitChange();
		})
		.on(events.districtsLoaded, (response) => {
			_state.districts = response.items;
			MapStore.emitChange();
		})
		.on(events.locationDetailsLoaded, (response) => {
			_state.lastDetails = response.details;
			MapStore.emitChange();
		});
	

	return {
		getState() { return _state } ,
		//Emit the change event for the views
		emitChange() { 
			this.emit(events.change, _state);
		}
	}


})());


export default MapStore;