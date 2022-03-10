const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// desc: Register a User
// route: POST /api/users
// access: Public
const registerUser = asyncHandler( async (req,res) => {
    // get user data from the request
    const { name, email, password } = req.body;

    if(!name || !password || !email) {
        res.status(400);
        throw new Error('Please add all fields')
    }

    //check if the user exist
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error('User already exists')
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a User 
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }

})

// desc: Authenticate a User
// route: POST /api/users/login
// access: Public
const loginUser =asyncHandler( async (req,res) => {
    const { email, password } = req.body;

    //check for user mail 
    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error('Invalid User Credentials')
    }

})

// desc: Get user Data
// route: GET /api/users/me
// access: Private
const getMe =asyncHandler( async (req,res) => {
    res.status(200).json(req.user)
} )

//generate JWT 
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
} 

module.exports = {
    registerUser,loginUser,getMe
}
