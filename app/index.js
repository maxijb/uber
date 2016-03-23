import {default as express} from 'express';
import {default as React} from 'react';
import {default as ReactDOMServer} from 'react-dom/server';
import {default as AppComponent} from '../assets/js/components/app';


/* -------------- Config Application and Bootstrap ------------- */
	
	//Start app and configure views and assets
    let app = express();
	app.engine('jade', require('jade').__express)
	app.set('view engine', 'jade')

	//Load the dataset and start server
	require('./dataset').init().then(startServer);


/* -------------- Server routes ------------- */

	function startServer(dataset) {
		
		app.use('/static', express.static(__dirname + '/../assets/public'));


		// Render static page with React app
		app.get('/', function(req, res){
		  res.render('index', {
		  	  app: ReactDOMServer.renderToString(React.createElement(AppComponent, {}))
		  })
		});
		


		app.get('/api/locationDetails', function(req, res) {
			let movies = dataset.getInstance().movies;
			let location = Object.assign({}, dataset.getInstance().locations[req.query.id]);
			location.movieDetails = location.movies.map((movie_id) => {
				return movies[movie_id];
			});

			res.send({details: location});


		});


		app.get('/api/locations', function(req, res) {

			let data = dataset.getInstance().locations;

			if (typeof req.query.locations !== "undefined") {
				data = [data[req.query.locations]];
			}

			if (typeof req.query.district !== "undefined") {
				data = data.filter(item => { return item && item.district == req.query.district });
			}

			if (typeof req.query.movies !== "undefined") {
				data = data.filter(item => { return item && item.movies.some(movie => movie == req.query.movies ) });
			}

			res.send({items: data});
		})

		
	    // JSON API to fetch different kinds of data
		app.get('/api/:resource', function(req, res){

			let resource, 
				datasource, 
				params;
			
			if (req.params.resource.match(/writers|actors|directors/)) {
				resource = "persons";
				params = Object.assign({type: req.params.resource}, req.query);
			} else {
				resource = req.params.resource;
				params = req.query;
			}

			if (datasource = dataset.getInstance()[resource]) {
				res.send(limitResponse(datasource, req.query));
			} else {
				res.status(404).send('Not found');
			}

		});

		
		//Start server
		app.listen(3000, function() {
		  console.log('Listening on port 3000...')
		})

	}



	/* Helper to return the desired data */
	//Default respnse size and offset
	const defaultOffset = 0;
	const defaultLimit  = 30;

	function limitResponse(data, params) {

		if (params.name) {
			data = data.filter(item => {
				return item && 
				       item.name && 
				       item.name.toLowerCase().indexOf(params.name.toLowerCase()) !== -1;

			});
		}
		
		//for persons
		if (params.type) {
			data = data.filter(item => {
				item && item.type && item.type.some(type => type == params.type)
			});
		}


		const offset = parseInt(params.offset || defaultOffset, 10);
		const limit  = offset + parseInt((params.limit || defaultLimit), 10);
		
		const fullLength = data.length;

		data = data.slice(offset, limit);

		console.log(fullLength, data.length);

		return {items: data, complete: data.length == fullLength || data.length == 0};
	}
