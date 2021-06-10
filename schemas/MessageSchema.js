const mongoose = require('mongoose');
const crypto = require ('crypto');


const {ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    chatName:{ type:String, trim:true},
    isGroupChat: { type:Boolean , default: false},
    users: [{ type: ObjectId, ref: "User" }], 
    latestMessage: { type: ObjectId, ref: "Message" }
     
    }, 
    { timestamps: true }
);


var Message = mongoose.model("Message", messageSchema);

module.exports = Message;