/* Static conatiner and behaviour for the map actions.
All the dom interactions within the map are handled by leaflet, not react.
*/

import React from 'react';
import {events} from '../constants/Constants';
import {mapboxApiKey, googleResponseDefaultSF as googleSF, LeafletImagesPath, LeafletMapTilesPath} from '../constants/Constants';
import MapActions from '../actions/MapActions.js';
import MapStore from '../stores/MapStore.js';
import {MarkerFactory} from './map/MarkerFactory';
import {closest} from './helpers/helpers';

//import Leaflet only on the browser
let L = (typeof window !== "undefined") ? L = require('leaflet') : null;



export default React.createClass({
  
  componentDidMount() {
  	  
      //Listen to the store
      MapStore.on(events.change, this.handleMapStateChange);

      //This component owns markers data
      this.markers = {};
      this.markerLayer = null;
      this.renderedLocations = [];
      this.type = null;

      //Init the map
      this.map = L.map('map');
      
      L.tileLayer(LeafletMapTilesPath + mapboxApiKey).addTo(this.map);
      
      this.map
        .setView([googleSF.lat, googleSF.lng], googleSF.zoom)
        .on('zoomend', this.updateMarkers)
        .on('moveend', this.handleMoveMap);

      //Easiest way to listen to clicks on Leaflet popups
      document.getElementById('map').addEventListener('click', (event) => {
         if (closest(event.target, '.location-popup')) {
           this.handleLocationPopupClick(event);
         }
      })
  },

  //empty locations
  getInitialState() {
    return {
      mapLocations: []
    }
  },


  //When the mapStore changes, check if we need to update our markers and settings
  handleMapStateChange(mapState) {
      this.setState(mapState);
      this.updateMarkers();
      this.updateOpenMarkerPopup(mapState.lastDetails);
  },


  shouldComponentUpdate: function(nextProps, nextState) {
    //the rendering of the map ois performed by leaflet, not React
  	return false;
  },

  //Get new markers as user moves the map
  //if no filters have been applied and the zoom is greater than 14
  //otherwise it will show distrcts
  handleMoveMap() {
    if (this.map.getZoom() >= 14 && !this.state.anyFiltersApplied) {
      MapActions.requestLocations({coordinates: this.map.getBounds().toBBoxString()})
    }
  },

  //when we click on a marker we want more information about it
  //check if the marker still exists before assigning the new prperties
  updateOpenMarkerPopup(details) {
    //Find the marker to update
    const marker = details ? this.markers[details.id] : null;

    //If it still exists and needs data, load it
    if (marker && !marker.fullyLoaded && marker.addPopupProperties) {
            marker.addPopupProperties(details);
    }
  },


  updateMarkers() {
    
    //decide whether to show districts or locations' icons
    let source, type, needUpdate, method;
    
    //Decide whether to render locations or neighborhoods
    if (!this.state.anyFiltersApplied && (!this.state.mapLocations.length || (this.state.mapLocations.length >= 100 && this.map.getZoom() < 14))) {
      
      // We only need to update if we weren't showing ditricts
      if (this.type !== "district") {
        this.renderedLocations = this.state.districts;
        this.type = "district";
        this.renderMarkers(this.state.districts, this.handleDistrictClick);  
      }
      
    } else {
      //if we need to render locations' markers
      //we need to check that the lists are different
      if (this.state.mapLocations !== this.renderedLocations) {
        this.renderedLocations = this.state.mapLocations;
        this.type = "location";
        this.renderMarkers(this.state.mapLocations, this.handleLocationClick);
      }
    }

  },

  //Clicks on distruct triggers an action
  handleDistrictClick(district, marker, event) {
    MapActions.selectDistrict({id: district.id, name: district.name});
  },

  //Clicks on popups
  handleLocationPopupClick(event) {
    //find the trigger
    const trigger = closest(event.target, ".trigger");
    //and trigger an action if required
    if (trigger && trigger.dataset) {
      MapActions.openHighlight(trigger.dataset.highlight, trigger.dataset.id, JSON.parse(trigger.dataset.data));
    }
  },

  //CLicks on locations markers
  handleLocationClick(location, marker, event) {
    //the click will by default try to close the popup
    marker.openPopup();
    
    //update marker popup if required
    if (!marker.fullyLoaded && marker.addPopupProperties) {
      //start updating the popup and ask for more data
      marker.addPopupProperties({showPic: true, loading: true});
      MapActions.requestLocationDetails(location.id);
    }
  },

  //kill all markers and return a new group layer
  resetMarkers() {
    if (this.markerLayer) {
      this.map.removeLayer(this.markerLayer);
      this.markers = {};
    }

    return L.featureGroup([]).addTo(this.map);
  },

  
  //just walk the desired points and call marker factory
  renderMarkers(pois, handleClick, handlePopupClick) {
    
    this.markerLayer = this.resetMarkers();

    pois.forEach(loc => {
      
      if (loc && loc.lat) {
         this.markers[loc.id] = MarkerFactory(this.type, loc, handleClick).addTo(this.markerLayer);
     	}

  	});

    //if some filters are applied and we're not showing districts
    if (this.state.anyFiltersApplied && pois != this.state.districts) {
      //get bound of the markes
      const bounds = this.markerLayer.getBounds();
      //it could be empty, so check first
      if (bounds.isValid()) {
        this.map.fitBounds(bounds);
      }
    }

  },

  //render a static container
  //the updates are handled by leaflet
  render: function() {
    return (
    	<div id="map">
      </div>
    );
  }

});
