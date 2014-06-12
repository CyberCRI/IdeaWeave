if(!this.subject){
    error('subject', "不能为空");
}
if(!me){
    cancel('必须登陆才能发信','401');
}
