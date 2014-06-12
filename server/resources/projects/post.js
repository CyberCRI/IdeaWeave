if(!me){
    cancel('Must be logged in to create a project','401');
}
console.log('this',this)
if(this.tags){
    for(var tag in this.tags){
        dpd.tags.post({title : this.tags[tag]},function(){
        
        })
    }
}
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

 

