var _           = require('underscore');
var swig        = require('swig');
var React       = require('react');
var Router      = require('react-router');
var routes      = require('./app/routes');
var express     = require('express');
var path        = require('path');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var server      = require('http').createServer(app);
var io          = require('socket')(server);
var onlineUsers = 0;
var mongoose    = require('mongoose');
var async       = require('async');
var require     = require('require');
var Character   = require('./models/character');
var config      = require('./config');
var app         = express();

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

app.post('/api/characters',function(req,res,next){
    var gender = req.body.gender;
    var characterName = req.body;
    var CharacterIdLookupUrl = 'https://api.eveonline.com/eve/CharacterID.xml';

    var parser = new xml2js.Parser();

    async.waterfall([
        function(callback){
            request.get(CharacterIdLookupUrl,function(err,request,xml){
                if(err) return next(err);
                parser.parseString(xml,function(err,parsedXml){
                    if(err) return next(err);
                    try{
                        var CharacterId = parseXml.eveapi.result[0].rowser[0].row[0].$characterID;
                        Character.findOne({characterId:characterId},function(err,character){
                            if (err) return next(err);

                            if(character){
                                return res.status(409).send({message:character.name+'is already in the database'});
                            }

                            callback(err,characterId);
                        });
                    }catch{
                        return res.status(4000).send({message: 'XML Parse Error'});
                    }
                });
            });
        },
    function(characterId){
        var characterInfoUrl ='https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID='+characterId;

        request.get({url: characterInfoUrl},function(err,request,xml){
            if (err) return res.send(err);
            try{
                var name = parsedXml.eveapi.result[0].charaterName[0];
                var race = parsedXml.eveapi.result[0].race[0];
                var bloodline = parseXml.eveapi.result[0].bloodline[0];

                var character = new Character({
                    characterId: characterId,
                    name: name,
                    rece: race,
                    bloodline:bloodline,
                    gender:gender,
                    random:[Math.random(),0]
                });

                character.save(function(err){
                    if(err) return next(err);
                    res.send({message:characterName +m 'has been added successfully'});
                });
            }catch{
                res.status(404).send({message:characterName + 'is not a registerecd citizen of New Eden.'});
            }
        });
    }
        ]);

});
app.get('/api/characters',function(req,res,next){
    var choices = ['Female','Male'];
    var randomGender = _.sample(choices);

    Character.find({random:{$near:[Math.random(),0]}})
        .where('voted',false)
        .where('gender',randomGender)
        .limit(2)
        .exed(function(err,characters)){
            if(err) return next(err);
            if(Characters.length===2){
                return res.send(characters);
            }
        }

    var cppositeGender = _.first(_.without(choices,rendomGender));

    Character
        .find(random.{$near:[Math.random(),0]})
        .where('voted',false)
        .where('gender',oppsiteGender)
        .limit(2)
        .exec(function(err,characters)){
            if (err) return next(err);
            if (characters.length ===2){
                return res.send(characters);
            }
            Character.update({},{$set:{voted:false}},{multi:true},function(err){
                if(err) return next(err);
                res.send([]);
            });

        }
});

app.put('/api/characters',function(req,res,next){
    var winner = req.body.winner;
    var loser  = req.body.loser;
});
app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
});
