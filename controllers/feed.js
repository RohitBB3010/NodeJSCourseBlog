const { validationResult } = require('express-validator');
const Post = require('../models/post_model');
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, next) => {

    // Post.find().then(posts => {
    //     let modifiedPosts = [];

    //     posts.map((post) => {
    //         modifiedPosts.push({
    //             _id : post._id.toString(),
    //             title : post.title,
    //             content : post.content,
    //             creator : post.creator,
    //             createdAt : post.createdAt,
    //             imageUrl : post.imageUrl
    //         });
    //     })
    //         res.status(200).json({
    //             message : 'Posts sent',
    //             posts : modifiedPosts
           
    //     });
    // }).catch(err => {
    //     console.log(err);
    // })

    const pageNumber = req.query.page || 1;
    const postPerPage = 2;
    let totalItems;

    Post.find().countDocuments().then(count => {
        totalItems = count;
        return Post.find().skip((pageNumber-1)*postPerPage).limit(postPerPage).then(posts => {
            res.status(200).json({
                message : "Posts fetched successfully",
                posts : posts,
                totalItems : totalItems
            })
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
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

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Validation failed; entered data is incorrect');
        error.statusCode = 422;
        throw err;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.imageUrl;

    if(req.file){
        imageUrl = req.file.path;
    }

    if(!imageUrl){
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId).then(post => {
        if(!post){
            const error = new Error('Post not found');
            error.statusVode = 404;
            throw error;
        }

        if(imageUrl != post.imageUrl){
            clearImage(post.imageUrl);
        }

        imageUrl = imageUrl.replace(/\\/g, '/');

        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        return post.save();
    }).then(result => {
        res.status(200).json({
            message : 'Post edited successfully',
            post : result
        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.deletePost = (req, res, next) => {

    console.log("Delete attempted");
    
    const postId = req.params.postId;

    Post.findById(postId).then(post => {
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }

        //Check logged in user
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(postId);
    }).then(result => {
        res.status(200).json({
            message : 'Post deleted successfully',

        })
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}

const clearImage = filePath => {

    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}