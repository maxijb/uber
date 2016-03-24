/* Store containig information regarding the map.
   Listens to pubsub and emits a 'change' event
   */

import pubsub from '../dispatcher/Dispatcher';
import {events, actions} from '../constants/Constants';
import {EventEmitter} from 'events';

const MapStore = Object.assign({}, EventEmitter.prototype, (() => {

	let _state = {
		districts: [],
		mapLocations: [],
		filters: {
			movie: null,
			district: null,
			director: null,
			actor: null,
			writer: null,
			location: null
		},
		anyFiltersApplied: false,
		lastDetails: null,
		highlight: null
	};


	//Listen to this actions:
	pubsub
		//new locations loaded
		.on(actions.locationsLoaded, (response) => {
			_state.mapLocations = response.items;
			_state.loading = false;
			MapStore.emitChange();
		})
		//districs have been loaded
		//this will happen only on startup as we'll cache that information
		.on(actions.districtsLoaded, (response) => {
			_state.loading = false;
			_state.districts = response.items;
			MapStore.emitChange();
		})
		//location details havebeen loaded
		.on(actions.locationDetailsLoaded, (response) => {
			_state.lastDetails = response.details;
			MapStore.emitChange();
		})
		//a new filter has been selected
		.on(actions.addFilter, (filter) => {
			_state.filters = Object.assign({}, _state.filters, filter);
			_state.anyFiltersApplied = true;
			MapStore.emitChange();
		})
		//filter unselected. Chack if any remains
		.on(actions.removeFilter, (filter) => {
			let message = {};
			message[filter] = null;
			_state.filters = Object.assign({}, _state.filters, message);
			checkAnyFiltersApplied();
			MapStore.emitChange();
		})
		//opent the highlight bar
		.on(actions.openHighlight, (highlight) => {
			_state.highlight = highlight;
			MapStore.emitChange();
		})
		//close the highlight bar
		.on(actions.closeHighlight, () => {
			_state.highlight = null;
			MapStore.emitChange();
		});


	//Helper to check if any filter has been applied
	const checkAnyFiltersApplied = () => {
		let applied = false;
			for (let i in _state.filters) {
				if (_state.filters[i]) {
					break
					applied = true;
				}
				
			}
		_state.anyFiltersApplied = applied;
	}


	//Public API
	return {
		getState() { return _state } ,
		//Emit the change event for the views
		emitChange() { 
			this.emit(events.change, _state);
		}
	}


})());


export default MapStore;