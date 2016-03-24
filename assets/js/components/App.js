/* Main application component at the root of the react tree 
  It's rendered both server and client side.
  When on the client, we need to check for 'window' and start the react element 
  on the '#react-root' div
*/

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


  //Update the state when mapStore changes
  //@param state is the store's state
  handleChange(state) {
    this.setState({
      filters: state.filters, 
      anyFiltersApplied: state.anyFiltersApplied,
      highlight: state.highlight
    });
  },

  //Action to close the highlightd window
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

//Start the app in the browser
if (typeof window !== "undefined") {
  ReactDOM.render(React.createElement(App, {}), document.getElementById('react-root'));
}