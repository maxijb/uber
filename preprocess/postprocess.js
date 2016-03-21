/* ---------------- Dependencies ---------------- */

const fs 		= require('fs');
const request 	= require('request-promise');


/* ---------------- Start Preprocessing ---------------- */

new Promise((resolve, reject) => {
		//Read the dataset 
		fs.readFile('../data/data-preprocessed.json', 'utf-8', (err, data) => {
			!err ? resolve(data) : reject(err);
		});
	})
	//modify raw data
	.then(JSON.parse)
	.then(mapDistricts)
	.then(calculateDistrictsLatLng)
	.then(formatOutputAsArray)
	.then(data => {
		//persist to file
		return new Promise((resolve, reject) => {
			fs.writeFile('../data/data.json', JSON.stringify(data), function(err) {
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
function mapDistricts(data) {
	//cache data container
	let locations = data.locations;
	let districts = {},
		districtId = 0;


	Object.keys(locations).forEach(loc => {
		var district = data.locations[loc].district;
		if (!districts.hasOwnProperty(district)) districts[district] = {id: ++districtId, locations: [loc]};
		else districts[district].locations.push(loc);

		data.locations[loc].district = districts[district].id;
	});

	data.districts = districts;


	//walk data
	return data;
}



function calculateDistrictsLatLng(data) {
	Object.keys(data.districts).forEach(key => {
		Object.assign(data.districts[key], getAvg(data.districts[key].locations));
	});

	function getAvg(locations) {
		let sum = locations.reduce((results, loc) => {
			if(data.locations[loc].lat) {
				results.lat += data.locations[loc].lat;
				results.lng += data.locations[loc].lng;
			}
			return results;
		}, {lat: 0, lng: 0});

		return { lat: sum.lat / locations.length, lng: sum.lng / locations.length };
	}

	return data;
}




/* 
Format our normalized data in a way such that KEYS of the object are the numeric IDs.
@param data (Object) {movies, persons, locations}
@return Object, containing the same keys
*/
function formatOutputAsArray(data) {

	return {
		movies: 	transformIds(data.movies),
		persons: 	transformIds(data.persons),
		locations: 	transformIds(data.locations),
		districts: 	transformDistrict(data.districts)
	};

	//actually do the transformations
	function transformIds(obj) {
		return Object.keys(obj).reduce((prev, key) => {
			prev[key] = obj[key];
			prev[key].id = key;
			return prev;
		}, [])
	}

	function transformDistrict(obj) {
		return Object.keys(obj).reduce((prev, key) => {
			prev[obj[key].id] = obj[key];
			prev[obj[key].id].name = key;
			prev[obj[key].id].locations = prev[obj[key].id].locations.length;
			return prev;
		}, [])	
	}

}



