import {default as React} from 'react';
import {default as MovieListItem} from './MovieListItem';
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
            default:         return ( <PlainListItem item={item} /> ); break;
          }
        })()}

      </div>
    );
  }

});