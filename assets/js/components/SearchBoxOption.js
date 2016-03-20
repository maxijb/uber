import {default as React} from 'react';
import {default as classes} from 'classnames';

export default React.createClass({

  
  


  render() {

  	let itemClass = classes("searchbox-option", 
  							 this.props.type+"-option",
  							 {"selected": !!this.props.selected});

    return (
    	<li className={itemClass}>
			<span className="searchbox-option-title">{this.props.type}</span>
			<div className="searchbox-option-search">
				<input type="text" className="searchbox-input" placeholder="Search..."/>
				<span className="icon icon-search">MAx</span>
			</div>
		</li>
    );
  }

});