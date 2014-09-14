angular.module('cri.workspace')
.config(['$translateProvider',function ($translateProvider){
  $translateProvider.translations('en', {
    // PROJECT VIEW
    'PROJECT_VIEW_MANAGE':'Manage Project',
    'PROJECT_VIEW_RELY':'Reliable Index',
    'PROJECT_VIEW_DISCUSS':'Discussion',
    'PROJECT_VIEW_DISCUSS_INFO':'Add any topic that related to this project.',
    'PROJECT_VIEW_ADD_DISCUSS':'Add Topic',
    'PROJECT_VIEW_ADD_LINK':'Add Link',
    'PROJECT_VIEW_ADD_FILE':'Add a File',
    'PROJECT_VIEW_DIS_TITLE':'Topic',
    'PROJECT_VIEW_DIS_CONTENT':'Content (optional)',
    'PROJECT_VIEW_DIS_BTN':'Post',
    'PROJECT_VIEW_LINK':'Related Links',
    'PROJECT_VIEW_LINK_INFO':'Similar or Related links',
    'PROJECT_VIEW_Add_LINK':'Add Link',
    'PROJECT_VIEW_LINK_TITLE':'Title',
    'PROJECT_VIEW_LINK_LINK':'Link',
    'PROJECT_VIEW_LINK_NOTE':'Note (optional)',

    'PROJECT_VIEW_SHARE':'Forward', 
	'PROJECT_VIEW_JOIN':'Join Us', 
	'PROJECT_VIEW_FOLLOW':'Follow Us',
	'PROJECT_VIEW_UNFOLLOW':'UnFollow', 
	'PROJECT_VIEW_MEMBER':'Member',
	'PROJECT_VIEW_BASICINFO':'Basic Info',
	'PROJECT_VIEW_OWNER':'Owner:',
	'PROJECT_VIEW_BELONGTO':'Challenge that belong to',

	// project share
	'PROJECT_VIEW_SHARE_INFO':'Copy and share the link below to your friends.',
	// project join
	'PROJECT_VIEW_JOIN_INFO':'Please introduce yourself and why you are interested in this project.',

  });

   $translateProvider.translations('zh_CN', {
    'PROJECT_VIEW_MANAGE':'管理项目',
    'PROJECT_VIEW_RELY':'靠谱度',
    'PROJECT_VIEW_DISCUSS':'讨论',
    'PROJECT_VIEW_DISCUSS_INFO':'想到任何与这个创意相关的话题都可以点击添加话题一起讨论。',
    'PROJECT_VIEW_Add_DISCUSS':'发起话题',
    'PROJECT_VIEW_DIS_TITLE':'话题',
    'PROJECT_VIEW_DIS_CONTENT':'内容（可选）',
    'PROJECT_VIEW_DIS_BTN':'发起',
    'PROJECT_VIEW_LINK':'参考链接',
    'PROJECT_VIEW_LINK_INFO':'相似创意的链接或者其他参考链接均可添加，共同完善创意。',
    'PROJECT_VIEW_Add_LINK':'添加链接',
    'PROJECT_VIEW_LINK_TITLE':'标题',
    'PROJECT_VIEW_LINK_LINK':'链接',
    'PROJECT_VIEW_LINK_NOTE':'备注（可选）',

	'PROJECT_VIEW_SHARE':'转发分享', 
	'PROJECT_VIEW_JOIN':'我要参与', 
	'PROJECT_VIEW_FOLLOW':'关注我们',
	'PROJECT_VIEW_UNFOLLOW':'取消关注',   

	'PROJECT_VIEW_MEMBER':'成员',
	'PROJECT_VIEW_BASICINFO':'基本信息',
	'PROJECT_VIEW_OWNER':'发起人：',
	'PROJECT_VIEW_BELONGTO':'所属挑战',
     // project share
	'PROJECT_VIEW_SHARE_INFO':'创意链接： (复制以下链接，并通过邮件、QQ、微信等分享给你的朋友，仅限中大访问哦)',
	// project join
	'PROJECT_VIEW_JOIN_INFO':'请简单介绍一下自己以及为什么希望做这个项目',
    
    
	//
  });

 
 
}]);