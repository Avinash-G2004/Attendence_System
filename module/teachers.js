const mongoose = require("mongoose");

const teachers_Schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    user_name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});
const teachers= mongoose.model("teachers", teachers_Schema);
module.exports = teachers;