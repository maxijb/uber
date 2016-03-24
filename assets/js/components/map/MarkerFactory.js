/* Factory to create the markers to be rendered on the map.
Creates both district and location markers */

import {reactRender} from '../helpers/helpers';
import {default as LocationIcon} from './LocationIcon';
import {default as MapPopup} from './MapPopup';
import {default as DistrictPopup} from './DistrictPopup';


/* @param type [district|location]
   @param props (object) props of the marker
   @param handleClick (function) callback when clicking the marker
*/
export function MarkerFactory(type, props, handleClick) {

	let marker,
		popup;

	//ditrict markers use L.circle
	if (type == 'district') {
		
		marker = L.circle([props.lat, props.lng], 50 + 10 * props.locations, {
			color: 'green',
		    fillColor: 'green',
		    fillOpacity: 0.4,
		    zIndex: -props.locations
		});

		popup = {
			className: "district-popup",
			html: reactRender(DistrictPopup, props),
			offset: [0, -10]
		}

	} else {
		
		//location markers use html from a react component
		const icon = L.divIcon({
			className: 'location-icon',
			html: reactRender(LocationIcon, props)
		})
		
		//create the marker
		marker = L.marker([props.lat, props.lng], {icon});

		//define the popup from a react component
		popup = {
			className: "location-popup",
			html: reactRender(MapPopup, props),
			offset: [0, -10]
		};

		//extedn the marker object with the ability to pass more properties to the popup
		marker.addPopupProperties = function(newProps) {
			//if movie details is there, we've finished loading this marker
			if (newProps.hasOwnProperty('movieDetails')) {
				this.fullyLoaded = true;
				newProps.loading = false;
			}
			//render react markup into the popup
			this._popup.setContent(reactRender(MapPopup, Object.assign(props, newProps)));
		}

	}
	
	//set callbacks for marker events	
	marker
		.bindPopup(popup.html, popup)
		.on('mouseover', () => marker.openPopup())
		.on('click', (event) => handleClick(props, marker, event));

	
	//and return it
	return marker;
	
}

