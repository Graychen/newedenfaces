var mongoose = require('mongoose');

var characterSchema = new mongoose.Schema(
        characterId:{type:string,unique:true,index:true} 
        name:String,
        race:String,
        gender:String,
        bloodline:String,
        Wins:{type:Number,default:0},
        losses:{type:Number,default:0},
        reports:{type:[Number],index:'2d'},
        voted:{type:Boolean,default:false},
        );

module.exports = mongoose.model('Character',characterSchema);
