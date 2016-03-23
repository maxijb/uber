import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, urls} from '../constants/Constants';
import {queryString} from '../components/helpers/helpers';

var SidebarActions = (function() {

  pubsub.on(actions.appLoad, requestItems.bind(this, true, 'movies'));
  

  function changeType(type) {
     requestItems(true, type);
  }

 
  function requestItems(setNewItems, type, options) {
    
    pubsub.emit(setNewItems ? actions.sidebarItemsWillBeSet : actions.sidebarItemsWillBeAdded);

    fetch(urls[type] + queryString(options))
    .then((response) => {
     return response.json()
    })
    .then(data => {
      let event = setNewItems ? actions.setSidebarItems : actions.addSidebarItems;
      pubsub.emit(event, data);
    });

  }
  

  function selectFilter(filter) {
    pubsub.emit(actions.addFilter, filter);
  }

  return {
    requestItems,
    changeType,
    selectFilter
  }


  



})();

export default SidebarActions;