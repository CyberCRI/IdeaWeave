console.log('get projects !');

function inArray(value,array){
    if(typeof value=="string"){
        var len=array.length;
        for(var i=0;i<len;i++){
            if(value===array[i]){
                return true;
            }
        }
    }
    return false;
}
var isMember=false;
if(me && this.member){
    if(isMe(this.owner)||inArray(me.id,this.member)){
        isMember=true;
    }
}
if(isMember){
    this.isMember=1;
}else{
    this.isMember=0;
}

if(query.type =='position'){
    Object.keys(this).forEach(function(key) {
        if(key != 'localisation'){
            hide(key);    
        }
    });
}
if(isMe(this.owner)){
    this.isOwner=1;
}
// for getting all projects
switch(query.context){
    case 'detail':
        dpd.followers.get({eid:this.id,type:'project'},function(data){
            if(data){
                if(data.length>0){
                    this.followers=data[0].users;
                }else{
                    this.followers=[];
                }
            }else{
                this.followers=[];
            }
            dpd.pforums.get({ container : this.id },function(fData){
                if(fData){                    
                    this.topics = fData;
                }else{
                    this.topics = [];
                }
            });
        });
        break;
    case 'feed':
        hide('tags');
        hide('detail');
        hide('updateDate');
        hide('member');
        break;
    case 'list':
        hide('detail');
        // change score
        this.score=(this.score/9).toFixed(2);
        break;
    default:
        // basic information view,for search
        hide('detail');
        hide('updateDate');
}

