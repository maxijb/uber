import {default as React} from 'react';
import {googleApiKey, defaultImgPlaceholder} from '../../constants/Constants';

export default React.createClass({

  
  


  render() {

    let src = this.props.lat ? 
    		  `https://maps.googleapis.com/maps/api/streetview?size=${this.props.width}x${this.props.height}&location=${this.props.lat},${this.props.lng}&heading=151.78&pitch=-0.76&key=${googleApiKey}` :
    		  defaultImgPlaceholder;

    return (
    	<img src={src} />
    );
  }

});