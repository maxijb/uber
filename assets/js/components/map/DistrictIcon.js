import {default as React} from 'react';

export default React.createClass({

  render: function() {
  	
  	let divStyle = {
	  background: 'green',
	  opacity: 0.5,
	  width: (this.props.locations * 5) + 'px',
	  height: (this.props.locations * 5) + 'px',
	  borderRadius: '1000px'
	};

    return (
      <div className="district-icon" style={divStyle}>
      	<p>a</p>
      </div>
    );
  }

});