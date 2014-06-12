this.owner=me.id;
if(this.container){
    emit('file:create',this);
}
this.createDate=new Date().getTime();
if(this.entity==="users"){
    // update user fileId
    dpd.users.put(me.id,{fileId:this.name});
}
dpd.activities.post({action:'createfile',entity:this.id});