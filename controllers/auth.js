const User = require('../models/User')
const StatusCodes = require('http-status-codes')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const data = req.body

    const userCreated = await User.create(data)
    const token = userCreated.createToken()
    res.status(200).json({ token:token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({err : 'please fill all fields'})
    }

    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({err :'No Account Created with this email'})
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        return res.status(StatusCodes.UNAUTHORIZED).json({err :'Incorrect Password'})
    }
    const token = user.createToken()
    res.status(200).json({token : token })
}

module.exports = { login, register }


