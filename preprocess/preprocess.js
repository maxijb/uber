/* ---------------- Dependencies ---------------- */

const fs 		= require('fs');
const request 	= require('request-promise');
const async 	= require('async');

/* ---------------- Config APIS ---------------- */

const googleApiKey 		= 'AIzaSyCwet2EyOpO1Fz4wRu9tF3YGFS43zbQft4';
const googleResponseDefaultSF = {
	lat: 37.77493,
	long: -122.419416,
	place_id : "ChIJIQBpAG2ahYAR_6128GcTUEo"
};
const geocodingURL 		= `https://maps.googleapis.com/maps/api/geocode/json?language=en&components=country:US|region=CA&key=${googleApiKey}&address=`;
const imdbURL 			= 'http://www.omdbapi.com/?y=&plot=short&r=json&t=';

//level of accuracy in google's response
//smaller is better
const googleLevels = {
	"natural_feature":              0,
	"establishment":                0,
	"premise":                      0,
	"point_of_interest":            0,
	"street_number": 			    1,
	"route": 						2,
	"neighborhood": 				3,
	"locality": 					5,
	"administrative_area_level_2": 	6,
	"political": 					10
};


/* ---------------- Data to be saved ---------------- */
const normalizedData = {

	movies: {},
	moviesIndex: -1,
	
	locations: {},
	locationsIndex: -1,

	persons: {},
	personsIndex: -1,

	districts: {},
	districtsIndex: -1

}



/* ---------------- Start Preprocessing ---------------- */

new Promise((resolve, reject) => {
		//Read the dataset 
		fs.readFile('../data/sf-dump.json', 'utf-8', (err, data) => {
			!err ? resolve(data) : reject(err);
		});
	})
	//modify raw data
	.then(JSON.parse)
	.then(mapMovies)
	.then(mapLocations)
	//work with normalized data
	.then(() => normalizedData)
	.then(getMoviesData)
	.then(getLocationData)
	//prepare output and save to file
	.then(formatOutput)
	.then(data => {
		//persist to file
		return new Promise((resolve, reject) => {
			fs.writeFile('../data/data-preprocessed.json', JSON.stringify(data), function(err) {
				!err ? resolve(data) : reject(err);
			});
		});
	})
	.catch(e => console.error(e));




/* ---------------- Transformations to be applied over the dataset ---------------- */

/* Normalizes movies' data, avoiding repetitions and assigning unique IDs 
   @param data [{raw data from original JSON}] 
   @return raw data
*/
function mapMovies(data) {
	//cache data container
	let movies = normalizedData.movies;

	//walk data
	return data.map((item) => {
		
		//create new movie entry if it doesn't exist
		if (!movies.hasOwnProperty(item.title)) {
			movies[item.title] = {
				id: ++normalizedData.moviesIndex,
				persons: mapPersons(normalizedData.moviesIndex, item.director, item.writer, item.actor_1, item.actor_2, item.actor_3),
				release_year: item.release_year,
				production_company: item.production_company,
				name: item.title
			}
			
		}

		//this movie_id will be used later to normalize locations
		item.movie_id = movies[item.title].id;
		return item;
	});
}


