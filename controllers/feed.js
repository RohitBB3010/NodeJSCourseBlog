const { validationResult } = require('express-validator');
const Post = require('../models/post_model');

exports.getPosts = (req, res, next) => {

    Post.find().then(posts => {
        let modifiedPosts = [];

        posts.map((post) => {
            modifiedPosts.push({
                _id : post._id.toString(),
                title : post.title,
                content : post.content,
                creator : post.creator,
                createdAt : post.createdAt,
                imageUrl : post.imageUrl
            });
        })
            res.status(200).json({
                message : 'Posts sent',
                posts : modifiedPosts
           
        });
    }).catch(err => {
        console.log(err);
    })
}

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation error!! Entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    let imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;

    imageUrl = imageUrl.replace(/\\/g, '/');

    const post = new Post({
        title : title,
        content : content,
        creator : { name : 'Rohit' },
        imageUrl : imageUrl
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

exports.getSinglePost = (req, res, next) => {

    const postId = req.params.postId;
    console.log(postId);

    Post.findById(postId).then(post => {
        res.status(200).json({
            message : 'Post fetched successfully',
            post : post
        });

        console.log(post);
    }).catch(err => {
        console.log(err);
    })
}