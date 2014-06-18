if(!me){
    cancel('Must be logged in to create a project','401');
}
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

// in case dulplicate
dpd.projects.get({title:this.title},function(data,err){
    if(data.length>0) cancel('Already created',401);
    
    
    this.member=[];
    this.owner=me.id;
    //this.detail="正在更新中...";
    this.mentors=[];
    this.createDate=new Date().getTime();
    this.updateDate=new Date().getTime(); 
    this.visit=0;
    this.score=0;
    dpd.activities.post({action:'createProject',entity:this.id});
    // emit id
    emit('projects:create',this.id);
    
    // notify all fans in challenge
dpd.followers.get({type:'challenges',eid:this.container},function(datas){
   if(datas.length>0){
       for(var i in datas[0].users){
           dpd.unotifys.post({uid:datas[0].users[i],type:'createProject',entity:this.id});
       }
   }
});
    
});

 

