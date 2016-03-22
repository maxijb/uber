import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, events, urls} from '../constants/Constants';

var MapActions = (function() {


  pubsub.on(actions.appLoad, requestDistricts);

  
  function requestDistricts(filter) {
    console.log('llea');
    fetch(urls.districts + "?limit=5000")
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.districtsLoaded, data);
    });

  }

  function requestLocations(filter) {

    fetch(urls.locations)
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.locationsLoaded, data);
    });

  }


    
  return {
    requestDistricts,
    requestLocations
  }



})();

export default MapActions;