import {default as React} from 'react';
import {events} from '../constants/Constants';
import {default as MapActions} from '../actions/MapActions.js';
import {default as MapStore} from '../stores/MapStore.js';
import {mapboxApiKey, googleResponseDefaultSF as googleSF, LeafletImagesPath, LeafletMapTilesPath} from '../constants/Constants';
import {MarkerFactory} from './map/MarkerFactory';
import {closest} from './helpers/helpers';
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
         if (closest(event.target, '.location-popup')) {
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
      this.updateMarkers();
      this.updateOpenMarkerPopup(mapState.lastDetails);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    //the rendering of the map ois performed by leaflet, not React
  	return false;
  },


  handleMoveMap() {
    if (this.map.getZoom() >= 14 && !this.state.anyFiltersApplied) {
      MapActions.requestLocations({coordinates: this.map.getBounds().toBBoxString()})
    }
  },

  updateOpenMarkerPopup(details) {
    //Update last marker popup
    if (details && this.markers[details.id] && !this.markers[details.id].fullyLoaded) {
         this.markers[details.id].addPopupProperties(details);
    }
  },

  updateMarkers() {
    

    //decide whether to show districts or locations' icons
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


  handleDistrictClick(district, marker, event) {
    MapActions.selectDistrict({id: district.id, name: district.name});
  },

  handleLocationPopupClick(event) {
    const trigger = closest(event.target, ".trigger");
    if (trigger && trigger.dataset) {
      MapActions.openHighlight(trigger.dataset.highlight, trigger.dataset.id, JSON.parse(trigger.dataset.data));
    }
  },

  handleLocationClick(location, marker, event) {
    marker.openPopup();
    //update marker popup if required
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

    if (this.state.anyFiltersApplied && pois != this.state.districts) {
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
