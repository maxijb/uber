import {default as ReactDOMServer} from 'react-dom/server';
import {default as React} from 'react';

export const reactRender = (reactClass, props) => {
	return ReactDOMServer.renderToStaticMarkup(React.createElement(reactClass, props));
}



// export function debounce(fn, time) => {
// 	let timeout = null;

// 	return () => {
// 		fn.apply(this)
// 	}
// }


export const queryString = (obj) => {
    var str = [];
    for(var p in obj)
      if (obj.hasOwnProperty(p) && obj[p] !== null) {
      	let value = (typeof obj[p] === "object") ? obj[p].id || obj[p].name : obj[p];
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(value));
      }
    return "?" + str.join("&");
  }