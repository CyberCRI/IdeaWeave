var HackPad = require('hackpad'),
    client = new HackPad('qGjGvsaCdDG', 'byPcXTnxwDxYgwT6zrwsgVw33RHVpNSz'),
    mongoose = require('mongoose-q')(),
    NoteLab = mongoose.model('NoteLab');

exports.client = client;
exports.getContent = function(req,res) {
    client.export(req.params.id,'','',function(err,resp){
        if(err){
            res.json(400,err)
        }else{

            NoteLab.findOneAndUpdateQ({hackPadId : req.params.id},{ text : resp }).then(function(note){
                res.json(note);
            }).fail(function(err){
                res.json(500,err);
            });
        }
    })
};


