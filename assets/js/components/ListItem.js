import {default as React} from 'react';
import {default as ImdbPoster} from './helpers/ImdbPoster';

export default React.createClass({



  handleClick() {
    this.props.selectFilter(this.props.selected ? 
                            null :
                            {id: this.props.item.id, name: this.props.item.name});
  },

  render: function() {
  	let item = this.props.item;

    return (
    	<div className={"list-item " + (this.props.selected ? "selected" : "")} onClick={this.handleClick}>
    		<ImdbPoster poster={item.poster} size={40} />
    		<p className="name">{item.name}</p>
    		<span className='year'>{item.release_year}</span>
    		<span className='rating'>| {Math.round(item.imdbRating/2)}</span>
        </div>
    );
  }

});