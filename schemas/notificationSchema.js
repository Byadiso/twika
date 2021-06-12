const mongoose = require('mongoose');
const crypto = require ('crypto');


const {ObjectId } = mongoose.Schema;

const notificationSchema = new mongoose.Schema({

        userTo: { type: ObjectId, ref: "User" },
        userFrom: { type: ObjectId, ref: "User" },
        notificationType: String,
        opened:{type: Boolean, default: false},
        entityId: ObjectId       
    }, 
    { timestamps: true }
);


var notification = mongoose.model("Notification", notificationSchema);

module.exports = notification;