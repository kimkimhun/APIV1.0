var mongoose = require('mongoose');

var LogMachineSchema = new mongoose.Schema({
  temperature: {
    type: Number
  },
  humidity: {
    type: Number
  },
  hour: {
    type: Number
  },
  day: {
    type: Number
  },
  connect: {
    type: Number
  },
  date: {
    type: Date
  }
});

module.exports = mongoose.model('LogMachine', LogMachineSchema);