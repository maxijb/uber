import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, events, urls} from '../constants/Constants';

var SidebarActions = (function() {

  pubsub.on(actions.appLoad, requestSidebarItems.bind(this, true, 'movies'));
  

  function changeType(type) {
     pubsub.emit(events.sidebarItemsWillBeSet);
     requestSidebarItems(true, type);
  }

 
  function requestSidebarItems(setNewItems, type, filter, sort) {

    fetch(urls[type])
    .then((response) => {
     return response.json()
    })
    .then(data => {
      let event = setNewItems ? events.setSidebarItems : events.addSidebarItems;
      pubsub.emit(event, data);
    });

  }
  

  return {
    requestSidebarItems,
    changeType
  }



})();

export default SidebarActions;