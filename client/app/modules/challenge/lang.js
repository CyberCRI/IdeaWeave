angular.module('cri.challenge')
    .config(['$translateProvider',function ($translateProvider){
        $translateProvider.translations('en', {
            'CHALLENGE_PROJECT_NAME': 'Project Name',
            'CHALLENGE_PROJECT_BRIEF': 'Project Brief',
            'CHALLENGE_PROJECT_TAGS': 'Project Tags',
            'CHALLENGE_ACCESS_URL': 'Access Url',
            //challenge list
            'CHALLENGE_LIST_SUGGEST':'Suggest An Challenge',
            'CHALLENGE_LIST_NORESULT':'No Challenge Yet',
            'CHALLENGE_LIST_END':'End, Maybe you can also suggest us an challenge',


            // challenge suggest
            'CHALLENGE_SUGGEST_INTRO':'Welcome to suggest us a new challenge. We will check and evaluate after you submit.',
            'CHALLENGE_SUGGEST_TITLE':'Challenge Title:',
            'CHALLENGE_SUGGEST_BRIEF':'Challenge Brief:',
            'CHALLENGE_SUGGEST_POSTER':'Challenge Poster:',
            'CHALLENGE_SUGGEST_ACCESSURL':'Access Url:',

            // challenge view
            'CHALLENGE_VIEW_NEWIDEA_BTN':'New Idea',
            'CHALLENGE_VIEW_FOLLOW':'Follow',
            'CHALLENGE_VIEW_FOLLOW_INFO':'You will get notification when you follow',
            'CHALLENGE_VIEW_UNFOLLOW':'UnFollow',
            'CHALLENGE_VIEW_IDEA':'Ideas',
            'CHALLENGE_VIEW_IDEA_RELY':'Reliable Index:',
            'CHALLENGE_VIEW_DETAIL':'Detail',
            'CHALLENGE_VIEW_DISCUSS':'Dicussion',
            'CHALLENGE_VIEW_DISCUSS_INFO':'Discuss anything related with this challenge',
            'CHALLENGE_VIEW_FANS':'Followers',


        });

        $translateProvider.translations('zh_CN', {

            'CHALLENGE_PROJECT_NAME': '项目名称',
            'CHALLENGE_PROJECT_BRIEF': '项目简介',
            'CHALLENGE_PROJECT_TAGS': '标签',

            //challenge list
            'CHALLENGE_LIST_SUGGEST':'建议添加挑战',
            'CHALLENGE_LIST_NORESULT':'还没有挑战哦',
            'CHALLENGE_LIST_END':'到底部啦，不如你也提议一个吧。',
            // challenge suggest
            'CHALLENGE_SUGGEST_INTRO':'欢迎来建议新的挑战，提交以后，我们会即时审核。对于合理的挑战，我们会添加到平台上。',
            'CHALLENGE_SUGGEST_TITLE':'挑战标题：',
            'CHALLENGE_SUGGEST_BRIEF':'挑战简介：',

            // challenge view
            'CHALLENGE_VIEW_NEWIDEA_BTN':'新创意',
            'CHALLENGE_VIEW_FOLLOW':'关注挑战',
            'CHALLENGE_VIEW_FOLLOW_INFO':'关注以后，每当有新想法，你会收到通知。',
            'CHALLENGE_VIEW_UNFOLLOW':'取消关注',
            'CHALLENGE_VIEW_IDEA':'创意',
            'CHALLENGE_VIEW_IDEA_RELY':'靠谱度：',
            'CHALLENGE_VIEW_DETAIL':'详情',
            'CHALLENGE_VIEW_DISCUSS':'讨论',
            'CHALLENGE_VIEW_DISCUSS_INFO':'大家可以在这里一起讨论与挑战相关的话题：）',
            'CHALLENGE_VIEW_FANS':'粉丝',


        });



    }]);