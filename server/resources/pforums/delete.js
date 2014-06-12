if(!isMe(me.id)){
    cancel('你不是创建所有者，没有权限删除',401);
}