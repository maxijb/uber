import {default as pubsub} from '../dispatcher/Dispatcher';
import {events, actions} from '../constants/Constants';
import {EventEmitter} from 'events';

const SidebarStore = Object.assign({}, EventEmitter.prototype, (() => {

	//Default state container
	let _state = {
		listItems: [],
		loading: false,
		complete: false
	};

	//Setting event Listeners, coming from actions
	pubsub
		.on(actions.addSidebarItems, (response) => {
			_state.complete = response.complete;
			_state.listItems = _state.listItems.concat(response.items);
			_state.loading = false;
			SidebarStore.emitChange();
		})
		.on(actions.setSidebarItems, (response) => {
			_state.complete = response.complete;
			_state.listItems = response.items;
			_state.loading = false;
			SidebarStore.emitChange();
		})
		.on(actions.sidebarItemsWillBeSet, () => {
			_state.listItems = [];
			_state.loading = "full";
			SidebarStore.emitChange();
		})
		.on(actions.sidebarItemsWillBeAdded, () => {
			_state.loading = "partial";
			SidebarStore.emitChange();
		});
	
	//Export public API
	return {
		//Getter to the state
		getState() { return _state },

		//Emit the change event for the views
		emitChange() { 
			this.emit(events.change, _state);
		}
	}


})());



export default SidebarStore;