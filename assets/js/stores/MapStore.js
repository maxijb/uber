import {default as pubsub} from '../dispatcher/Dispatcher';
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

	pubsub
		.on(actions.locationsLoaded, (response) => {
			_state.mapLocations = response.items;
			MapStore.emitChange();
		})
		.on(actions.districtsLoaded, (response) => {
			_state.districts = response.items;
			MapStore.emitChange();
		})
		.on(actions.locationDetailsLoaded, (response) => {
			_state.lastDetails = response.details;
			MapStore.emitChange();
		})
		.on(actions.addFilter, (filter) => {
			_state.filters = Object.assign({}, _state.filters, filter);
			_state.anyFiltersApplied = true;
			MapStore.emitChange();
		})
		.on(actions.removeFilter, (filter) => {
			let message = {};
			message[filter] = null;
			_state.filters = Object.assign({}, _state.filters, message);
			checkAnyFiltersApplied();
			MapStore.emitChange();
		})
		.on(actions.openHighlight, (highlight) => {
			_state.highlight = highlight;
			MapStore.emitChange();
		})
		.on(actions.closeHighlight, () => {
			_state.highlight = null;
			MapStore.emitChange();
		});
	

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


	return {
		getState() { return _state } ,
		//Emit the change event for the views
		emitChange() { 
			this.emit(events.change, _state);
		}
	}


})());


export default MapStore;