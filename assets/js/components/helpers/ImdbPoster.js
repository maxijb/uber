import {default as React} from 'react';

export default React.createClass({

  
  


  render() {

    if (!this.props.poster) return null;

    let src = this.props.size ? 
              this.props.poster.replace('300.jpg', this.props.size+'.jpg') : 
              this.props.poster;

    return (
    	<img src={src} />
    );
  }

});