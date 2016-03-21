import {default as React} from 'react';
import {default as SearchBox} from './SearchBox';
import {default as SidebarList} from './SidebarList';

import {default as SidebarActions} from '../actions/SidebarActions.js';
import {default as SidebarStore} from '../stores/SidebarStore.js';
import {events} from '../constants/Constants';

export default React.createClass({
  

  componentDidMount() {
    //subscribe to the UIState change and set state accordingly
    pubsub.on(events.sidebarStateChange, this.handleChangeItems);
  },


  getInitialState() {
  	return {
  		type: 'movies',
  		listItems: []
  	}
  },

  handleChangeItems(storeState) {
  	this.setState({listItems: storeState.listItems});
  },

  changeType(type) {
  	this.setState({"type": type});
  	SidebarActions.changeType(type);
  },

  render: function() {
    return (
    	<div id="sidebar">
    		<SearchBox type={this.state.type} changeType={this.changeType} changeSearch={this.changeSearch} changeFilter={this.changeFilter} changeSort={this.changeSort}/>
    		<SidebarList type={this.state.type} listItems={this.state.listItems} />
        </div>
    );
  }

});