const mongoose = require("mongoose");
const { type } = require("os");
const HOD_loginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    Username:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    }
});
const HOD_login= mongoose.model("HOD_login", HOD_loginSchema);
module.exports = HOD_login;