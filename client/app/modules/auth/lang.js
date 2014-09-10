angular.module('cri.auth')
    .config(['$translateProvider',function ($translateProvider){
        $translateProvider.translations('en', {
            'ACCOUNT_TITLE': 'Account',
            // LOGIN FORM
            'LOGIN_TITLE':'Login:',
            'LOGIN_BUTTON':'Login',
            'LOGIN_USERNAME':'Username',
            'LOGIN_PASSWORD':'Password',
            'LOGIN_REGISTER_INFO':'Do not have account?',
            'LOGIN_REGISTER_BTN':'Register Now!',
            'LOGIN_RESETPASS':'forget Password?',
            'LOGIN_ALREADY':'Welcome on board !.',

            // Register
            'REGISTER_TITLE':'Register User',
            'REGISTER_USERNAME':'Username',
            'REGISTER_USERNAME_PH':'your name,mixed a-z with numbers',
            'REGISTER_EMAIL':'Email',
            'REGISTER_EMAIL_PH':'example@gmail.com',
            'REGISTER_SKILLS':'skills/tag',
            'REGISTER_PASSWORD':'Password',
            'REGISTER_PASSWORD_PH':'Login Password',
            'REGISTER_CONFIRMPASS':'Password Again',
            'REGISTER_CONFIRMPASS_PH':'Confirm Your Password',
            'REGISTER_NOTMATCH_PASS':'Password Not Match',
            'REGISTER_NOW':'Let Me In!',
            'REGISTER_LOGIN_INFO':'Already have  account?',
            'REGISTER_LOGIN_BTN':'Login Now',
            'REGISTER_ATTENTION':'Attention:',
            'REGISTER_ATTENTION_INFO':'Email address should be same with the one that recieved the email, otherwise,you could not join the project.',
            'REGISTER_TERM':'I have readed the term of service.',

            // Reset pass
            'RESET_TITLE':'Reset Password by Email',
            'RESET_EMAIL':'your email',
            'RESET_GET_CODE':'Get Code',
            'RESET_CODE':'Enter vertify code',
            'RESET_NEWPASS':'Enter new code',
            'RESET_BTN':'Reset',


        });

        $translateProvider.translations('zh_CN', {
            'ACCOUNT_TITLE': '积致账户',
            // LOGIN FORM
            'LOGIN_TITLE':'登陆积致',
            'LOGIN_BUTTON':'登陆',
            'LOGIN_USERNAME':'用户名',
            'LOGIN_PASSWORD':'密码',
            'LOGIN_REGISTER_INFO':'还没有积致账号？',
            'LOGIN_REGISTER_BTN':'马上注册!',
            'LOGIN_RESETPASS':'忘记密码？',
            'LOGIN_ALREADY':'您已经登陆过啦。',
            // Register
            'REGISTER_TITLE':'欢迎加入积致',
            'REGISTER_USERNAME':'用户名',
            'REGISTER_USERNAME_PH':'建议用英文搭配数字',
            'REGISTER_EMAIL':'常用邮箱',
            'REGISTER_EMAIL_PH':'example@gmail.com',
            'REGISTER_PASSWORD':'您的登陆密码',
            'REGISTER_PASSWORD_PH':'登陆密码',
            'REGISTER_CONFIRMPASS':'确认登陆密码',
            'REGISTER_CONFIRMPASS_PH':'再次输入登陆密码',
            'REGISTER_NOTMATCH_PASS':'两次密码不相等',
            'REGISTER_NOW':'快速注册',
            'REGISTER_LOGIN_INFO':'已经有积致账号？',
            'REGISTER_LOGIN_BTN':'直接登录',
            'REGISTER_ATTENTION':'注意：',
            'REGISTER_ATTENTION_INFO':'邮件地址应和你收到的邀请链接的邮箱地址相同，否则无法成功加入项目。',
            'REGISTER_TERM':'已经阅读并同意积致协议',

            // Reset pass
            'RESET_TITLE':'通过邮箱重置密码',
            'RESET_EMAIL':'输入邮箱',
            'RESET_GET_CODE':'获取验证码',
            'RESET_CODE':'输入邮箱验证码',
            'RESET_NEWPASS':'输入新密码',
            'RESET_BTN':'重置密码',

        });

    }]);