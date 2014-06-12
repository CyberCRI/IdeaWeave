var hideOwner=false;
switch (query.context){
    case 'list':
     hide('parent');
     hide('text');
        break;
    case 'feed':
        hide('parent');
        break;
    case 'detail':
        if(this.parent){
            dpd.comments.get(this.parent,{context:'detail'},function(comments) {
              if(comments){
                  dpd.pforums.get(comments.container,function(data){
                    comments.container=data;
                     this.parent=comments;
                  });
              }
            });
        }
    break;
    default:
    if(this.parent){
    dpd.comments.get(this.parent, function(comments) {
      if(comments){
          this.parent=comments;
      }
    });
}
   
}
 
 