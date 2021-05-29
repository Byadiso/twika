const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const  User = require('../../schemas/UserSchema');
const  Post = require('../../schemas/PostSchema');

const router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async (req,res, next)=>{   
    
    var searchObject = req.query;


    if(searchObject.isReply !== undefined){
        var isReply = searchObject.isReply == "true";
        searchObject.replyTo = { $exists: isReply };
        delete searchObject.replyTo;
        

    } 

  var results = await getPosts(searchObject);
  res.status(200).send(results)
});



router.get('/:id', async (req,res, next)=>{   
    var postId = req.params.id;
    var postData = await getPosts({_id: postId});
    postData = postData[0];

    var results = {
        postData : postData
    }

    if(postData.replyTo !==undefined){
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({ replyTo : postId});
    
    res.status(200).send(results)

 });

router.post('/', async(req,res, next)=>{  
    if(!req.body.content){
        console.log("content param not sent with request ")
        return res.sendStatus(400);
    }      



    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    
    if(req.body.replyTo) {
        postData.replyTo = req.body.replyTo
    }
    Post.create(postData)
    .then( async newPost =>{
        newPost = await User.populate(newPost, { path: "postedBy" })
        res.status(201).send(newPost);
    })
    .catch(error =>{
        console.log(error);
        res.sendStatus(400);
    });
  
});


router.delete('/:id', async(req,res, next)=>{     
    var postId = req.params.id;  

    // delete post
    var post = await Post.findByIdAndDelete(postId)
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

    res.status(202).send(post)
 });


router.put('/:id/like', async(req,res, next)=>{ 
    
    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";
    // insert user like 
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })


    // insert post like 
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post)
 });

 

router.post('/:id/retweet', async(req,res, next)=>{ 

    var postId = req.params.id;
    var userId = req.session.user._id;
    

    // try and retweet
    var deletedPost = await Post.findOneAndDelete({ postedBY: userId, retweetData: postId})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);

    })

    // var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = deletedPost != null ?  "$pull" : "$addToSet";

    var repost = deletedPost;

    if(repost == null){
        repost = await Post.create({ postedBy: userId, retweetData: postId})
          .catch( error => {
              console.log(error);
              res.sendStatus(400);
          })
    }

    // insert user like 
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })


    // insert post like 
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } } , { new : true })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post)
 });


 async function getPosts(filter){

     var results = await Post.find(filter)
     .populate("postedBy")
     .populate("retweetData")
     .populate("replyTo")
     .sort({ "createdAt": -1})
     .catch(error => console.log(error))

     results = await User.populate(results, {path : "replyTo.postedBy"});
     return await User.populate(results, {path : "retweetData.postedBy"});
 }


    
module.exports = router;

