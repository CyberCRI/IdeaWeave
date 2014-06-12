cancelUnless(me,'no permission',401);
if(query.context==="list"){
        switch(this.action){
            case 'createPtopic':
                dpd.pforums.get(this.entity,function(data,err){
                 this.entity=data;
                });
            break;
            case 'createPlink':
                dpd.plinks.get(this.entity,function(data,err){
                this.entity=data;
                });
            break;
            case 'commentPtopic':
               dpd.comments.get(this.entity,function(data,err){
                 this.entity=data;
               });
      
               dpd.pforums.get(this.container,function(data,err){
                   console.log(data);
                this.container=data;
               })
            break;
            
        }
}

  