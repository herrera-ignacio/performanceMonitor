const mongoose = require('mongoose');
const { Schema } = mongoose;

const Machine = new Schema({
	macA: String,
	cpuLoad: Number,
	freeMem: Number,
	totalMem: Number,
	usedMem: Number,
	memUsage: Number,
	osType: String,
	upTime: Number,
	cpuModel: String,
	numCores: Number,
	cpuSpeed: Number,
});

module.exports = mongoose.model('Machine', Machine);
