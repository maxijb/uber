import {default as pubsub} from '../dispatcher/Dispatcher';
import {events, actions} from '../constants/Constants';
import {EventEmitter} from 'events';

const UIStore = Object.assign({}, EventEmitter.prototype, (() => {

	let _state = {
		filters: {
			movie: null,
			district: null,
			director: null,
			actor: null,
			writer: null,
			location: null
		}
	};

	pubsub
		.on(actions.addFilter, (filter) => {
			_state.filters = Object.assign({}, _state.filters, filter);
			UIStore.emitChange();
		})
		.on(actions.removeFilter, (filter) => {
			let message = {};
			message[filter] = null;
			_state.filters = Object.assign({}, _state.filters, message);
			UIStore.emitChange();
		});
	

	return {

		anyFiltersApplied() {
			for (let i in _state.filters) 
				if (_state.filters[i]) return true;
			return false;
		},
		getState() { return _state } ,
		//Emit the change event for the views
		emitChange() { 
			this.emit(events.change, _state);
		}
	}


})());


export default UIStore;