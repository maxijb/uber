import {default as React} from 'react';

export default React.createClass({

  render: function() {
  	

    return (
    	<div className="map-icon">
    		<p>{this.props.lat}</p>
      </div>
    );
  }

});