if ( !internal && !isMe(this.id) ) {
    hide('email');
    hide('notify');
    hide('language');
}

if(query.type =='position'){
    Object.keys(this).forEach(function(key) {
        if(key != 'localisation'){
            hide(key);    
        }
    });
}