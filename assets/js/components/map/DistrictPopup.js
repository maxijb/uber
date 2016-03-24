/* Renders the popup for district markers */

import {default as React} from 'react';

export default React.createClass({

	propTypes: {
		name: React.PropTypes.string,
		locations: React.PropTypes.number
	},
  	
  	render: function() {

	    return (
	    	<div className="district-popup">
	    		<p>{this.props.name}</p>
	    		<p><strong>{this.props.locations + " " + (this.props.locations > 1 ? "locations" : "location")}</strong></p>
	        </div>
	    );
	}

});