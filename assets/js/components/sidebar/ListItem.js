import {default as React} from 'react';
import {default as MovieListItem} from './MovieListItem';
import {default as LocationListItem} from './LocationListItem';
import {default as PlainListItem} from './PlainListItem';

export default React.createClass({



  handleClick() {
    this.props.selectFilter(this.props.selected ? 
                            null :
                            {id: this.props.item.id, name: this.props.item.name});
  },

  render: function() {
  	
    const item = this.props.item;
  
    return (
    	<div className={"list-item " + (this.props.selected ? "selected" : "")} onClick={this.handleClick}>
    		
        {(() => {
          switch (this.props.type) {
            case "movies":   return ( <MovieListItem item={item} /> ); break;
            case "locations": return ( <LocationListItem item={item} /> ); break;
            default:         return ( <MovieListItem item={item} /> ); break;
          }
        })()}

      </div>
    );
  }

});