const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    name : {
        required: [true, 'Please Enter Your Name'],
        type: String,
        minlength:5,
        maxlength:50,
    },
    email:{
        required: [true, 'Please Enter Your Email'],
        type: String,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'
        ],

    },
    password:{
        required: [true, 'Please Enter Your Password'],
        type: String,
        minlength:6,
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createToken = function(){
    const token = jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token
}

UserSchema.methods.comparePassword = async function(reqPassword){
    const isMatch = await bcrypt.compare(reqPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User',UserSchema)