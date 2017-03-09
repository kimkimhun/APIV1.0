const LogMachine = require('../models/Logmachine');
const Time;

module.exports.newlog = (temperature, humidity, hour, day, connect)=>{
   var log = new LogMachine();      // create a new instance of the Bear model
        log.temperature = temperature;
        log.humidity = humidity;
        log.hour = hour;
        log.day = day;
        log.connect = connect;
        log.save((err)=> {
            if (err) console.log(err);
            console.log(" New log!");
        });
};