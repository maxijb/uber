/* Renders the searchbox to select type of list items and filter them by name */

import {default as React} from 'react';
import {default as SearchBoxOption} from './SearchBoxOption';

export default React.createClass({

  propTypes: {
    changeType: React.PropTypes.func.isRequired,
    handleFilterChange: React.PropTypes.func.isRequired,
    filterValue: React.PropTypes.string,
    type: React.PropTypes.string
  },

  //initial state constins type of objects and "closed" state
  getInitialState() {
    return {
      open: false,
      typesOfSearch: ["movies", "districts", "locations", "actors", "directors", "writers"]
    }
  },

  //OPen the searchbox
  //@param e (event)
  toggleOpen(e) {
    if (e.target.tagName !== "INPUT") {
      var isOpen = this.state.open;
      this.setState({open: !isOpen});
    }
  },

  //Callback when one options has been clicked
  //@param type (string) type of objects required
  handleOptionClick(type) {
    if (this.state.open) {
      this.props.changeType(type);
    }
  },


  render() {
    return (
    	<div id="searchbox">
    		<ul className={"searchbox-options " + (this.state.open ? "open" : "")} onClick={this.toggleOpen}>
    			{this.state.typesOfSearch.map((type, i) => ( 
    				<SearchBoxOption key={i} 
                type={type} 
                selected={type==this.props.type} 
                handleClick={this.handleOptionClick.bind(this, type)} 
                handleFilterChange={this.props.handleFilterChange} 
                filterValue={this.props.filterValue} /> 
    			  )
    			)}
    		</ul>
      </div>
    );
  }

});