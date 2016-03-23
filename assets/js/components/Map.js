import {default as React} from 'react';
import {events} from '../constants/Constants';
import {default as MapActions} from '../actions/MapActions.js';
import {default as MapStore} from '../stores/MapStore.js';
import {default as UIStore} from '../stores/UIStore.js';
import {mapboxApiKey, googleResponseDefaultSF as googleSF, LeafletImagesPath, LeafletMapTilesPath} from '../constants/Constants';
import {MarkerFactory} from './map/MarkerFactory';
//import Leaflet only on the browser
let L = (typeof window !== "undefined") ? L = require('leaflet') : null;



export default React.createClass({
  
  componentDidMount() {
  	  
      //Listen to the store
      MapStore.on(events.change, this.handleMapStateChange);

      //Init the map
      this.map = L.map('map');
      L.Icon.Default.imagePath = LeafletImagesPath;
      L.tileLayer(LeafletMapTilesPath + mapboxApiKey).addTo(this.map);
	    this.map.setView([googleSF.lat, googleSF.lng], googleSF.zoom); 

      //This component owns markers data
	    this.markers = {};
      this.markerLayer = null;

      this.map.on('zoomend', this.updateMarkers);
      this.map.on('moveend', this.handleMoveMap);

      //Leaflet doesn't listen to clicks on popups
      document.getElementById('map').addEventListener('click', (event) => {
         if (event.target.matches('.location-popup, .location-popup *')) {
           this.handleLocationPopupClick(event);
         }
      })
  },

  getInitialState() {
    return {
      mapLocations: [],
      renderedLocations: [],
      type: null
    }
  },


  handleMapStateChange(mapState) {
      this.setState(mapState);
      debugger;
      if (mapState.lastDetails && this.markers[mapState.lastDetails.id]) {
         this.markers[mapState.lastDetails.id].addPopupProperties(mapState.lastDetails);
      }
      this.updateMarkers();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    //the rendering of the map ois performed by leaflet, not React
  	return false;
  },


  handleMoveMap() {
    if (this.map.getZoom() >= 14 && !UIStore.anyFiltersApplied()) {
      MapActions.requestLocations({coordinates: this.map.getBounds().toBBoxString()})
    }
  },

  updateMarkers() {
    let source, type, needUpdate, method;
    if (!this.state.mapLocations.length || (this.state.mapLocations.length >= 100 && this.map.getZoom() < 14)) {
      if (this.state.type !== "district") {
        this.setState({renderedLocations: this.state.districts, type: "district"});
        this.renderMarkers(this.state.districts, this.handleDistrictClick);  
      }
      
    } else {
      if (this.state.mapLocations !== this.state.renderedLocations) {
        this.setState({renderedLocations: this.state.mapLocations, type: "location"});
        this.renderMarkers(this.state.mapLocations, this.handleLocationClick);
      }
    }
  },

  handleDistrictPopupClick(district, marker, event) {
    console.log('popup', district, marker, event);
  },

  handleDistrictClick(district, marker, event) {
    MapActions.selectDistrict({id: district.id, name: district.name});
  },

  handleLocationPopupClick(location, marker, event) {
    console.log('popup', location, marker, event);
  },

  handleLocationClick(location, marker, event) {
    console.log('marker', location, marker, event);
    marker.openPopup();
    if (!marker.fullyLoaded) {
      marker.addPopupProperties({showPic: true, loading: true});
      MapActions.requestLocationDetails(location.id);
    }
  },

  resetMarkers() {
    if (this.markerLayer) {
      this.map.removeLayer(this.markerLayer);
      this.markers = {};
    }

    return L.featureGroup([]).addTo(this.map);
  },

  
  renderMarkers(pois, handleClick, handlePopupClick) {
    
    this.markerLayer = this.resetMarkers();

    pois.forEach(loc => {
      
      if (loc && loc.lat) {
         this.markers[loc.id] = MarkerFactory(this.state.type, loc, handleClick).addTo(this.markerLayer);
     	}

  	});

    if (UIStore.anyFiltersApplied()) {
      this.map.fitBounds(this.markerLayer.getBounds());
    }

  },

  render: function() {
    return (
    	<div id="map">
      </div>
    );
  }

});
