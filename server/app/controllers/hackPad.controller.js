var HackPad = require('hackpad'),
    client = new HackPad('z9FmIrlxJNu', 'W17CLixQ5ocGRy20NqlRnNnKtyKi8531',{
        site : 'ideaweave'
    }),
    mongoose = require('mongoose-q')(),
    NoteLab = mongoose.model('NoteLab'),
    myHackpad = require('../services/hackpad.service');

exports.client = client;

exports.getIframe = function(req,res){
    myHackpad.getIframe('z9FmIrlxJNu','W17CLixQ5ocGRy20NqlRnNnKtyKi8531',req.params.id,req.query.email,req.query.name).then(function(data){
        console.log(data)
        res.send(200,data);
    }).catch(function(err){
        console.log(err);
        res.json(400,err);
    })
};

exports.auth = function(req,res){
    console.log(myHackpad.auth('z9FmIrlxJNu','W17CLixQ5ocGRy20NqlRnNnKtyKi8531'))
    res.json(myHackpad.auth('z9FmIrlxJNu','W17CLixQ5ocGRy20NqlRnNnKtyKi8531'));
};
