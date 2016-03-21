import {default as React} from 'react';
import {events} from '../constants/Constants';
import {default as MapActions} from '../actions/MapActions.js';
import {default as MapStore} from '../stores/MapStore.js';
import {mapboxApiKey, googleResponseDefaultSF as googleSF} from '../constants/Constants';
let L;
if (typeof window !== "undefined") {
	L = require('leaflet');
}



export default React.createClass({
  
  componentDidMount() {
  	  
      pubsub.on(events.mapStateChange, this.handleMapStateChange);

      this.map = L.map('map');
  	  L.Icon.Default.imagePath = '/static/images/';
  	  L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + mapboxApiKey)
  	  .addTo(this.map);

	  this.map.setView([googleSF.lat, googleSF.lng], googleSF.zoom); 

	  this.markers = [];
  },

  getInitialState() {
    return {
      mapLocations: []
    }
  },


  handleMapStateChange(mapState) {
    if (mapState.mapLocations !== this.state.mapLocations) {
      this.setState({mapLocations : mapState.mapLocations})
      this.updateMarkers();
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    //the rendering of the map ois performed by leaflet, not React
  	return false;
  },


  updateMarkers() {
  	this.state.mapLocations.forEach(loc => {
  		//if valid point
  		if (loc && loc.lat) {
  			L.marker([loc.lat, loc.lng]).addTo(this.map);
  		}
  	});
  },

  render: function() {
    return (
    	<div id="map">
        </div>
    );
  }

});
