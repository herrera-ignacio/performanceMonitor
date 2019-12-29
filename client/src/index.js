/*
Node program that captures local performance data
and sends it up to the socket.io server
*/


const os = require('os');
const io = require('socket.io-client');

let socket = io('http://server:80');

socket.on('connect', () => {
	console.log('Connected to the socket server!');
	const networkIf = os.networkInterfaces();
	let macA;
	for(let key in networkIf) {
		if(!networkIf[key][0].internal) {
			macA = networkIf[key][0].mac;
			break;
		}
	}

	// Client auth with single key value
	socket.emit('clientAuth', '4kk39vmasdklg1305');

	getPerformanceData().then((data) => {
		data.macA = macA;
		socket.emit('initPerfData', data);
	});

	// Start sending data on interval
	let perfDataInterval = setInterval(() => {
		getPerformanceData().then((data) => {
			data.macA = macA;
			socket.emit('perfData', data);
		})
	}, 1000);

	socket.on('disconnect', () => {
		clearInterval(perfDataInterval);
	});
});

function getPerformanceData() {
	return new Promise(async (resolve, reject) => {
		// OS
		const osType = os.type() === 'Darwin'  ? 'Mac OS' : os.type();
		const upTime = os.uptime();
		// Memory
		const freeMem = os.freemem();
		const totalMem = os.totalmem();
		const memUsage = Math.floor((totalMem - freeMem) / totalMem * 100) / 100;
		// CPU info
		const cpus = os.cpus();
		const cpu = {
			model: cpus[0].model,
			cores: cpus.length,
			speed: cpus[0].speed
		};
		const cpuLoad = await getCpuLoad();
		const isActive = true;

		resolve({
			osType,
			upTime,
			freeMem,
			totalMem,
			memUsage,
			cpu,
			cpuLoad,
			isActive
		});
	});
}

function cpuAverage() {
	/*
	cpus is all cores, we need the average of all the cores which
	will give us the cpu average.
	To calculate the average of each node, we get ms from reboot,
	then we get it again in 100ms and compare
	 */
	// CPU
	const cpus = os.cpus();
	let idleMs = 0;
	let totalMs = 0;
	cpus.forEach((core) => {
		for(type in core.times) {
			totalMs += core.times[type];
		}
		idleMs += core.times.idle;
	});
	return {
		idle: idleMs / cpus.length,
		total: totalMs / cpus.length
	}
}

function getCpuLoad() {
	return new Promise((resolve, reject) => {
		const start = cpuAverage();
		setTimeout(() => {
			const end = cpuAverage();
			const idleDiff = end.idle - start.idle;
			const totalDiff = end.total -start.total;
			let cpuLoadPercentage = 100;
			if (totalDiff !== 0) {
				cpuLoadPercentage = 100 - Math.floor(100 * idleDiff / totalDiff);
			}
			resolve(cpuLoadPercentage)
		}, 100)
	});
}
