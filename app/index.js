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

	app.get('/api/districts', function(req, res){
	  res.send(dataset.getInstance().districts);
	})	


	app.get('/api/actors', function(req, res){
	  res.send(dataset.getInstance().persons.filter(person => {
	  	return person && person.name && person.type.some(type => type == 'actor');
	  }));
	})	


	app.get('/api/directors', function(req, res){
	  res.send(dataset.getInstance().persons.filter(person => {
	  	return person && person.name && person.type.some(type => type == 'director');
	  }));
	})	

	app.get('/api/writers', function(req, res){
	  res.send(dataset.getInstance().persons.filter(person => {
	  	return person && person.name && person.type.some(type => type == 'writer');
	  }));
	})	

	app.listen(3000, function() {
	  console.log('Listening on port 3000...')
	})

}
