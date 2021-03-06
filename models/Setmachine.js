const mongoose = require('mongoose');
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
  day:{
    type: Number
  },
  reset: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SetMachine', SetMachineSchema);