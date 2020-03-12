require('./config/setup_db');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var db = require('./config/connection');
var session = require('express-session');
var exphbs = require('express-handlebars');
var helpers = require('handlebars-helpers');
var fs = require('fs-extra');
var path = require('path');
var fileUpload = require('express-fileupload');
var comparison = helpers.comparison();
var http = require('http').Server(app);
const auth = require('./middlewares/checkToken');
var user = require('./models/user');
const port = 5000;
var server = app.listen(5000, () => {
    console.log(`Server is running on port ${port}`);
  });
var io = require('socket.io')(server);

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname,'views'))

// Middlewares
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
app.use("/auth", express.static(__dirname + '/public'));
app.use("/users", express.static(__dirname + '/public'));
app.use("/users/gallery", express.static(__dirname + '/public'));
app.use("/profile/:username", express.static(__dirname + '/public'));
app.use("/finder", express.static(__dirname + '/public'));
app.use("/search", express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload({
  limits: { 
      fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
  },
}));
app.use(session({
  secret : 'keyboardcat',
  name : 'matchasession',
  resave : true,
  saveUninitialized : true,
}));
app.use(require('./controllers'));

io.on('connection', function(socket) {
  // console.log('user connected for chat');

  socket.on('create', function(roomName) {
    socket.join(roomName);
  })

  socket.on('message', function(message, roomName) {
    io.to(roomName).emit('server-message', message);
  })

  socket.on('disconnect', function() {
    // console.log('user disconnected');
  })

  socket.on('online req', function(username) {
    socket.broadcast.emit('online check', username)
  })

  socket.on('online resp', function(username) {
    socket.broadcast.emit('online')
  })

  socket.on('notif', function(dest) {
    socket.broadcast.emit('notif resp', dest);
  })

  socket.on('notif-chat', function(obj) {
    socket.broadcast.emit('notif-chat resp', obj);
  })

})

app.use(function(req, res, next){
  res.status(404).render('notFound');
});

app.use(function(req, res, next){
  res.status(500).render('error');
});