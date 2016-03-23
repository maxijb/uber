import {default as React} from 'react';

export default React.createClass({

  render: function() {
  	
    return (
    	<div className="district-popup">
    		<p>{this.props.name}</p>
    		<p><strong>{this.props.locations + " " + (this.props.locations > 1 ? "locations" : "location")}</strong></p>
        </div>
    );
  }

});