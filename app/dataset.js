/* Singleton conatining the 'dataset'... all our data parsed into an Object */ 
let fs 	 = require('fs');

//private data container
let data = null;

module.exports = {


	/* This method reads the data from our data file 
	  and returns a promise, resolve when its ready
	  */	
	init()  {

		//Read the data and store privately
		return new Promise((resolve, reject) => {
			
			//Read our data
			fs.readFile('./data/data.json', 'utf-8', (err, dataset) => {
				if (!err) {
					data = JSON.parse(dataset);
					resolve(module.exports);
				} else {
					reject(err);
				}
			});

		});
	},

	//Getter to accces the data
	getInstance() {
		return data;
	}
}