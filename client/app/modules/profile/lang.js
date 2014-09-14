angular.module('cri.profile')
    .config(['$translateProvider',function ($translateProvider){
        $translateProvider.translations('en', {
            'USER_TITLE': 'User',
            'PROFILE_PROJECT': 'Projects',
            'PROFILE_FAN': "'s Fans",
            'PROFILE_NO_FAN': "No Fans yet.",
            'PROFILE_REC': "People you might interested in:",
            'PROFILE_NO_REC': "No recommened users yet.",
            'PROFILE_EDIT': 'Edit User',
            'PROFILE_CON_CHALLENGE':'Challenges contributed to',
            'PROFILE_POP_PROJECT':'Popular projects',
            'PROFILE_CON_PROJECT':' Projects contributed to',
            // user setting
            'USERSET_TPL_BASIC': 'Basic Info',
            'USERSET_TPL_PASS': 'Password Reset',
            'USERSET_TPL_AVATER': 'Change Avater',
            'USERSET_TPL_NOTIFY': 'Notification',
            'USERSET_BASIC_REALNAME':'Full Name:',
            'USERSET_BASIC_SKILL':'Skills/Interested:',
            'USERSET_BASIC_GENDER':'Gender:',
            'USERSET_BASIC_H':'Hidden',
            'USERSET_BASIC_M':'Male',
            'USERSET_BASIC_F':'Female',
            'USERSET_BASIC_CATEGORY':'Category',
            'USERSET_PASS_NEW':'New Password:',
            'USERSET_PASS_AGAIN':'Enter Again:',
            'USERSET_PASS_NOTMATCH':'Not Match',
            'USERSET_NOTIFY_EMAIL':'Email Notification',
            'USERSET_NOTIFY_INFO':'Check if you want email notifications.',

            //Profile page
            'PROFILE_ACTIVITY':'News Feed',
            'PROFILE_IDEA':'Project',
            'PROFILE_CHALLENGE':'Challenges',
            'PROFILE_RELATION':'Relationship',
            'PROFILE_RECOMMANDATION':'Recommandation',
            // idea
            'PROFILE_IDEA_CON':'Contributed Project',
            'PROFILE_IDEA_FOLLOW':'Followed Project',
            'PROFILE_IDEA_OWNER':'Created Project',
            'PROFILE_IDEA_REC':'Recommended Project',
            'PROFILE_IDEA_REC_SIMILAR':'Idea with similar tags',
            'PROFILE_IDEA_REC_SIMILAR_INFO':'No Recommened yet,please follow some ideas or add more tags.',
            'PROFILE_IDEA_REC_SIMILAR_CHANGE':'Add Tag Now',

            // Challenge
            'PROFILE_CHALLENGE_CON':'Contributed Challenge',
            'PROFILE_CHALLENGE_FOLLOW':'Followed Challenge',
            'PROFILE_CHALLENGE_REC':'Recommened Challenge',
            'PROFILE_CHALLENGE_REC_SIMILAR':'Challenge with similar tags',
            'PROFILE_CHALLENGE_REC_SIMILAR_INFO':'No Recommened yet,please follow some challenges or add more tags.',
            'PROFILE_CHALLENGE_REC_SIMILAR_CHANGE':'Add Tag Now',
            //RELATION
            'PROJECT_USER_REC':'Recommend User',
            'PROJECT_USER_REC_FOLLOW':'Some friends of your friends ',
            'PROJECT_USER_REC_TAG':'User with similar Tags'
        });

        $translateProvider.translations('zh_CN', {
            'USER_TITLE': '积致账号',
            'PROFILE_PROJECT': '项目',
            'PROFILE_FAN': '的粉丝',
            'PROFILE_NO_FAN': "还没粉丝。",
            'PROFILE_REC': "你可能感兴趣的人：",
            'PROFILE_NO_REC': "还没有推荐用户。",
            'PROFILE_EDIT': '编辑用户',
            // user setting
            'USERSET_TPL_BASIC': '基本信息',
            'USERSET_TPL_PASS': '密码重置',
            'USERSET_TPL_AVATER': '头像修改',
            'USERSET_TPL_NOTIFY': '通知设定',
            'USERSET_BASIC_REALNAME':'真实姓名：',
            'USERSET_BASIC_SKILL':'技能/兴趣：',
            'USERSET_BASIC_GENDER':'性别',
            'USERSET_BASIC_H':'未指定',
            'USERSET_BASIC_M':'男',
            'USERSET_BASIC_F':'女',
            'USERSET_BASIC_CATEGORY':'类别',
            'USERSET_PASS_NEW':'新密码：',
            'USERSET_PASS_AGAIN':'再次确认：',
            'USERSET_PASS_NOTMATCH':'密码不匹配',
            'USERSET_NOTIFY_EMAIL':'发送邮件通知',
            'USERSET_NOTIFY_INFO':'如果去掉勾选，你将无法收到邮件通知。',
            //Profile page
            'PROFILE_ACTIVITY':'动态',
            'PROFILE_IDEA':'创意',
            'PROFILE_CHALLENGE':'挑战',
            'PROFILE_RELATION':'关系',
            // idea
            'PROFILE_IDEA_CON':'我参与的创意',
            'PROFILE_IDEA_FOLLOW':'我关注的创意',
            'PROFILE_IDEA_OWNER':'我创建的创意',
            'PROFILE_IDEA_REC':'推荐创意',
            'PROFILE_IDEA_REC_SIMILAR':'有类似标签的创意：',
            'PROFILE_IDEA_REC_SIMILAR_INFO':'还没有推荐哦，赶紧关注多些创意吧或添加多一些标签吧。',
            'PROFILE_IDEA_REC_SIMILAR_CHANGE':'马上修改',
            // Challenge
            'PROFILE_CHALLENGE_CON':'我参与的挑战',
            'PROFILE_CHALLENGE_FOLLOW':'我关注的挑战',
            'PROFILE_CHALLENGE_REC':'推荐挑战',
            'PROFILE_CHALLENGE_REC_SIMILAR':'有类似标签的挑战：',
            'PROFILE_CHALLENGE_REC_SIMILAR_INFO':'还没有推荐哦，赶紧关注多些挑战吧或添加多一些标签吧。',
            'PROFILE_CHALLENGE_REC_SIMILAR_CHANGE':'马上修改',
            //RELATION
            'PROJECT_USER_REC':'推荐认识',
            'PROJECT_USER_REC_FOLLOW':'你关注的人在关注：',
            'PROJECT_USER_REC_TAG':'跟你有同样标签的用户：'

        });

    }]);