const mongoose = require('mongoose');
const crypto = require ('crypto');


const {ObjectId } = mongoose.Schema;
// const uuidv1 = require('uuid/v1');
// const { v1: uuidv1 } = require('uuid');
// const { strict } = require('assert');

const userSchema = new mongoose.Schema({
    firstName:{ type:String,trim:true,required:true, maxlength:32  },
    lastName:{type:String,trim:true,required:true, unique: true },
    username:{type:String,trim:true,required:true, unique: true },
    email:{type:String,trim:true,required:true, unique: true },
    password:{type:String,trim:true,required:true, unique: true },
    profilePic:{type:String, default: "/images/profilePic.png" },
    likes: [{ type: ObjectId, ref: "Post" }],

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




// // virtual fields;
// userSchema.virtual('password')
// .set(function(password) {
//     this._password = password;
//     this.salt= uuidv1();
//     this.hashed_password = this.encryptPassword(password);
// })
// .get(function(){
//     return this._password
// })


// userSchema.methods = {
//     authenticate: function(plainText){
//         return this.encryptPassword(plainText) === this.hashed_password;
//     },

//     encryptPassword: function(password){
//         if(!password) return "";
//         try {
//             return crypto.createHmac('sha1',this.salt)
//                         .update(password)
//                         .digest('hex');
//         } catch (err) {
//             return "";
//         }
//     }
// };


var User = mongoose.model("User", userSchema);

module.exports = User;