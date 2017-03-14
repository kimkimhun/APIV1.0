const LogMachine = require('../models/Logmachine');


module.exports.newlog = (temperature, humidity, hour, day)=>{

   var log = new LogMachine();      // create a new instance of the Bear model
        log.temperature = temperature;
        log.humidity = humidity;
        log.hour = hour;
        log.day = day;
        log.save((err)=> {
            if (err) console.log(err);
            console.log(" New log!");
        });
};