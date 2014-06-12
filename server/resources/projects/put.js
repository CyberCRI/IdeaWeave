console.log('this',this);
console.log('query',query);


var member=this.member.concat(this.owner);

if(!inArray(me.id,member)&&!internal){
    cancel('no permission','401');
}
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
this.updateDate=new Date().getTime();
   function getUnique(array){
         var uniqueArray = array.filter(function(elem, pos, self) {
	      return self.indexOf(elem) == pos;
	     });
	      return uniqueArray;
	}
// update member
if(query.context==="team"){
this.member=getUnique(this.member);    
// update 
}
protect('owner');
protect('createDate');



