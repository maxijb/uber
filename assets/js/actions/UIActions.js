import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, events, urls} from '../constants/Constants';

var UIActions = {

  /**
   * first Load of the application
   */
  appLoad() {
    pubsub.emit(actions.appLoad);
    this.requestDistricts();
    this.requestMovies();
  },


  requestDistricts(filter) {

    fetch(urls.districts)
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.districtsLoaded, data);
    });

  },

  requestLocations(filter) {

    fetch(urls.locations)
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.locationsLoaded, data);
    });

  },


  requestMovies(filter) {

    fetch(urls.movies)
    .then((response) => {
     return response.json()
    })
    .then(data => {
      pubsub.emit(events.moviesLoaded, data);
    });

  }
  




};

export default UIActions;