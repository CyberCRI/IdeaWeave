var search = query.query;
if(query.query){
    dpd.projects.get({title : { $regex : query, $options : 'i' }},function(result){
        console.log('search title project  :  ',result);
    })    
}else if(query.search){
    
}
