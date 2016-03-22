import {default as React} from 'react';
import {default as ListItem} from './ListItem';

export default React.createClass({

  componentDidMount() {
    //we want to implement infinite scrolling
    //TODO: debounce
    this.node = this.getDOMNode();
    this.node.addEventListener('scroll', this.handleScroll)
  },

  getDefaultProps() {
    return {
      listItems: []
    }
  },

  //remove listeners from the dom, when unmounting
  componentWillUnmount() {
    this.node.removeEventListener('scroll', this.handleScroll)
  },

  //only update if the list has changed, we use immutable arrays! 
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.listItems !== this.props.listItems;
  },

  //handle the scrolling event and request more items if we've scrolled beyond 80% of the bar
  handleScroll() {
    if (!this.props.loading && !this.props.complete && this.node.scrollTop + this.node.offsetHeight > this.node.scrollHeight * 0.8) {
       this.props.requestItems();
    }
  },

  render: function() {
  	
    const items = this.props.listItems.map(item => {
  		if (item) return ( <ListItem key={item.id} item={item}/> )
  	});

    return (
    	<div id="sidebar-list">
    		{items}
      </div>
    );
    
  }

});