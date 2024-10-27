const { validationResult } = require('express-validator');
const User = require('../models/user_model');
const bcrypt = require('bcrypt');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation failed; entered data is incorrect');
        error.status = 422;
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    bcrypt.hash(password, 12).then(hp => {
        const user = new User({
            name:name,
            password:hp,
            email:email
        });

        return user.save();
    }).then(result => {
        res.status(200).json({
            message : 'User created successfully',
            userId : result._id
        });
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}