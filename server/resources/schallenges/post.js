this.createDate=new Date().getTime();
if(me){
    this.owner=me.id;
} else {
    cancel("You must be logged in", 401);
}

