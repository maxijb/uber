import {default as React} from 'react';

export default React.createClass({

  render: function() {
  	
    const item = this.props.item;
   

    return (
    	<div className="list-item-content plain">
    		
        <p className="name">{item.name}</p>
        
      </div>
    );
  }

});