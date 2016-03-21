import {default as React} from 'react';
import {default as ListItem} from './ListItem';

export default React.createClass({


  getDefaultProps() {
    return {
      listItems: []
    }
  },

  render: function() {

  	let items = this.props.listItems.map(item => {
  		if (item) return ( <ListItem key={item.id} item={item}/> )
  	});

    return (
    	<div id="sidebar-list">
    		{items}
        </div>
    );
  }

});