import {default as pubsub} from '../dispatcher/Dispatcher';
import {events} from '../constants/Constants';

const SidebarStore = (() => {

	let _state = {
		listItems: []
	};

	//Let the views know that the state is changed
	let emitChange = () => { pubsub.emit(events.sidebarStateChange, _state); }



	pubsub.on(events.addSidebarItems, (items) => {
		_state.listItems = _state.listItems.concat(items);
		_state.loading = false;
		emitChange();
	});

	pubsub.on(events.setSidebarItems, (items) => {
		_state.listItems = items;
		_state.loading = false;
		emitChange();
	});	

	pubsub.on(events.sidebarItemsWillBeSet, () => {
		_state.listItems = [];
		_state.loading = true;
		emitChange();
	});

	pubsub.on(events.sidebarItemsWillBeAdded, () => {
		_state.loading = true;
		emitChange();
	});
	

	return {
		getState() { return _state } 
	}


})();


export default SidebarStore;