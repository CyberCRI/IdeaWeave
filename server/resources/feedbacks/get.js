if(me&&me.admin){
    if(this.archive){
    cancel('已经存档',200);
    }  
    dpd.users.get(this.sender,function(data){
       this.sender=data;
    });

}else{
    cancel('no permission',401);
}

