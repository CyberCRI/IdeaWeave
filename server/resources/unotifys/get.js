if(!isMe(this.uid)&&!internal){
    cancel('no permission',401);
}
if(query.context==="detail"){
    switch(this.type){
        case 'followUser':
        // 
        break;
        case 'createProject':
         dpd.projects.get(this.entity,{context:'list'},function(data){
         this.entity=data;
         });
        break;
        case 'createPforum':
         dpd.pforums.get(this.entity,function(data){
         this.entity=data;
         });
        break;
        case 'createPlink':
          dpd.plinks.get(this.entity,function(data){
         this.entity=data;
         });
        break;
        case 'replyComment':
           dpd.comments.get(this.entity,{context:'detail'},function(data){
             this.entity=data;
           });
        break;
        
    }
}