/* Normalize persons (director, actor, writer) into a single hash object to get quick lookups.
   @param movie_id (int) 
   @param ...people [strings] people's names. Order of the parameters indicates role on the movie
   @return data
*/
function mapPersons(movie_id, ...people) {
	//cache normalized data container
	let persons = normalizedData.persons;

	//we are going to split composed filed like "john & rick" to be two different persons
	let members = [];

	//store splitted names into array 'members', including name and type of role
	people.map((name, i) => { 
		//if null add null
		if (isNull(name)) return null;

		//find the type, based on the order of parameters
		let type = i > 1 ? 'actor' : i > 0 ? 'writer' : 'director';
		//split composed roles
		let names = name.replace(/,/g, '&').split('&');
		//add all those names and roles to the array
		names.forEach(member => {
			members.push({member, type});	
		})
	}); 

	//now walk the array storing normalized names
	//the roles will be kept in a Set to avoid repetitions
	return members.map((name, i) => {
		
		if (!persons.hasOwnProperty(name.member)) {
			persons[name.member] = {
				id: ++normalizedData.personsIndex,
				type: new Set(),
				movies: [movie_id],
				name: name.member
			}
		} else {
			persons[name.member].movies.push(movie_id);
		}

		persons[name.member].type.add(name.type);

		//this persons array will be stores on movies object as a reference (one to many)
		return {
			id: normalizedData.personsIndex, 
			type: name.type
		}; 

	//remove empty references	
	}).filter(x => x !== null);
}


/* Normalize locations to avoid repetitions and assign unique id.
 	@param data (array) containig the content of the modified json object
 	@return the same data to fullfil promise
 */
function mapLocations(data) {
	let locations = normalizedData.locations;

	//walk the data
	data.forEach(item => {

		//if location is valid
		if (!isNull(item.locations)) {
			//if it doesnt exist create the key
			if (!locations.hasOwnProperty(item.locations)) {
				locations[item.locations] = {
					id: ++normalizedData.locationsIndex,
					movies: [item.movie_id],
					name: item.locations
				}
			} else {
				//else add another movie
				locations[item.locations].movies.push(item.movie_id);
			}
		}
	});

	//return to fullfil the promise
	return data;
}




/* ---------------- Transformations to be applied over the normalized data ---------------- */

/* Hit the IMDB API to store movies' information.
   We want to store this, to be able to show pictures without calling to the API from the client.
   @param data (Object) same JSON array with the dataset
   @return data to keep the promise chain
 */
function getMoviesData(data) {
	
	log10(data.locations);

	console.log("STARTING MOVIES DATA...")

	//Get every movie name
	let movies = Object.keys(data.movies);
	
	let num = 0;

	//Return a promise, only resolved when every movie has been completed
	return new Promise((resolve, reject) => {

		//walk the movies asynchronally
		async.eachSeries(movies, (item, next) => {
			
			if (++num % 50 === 0) console.log(num);

			//call the api
			request(imdbURL+item)
			.then((response) => {
				
				var fields = JSON.parse(response);
				
				//if valid response
				if (fields.Response == "True") {

					//merge old and new data
					Object.assign(normalizedData.movies[item], {
						rated: fields.Rated, 
						released: fields.Released, 
						runtime: fields.Runtime, 
						genre: fields.Genre, 
						plot: fields.Plot, 
						language: fields.Language,
						poster: fields.Poster,
						imdbRating: fields.imdbRating,
						imdbVotes: fields.imdbVotes
					});
				}

				//we don't want to choke the api, so we wait before recursing
				return setTimeout(next, 100);
			})
		},
		//every movie is done, resolve the promise
		function done() {
			resolve(data);
		})
	});
}


/* Call the Google geocoding API to get lat/lng data for each location.
   As the dataset is quite messy, we have to take some considerations.
   @param data (object) normalized data, from where we'll take data.locations
   @return a promise, which resolves to the same object to keep the chain
  */
