/* Each of the options on the searchbox to filter by type and name */

import {default as React} from 'react';
import {default as classes} from 'classnames';

export default React.createClass({

  propTypes: {
    selected: React.PropTypes.bool,
    filterValue: React.PropTypes.string,
    type: React.PropTypes.string,
    handleClick: React.PropTypes.func.isRequired,
    handleFilterChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
       filterValue: ""
    }
  },
  
  /* Reset filter field to search by name 
    @param event DOMEvent */
  resetFilter(event) {
    event.stopPropagation();
    this.props.handleFilterChange("");
  },

  /* The name filter has changed its value 
  @param event DomEvent
  */
  handleFilterChange(event) {
    this.props.handleFilterChange(event.target.value);
  },

  render() {

  	let itemClass = classes("searchbox-option", 
  							 this.props.type+"-option",
  							 {"selected": !!this.props.selected});

    return (
    	<li className={itemClass} onClick={this.props.handleClick}>
  			<span className="searchbox-option-title">{this.props.type}</span>
  			<div className="searchbox-option-search">
  				<input type="text" 
                 className="searchbox-input" 
                 value={this.props.filterValue}
                 placeholder="Search..."
                 onChange={this.handleFilterChange}
                 />
  				<span className="icon icon-cross" onClick={this.resetFilter}></span>
  			</div>
  		</li>
    );
  }

});