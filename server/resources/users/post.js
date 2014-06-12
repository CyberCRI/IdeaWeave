dpd.users.get( {username: this.username},
    function callback (result, err) {
        if (result.length > 0) error('username',"Username already exists");
    });

dpd.users.get( {email: this.email},
    function(result, err){
        if (result.length > 0) error('email', "Email already exists");
    });

this.emailValidated = false;
this.createDate = new Date().getTime();
this.notify = true;
this.admin = false;
this.language = "en";
this.tags = [];
if (!this.meta) {
  this.meta = {};
}
this.score = 0;
this.sex = 0;


// Send mail for email validation
// TODO Remove IP Address
var link = 'http://localhost:5010/account/activate/' + this.id;
var emailMsg = "<h3>Welcome</h3>Please validate your email by clicking on this link : <a href='" + link + "'>" + link + "</a>";
dpd.email.post({from:'Coidea<no-reply@coidea.com>',
    to: this.email,
    subject: 'Coidea - Validate your email',
    html: emailMsg,
    text: emailMsg
});