function getLocationData(data) {

 	// return a promise which only resolves when every location has been completed
	return new Promise((resolve, reject) => {

		console.log("STARTING DATA LOCATIONS...")
		let num = 0;

		//walk every location asyn
		async.eachSeries(Object.keys(data.locations), (location, next) => {
				if (++num % 50 == 0) console.log(num);
				
				//getGeolocation 
				geoLocate(location)
				.then(bestResponse => {
					
					//merge the bestResponse with the existing data
					Object.assign(data.locations[location], bestResponse);

					//we dont want to choke the api, so we wait a little
					setTimeout(next, 100);
				})
				
			},
			//resolve the promise when everything is done
			function done() {
				resolve(data);
			}
		);
	});


	/* Call the geolocation api with different variants to get the best response from Google */
	function geoLocate(location) {

		//queue includes every variant we'll try against the google api
		let queue = [location];
		let match;
		
		//location format XXXX (address)
		if (match = location.match(/(.*?)\((.*?)\)/)) {
			queue.push(match[1], match[2]);
		} else if (match = location.match(/(.*?)from(.*?) (to|at|and) (.*)/)) {
			//location format XXXX from one st. to other st.
			queue.push(match[1] + " & " + match[2], match[1] + " & " + match[4], match[2] + " & " + match[4]);
		} else if (match = location.match(/(.*?)at(.*?) (to|at|and) (.*)/)) {
			//location format XXXX at one st. to other st.
			queue.push(match[1] + " & " + match[2], match[1] + " & " + match[4]);
		} else if (match = location.match(/(.*?) between (.*?) (and|&) (.*)/)) {
			//location format XXXX between one st. and other st.
			queue.push(match[1] + " & " + match[2], match[1] + " & " + match[4]);
		} else if (location.indexOf('/') !== -1) {
			//location format including '/' as separator
			queue = queue.concat(location.split('/'));
		}


		let promises = [];
		queue.forEach((address) => {
			//add a new promise for each variant we want to test against the API
			promises.push(request(geocodingURL + formatAddress(address)));
		});

		return Promise.all(promises)
				.then((responses) => {
					
					let bestResponse = responses.reduce((prev, item) => {
						item = JSON.parse(item);
						
						//format can fail and throw 
						try {

							//if the level of accuracy is better than other response, set this one as best response
							if (item.status == "OK") {
								let results = item.results[0];
								if (googleLevels[results.address_components[0].types[0]] < prev.level) {
									prev = {
										level: googleLevels[results.address_components[0].types[0]],
										lat: results.geometry.location.lat,
										lng: results.geometry.location.lng,
										place_id: results.place_id,
									}

									//find any adress_component containig the type neighborhood
									for (let j = 0, len = results.address_components.length; j < len; j++) {
										if (results.address_components[j].types.some(x => x == "neighborhood")) {
											//and save it as district
											prev.district = results.address_components[j].long_name;
											break;
										}
									}
								}
							}  
							
						} catch(err) { return prev; }

						return prev;
					},
					//we start with an infinit level of accuracy 
					{level: Infinity});

					//it hasn't found a good match, or it's returning the default response for SF city
					//so we ignore this location
					if (!bestResponse.place_id || bestResponse.place_id == googleResponseDefaultSF.place_id) {
						console.log("FAILS ", location);
						return {};
					}
					
					//has found a good response!
					return bestResponse;
					
				})
				.catch(e => console.error(e));
				
	}

	/* Encodes an address to URL format, including ()
	   @param location (string)
	   @return string
	 */
	function formatAddress(location) {
		return encodeURIComponent(location)
				.replace(/\(/g, '%28') 
				.replace(/\)/g, '%29') 
				+ ",San%20Francisco";
	}

}  //end getLocationData


/* 
Format our normalized data in a way such that KEYS of the object are the numeric IDs.
@param data (Object) {movies, persons, locations}
@return Object, containing the same keys
*/
function formatOutput(data) {


	return {
		movies: 	transformIds(data.movies),
		persons: 	transformIds(data.persons),
		locations: 	transformIds(data.locations)
	};

	//actually do the transformations
	function transformIds(obj) {
		return Object.keys(obj).reduce((prev, key) => {
			let id = obj[key].id;
			prev[id] = obj[key];
			return prev;
		}, [])
	}
}



/* ---------------- Utilities ---------------- */


function isNull(value) {
	return !value || value == 'N/A';
}

function log10(obj) {
	var keys = Object.keys(obj);
	for (let i = 0; i < 10; i++) {
		console.log(keys[i], obj[keys[i]]);
	}
}