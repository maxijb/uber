import {default as React} from 'react';
import {default as SearchBoxOption} from './SearchBoxOption';

export default React.createClass({

  
  getDefaultProps() {
    return {
      typesOfSearch: ["movies", "districs", "locations", "actors", "directors", "writers"],
      typeSelected: "movies"
    };
  },


  render() {
    return (
    	<div id="searchbox">
    		<ul className="searchbox-options">
    			{this.props.typesOfSearch.map((type, i) => ( 
    				<SearchBoxOption key={i} type={type} selected={type==this.props.typeSelected} /> 
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