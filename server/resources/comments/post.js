this.createDate=new Date().getTime();

console.log('event emitted')
emit('comments:create',this);
// add activity
if(this.type==='pforums'){
    dpd.activities.post({action:'commentPtopic',entity:this.id,container:this.container});
}else{
     dpd.activities.post({action:'comment',entity:this.id,container:this.container});
}
if(this.parent){
    //notify parent comment's owner
    dpd.comments.get(this.parent,function(data,err){
      dpd.unotifys.post({uid:data.owner,type:'replyComment',entity:this.id});
    });
}
