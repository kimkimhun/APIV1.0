const SetMachine = require('../models/Setmachine');

module.exports.setdata = (temperature, humidity, hour, day, reset)=>{
   
   var set = new SetMachine();      // create a new instance of the Bear model
        set.temperature = temperature;
        set.humidity = humidity;
        set.hour = hour;
        set.day = day;
        set.reset = reset;
        set.save((err)=> {
            if (err) console.log(err);
            console.log(" New Set Machine!");
        });
};