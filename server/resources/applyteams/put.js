dpd.projects.get(this.container,function(result,err){
    if(!result.isMember){
        cancel('no permission',401);    
    }
    protect('sender');
    protect('container');
    protect('message');
});