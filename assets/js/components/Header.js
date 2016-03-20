import {default as React} from 'react';

export default React.createClass({

  render: function() {
    return (
    	<header>
            <h1>
                <strong>San Francisco</strong>
                <span>| Filming locations</span>
            </h1>
            <div className="header-buttons">
                <a className="data">Data</a>
                <a className="about">About</a>
                <a className="share">Share</a>
            </div>
        </header>
    );
  }

});
