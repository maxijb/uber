/* Actions related to the app's sidebar.
   Includes searchbox and item list
*/ 

import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, urls} from '../constants/Constants';
import {queryString} from '../components/helpers/helpers';


var SidebarActions = (function() {


  /* Request more item to the sidebar,
    @param setNewItems (boolean) tells wheter shoudl erase old items
    @parma type (string) tyoe of items
    @param options (object) filtering options
    */
  const requestItems = (setNewItems, type, options) => {
    
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


  /* Change type of item in the searchbox
     @param type [movies|writters|director|actors|districts]
     */
  const changeType = (type) => {
     requestItems(true, type);
  }
  

  /* Select one new filter 
     @param filter (object)
  */
  const selectFilter = (filter) => {
    pubsub.emit(actions.addFilter, filter);
  }


/* Subscribe to appLoad and request the first load of items */
  pubsub.on(actions.appLoad, requestItems.bind(this, true, 'movies'));

  /* Exposed methods */
  return {
    requestItems,
    changeType,
    selectFilter
  }


})();


export default SidebarActions;