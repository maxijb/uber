import {reactRender} from '../helpers/helpers';
import {default as LocationIcon} from './LocationIcon';
import {default as MapPopup} from './MapPopup';
import {default as DistrictPopup} from './DistrictPopup';

export function MarkerFactory(type, props, handleClick) {

	let marker,
		popup;

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
		
		const icon = L.divIcon({
			className: 'location-icon',
			html: reactRender(LocationIcon, props)
		})
		
		marker = L.marker([props.lat, props.lng], {icon});

		popup = {
			className: "location-popup",
			html: reactRender(MapPopup, props),
			offset: [0, -10]
		};

		marker.addPopupProperties = function(newProps) {
			if (newProps.hasOwnProperty('movieDetails')) {
				this.fullyLoaded = true;
				newProps.loading = false;
			}
			this._popup.setContent(reactRender(MapPopup, Object.assign(props, newProps)));
		}

	}
	
	marker
		.bindPopup(popup.html, popup)
		.on('mouseover', () => marker.openPopup())
		//.on('mouseout', () => marker.closePopup())
		.on('click', (event) => handleClick(props, marker, event));

	

	return marker;
	
}

