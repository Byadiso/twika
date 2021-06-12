const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('./database/db');
const port = 3002;
// const io = require('socket.io');

const session = require('express-session');


// run our server 

const server = app.listen(port, ()=>{
    message;
});

//runn socket.io
const io = require('socket.io')(server, { pingTimeout: 60000 });




const middleware = require('./middleware');

const message = console.log('server listening on port ' + port);




app.set("view engine", "pug");
app.set("views", "views");

//for serving our static files
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "yes-yeso",
    resave: true,
    saveUninitialized: false
}));

//routes
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const logoutRoutes = require('./routes/logout');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');
const messagesRoutes = require('./routes/messagesRoutes');

//api Routes
const postsApiRoutes = require('./routes/api/posts');
const usersApiRoutes = require('./routes/api/users');
const chatsApiRoutes = require('./routes/api/chats');
const messagesApiRoutes = require('./routes/api/messages');





app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);
app.use('/uploads', uploadRoutes);

app.use('/api/search',middleware.requireLogin, searchRoutes);
app.use('/api/messages',middleware.requireLogin, messagesRoutes);


app.use('/posts', middleware.requireLogin, postRoutes);
app.use('/profile',  middleware.requireLogin, profileRoutes);

app.use('/api/posts', postsApiRoutes);
app.use('/api/users', usersApiRoutes);
app.use('/api/chats', chatsApiRoutes);
app.use('/api/messages', messagesApiRoutes);





app.get("/", middleware.requireLogin, (req,res, next)=>{

    var payload = {
        pageTitle:"Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.status(200).render("home", payload)
});

io.on("connection", (socket)=>{
    console.log("connected to socket.io")

    socket.on("setup", userData =>{
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on("join room", room => socket.join(room));
    socket.on("typing", room => socket.in(room).emit("typing"));
    socket.on("stop typing", room => socket.in(room).emit("stop typing"));



})
