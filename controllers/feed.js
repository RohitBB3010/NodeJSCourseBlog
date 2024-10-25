
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        title : 'First API request',
        content: 'I Loveeeee Gujjuuuu'
    });
}

exports.createPost = (req, res, next) => {
    console.log("Came here");
    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message : 'Content Added Successfully',
        post : {
            id : Date.now.toString,
            title : title,
            content : content
        }
    });
}