import {default as React} from 'react';
import {default as SearchBoxOption} from './SearchBoxOption';

export default React.createClass({

  
  getInitialState() {
    return {
      open: false,
      typesOfSearch: ["movies", "districts", "locations", "actors", "directors", "writers"]
    }
  },

  toggleOpen(e) {
    if (e.target.tagName !== "INPUT") {
      var isOpen = this.state.open;
      this.setState({open: !isOpen});
    }
  },

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
    		<div id="searchbox-buttons">
    			<a id="searchbox-filter" className="searchbox-button">Filter</a>
    			<a id="searchbox-sort" className="searchbox-button">Sort</a>
    		</div>
      </div>
    );
  }

});