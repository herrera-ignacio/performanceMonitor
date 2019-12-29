const mongoose = require('mongoose');

const user = 'test-user';
const pwd = 'test-password';
const dbname = 'perfData';

const options = {
	autoIndex: false, // Don't build indexes
	reconnectTries: 30, // Retry up to 30 times
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0
};

const connectWithRetry = () => {
	console.log('MongoDB connection with retry');
	mongoose.connect(`mongodb://${user}:${pwd}@mongodb:27017/${dbname}`, options)
		.then(() => console.log('MongoDB is connected'))
		.catch((err) => {
			console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
			console.warn(err);
			setTimeout(connectWithRetry, 5000)
		})
};

connectWithRetry();

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', function() {
	console.log('API service connecting to Mongo');
});

module.exports = db;
