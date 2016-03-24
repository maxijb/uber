/* Contains all the sidebar childs
and interacts with the sidebar Actions.
Receive filters from app */

import React from 'react';
import SearchBox from './sidebar/SearchBox';
import SidebarList from './sidebar/SidebarList';
import SidebarActions from '../actions/SidebarActions.js';
import SidebarStore from '../stores/SidebarStore.js';
import {events} from '../constants/Constants';


export default React.createClass({
  
  propTypes: {
    filters: React.PropTypes.object
  },

  //bind the onchnage event from store
  componentDidMount() {
    SidebarStore.on(events.change, this.handleStoreChange);
  },


  getInitialState() {
  	return {
  		type: 'movies',
  		listItems: [],
  		filterValue: ''
  	}
  },

  //update state according to store
  handleStoreChange(storeState) {
  	this.setState(storeState);
  },

  //Change type of filter applied
  //@param type (string) [directors|writers...]
  changeType(type) {
  	this.setState({"type": type, filterValue: ''});
  	SidebarActions.changeType(type);
  },

  //request more items more the server on infinite scrolling
  //send active filtering information
  requestItems() {
  	SidebarActions.requestItems(false, this.state.type, {
  						offset: this.state.listItems.length, 
  						name: this.state.filterValue
  					});
  },

  //when user types, filter results accordingly
  handleFilterChange(value) {
  	this.setState({filterValue: value});
  	//TODO Debounce
  	SidebarActions.requestItems(true, this.state.type, {
  						name: value
  					});
  },

  //select an item will filter the locations on the map
  //@param filter (object) {id, value} of the item clicked
  selectFilter(filter) {
    //we create a message including the type, and the filter as value
    let message = {};
    message[this.state.type] = filter;
    SidebarActions.selectFilter(message);
  },

  render: function() {
    return (
    	<div id="sidebar" className={this.state.loading ? "loading"+this.state.loading : "" }>
    		<SearchBox 
    			type={this.state.type} 
    			changeType={this.changeType} 
    			handleFilterChange={this.handleFilterChange} 
    			changeSearch={this.changeSearch} 
    			changeSort={this.changeSort}
    			filterValue={this.state.filterValue}
    			/>
    		
    		<SidebarList 
    			type={this.state.type} 
    			listItems={this.state.listItems} 
    			complete={this.state.complete}
    			requestItems={this.requestItems}
    			loading={this.state.loading}
          selectFilter={this.selectFilter}
          filters={this.props.filters}
    			/>
        </div>
    );
  }

});