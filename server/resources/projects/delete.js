if (!isMe(me.id) && me.admin !== true) {
  cancel("You must be an admin to delete this", 401);
}
// minus point
dpd.users.put(me.id,{score:{$inc:-20}});

// delete activity
dpd.activities.get({owner:me.id,entity:this.id},function(data,err){
  if(data.length>0) dpd.activities.del(data[0].id)
})