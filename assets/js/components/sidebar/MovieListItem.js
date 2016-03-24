/* Special list item for movies */

import {default as React} from 'react';
import {default as ImdbPoster} from '../helpers/ImdbPoster';

export default React.createClass({
  
  propTypes: {
    item: React.PropTypes.object
  },

  render: function() {
  	//cache props
    const item = this.props.item;

    //render rating if available
    const rating = item && !isNaN(item.imdbRating) ? 
                      Array.apply(null, Array(Math.round(item.imdbRating/2))).map((x,i) => { 
                        return ( <span key={i} className="icon-star-full"></span> )
                      }) 
                      : null;

    return (
    	<div className="list-item-content movies">
    		
        <ImdbPoster poster={item.poster} size={40} />
    		
        <p className="name">{item.name}</p>
        
        {(() => item.release_year && ( <span className='year'>{item.release_year}</span> ) )()}
    		
        {(() => rating && ( <span className='rating'>{rating}</span> ) )()}

      </div>
    );
  }

});