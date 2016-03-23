import {default as React} from 'react';
import {default as SearchBox} from './sidebar/SearchBox';
import {default as SidebarList} from './sidebar/SidebarList';

import {default as SidebarActions} from '../actions/SidebarActions.js';
import {default as SidebarStore} from '../stores/SidebarStore.js';
import {events} from '../constants/Constants';


export default React.createClass({
  

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

  handleStoreChange(storeState) {
  	this.setState(storeState);
  },

  changeType(type) {
  	this.setState({"type": type, filterValue: ''});
  	SidebarActions.changeType(type);
  },

  requestItems() {
  	SidebarActions.requestItems(false, this.state.type, {
  						offset: this.state.listItems.length, 
  						name: this.state.filterValue
  					});
  },

  handleFilterChange(value) {
  	this.setState({filterValue: value});
  	//TODO Debounce
  	SidebarActions.requestItems(true, this.state.type, {
  						name: value
  					});
  },

  selectFilter(filter) {
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