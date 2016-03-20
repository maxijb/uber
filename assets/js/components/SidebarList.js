import {default as React} from 'react';
import {default as ListItem} from './ListItem';

export default React.createClass({

  render: function() {
  	let items = Object.keys(this.props.listItems).map(id => {
  		return ( <ListItem key={id} item={this.props.listItems[id]}/> )
  	})

    return (
    	<div id="sidebar-list">
    		{items}
        </div>
    );
  }

});