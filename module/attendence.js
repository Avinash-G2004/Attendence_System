const mongoose = require("mongoose");
const attendence_Schema = new mongoose.Schema({
    subject_name:{
        type: String,
        required: true
    },
    l_number:{
        type:Number
    },
    branch:{
        type: String,
        required: true 
    },
    date:{
        type: Date,
        required: true
    },
    Present_roll:{
        type: Number
    }
});
const attendence= mongoose.model("attendence",attendence_Schema);
module.exports = attendence;