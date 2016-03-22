import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';
import {EventEmitter} from 'events';

const SidebarStore = Object.assign({}, EventEmitter.prototype, (() => {

	//Default state container
	let _state = {
		listItems: []
	};

	//Setting event Listeners, coming from actions
	pubsub
		.on(events.addSidebarItems, (response) => {
			_state.complete = response.complete;
			_state.listItems = _state.listItems.concat(response.items);
			_state.loading = false;
			SidebarStore.emitChange();
		})
		.on(events.setSidebarItems, (response) => {
			_state.complete = response.complete;
			_state.listItems = response.items;
			_state.loading = false;
			SidebarStore.emitChange();
		})
		.on(events.sidebarItemsWillBeSet, () => {
			_state.listItems = [];
			_state.loading = "full";
			SidebarStore.emitChange();
		})
		.on(events.sidebarItemsWillBeAdded, () => {
			_state.loading = "partial";
			SidebarStore.emitChange();
		});
	
	//Export public API
	return {
		//Getter to the state
		getState() { return _state } ,

		//Emit the change event for the views
		emitChange() { 
			this.emit(events.change, _state);
		}
	}


})());



export default SidebarStore;