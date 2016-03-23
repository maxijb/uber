import {default as React} from 'react';
import {default as ImdbPoster} from '../helpers/ImdbPoster';
import {default as GoogleSVPoster} from '../helpers/GoogleSVPoster';

export default React.createClass({

  render: function() {
  	
    const item = this.props.item;


    return (
    	<div className="list-item-content locations">
    		
        <p className="name">{item.name}</p>

        <span className="movies-quantity">
          <span className="icon-film"></span>
          { item.movies ? item.movies.length : 0 }
        </span>

      </div>
    );
  }

});