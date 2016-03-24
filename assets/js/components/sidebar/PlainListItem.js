/* List item content plain markup*/

import {default as React} from 'react';

export default React.createClass({
  

  propTypes: {
    item: React.PropTypes.object
  },

  //click on "view more button"
  handleClick(e) {
    e.stopPropagation();
    this.props.handleViewMoreClick("location", this.props.item.id, this.props.item);
  },

  render: function() {
  	
    const button = this.props.item.lat ? 
                  ( <a className="icon-eye-plus" onClick={this.handleClick} title="View more"></a>) 
                  : null;

    const item = this.props.item;

    return (
    	<div className="list-item-content plain">
        
        {button}
        <p className="name">{item.name}</p>


        
      </div>
    );
  }

});