const { validationResult } = require('express-validator');
const PostSchema = require('../models/post_model');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts : [
            {
                title : 'First API request',
                content: 'I Loveeeee Gujjuuuu',
                imageUrl : 'images/duck.jpg',
                creator : {
                    name : 'Rohit'
                },
                date : new Date()
            }
        ]
    });
}

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation error!! Entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const post = new PostSchema({
        title : title,
        content : content,
        creator : { name : 'Rohit' },
        imageUrl : 'images/Mic.jpg',
    });
    
    post.save().then(result => {
        console.log("Added here");
    }).catch(error => {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    });
}