import {default as ReactDOMServer} from 'react-dom/server';
import {default as React} from 'react';


/* 
	Renders static html from a reactClass and properties.
	It's used inside of leaflet where we need to interact wit the dom directly
	@param reactClass
	@param props

	@return HTML string
*/
export const reactRender = (reactClass, props) => {
	return ReactDOMServer.renderToStaticMarkup(React.createElement(reactClass, props));
}


/* Receives an object and serializes it, removing empty keys
   and encoding it for query string
	@param obj (object)
	@return string formatted like '?cdjncd=cdjncd&uh=90'
*/
export const queryString = (obj) => {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p) && obj[p] !== null) {
      	let value = (typeof obj[p] === "object") ? obj[p].id || obj[p].name : obj[p];
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(value));
      }
    return "?" + str.join("&");
  }



/* Find the closest element (moving upwards) in the dom matching our desired selector
	@param el (DomNode)
	@param selector (string -> css selector)
	@return null | found DomNode
*/
export const closest = (el, selector) => {
    let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
    }
    return el;
}