function socketMain(io, socket) {
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

	socket.on('perfData', (data) => {
		console.log(data)
	});
}

module.exports = socketMain;
