const mongoose = require('mongoose');
const crypto = require ('crypto');


const {ObjectId } = mongoose.Schema;
// const uuidv1 = require('uuid/v1');
// const { v1: uuidv1 } = require('uuid');
// const { strict } = require('assert');

const postSchema = new mongoose.Schema({
    content:{ type:String, trim:true},
    postedBy:{ type: ObjectId,  ref: "User" },
    pinned: Boolean
    

    // hashed_password:{
    //     type:String,
    //     required:true,
      
    // },
    // photo: {
    //     data: Buffer,
    //     contentType: String
    // },
    // about:{
    //     type:String,
    //     trim:true
    //    },
    // following: [{ type: ObjectId, ref: "USer" }],
    // followers: [{ type: ObjectId, ref: "USer" }],
    // salt: String,
    // role:{
    //        type: Number,
    //        default: 0
    //    },
    // history:{
    //        type:Array,
    //        default: []
    //    }
    
    }, 
    { timestamps: true }
);





var Post = mongoose.model("Post", postSchema);

module.exports = Post;