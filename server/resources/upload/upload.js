console.log('yo',this);
if(query.topic){
    dpd.pforums.get(query.topic,function(err,topic){
        if(err){
            console.log(err);
        }
        //topic.files.push()
        console.log(err,topic);
    });
}else if(query.poster){
    
}