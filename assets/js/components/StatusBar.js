import React from 'react';
import MapActions from '../actions/MapActions.js';
export default React.createClass({

  propTypes: {
    filters: React.PropTypes.object
  },

  //not muting objects allows us to compare like this
  shouldComponentUpdate(nextProps, nextState) {
  	return nextProps.filters !== this.props.filters;
  },

  //if filter have changed request new map markers
  componentWillUpdate(nextProps, nextState) {
  	MapActions.requestLocations(nextProps.filters);
  },

  //remove filter 
  removeFilter(filter) {
  	MapActions.removeFilter(filter.type)
  },

  render: function() {
  	const filters = Object.keys(this.props.filters).reduce((prev, filter) => {
  			if (this.props.filters[filter]) prev.push({type: filter, value: this.props.filters[filter]})

  			return prev;
  		}, []);
  	
    const items = filters.map((filter, i)=> {
  		return (
  			<div key={i} className="statusbar-item">
          <span className="type">{filter.type}:</span> 
          <span className="value">{filter.value.name}</span>
  				<span onClick={this.removeFilter.bind(this, filter)} className="icon-cross"></span>
  			</div>
  		)
	  });

    return (
      	<div id="status-bar" className={filters.length ? "visible" : ""}>
      		{items}
          </div>
      );
    }

});