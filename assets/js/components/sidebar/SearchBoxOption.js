import {default as React} from 'react';
import {default as classes} from 'classnames';

export default React.createClass({

  getInitialState() {
    return {
       filterValue: ""
    }
  },
  
  resetFilter(event) {
    event.stopPropagation();
    this.props.handleFilterChange("");
  },

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