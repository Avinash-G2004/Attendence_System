const mongoose = require("mongoose");
const student_Schema = new mongoose.Schema({
    PRN:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    fathers_name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    branch:{
        type: String,
        required: true
    },
    roll:{
        type: Number,
        required: true
    },
    number_of_days_present:{
        type: Number
    }
});
const student= mongoose.model("student", student_Schema);
module.exports = student;