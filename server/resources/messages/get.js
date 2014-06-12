console.log('message get',query)
console.log('this message',this)
if(!me){
    cancel('没有权限',401);
}
if(!isMe(this.to)&&!isMe(this.from)){
    cancel('no permission',401);
}
