const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const auth = async (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(404).json({err :'No Header is Provided'})
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = {userId: decoded.userId, name: decoded.name}
        next()
    } catch (error) {
        return res.status(401).json({err :error.message})
    }
    
}

module.exports = auth