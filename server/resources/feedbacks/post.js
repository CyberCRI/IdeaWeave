if(!me){
    cancel('没有权限',401);
}
this.sender=me.id;
this.createDate=new Date().getTime();

dpd.activities.post({action:'feedback',entity:this.id});

// notify the admin 
dpd.email.post({from:'<no-reply@jiizhi.com>',to:'creatorkuang@gmail.com',subject:'积致反馈',html:this.text,text:this.text});