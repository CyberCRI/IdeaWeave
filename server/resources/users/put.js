protect('email');
protect('createDate');

if (!isRoot) protect('admin'); // Only Dashboard can promote a user to admin

if ( !isMe(this.id) && !internal ){
    protect('notify');
    protect('language');
    protect('fileId');
    protect('realname');
    protect('tags');
    protect('metadata');
    protect('score');
    protect('sex');
}