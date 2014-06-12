console.log('ererer')
var search = query.query;
dpd.projects.get({title : { $regex : query, $options : 'i' },function(result){
    console.log('search title project  :  ',result);
})