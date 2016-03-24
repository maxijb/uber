/* Renders the popup for locations markers */

import {default as React} from 'react';
import {default as GoogleSVPoster} from '../helpers/GoogleSVPoster';

export default React.createClass({

  propTypes: {
  	movieDetails: React.PropTypes.array,
  	lat: React.PropTypes.number,
  	lng: React.PropTypes.number,
  	showPic: React.PropTypes.bool
  },

  //Start with and empty list of films
  getDefaultProps() {
  	return {
  		movieDetails: []
  	}
  },

  render: function() {

  	//render array of movie details
  	const movies = this.props.movieDetails.map(movie => {
  		return (
  			<a key={movie.id} className="trigger movies" data-highlight="movies" data-id={movie.id} data-data={JSON.stringify(movie)}>{movie.name}</a>
  		);
  	})

    return (
    	<div className="map-popup">
    		
    		{(() => { 
    			if (this.props.showPic) 
    				return <GoogleSVPoster 
    					lat={this.props.lat} 
    					lng={this.props.lng} 
    					width={150} 
    					height={90} />
    		})() }
    		
    		<p className="name">{this.props.name}</p>
    		
    		{(() => { 
    			if (this.props.movieDetails.length) 
    				return (
    					<div className="movies-container">
    						<p className="movies-header">Movies filmed here:</p>
    						{movies}
    					</div>
    				);
    		})() }
    		
        </div>
    );
  }
});