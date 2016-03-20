import {default as React} from 'react';
import {mapboxApiKey, googleResponseDefaultSF as googleSF} from '../constants/Constants';
let L;
if (typeof window !== "undefined") {
	L = require('leaflet');
}



export default React.createClass({
  
  componentDidMount() {
  	  this.map = L.map('map');
  	  L.Icon.Default.imagePath = '/static/images/';
  	  L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + mapboxApiKey)
  	  .addTo(this.map);

	  this.map.setView([googleSF.lat, googleSF.lng], googleSF.zoom); 

	  this.markers = {};
  },


  shouldComponentUpdate: function(nextProps, nextState) {
  	return nextProps.locations !== this.props.locations;
  },

  componentWillUpdate(nextProps, nextState) {
  	for (let i in nextProps.locations) {
  		let location = nextProps.locations[i];
  		if (location && location.lat) {
  			L.marker([nextProps.locations[i].lat, nextProps.locations[i].lng]).addTo(this.map)
  		}
  	}

  },

  render: function() {
    return (
    	<div id="map">
        </div>
    );
  }

});
