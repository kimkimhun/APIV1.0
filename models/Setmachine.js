var mongoose = require('mongoose');

var SetMachineSchema = new mongoose.Schema({
  temperature: {
    type: Number
  },
  humidity: {
    type: Number
  },
  hour: {
    type: Number
  },
  reset: {
    type: Number
  },
  date: {
    type: Date
  }
});

module.exports = mongoose.model('SetMachine', SetMachineSchema);