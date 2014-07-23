if(query.topic){
    dpd.pforums.get(query.topic,function(err,topic){
        if(err){
            console.log(err);
        }
    });
}else if(query.poster){
    
}