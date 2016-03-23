import {default as React} from 'react';

export default React.createClass({

  render: function() {
    return (
    	<div id="details-bar" className={this.props.highlight ? "visible " + this.props.highlight.type  : ""}>
    		<a className="details-bar-close icon icon-cross" onClick={this.props.close}></a>
    		<div className='details-bar-content'>
    			{JSON.stringify(this.props.highlight)}
    		</div>
        </div>
    );
  }

});