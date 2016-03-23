import {default as React} from 'react';
import {defaultImgPlaceholder} from '../../constants/Constants';


export default React.createClass({


  render() {

  	let src;

    //if null image fallback to placeholder
    if (!this.props.poster || this.props.poster == 'N/A') {
    	src = defaultImgPlaceholder;
    } else {
    	//otherwise show it
    	src = this.props.size ? 
              this.props.poster.replace('300.jpg', this.props.size+'.jpg') : 
              this.props.poster;
    }


    return (
    	<img src={src} />
    );
  }

});