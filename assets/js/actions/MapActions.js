import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, events, urls} from '../constants/Constants';
import {queryString} from '../components/helpers/helpers';

var MapActions = (function() {


  const appLoad = () => {
    pubsub.emit(actions.appLoad);
  };
  
  const requestDistricts = () => {

      fetch(urls.districts + "?limit=5000")
      .then((response) => {
       return response.json()
      })
      .then(data => {
        pubsub.emit(actions.districtsLoaded, data);
      });

  };


  const requestLocations = (options) => {
    
    fetch(urls.locations + queryString(Object.assign({}, options, {limit: 100})))
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(actions.locationsLoaded, data);
    });

  };


  const selectDistrict = (district) => {
    pubsub.emit(actions.locationsWillBeLoaded);
    pubsub.emit(actions.addFilter, {district});
  }

  const removeFilter = (filter) => {
    pubsub.emit(actions.removeFilter, filter);
  }
  

  const requestLocationDetails = (location) => {
    pubsub.emit(actions.locationsWillBeLoaded);

    fetch(urls.locationDetails + queryString({id: location}))
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(actions.locationDetailsLoaded, data);
    });
  };

  const openHighlight = (type, id, data) => {
    pubsub.emit(actions.openHighlight, {type, id, data});
  };

  const closeHighlight = () => {
    pubsub.emit(actions.closeHighlight);
  }

  

  pubsub.on(actions.appLoad, requestDistricts);


  return {
    appLoad,
    requestDistricts,
    requestLocations,
    selectDistrict,
    removeFilter,
    requestLocationDetails,
    openHighlight,
    closeHighlight
  }



})();

export default MapActions;