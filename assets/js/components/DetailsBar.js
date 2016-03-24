/* Details bar at the bottom
to show the complete information for a movie or Street View
*/

import React from 'react';
import ImdbPoster from './helpers/ImdbPoster';

export default React.createClass({

	propTypes: {
		close: React.PropTypes.func.isRequired,
		highlight: React.PropTypes.object
	},


 

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.highlight) {

      if (nextProps.highlight.type == "location" && nextProps.highlight != this.props.highlight) {
        this.shouldRenderSV = true;   
      } else if (!nextProps.highlight.type !== "location") {
        this.panorama = null;
      }
    }
  },

  componentDidUpdate() {
    if (this.shouldRenderSV) {
      this.shouldRenderSV = false;
      this.panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
          position: {lat: this.props.highlight.data.lat, lng: this.props.highlight.data.lng},
          pov: {heading: 165, pitch: 0},
          zoom: 1
        });
    }
  },

    //Sub render method to render location's street view 
  //@param props (ojbect) data about the location
   renderLocation(props) {
    return (
      <div className='details-bar-content'>
        <div id='street-view'>
        </div>
        <div className='details-bar-sidebar'>
          <p className='title'>{props.name}</p>
        </div>
      </div>
    )
  },

  //Sub render method to render movies information
  //@param props (ojbect) data about the movie
  renderMovie(props) {

  	const rating = props && !isNaN(props.imdbRating) ? 
                      Array.apply(null, Array(Math.round(props.imdbRating/2))).map((x,i) => { 
                        return ( <span key={i} className="icon-star-full"></span> )
                      }) 
                      : null;


  	return (
    	<div className='details-bar-content'>
    		
    		<ImdbPoster poster={props.poster} />
    		
    		<div className='details-bar-main'>
    			<p className='title'>{props.name}</p>
    			 
    			 {(() => props.release_year && ( <span className='year'>{props.release_year}</span> ) )()}
 
        		 {(() => rating && ( <span className='rating'>{rating} ({props.imdbVotes} votes)</span> ) )()}

        		 <div className='plot'>{props.plot}</div>
        		 <div className='awards'>{props.awards}</div>
    		</div>

    		<div className='details-bar-sidebar'>
    			<p className='key genre'>Genre: <span className='value'>{props.genre}</span></p>
    			<p className='key rated'>Rated: <span className='value'>{props.rated}</span></p>
    			<p className='key runtime'>Runtime: <span className='value'>{props.runtime}</span></p>
    			<p className='key language'>Language: <span className='value'>{props.language}</span></p>
        		<p className='key producer'>Producer: <span className='value'>{props.production_company}</span></p>
    		</div>
  		</div>
  	);
  },


  render: function() {
    
    return (
    	<div id="details-bar" className={this.props.highlight ? "visible " + this.props.highlight.type  : ""}>
    		<a className="details-bar-close icon icon-cross" onClick={this.props.close}></a>

    			{(() => {
    				if (this.props.highlight)
    				return this.props.highlight.type == "location" ? this.renderLocation(this.props.highlight.data) : this.renderMovie(this.props.highlight.data);
    			})()}
        </div>
    );
  }

});