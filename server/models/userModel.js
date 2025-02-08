const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        min: 3,
        max: 30,
        required: true,
        unique: true
    },
    email:{
        type: String,
        max: 50,
        unique: true,
        required: true
    },
    password:{
        type: String,
        min: 8,
        required: true
    },
    isAvatarActive:{
        type: Boolean,
        default: false
    },
    avatarImage:{
        type: String,
        default: ""
    }
})

module.exports = mongoose.model("Users",userSchema);