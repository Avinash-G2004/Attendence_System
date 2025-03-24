const mongoose = require("mongoose");


const subject_Schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    branch:{
        type: String,
        required: true
    },
    sem:{
        type: String,
        required: true
    },
    teacher_name:{
        type: String
    },
    remaing_l:{
        type: Number
    },
    taken_l:{
        type: Number
    },
    total_l:{
        type: Number
    }
});
const subject= mongoose.model("subject", subject_Schema);
module.exports = subject;