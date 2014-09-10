angular.module('cri.common')
    .config(['$translateProvider',function ($translateProvider){
        $translateProvider.translations('en', {
            'TITLE': 'IdeaStorm',
            'HEAD_HOME':'Home',
            'HEAD_PROJECT': 'Project',
            'HEAD_CHALLENGE': 'Challenges',
            'HEAD_REGISTER':'Register',
            'HEAD_LOGIN':'Login',
            'ADMIN_SCREEN':'Admin Screen',
            'HEAD_MESSAGE':'Message',
            'HEAD_SETTING':'Setting',
            'HEAD_ACCOUNT':'Account',
            'HEAD_LOGOUT':'Logout',

            // Common Button
            'BTN_SAVE':'Save',
            'BTN_CANCEL':'Cancel',
            'BTN_SUBMIT':'Submit',
            'BTN_DELETE':'Delete',
            'BTN_FOLLOW':'Follow',
            'BTN_MSG':'Email',
            'BTN_COMMENT':'Comment',
            'BTN_ADD':'Add',
            'BTN_CREATE':'Create',
            'BTN_MORE':'Load More',
            'BTN_SEND':'Send',

            //menu
            'BTN_TEAM':'Team',
            'BTN_DESC':'Description',
            'BTN_INFO':'Infos',
            'BTN_EDIT':'Edit',
            'BTN_TOPIC':'Topic',
            'BTN_HOME':'Home',

            // upload model
            'UPLOAD_INFO':'Please choose your file ( less than',

            //TAGS
            'TAGS_LABEL':'Tags',

            // Time
            'LAST_UPDATE':'Updated:',
            'CREATE_TIME':'Created at:',

            // score
            'SCORE':'Point',

            // follow and follower
            'FOLLOWER':'Followers',
            'FOLLOWING':'Following',
            'UNFOLLOW':'UnFollow',
            'NOFOLLOWER':'No Followers Yet',

            //footer
            'FOOTER_ABOUT':'About Us',
            'FOOTER_CONTACT':'Contact Us',
            'FOOTER_JOIN':'Join Us',
            'FOOTER_FAQ':'Faq',
            'FOOTER_TERM':'Term of Service',
            'FOOTER_TERM_CONTENT':'Term of Content',


        });

        $translateProvider.translations('zh_CN', {
            'TITLE': '积致',
            'HEAD_HOME':'首页',
            'HEAD_PROJECT': '创意墙',
            'HEAD_CHALLENGE': '挑战',
            'HEAD_REGISTER':'注册',
            'HEAD_LOGIN':'登录',
            'HEAD_MESSAGE':'消息',
            'HEAD_SETTING':'设置',
            'HEAD_ACCOUNT':'帐户',
            'HEAD_LOGOUT':'退出',

            // LETMEIN FORM
            'LETMEIN_TITLE':'登录积致',
            'LETMEIN_USERNAME':'用户名',
            'LETMEIN_PASSWORD':'密码',
            'LETMEIN_BUTTON':'登录',
            'LETMEIN_REGISTER_INFO':'还没有积致用户？',
            'LETMEIN_REGISTER_BTN':'马上注册一个！',

            // Common Button
            'BTN_SAVE':'保存',
            'BTN_CANCEL':'取消',
            'BTN_SUBMIT':'提交',
            'BTN_DELETE':'删除',
            'BTN_FOLLOW':'关注',
            'BTN_MSG':'私信',
            'BTN_COMMENT':'评论',
            'BTN_ADD':'添加',
            'BTN_CREATE':'创建',
            'BTN_MORE':'加载更多',
            'BTN_SEND':'发送',


            // upload model
            'UPLOAD_INFO':'请选择您的文件(小于',

            //TAGS
            'TAGS_LABEL':'标签',

            // Time
            'LAST_UPDATE':'最后更新：',
            'CREATE_TIME':'创建于：',

            // score
            'SCORE':'积点',

            // follow and follower
            'FOLLOWER':'粉丝',
            'FOLLOWING':'关注',
            'UNFOLLOW':'取消关注',
            'NOFOLLOWER':'还没人关注哦。',

            //footer
            'FOOTER_ABOUT':'关于我们',
            'FOOTER_CONTACT':'联系我们',
            'FOOTER_JOIN':'加入我们',
            'FOOTER_FAQ':'常见问题',
            'FOOTER_TERM':'服务协议',
            'FOOTER_TERM_CONTENT':'内容规范',


        });

        //set default languages
        //$translateProvider.preferredLanguage('zh_CN')
        $translateProvider.preferredLanguage('en');


    }]);