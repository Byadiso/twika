var connected = false;

var socket = io("http://localhost:3002");
socket.emit("setup", userLoggedIn);

socket.on("connected", ()=> connected= true)