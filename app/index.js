import {default as express} from 'express';
import {default as React} from 'react';
import {default as ReactDOMServer} from 'react-dom/server';
import {default as AppComponent} from '../assets/js/components/App';


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

			//coordinate search overrides any other filter
			if (typeof req.query.coordinates !== "undefined") {
				//split the coordinates and filter lat/;ng
				let coordinates = req.query.coordinates.split(',').map(Number);
				data = data.filter(item => {
					return item && item.lat && 
						   item.lng > coordinates[0] && item.lng < coordinates[2] && 
						   item.lat > coordinates[1] && item.lat < coordinates[3];
				})
			
			} else {

				//if specific location has been selected
				if (typeof req.query.locations !== "undefined") {
					data = [data[req.query.locations]];
				}

				//if district has been selected
				if (typeof req.query.district !== "undefined") {
					data = data.filter(item => { return item && item.district == req.query.district });
				}


				//Filter by persons or movies
				let movieSet = new Set(),
					personsSet = new Set(),
					movies = dataset.getInstance().movies;

				//check for any persons params, and add that id to the personsSet
				if (typeof req.query.actors !== "undefined") personsSet.add(Number(req.query.actors));					
				if (typeof req.query.directors !== "undefined") personsSet.add(Number(req.query.directors));					
				if (typeof req.query.writers !== "undefined") personsSet.add(Number(req.query.writers));					

				//if some person has been queried, find his movies
				if (personsSet.size) {
					movies.forEach((movie) => {
						if (movie && movie.persons.some(person => personsSet.has(person.id))) {
							movieSet.add(Number(movie.id)); 
						}
					});
				}

				//Add the desired movie if the param's there
				if (typeof req.query.movies !== "undefined") {
					movieSet.add(Number(req.query.movies));
				}

				//if any movie has been filtered, filter locations by that moviw
				if (movieSet.size) {
					data = data.filter(item => { 
						return item && item.movies.some(movie => movieSet.has(movie)) 
					});
				}

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
		app.listen(process.env.PORT || 5000, function() {
		  console.log('Listening on port 3000...')
		})

	}



	/* Helper to return the desired data */
	//Default respnse size and offset
	const defaultOffset = 0;
	const defaultLimit  = 30;

	function limitResponse(data, params) {

		//filter by name (containing case insensitive string)
 		if (params.name) {
			data = data.filter(item => {
				return item && 
				       item.name && 
				       item.name.toLowerCase().indexOf(params.name.toLowerCase()) !== -1;
			});
		}
		
		//for persons, filter by type of role
		if (params.type) {
			data = data.filter(item => {
				item && item.type && item.type.some(type => type == params.type)
			});
		}


		//set the offset and limit of the query (fallback to default)
		const offset = parseInt(params.offset || defaultOffset, 10);
		const limit  = offset + parseInt((params.limit || defaultLimit), 10);
		
		//size of the query before slicing (compared to get complete status later)
		const fullLength = data.length;

		data = data.slice(offset, limit);

		return {items: data, complete: data.length == fullLength || data.length == 0};
	}
