import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, events, urls} from '../constants/Constants';

var SidebarActions = (function() {

  pubsub.on(actions.appLoad, requestItems.bind(this, true, 'movies'));
  

  function changeType(type) {
     pubsub.emit(events.sidebarItemsWillBeSet);
     requestItems(true, type);
  }

 
  function requestItems(setNewItems, type, options) {

    fetch(urls[type] + queryString(options))
    .then((response) => {
     return response.json()
    })
    .then(data => {
      let event = setNewItems ? events.setSidebarItems : events.addSidebarItems;
      pubsub.emit(event, data);
    });

  }
  

  return {
    requestItems,
    changeType
  }


  function queryString(obj) {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return "?" + str.join("&");
  }



})();

export default SidebarActions;