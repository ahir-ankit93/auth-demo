const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {registerValidation, loginValidation} = require('../validation');


router.post('/register', async (req, res) => {

    // Validate data before the use 
    // const {error} = Joi.validate(req.body, schema);

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // res.send(error.details[0].message);
    
    // Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists'); 


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
        // password: req.body.password
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});


// Login
router.post('/login', async (req, res) => {
    // Lets validate data before use

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

        // Checking if the email exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email is1 not found'); 

        // Password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid password')

        //Create and assign a jwt token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send(token);
       
        // res.send('Logged In');
});

module.exports = router;