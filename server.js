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

app.get('/api/characters/count',function(req,res,next){
    Character.count({},function(err,count){
        if(err) return next(err);
        res.send({count:count});
    });
});
app.get('/api/characters/search',function(req,res,next){
    var characterName = new RegExp(req.query.name,'i');

    Character.findOne({name:characterName},function(err,character){
        if(err) return next(err);

        if(!Character){
            return res.status(404).send({message:'Character not found'});
        }

        res.send(character);
    });
});
app.get('/api/Characters/:id',function(req,res,next){
    var id = req.params.id;
    Character.findOne({});
});
app.get('/api/characters/top',function(req,res,next){
    var params = reql.query;
    var conditions = {};

    _.each(params,function(value,key){
        conditions[key] = new RegExp('^'+value + '$','i');
    });
    Character
        .find(conditions)
        .sort('-wins')
        .limit(100)
        .exec(function(err,characters){
            if(err) return next(err);
            Characters.sort(function(a,b){
                if(a.wins/(a.wins+a.losses)<b.wins/(b.wins+b.losses))
                return 0;
            });
            res.send(characters);
        });
        

});
app.get('/api/characters/shame',function(req,res,next){
    Characters
        .find()
        .sort('-losses')
        .limit(100)
        .exec(function(err,characters){
            if(err) return next(err);
            res.send(characters);
        });
});
app.post('/api/report',function(req,res,next){
    var characterId = req.body.characterId;

    Character.findOne({characterId:characterId},function(err,character){
        if(err) return next(err);
        if(!character){
            return res.status(404).send({message:'Character not found'});
        }
        character.reports++;
        if(character.remove()){
            character.remove();
            return res.send({message:character.name+'has been deleted'});
        }

        character.save(function(err){
            if(err) return next(err);
            res.send(message: character.name+'has been repoted');
        });

    });
    
});
app.get('/api/status',function(req,res,next){
    async.parallel([
            function（callback）{
                Character.count({},function(err,count){
                    callback(err,count);
                });
            }
            function(callback){
                Character.count({race:'Amarr'},function(){

                });
            }
    ]);
});
app.put('/api/characters',function(req,res,next){
    var winner = req.body.winner;
    var loser  = req.body.loser;
});
app.post('/api/report',function(req,res,next){
    var characterId = req.body.characterId;
    Character.findOne({characterId: characterId},function(err,character){
        if(err) return next(err);
        if(!character){
            return res.status(404).send({message:'Character not found'});
        }
        character.reports++;
        if(character.reports>4){
            character.remove();
            return res.send({message:character.name+has been deleted});
        }

        character.save(function(err){
            if(err) return next(err);
            res.send({message: character.name+'has been repoted'});
        });
    });
});
app.get('/api/stats',function(req,res,next){
    async.parallel([
        function(callback){
            Character.count({},function(err,count){
                callback(err,count);
            });
        },
        function(callback){
            Character.count({race:'Amarr'},function(err,amarrCount){
                callback(err,count);
            });
        },
        function(callback){
            Character.count({race:'Caldari'},function(err,caldariCount){
                callback(err,caldariCount);
            });
        },
        function(callback){
            Character.aggregate({$group:{_id:null,total:{$sum:'$wins'}}},function(err,totalVotes){
                var total = totalVotes.length?totalVotes[0].total:0;
                callback(err,total);
            });
        },
        function(callback){
            Character.find()
                .sort('-wins')
                .limit(100)
                .select('race')
                .exec(function(){
                    if(err) return next(err);
                    var raceCount = _.countBy(characters,function(charactera){return character.race;});
                    var max       = _.max(raceCount,function(race){return race});
                    var inverted  = _.inverted(raceCount);
                });
        }

        ]);
});
app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
});
