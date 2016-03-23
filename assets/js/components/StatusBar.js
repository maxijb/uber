import {default as React} from 'react';
import {default as MapActions} from '../actions/MapActions.js';
export default React.createClass({

  shouldComponentUpdate(nextProps, nextState) {
  	return nextProps.filters !== this.props.filters;
  },

  componentWillUpdate(nextProps, nextState) {
  	MapActions.requestLocations(nextProps.filters);
  },

  removeFilter(filter) {
  	MapActions.removeFilter(filter.type)
  },

  render: function() {
  	let items = Object.keys(this.props.filters).reduce((prev, filter) => {
  			if (this.props.filters[filter]) 
  				prev.push({type: filter, value: this.props.filters[filter]})

  			return prev;
  		}, [])
  	.map((filter, i)=> {
  		return (
  			<div key={i}>{filter.type}: {filter.value.name}
  				<span onClick={this.removeFilter.bind(this, filter)}>XX</span>
  			</div>
  		)
	});

  	console.log(items);

    return (
    	<div id="status-bar">
    		{items}
        </div>
    );
  }

});