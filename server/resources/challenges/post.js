if(this.tags){
    this.tags.forEach(function(v,k){
    dpd.tags.get({title : v},function(data){
        dpd.tags.put({
            id : data[0].id,
            number : { $inc : 1 }            
        },function(data,err){
            console.log(data,err);
        });
    });
});    
}