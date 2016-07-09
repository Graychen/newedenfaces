var swig = require('swig');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/routes');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io     = require('socket')(server);
var onlineUsers = 0;
var mongoose = require('mongoose');
var Character = require('./models/character');
var config = require('./config');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
mongoose.connect(config.database);
mongoose.connect.on('error',function(){
    console.info('Error:Count not connect to MongoDB');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false  }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res){
    Router.run(routes, req.path, function(Handler){
        var html = React.renderToString(React.createElement(Handler));
        var page = swig.renderFile('views/index.html',{html:html});
        res.send(page);
    });
});

app.sockets.on('connection',function(socket){
    onlineUsers++;

    io.sockets.emit('onlineUsers',{onlineUsers:onlineUsers});

    socket.on('disconnect',function(){
        onlineUsers--;
        io.socket.emit('onlineUsers',{ onlineUsers:onlineUsers });
    });
});

app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
});
