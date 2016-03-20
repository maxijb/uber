let fs 	 = require('fs');
let data = null;

module.exports = {
	
	init()  {
		return new Promise((resolve, reject) => {
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

	getInstance() {
		return data;
	}
}