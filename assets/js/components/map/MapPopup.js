import {default as React} from 'react';

export default React.createClass({

  getDefaultProps() {
  	return {
  		movieDetails: []
  	}
  },

  render: function() {
  	
  	const movies = this.props.movieDetails.map(movie => {
  		return (
  			<a key={movie.id} className="trigger movies" data-highlight="movies" data-id={movie.id} data-data={JSON.stringify(movie)}>{movie.name}</a>
  		);
  	})

    return (
    	<div className="map-popup">
    		<p>{this.props.name}</p>
    		<p>{this.props.loading ? "loading" : ""}</p>
    		{movies}
        </div>
    );
  }

});