const mongodb = require('./models/mongoose');
const Machine = require('./models/Machine');


function socketMain(io, socket) {
	let macA;

	socket.on('clientAuth', (key) => {
		if (key === '4kk39vmasdklg1305') {
			// valid node client
			socket.join('clients');
		} else if (key === 'asdkkw134ipfaosdk13') {
			// valid ui client
			socket.join('ui');
		} else {
			// unauthorized client
			socket.disconnect(true);
		}
	});

	socket.on('initPerfData', async (data) => {
		macA = data.macA;
		try {
			const mongooseRes = await checkAndAdd(data);
			console.log(mongooseRes);
		} catch (err) {
			console.log(err);
		}
	});

	socket.on('perfData', (data) => {
		console.log('Data update');
	});
}

function checkAndAdd(data) {
	console.log(data);
	return new Promise((resolve, reject) => {
		Machine.findOne(
			{ macA: data.macA },
			(err, doc) => {
				if (err) reject (err);
				if (doc === null) {
					// record not in db
					const machine = new Machine(data);
					machine.save();
					resolve('added');
				} else {
					// record is in db
					resolve('found');
				}
			}
		);
	});
}

module.exports = socketMain;
