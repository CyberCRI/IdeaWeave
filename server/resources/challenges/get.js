if(query.type =='position'){
    Object.keys(this).forEach(function(key) {
        if(key != 'localisation'){
            hide(key);    
        }
    });
}else if(query.context==="list"){
    hide('content');
}else{
    dpd.followers.get({eid:this.id,type:'challenges'},function(data){
        if(data.length>0){
            this.followers = data[0].users;
        }else{
          this.followers=[];
        }
    });
}

