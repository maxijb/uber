import {default as React} from 'react';

export default React.createClass({

  render: function() {
  	

    return (
    	<div className="map-popup">
    		<p>{this.props.name}</p>
    		<p>{this.props.loading ? "loading" : ""}</p>
    		<p>{this.props.movieDetails ? this.props.movieDetails[0].name : ""}</p>

      </div>
    );
  }

});