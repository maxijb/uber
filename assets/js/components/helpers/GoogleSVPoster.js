/* Renders a google StreetView static image with the desired size and the desired lat/lng
	Fallsback to a placeholder image
*/

import {default as React} from 'react';
import {googleApiKey, defaultImgPlaceholder} from '../../constants/Constants';

export default React.createClass({

 	propTypes: {
 		lat: React.PropTypes.number.isRequired,
 		lng: React.PropTypes.number.isRequired,
 		height: React.PropTypes.number.isRequired,
 		width: React.PropTypes.number.isRequired
 	},
  

  	render() {

	    let src = this.props.lat ? 
	    		  `https://maps.googleapis.com/maps/api/streetview?size=${this.props.width}x${this.props.height}&location=${this.props.lat},${this.props.lng}&heading=151.78&pitch=-0.76&key=AIzaSyCf3c3Ica2AWircgkTjlqxheiF642V3CRY` :
	    		  defaultImgPlaceholder;

	    return (
	    	<img src={src} />
	    );
	  }

});