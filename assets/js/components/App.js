import {default as React} from 'react';
import {default as ReactDOM} from 'react-dom';

import {events, actions} from '../constants/Constants';

import {default as MapActions} from '../actions/MapActions';
import {default as MapStore} from '../stores/MapStore';

import {default as Header} from './Header';
import {default as Sidebar} from './Sidebar';
import {default as Map} from './Map';
import {default as DetailsBar} from './DetailsBar';
import {default as StatusBar} from './StatusBar';


let App = React.createClass({
  
  componentDidMount() {
    //emit that the app has been loaded
    MapActions.appLoad();

    //subscribe to the UIState change and set state accordingly
    MapStore.on(events.change, this.handleChange);

  },  


  getInitialState() {
    return {
      districts: [],
      mapLocations: [],
      movies: [],
      filters: {}
    }
  },

  handleChange(state) {
    this.setState({
      filters: state.filters, 
      anyFiltersApplied: state.anyFiltersApplied,
      highlight: state.highlight
    });
  },

  closeHighlight() {
    MapActions.closeHighlight();
  },

  render() {
    return (
    	<div id="main-app">
    		<Header/>
    		<div id="main-container">
    			<Sidebar filters={this.state.filters} />
          <StatusBar filters={this.state.filters} />
    			<Map />
    			<DetailsBar highlight={this.state.highlight} close={this.closeHighlight} />
    		</div>
    	</div>
  	);
  }
});

export default App;

//Start in the browser
if (typeof window !== "undefined") {
  ReactDOM.render(React.createElement(App, {}), document.getElementById('react-root'));
}