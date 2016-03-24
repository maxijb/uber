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
                <a className="data">
                    Data
                    <div className="popup">
                        The data used in this application, comes from Open APIS: San Francisco open data initiative, Google Maps and open IMDB.
                    </div>
                </a>
                <a className="about">
                    About
                    <div className="popup">
                        This application has been built by Maximiliano Benedetto, as a coding challenge.
                    </div>
                </a>
            </div>
        </header>
    );
  }

});
