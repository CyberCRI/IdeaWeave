
dpd.projects.get(this.container,function(result,err){
    if(!result.isMember){
        cancel('no permission',401);    
    }
   // dpd.users.get(this.owner,function())
});