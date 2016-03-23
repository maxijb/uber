import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, events, urls} from '../constants/Constants';
import {queryString} from '../components/helpers/helpers';

var MapActions = (function() {



  
  const requestDistricts = () => {
    
    pubsub.emit(events.locationsWillBeLoaded);

    fetch(urls.districts + "?limit=5000")
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.districtsLoaded, data);
    });

  };


  const requestLocations = (options) => {
    
    pubsub.emit(events.locationsWillBeLoaded);

    fetch(urls.locations + queryString(Object.assign({}, options, {limit: 100})))
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.locationsLoaded, data);
    });

  };


  const selectDistrict = (district) => {
    pubsub.emit(actions.addFilter, {district});
  }

  const removeFilter = (filter) => {
    pubsub.emit(actions.removeFilter, filter);
  }
  

  const requestLocationDetails = (location) => {
    fetch(urls.locationDetails + queryString({id: location}))
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.locationDetailsLoaded, data);
    });
  }

  pubsub.on(actions.appLoad, requestDistricts);


  return {
    requestDistricts,
    requestLocations,
    selectDistrict,
    removeFilter,
    requestLocationDetails
  }



})();

export default MapActions;