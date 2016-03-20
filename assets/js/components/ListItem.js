import {default as React} from 'react';
import {default as ImdbPoster} from './helpers/ImdbPoster';

export default React.createClass({

  render: function() {
  	let item = this.props.item;

    return (
    	<div className="list-item">
    		<ImdbPoster poster={item.poster} size={40} />
    		<p className="name">{item.name}</p>
    		<span className='year'>{item.release_year}</span>
    		<span className='rating'>| {Math.round(item.imdbRating/2)}</span>
        </div>
    );
  }

});