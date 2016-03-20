import {default as express} from 'express';
import {default as React} from 'react';
import {default as ReactDOMServer} from 'react-dom/server';
import {default as AppComponent} from '../assets/js/components/app';


/* -------------- Config Application and Bootstrap ------------- */
	
	require('./dataset').init().then(startServer);

    let app = express();
	app.engine('jade', require('jade').__express)
	app.set('view engine', 'jade')

	//move this to the promise for production
	//startServer();



/* -------------- Server routes ------------- */

function startServer(dataset) {
	
	console.log(__dirname);

	app.use('/static', express.static(__dirname + '/../assets/public'));

	app.get('/', function(req, res){
	  res.render('index', {
	  	  app: ReactDOMServer.renderToString(React.createElement(AppComponent, {}))
	  })
	})
	
	app.get('/api/locations', function(req, res){
		res.send(dataset.getInstance().locations);
	});

	app.get('/api/movies', function(req, res){
		res.send(dataset.getInstance().movies);
	});

	app.get('/dataset', function(req, res){
	  res.send(dataset.getInstance());//, {
	  //   react: ReactDOM.renderToString(HelloMessage({name: "John"}))
	  // })
	})	

	app.listen(3000, function() {
	  console.log('Listening on port 3000...')
	})

}
