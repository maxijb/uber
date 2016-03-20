import {default as React} from 'react';
import {default as SearchBox} from './SearchBox';
import {default as SidebarList} from './SidebarList';

export default React.createClass({

  render: function() {
    return (
    	<div id="sidebar">
    		<SearchBox />
    		<SidebarList listItems={this.props.listItems} />
        </div>
    );
  }

});