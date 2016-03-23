import {default as React} from 'react';

export default React.createClass({

  
  


  render() {

  	console.log("PAASA");
    let src = `https://maps.googleapis.com/maps/api/streetview?size=${this.props.width}x${this.props.height}&location=${this.props.lat},${this.props.lng}&heading=151.78&pitch=-0.76&key=AIzaSyCf3c3Ica2AWircgkTjlqxheiF642V3CRY`;
  	console.log(src);

    return (
    	<img src={src} />
    );
  }

});